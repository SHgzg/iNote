TypeScript 的类型系统非常强大，除了前面提到的内置工具类型和高级类型操作技巧外，还有一些**更深入、更灵活**的类型编程方法，包括**分布式条件类型**、**类型推断与 `infer` 的高级用法**、**递归类型的高级应用**、**类型守卫与类型断言的结合**，以及一些**实用但较少被提及的技巧**。  

---

## **六、更深入的类型编程技巧**

### **1. 分布式条件类型（Distributive Conditional Types）**
当条件类型作用于**联合类型**时，TypeScript 会自动将条件类型"分配"到联合类型的每个成员上，这就是**分布式条件类型**。

#### **基本示例**
```typescript
type ToArray<T> = T extends any ? T[] : never;

type StrOrNumArray = ToArray<string | number>;
// 等同于 string[] | number[]
```
- `ToArray<string | number>` 会被拆解为 `string[] | number[]`，因为 `T` 是联合类型 `string | number`，条件类型会分别应用于 `string` 和 `number`。

#### **关闭分布式行为**
如果不想让条件类型自动分配，可以用`[]`包裹`T`：
```typescript
type ToArrayNonDistributive<T> = [T] extends [any] ? T[] : never;

type StrOrNumArrayNonDistributive = ToArrayNonDistributive<string | number>;
// 等同于 (string | number)[]
```
- `[T] extends [any]` 使得 `T` 不再被视为联合类型，而是作为一个整体处理。

#### **实际应用**
```typescript
type Filter<T, U> = T extends U ? T : never;

type NumbersOnly = Filter<string | number | boolean, number>;
// 等同于 number
```
- `Filter` 会从联合类型中筛选出符合 `U` 的类型。

---

### **2. `infer` 的高级用法**
`infer` 不仅可以用于函数返回类型推断，还可以用于**更复杂的类型结构**，如：
- 推断函数参数类型
- 推断数组元素类型
- 推断对象属性类型

#### **(1) 推断函数参数类型**
```typescript
type FirstArg<T> = T extends (arg: infer P, ...rest: any[]) => any ? P : never;

type Fn = (name: string, age: number) => void;
type FirstArgType = FirstArg<Fn>; // string
```

#### **(2) 推断数组元素类型**
```typescript
type ElementType<T> = T extends (infer U)[] ? U : never;

type Arr = string[];
type ElementTypeArr = ElementType<Arr>; // string
```

#### **(3) 推断 Promise 的解析类型**
```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type PromiseString = Promise<string>;
type Unwrapped = UnwrapPromise<PromiseString>; // string
```

#### **(4) 推断对象属性类型**
```typescript
type ValueType<T> = T extends { value: infer V } ? V : never;

type Obj = { value: number };
type ValueTypeObj = ValueType<Obj>; // number
```

---

### **3. 递归类型的高级应用**
递归类型不仅可以用于**深度 `Partial` 或 `DeepReadonly`**，还可以用于：
- **递归遍历对象属性**
- **递归转换类型**
- **递归生成复杂类型**

#### **(1) 递归 `DeepPartial`（前面已讲）**
```typescript
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
```

#### **(2) 递归 `DeepReadonly`**
```typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

#### **(3) 递归 `DeepRequired`**
```typescript
type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};
```
- `-?` 表示移除可选修饰符，使属性变为必选。

#### **(4) 递归 `DeepNullable`**
```typescript
type DeepNullable<T> = {
  [K in keyof T]: T[K] extends object ? DeepNullable<T[K]> : T[K] | null;
};
```

#### **(5) 递归 `Flatten`（扁平化嵌套数组）**
```typescript
type Flatten<T> = T extends (infer U)[] ? Flatten<U> : T;

type NestedArray = string[][][];
type Flattened = Flatten<NestedArray>; // string
```

#### **(6) 递归 `TupleToUnion`（元组转联合类型）**
```typescript
type TupleToUnion<T extends any[]> = T[number];

type Tuple = [string, number, boolean];
type Union = TupleToUnion<Tuple>; // string | number | boolean
```

---

### **4. 类型守卫与类型断言的结合**
TypeScript 的类型守卫（`typeof`、`instanceof`、`in`）可以与类型断言结合，实现更灵活的类型控制。

#### **(1) 自定义类型守卫**
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function process(value: string | number) {
  if (isString(value)) {
    // 这里 value 被推断为 string
    console.log(value.toUpperCase());
  } else {
    // 这里 value 被推断为 number
    console.log(value.toFixed(2));
  }
}
```

#### **(2) 类型断言 + 类型守卫**
```typescript
type Cat = { meow: () => void };
type Dog = { bark: () => void };

function isCat(animal: Cat | Dog): animal is Cat {
  return 'meow' in animal;
}

function makeSound(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow(); // 类型安全
  } else {
    animal.bark(); // 类型安全
  }
}
```

---

### **5. 实用但较少被提及的技巧**
#### **(1) `typeof` 类型查询**
```typescript
const person = { name: 'Alice', age: 30 };
type PersonType = typeof person; // { name: string; age: number; }
```

#### **(2) `keyof` + `typeof` 组合**
```typescript
const colors = { red: '#FF0000', green: '#00FF00', blue: '#0000FF' };
type ColorKeys = keyof typeof colors; // 'red' | 'green' | 'blue'
```

#### **(3) `satisfies` 运算符（TypeScript 4.9+）**
```typescript
type Theme = {
  color: string;
  fontSize: number;
};

const theme = {
  color: '#FF0000',
  fontSize: 14,
  // extraProp: true, // ❌ 报错，因为不符合 Theme 类型
} satisfies Theme;
```
- `satisfies` 确保对象符合类型，但不会改变对象的类型推断。

#### **(4) `const` 断言**
```typescript
const colors = ['red', 'green', 'blue'] as const;
// 类型推断为 readonly ['red', 'green', 'blue']
type Colors = typeof colors[number]; // 'red' | 'green' | 'blue'
```

---

## **七、总结**
TypeScript 的类型系统非常灵活，除了内置工具类型和基础高级技巧外，还可以通过：
1. **分布式条件类型** 处理联合类型
2. **`infer` 高级推断** 提取复杂类型
3. **递归类型** 处理嵌套结构
4. **类型守卫 + 类型断言** 实现运行时类型安全
5. **`typeof` + `keyof` 组合** 动态获取类型
6. **`satisfies` 和 `const` 断言** 增强类型安全性

这些技巧可以组合使用，构建出**极其强大且类型安全**的 TypeScript 代码。掌握它们，可以让你写出更健壮、更易维护的 TypeScript 项目！ 🚀