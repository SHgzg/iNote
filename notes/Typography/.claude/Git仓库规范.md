# Typography Git 仓库规范

## 一、仓库结构规范

### 1.1 根目录结构

```
typography/                          # 项目根目录
├── .git/                           # Git 版本控制
├── .gitignore                      # Git 忽略文件配置
├── .github/                        # GitHub 相关配置
│   ├── workflows/                  # GitHub Actions 工作流
│   │   ├── build.yml               # 构建与测试流程
│   │   ├── deploy.yml              # 部署流程
│   │   ├── security.yml            # 安全检查
│   │   └── docs.yml                # 文档部署流程
│   ├── ISSUE_TEMPLATE/             # Issue 模板
│   │   ├── bug_report.md           # Bug 报告模板
│   │   ├── feature_request.md      # 功能请求模板
│   │   └── config.yml              # Issue 配置
│   ├── PULL_REQUEST_TEMPLATE.md    # PR 模板
│   └── dependabot.yml              # 依赖更新配置
├── .claude/                        # Claude AI 项目配置
│   ├── CLAUDE.md                   # 项目提示词主文件
│   ├── 项目.md                     # 项目概述文档
│   ├── 代码风格规范.md             # 代码规范文档
│   ├── 工作流程.md                 # 工作流程文档
│   ├── 组件开发规范.md             # 组件开发规范
│   ├── Git仓库规范.md              # Git 仓库规范（当前文件）
│   └── settings.local.json         # Claude 配置文件
├── packages/                       # Monorepo 包目录
├── docs/                           # 项目文档
├── examples/                       # 示例项目
├── scripts/                        # 构建和工具脚本
├── pnpm-workspace.yaml             # pnpm 工作区配置
├── tsconfig.base.json              # TypeScript 基础配置
├── package.json                    # 根包配置
├── README.md                       # 项目说明文档
├── CHANGELOG.md                    # 变更日志
├── LICENSE                         # 开源协议
└── CONTRIBUTING.md                 # 贡献指南
```

### 1.2 .gitignore 规范

```gitignore
# 依赖目录
node_modules/
**/node_modules/

# 构建产物
dist/
build/
out/
coverage/
*.tsbuildinfo

# 环境配置文件
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE 和编辑器
.vscode/
.idea/
*.swp
*.swo
*~

# 操作系统
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# 日志文件
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# 临时文件
*.tmp
*.temp
.cache/

# 测试覆盖率
coverage/
*.lcov

# Storybook
storybook-static/

# 文档生成
.docusaurus/

# 包管理器锁文件（根据项目选择保留）
# package-lock.json
# yarn.lock
# pnpm-lock.yaml

# 本地配置
.local/
config/local.json

# Claude 配置（可选，根据团队需求）
.claude/secrets.json
```

## 二、分支管理规范

### 2.1 分支策略

**主要分支**
- `main`: 生产环境分支，始终保持稳定可发布状态
- `develop`: 开发分支，集成最新功能，用于测试和验证

**辅助分支**
- `feature/*`: 功能开发分支，从 `develop` 分出
- `release/*`: 发布准备分支，从 `develop` 分出
- `hotfix/*`: 紧急修复分支，从 `main` 分出
- `docs/*`: 文档更新分支
- `refactor/*`: 重构分支
- `perf/*`: 性能优化分支

### 2.2 分支命名规范

```bash
# 功能分支
feature/user-authentication
feature/data-source-validation
feature/component-library

# 修复分支
fix/memory-leak-issue
fix/cli-build-error

# 热修复分支
hotfix/security-vulnerability
hotfix/critical-bug-production

# 发布分支
release/v1.0.0
release/v1.1.0

# 重构分支
refactor/compiler-optimization
refactor/component-architecture

# 文档分支
docs/api-documentation
docs/development-guide
```

### 2.3 分支保护规则

**main 分支保护**
- 禁止直接推送
- 需要 PR 审查（至少 2 人审查）
- 需要 CI/CD 通过
- 需要管理员批准

**develop 分支保护**
- 禁止直接推送
- 需要 PR 审查（至少 1 人审查）
- 需要 CI/CD 通过

## 三、提交规范

### 3.1 提交信息格式

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**类型 (type)**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建工具或辅助工具的变动
- `ci`: CI/CD 相关配置变更
- `build`: 构建系统或依赖变更

**作用域 (scope)**
- `core`: 核心框架
- `cli`: 命令行工具
- `components`: 组件库
- `docs`: 文档
- `tests`: 测试
- `build`: 构建相关
- `deps`: 依赖管理

### 3.2 提交示例

```bash
# 新功能
feat(core): add data source validation
feat(components): implement table component
feat(cli): add watch mode for development

# 修复
fix(core): resolve memory leak in compiler
fix(cli): fix build error on Windows platform
fix(docs): correct installation instructions

# 文档
docs(api): update component documentation
docs(readme): add quick start guide
docs(contributing): update contribution guidelines

# 重构
refactor(core): simplify compiler architecture
refactor(components): extract common utilities

# 性能
perf(core): optimize template compilation speed
perf(components): reduce component bundle size

# 测试
test(core): add unit tests for data processor
test(e2e): add integration tests for CLI workflow

# 构建工具
chore(deps): update Vue to version 3.4.0
chore(build): configure TypeScript path mapping
```

### 3.3 提交信息详细格式

```bash
feat(components): add responsive table component

- Implement responsive design for mobile devices
- Add sorting functionality for all columns
- Support custom cell rendering
- Include comprehensive unit tests

Closes #123
Fixes #124
```

## 四、PR (Pull Request) 规范

### 4.1 PR 标题格式

遵循提交信息格式：
```
<type>(<scope>): <description>
```

### 4.2 PR 描述模板

```markdown
## 变更类型
- [ ] 新功能 (feature)
- [ ] 修复 (fix)
- [ ] 文档 (docs)
- [ ] 格式 (style)
- [ ] 重构 (refactor)
- [ ] 性能优化 (perf)
- [ ] 测试 (test)
- [ ] 构建 (build)
- [ ] 其他 (chore)

## 变更描述
简要描述本次变更的内容和目的。

## 相关 Issue
Fixes #(issue number)
Closes #(issue number)

## 变更详情
### 主要变更
- 变更点 1
- 变更点 2
- 变更点 3

### 技术细节
- 技术实现说明
- 架构变更说明
- 性能影响分析

## 测试
- [ ] 单元测试已通过
- [ ] 集成测试已通过
- [ ] 手动测试已完成
- [ ] 添加了新的测试用例

## 检查清单
- [ ] 代码符合项目规范
- [ ] 已更新相关文档
- [ ] 已添加必要的测试
- [ ] 类型检查通过
- [ ] 构建成功

## 截图（如适用）
添加相关截图或 GIF。

## 其他说明
其他需要说明的内容。
```

### 4.3 PR 审查规范

**审查要求**
1. **代码质量**
   - 代码逻辑正确
   - 符合代码规范
   - 类型定义完整

2. **测试覆盖**
   - 有适当的单元测试
   - 测试覆盖率不降低
   - 测试用例有意义

3. **文档更新**
   - API 文档已更新
   - 使用示例已添加
   - 变更日志已记录

4. **性能影响**
   - 性能没有回归
   - 构建大小合理
   - 内存使用正常

**审查流程**
1. 自动检查通过（CI/CD）
2. 至少一个团队成员审查
3. 作者根据反馈修改
4. 审查者批准
5. 合并到目标分支

## 五、标签管理规范

### 5.1 Issue 标签

**类型标签**
- `bug`: Bug 报告
- `feature`: 功能请求
- `enhancement`: 增强功能
- `documentation`: 文档相关
- `question`: 问题咨询
- `performance`: 性能问题
- `security`: 安全相关

**优先级标签**
- `priority/critical`: 关键
- `priority/high`: 高
- `priority/medium`: 中
- `priority/low`: 低

**状态标签**
- `status/in-progress`: 进行中
- `status/in-review`: 审查中
- `status/blocked`: 阻塞
- `status/duplicate`: 重复
- `status/wont-fix`: 不修复

**模块标签**
- `component/core`: 核心模块
- `component/cli`: CLI 工具
- `component/components`: 组件库
- `component/docs`: 文档

### 5.2 PR 标签

**类型标签**
- `pr/feature`: 功能 PR
- `pr/fix`: 修复 PR
- `pr/docs`: 文档 PR
- `pr/refactor`: 重构 PR

**规模标签**
- `size/small`: 小型变更（< 50 行）
- `size/medium`: 中型变更（50-200 行）
- `size/large`: 大型变更（> 200 行）

## 六、发布管理规范

### 6.1 版本号规范

遵循 Semantic Versioning 2.0.0：
- `MAJOR.MINOR.PATCH`
- `1.0.0`: 主要版本（不兼容的 API 修改）
- `1.1.0`: 次要版本（向下兼容的功能性新增）
- `1.1.1`: 修订版本（向下兼容的问题修正）

### 6.2 发布分支流程

```bash
# 1. 创建发布分支
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# 2. 完成发布准备
# 修复 bug、更新版本号、完善文档

# 3. 合并到 main
git checkout main
git merge --no-ff release/v1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"

# 4. 合并回 develop
git checkout develop
git merge --no-ff release/v1.2.0

# 5. 推送和发布
git push origin main --tags
git push origin develop
git branch -d release/v1.2.0
```

### 6.3 热修复流程

```bash
# 1. 创建热修复分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix

# 2. 修复问题
# 进行紧急修复...

# 3. 测试验证
# 确保修复有效且不引入新问题

# 4. 合并到 main 和 develop
git checkout main
git merge --no-ff hotfix/critical-bug-fix
git tag -a v1.1.1 -m "Hotfix version 1.1.1"

git checkout develop
git merge --no-ff hotfix/critical-bug-fix

# 5. 推送和清理
git push origin main --tags
git push origin develop
git branch -d hotfix/critical-bug-fix
```

## 七、CI/CD 集成

### 7.1 GitHub Actions 工作流

**构建测试流程 (.github/workflows/build.yml)**
```yaml
name: Build and Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}

    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: latest

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Type check
      run: pnpm run typecheck

    - name: Lint
      run: pnpm run lint

    - name: Test
      run: pnpm run test

    - name: Build
      run: pnpm run build
```

### 7.2 自动化标签管理

```yaml
name: Automatic Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        registry-url: 'https://registry.npmjs.org'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Build packages
      run: pnpm run build

    - name: Release to npm
      run: pnpm run release
      env:
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 八、安全规范

### 8.1 密钥管理
- 所有密钥使用 GitHub Secrets 管理
- 不在代码中硬编码任何密钥
- 定期轮换密钥
- 使用最小权限原则

### 8.2 依赖安全
- 使用 Dependabot 自动检查依赖漏洞
- 及时更新有安全漏洞的依赖
- 定期进行安全审计

### 8.3 代码安全
- 启用分支保护规则
- 要求代码审查
- 使用 signed commits
- 定期进行安全扫描

## 九、协作规范

### 9.1 团队成员权限

**角色定义**
- **Owner**: 项目所有者，完全权限
- **Maintainer**: 维护者，可管理仓库、合并 PR
- **Contributor**: 贡献者，可提交 PR、参与审查
- **Reader**: 只读权限，可查看和评论

### 9.2 沟通规范

**Issue 讨论**
- 使用清晰明确的标题
- 提供详细的复现步骤
- 标注相关的标签和里程碑
- 及时回复和更新状态

**PR 讨论**
- 提供建设性的反馈
- 解释修改的原因和影响
- 及时回应审查意见
- 保持专业和友好的态度

### 9.3 代码审查清单

**功能性检查**
- [ ] 代码实现了预期功能
- [ ] 边界情况得到处理
- [ ] 错误处理完善
- [ ] 性能表现良好

**质量检查**
- [ ] 代码结构清晰
- [ ] 命名规范一致
- [ ] 注释充分且准确
- [ ] 测试覆盖完整

**兼容性检查**
- [ ] API 变更符合语义化版本
- [ ] 向后兼容性得到保证
- [ ] 依赖版本兼容
- [ ] 文档已同步更新

## 十、维护规范

### 10.1 定期维护任务

**每周任务**
- 检查并合并 PR
- 更新依赖版本
- 检查 CI/CD 状态
- 清理过期分支

**每月任务**
- 性能评估和优化
- 安全漏洞扫描
- 文档更新和整理
- 用户反馈处理

**每季度任务**
- 重大项目规划
- 技术债务清理
- 架构评估和调整
- 社区建设活动

### 10.2 监控和报告

**指标监控**
- 代码质量指标
- 性能基准测试
- 测试覆盖率
- 构建成功率

**定期报告**
- 月度开发报告
- 发布版本总结
- 社区参与统计
- 技术债务分析

---

遵循这些 Git 仓库规范将确保项目的高效协作、代码质量和持续交付。