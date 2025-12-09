// === 优先级定义 ===
const PriorityLevels = {
  Immediate: 99,    // 最高优先级（错误边界等）
  UserBlocking: 80, // 用户交互（点击、输入）
  Normal: 50,      // 默认优先级
  Low: 10,         // 延迟任务
  Idle: 1          // 空闲任务
};

// === 全局调度状态 ===
let currentTree = null;
let workInProgressTree = null;
let workInProgress = null;

// 🔑 关键改进：按优先级组织的更新队列
let updateQueues = {
  [PriorityLevels.Immediate]: [],
  [PriorityLevels.UserBlocking]: [],
  [PriorityLevels.Normal]: [],
  [PriorityLevels.Low]: [], 
  [PriorityLevels.Idle]: []
};

let currentPriority = PriorityLevels.Normal; // 当前渲染的优先级
let isPerformingWork = false;

// === 1. 带优先级的更新调度 ===
function scheduleUpdate(update, priority = PriorityLevels.Normal) {
  console.log(`📨 收到更新: ${update.type}, 优先级: ${getPriorityName(priority)}`);
  
  // 将更新放入对应优先级的队列
  updateQueues[priority].push(update);
  
  // 请求工作，但会根据优先级决定何时执行
  requestWork(priority);
}

function requestWork(priority) {
  if (isPerformingWork) {
    // 🔁 如果正在渲染，检查是否需要中断当前工作
    if (priority > currentPriority) {
      console.log(`🚨 高优先级更新到达，中断当前工作！`);
      interruptCurrentRender(); // 中断当前渲染
    } else {
      console.log(`⏳ 低优先级更新，等待当前工作完成`);
      return; // 低优先级更新排队等待
    }
  }
  
  // 调度工作，高优先级更新会更快执行
  if (priority >= PriorityLevels.UserBlocking) {
    // 用户交互：立即调度
    scheduleImmediate(performConcurrentWork);
  } else {
    // 普通更新：在下一帧调度
    scheduleCallback(performConcurrentWork, priority);
  }
}

// === 2. 改进的工作循环 - 支持优先级中断 ===
function performConcurrentWork() {
  isPerformingWork = true;
  
  try {
    // 🔍 检查是否有更高优先级的更新等待
    const highestPendingPriority = getHighestPendingPriority();
    
    if (highestPendingPriority > currentPriority) {
      console.log(`🔄 有更高优先级任务，先处理高优先级`);
      currentPriority = highestPendingPriority;
      prepareFreshStack();
    }
    
    workLoop();
    
  } finally {
    isPerformingWork = false;
    
    // 检查是否还有待处理的更新
    if (hasPendingUpdates()) {
      console.log(`🔄 还有待处理更新，继续调度`);
      scheduleCallback(performConcurrentWork, getHighestPendingPriority());
    }
  }
}

function workLoop() {
  const deadline = getFrameDeadline(); // 获取当前帧的截止时间
  
  while (workInProgress !== null && !shouldYield(deadline)) {
    // 🚨 关键：在每次处理前检查是否有更高优先级更新
    if (hasHigherPriorityUpdate()) {
      console.log(`⏸️ 检测到更高优先级更新，中断当前工作`);
      interruptCurrentRender();
      return;
    }
    
    performUnitOfWork(workInProgress);
  }
  
  if (workInProgress === null) {
    // 整棵树完成，进入提交阶段
    commitRoot();
    
    // 提交后重置当前优先级
    currentPriority = getHighestPendingPriority();
  }
}

// === 3. 中断机制 ===
function interruptCurrentRender() {
  // 保存当前工作进度
  saveWorkInProgress();
  
  // 重置工作状态，准备处理高优先级更新
  workInProgress = null;
  workInProgressTree = null;
}

function shouldYield(deadline) {
  // 检查是否需要让出主线程
  return (
    // 1. 时间片用尽
    performance.now() >= deadline ||
    // 2. 有更高优先级任务
    hasHigherPriorityUpdate() ||
    // 3. 浏览器需要绘制
    needsBrowserPainting()
  );
}

function hasHigherPriorityUpdate() {
  const highestPending = getHighestPendingPriority();
  return highestPending > currentPriority;
}

function getHighestPendingPriority() {
  // 从高到低检查队列，返回最高优先级的待处理更新
  for (let priority = PriorityLevels.Immediate; priority >= PriorityLevels.Idle; priority--) {
    if (updateQueues[priority].length > 0) {
      return priority;
    }
  }
  return PriorityLevels.Normal;
}

// === 4. 处理单个工作单元（带优先级感知）===
function performUnitOfWork(fiber) {
  // 处理当前节点的所有该优先级的更新
  processUpdatesForCurrentPriority(fiber);
  
  const next = beginWork(fiber);
  
  if (next) {
    workInProgress = next;
  } else {
    completeUnitOfWork(fiber);
  }
}

function processUpdatesForCurrentPriority(fiber) {
  // 只处理当前优先级及以上的更新
  const updatesToProcess = [];
  
  for (let priority = PriorityLevels.Immediate; priority >= currentPriority; priority--) {
    const queue = updateQueues[priority];
    if (queue.length > 0) {
      updatesToProcess.push(...queue);
      updateQueues[priority] = []; // 清空已处理的队列
    }
  }
  
  // 应用这些更新到Fiber
  fiber.updateQueue = updatesToProcess;
}

// === 使用示例 ===
function demonstratePriorityScheduling() {
  console.log('=== 演示优先级调度 ===');
  
  // 场景：同时有多个不同优先级的更新
  
  // 1. 低优先级更新：大数据列表渲染
  scheduleUpdate({ type: 'RENDER_BIG_LIST' }, PriorityLevels.Low);
  
  // 2. 普通优先级更新：状态变更
  scheduleUpdate({ type: 'NORMAL_UPDATE' }, PriorityLevels.Normal);
  
  // 3. 高优先级更新：用户点击（这个会中断前面的工作）
  setTimeout(() => {
    scheduleUpdate({ type: 'USER_CLICK' }, PriorityLevels.UserBlocking);
  }, 10);
  
  // 4. 最高优先级更新：错误处理
  setTimeout(() => {
    scheduleUpdate({ type: 'ERROR_BOUNDARY' }, PriorityLevels.Immediate);
  }, 20);
}

// === 工具函数 ===
function getPriorityName(priority) {
  const names = {
    99: 'Immediate',
    80: 'UserBlocking', 
    50: 'Normal',
    10: 'Low',
    1: 'Idle'
  };
  return names[priority];
}

function scheduleImmediate(callback) {
  // 立即执行（微任务）
  Promise.resolve().then(callback);
}

function scheduleCallback(callback, priority) {
  // 根据优先级安排执行时间
  const delay = {
    [PriorityLevels.Immediate]: 0,
    [PriorityLevels.UserBlocking]: 0,
    [PriorityLevels.Normal]: 16,    // 下一帧
    [PriorityLevels.Low]: 50,       // 稍后
    [PriorityLevels.Idle]: 100      // 空闲时
  }[priority] || 16;
  
  setTimeout(callback, delay);
}