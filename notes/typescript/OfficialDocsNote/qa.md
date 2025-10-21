与接口的区别​​：类型别名和接口（interface）功能有重叠，但各有侧重。一个关键区别是，类型别名可以很方便地定义联合类型（如 type Status = "success" | "error"）或元组类型，而接口则更擅长通过声明合并（declaration merging）来扩展
关于如何选择，TypeScript官方建议是：​​在定义对象类型并期望通过继承扩展，或者需要利用声明合并（如在为环境类型或第三方库添加类型时）时，优先使用interface。而对于需要定义联合类型、元组或更复杂的类型变换时，则使用type

除了定义普通对象，接口还可以用于约束更复杂的结构：

函数类型​​：接口可以描述函数的形状
```
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```
​​可索引类型​​：描述可以通过索引（如数组或某些映射对象）访问的类型
```
interface StringArray {
  [index: number]: string;
}
```
​​类类型​​：类可以使用implements关键字来实现一个接口，强制类满足接口的约定
```
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}
class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) { this.currentTime = d; }
}
```
​​接口继承​​：接口可以通过extends关键字继承一个或多个其他接口，实现接口的复用和扩展
```
interface Point2D { x: number; y: number; }
interface Point3D extends Point2D { z: number; }
```

 当规则“过于严格”时怎么办？
有时，两个复杂的类型在结构上其实是兼容的，但 TypeScript 无法直接识别。这时，规则可能会显得“过于保守”。在这种情况下，可以通过 ​​双重断言​​ 来绕过检查
```
// 目标：将 string 断言为 number（通常不推荐，但可能在某些特殊场景下需要）
const x = "hello" as any as number; // ✅ 编译通过，但不安全
```