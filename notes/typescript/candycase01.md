在 TypeScript 中，从已有类型中提取部分类型，并组合成新的类型，是类型编程（Type Programming）的核心能力之一。TypeScript 提供了多种方式来实现这一目标，包括内置的工具类型（Utility Types）以及更高级的类型操作技巧。以下是 TypeScript 中从类型中获取类型并合成新类型的所有主要方法，按类别进行整理和说明。

---

## 一、使用内置的工具类型（Utility Types）

TypeScript 提供了一系列内置的工具类型，用于从已有类型中提取或转换部分类型，从而合成新的类型。

### 1. `Partial<T>`

将类型 `T` 的所有属性变为可选。

```typescript
interface Person {
  name: string;
  age: number;
}

type PartialPerson = Partial<Person>;
// 等同于 { name?: string; age?: number; }
```

### 2. `Required<T>`

将类型 `T` 的所有属性变为必选。

```typescript
type RequiredPerson = Required<PartialPerson>;
// 等同于 { name: string; age: number; }
```

### 3. `Readonly<T>`

将类型 `T` 的所有属性变为只读。

```typescript
type ReadonlyPerson = Readonly<Person>;
// 等同于 { readonly name: string; readonly age: number; }
```

### 4. `Record<K, T>`

构造一个键类型为 `K`，值类型为 `T` 的对象类型。

```typescript
type UserRoles = Record<string, string>;
// 等同于 { [key: string]: string; }
```

### 5. `Pick<T, K>`

从类型 `T` 中选取指定的属性 `K` 来构造新类型。

```typescript
type NameOnly = Pick<Person, 'name'>;
// 等同于 { name: string; }
```

### 6. `Omit<T, K>`

从类型 `T` 中排除指定的属性 `K` 来构造新类型。

```typescript
type AgeOnly = Omit<Person, 'name'>;
// 等同于 { age: number; }
```

### 7. `Exclude<T, U>`

从联合类型 `T` 中排除可以赋值给 `U` 的类型。

```typescript
type T = 'a' | 'b' | 'c';
type U = 'a' | 'b';
type Result = Exclude<T, U>;
// 等同于 'c'
```

### 8. `Extract<T, U>`

从联合类型 `T` 中提取可以赋值给 `U` 的类型。

```typescript
type Result = Extract<T, U>;
// 等同于 'a' | 'b'
```

### 9. `NonNullable<T>`

从类型 `T` 中排除 `null` 和 `undefined`。

```typescript
type T = string | null | undefined;
type NonNullableT = NonNullable<T>;
// 等同于 string
```

### 10. `ReturnType<T>`

获取函数类型 `T` 的返回类型。

```typescript
function getUser(): Person {
  return { name: 'Alice', age: 30 };
}

type UserReturnType = ReturnType<typeof getUser>;
// 等同于 Person
```

### 11. `Parameters<T>`

获取函数类型 `T` 的参数类型组成的元组类型。

```typescript
function greet(name: string, age: number): void {}

type GreetParams = Parameters<typeof greet>;
// 等同于 [string, number]
```

### 12. `ConstructorParameters<T>`

获取构造函数类型 `T` 的参数类型组成的元组类型。

```typescript
class PersonClass {
  constructor(public name: string, public age: number) {}
}

type PersonParams = ConstructorParameters<typeof PersonClass>;
// 等同于 [string, number]
```

### 13. `Uppercase<T>`, `Lowercase<T>`, `Capitalize<T>`, `Uncapitalize<T>`

字符串字面量类型的转换工具类型（TypeScript 4.1+）。

```typescript
type T = 'hello';
type UppercaseT = Uppercase<T>; // 'HELLO'
type LowercaseT = Lowercase<T>; // 'hello'
type CapitalizeT = Capitalize<T>; // 'Hello'
type UncapitalizeT = Uncapitalize<T>; // 'hello'
```

---

## 二、高级类型操作技巧

除了内置的工具类型，TypeScript 还支持更高级的类型操作，通过条件类型、映射类型、索引访问等实现更灵活的类型合成。

### 1. 条件类型（Conditional Types）

使用 `extends` 关键字进行类型条件判断，实现类型的分支选择。

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>; // true
type B = IsString<123>; // false
```

#### 常见应用：`infer` 关键字

`infer` 用于在条件类型中推断出某个类型，并在后续使用。

```typescript
type ReturnTypeCustom<T> = T extends (...args: any[]) => infer R ? R : never;

type UserReturnTypeCustom = ReturnTypeCustom<typeof getUser>;
// 等同于 Person
```

### 2. 映射类型（Mapped Types）

通过遍历已有类型的属性，进行转换或筛选，构造新的类型。

#### 基本映射类型

```typescript
type Optional<T> = {
  [P in keyof T]?: T[P];
};

type OptionalPerson = Optional<Person>;
// 等同于 { name?: string; age?: number; }
```

#### 结合条件类型进行筛选

```typescript
type StringKeys<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

interface Mixed {
  name: string;
  age: number;
  email: string;
}

type StringOnly = StringKeys<Mixed>;
// 等同于 { name: string; email: string; }
```

#### 使用 `keyof` 和索引访问

```typescript
type ValueOf<T> = T[keyof T];

type PersonValues = ValueOf<Person>;
// 等同于 string | number
```

### 3. 模板字面量类型（Template Literal Types）

TypeScript 4.1 引入了模板字面量类型，允许通过字符串字面量的组合来构造新的类型。

```typescript
type EventName = 'click' | 'scroll' | 'hover';
type HandlerName = `on${Capitalize<EventName>}`;

// 等同于 'onClick' | 'onScroll' | 'onHover'
```

### 4. 递归类型

TypeScript 支持递归类型定义，允许类型在自身内部引用自己，用于处理嵌套结构。

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface NestedPerson {
  name: string;
  address: {
    city: string;
    zip: number;
  };
}

type PartialNestedPerson = DeepPartial<NestedPerson>;
// 等同于 { name?: string; address?: { city?: string; zip?: number; }; }
```

---

## 三、组合使用工具类型与高级技巧

在实际开发中，往往需要组合使用内置的工具类型与高级的类型操作技巧，以实现更复杂的类型合成需求。

### 示例 1：从对象类型中提取特定类型的属性

假设有一个对象类型，想要提取所有属性值为 `string` 类型的属性。

```typescript
type StringProps<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

interface Example {
  name: string;
  age: number;
  email: string;
}

type StringOnlyExample = StringProps<Example>;
// 等同于 { name: string; email: string; }
```

### 示例 2：合并多个类型

假设有多个类型，想要将它们的属性合并成一个新的类型，同时处理属性冲突（如使用联合类型）。

```typescript
type Merge<T, U> = {
  [K in keyof T | keyof U]: 
    K extends keyof U ? U[K] :
    K extends keyof T ? T[K] :
    never;
};

interface A {
  a: string;
  b: number;
}

interface B {
  b: boolean;
  c: string;
}

type Merged = Merge<A, B>;
// 等同于 { a: string; b: boolean; c: string; }
// 注意：属性 'b' 的类型被 B 中的类型覆盖
```

如果需要更复杂的合并策略（如联合类型），可以进一步定制：

```typescript
type UnionMerge<T, U> = {
  [K in keyof T | keyof U]: 
    K extends keyof T & keyof U ? T[K] | U[K] :
    K extends keyof T ? T[K] :
    K extends keyof U ? U[K] :
    never;
};

type UnionMerged = UnionMerge<A, B>;
// 等同于 { a: string; b: number | boolean; c: string; }
```

### 示例 3：提取函数返回类型并组合

假设有多个函数类型，想要提取它们的返回类型，并组合成一个新的联合类型。

```typescript
type FunctionReturnUnion<T extends (...args: any[]) => any[]> = 
  ReturnType<T[0]> | ... | ReturnType<T[n]>;

// 实际中，TypeScript 不支持直接对元组类型的每个元素应用 ReturnType，
// 可以使用递归或展开的方式。

// 简单示例：两个函数
type Func1 = () => string;
type Func2 = () => number;

type ReturnUnion = ReturnType<Func1> | ReturnType<Func2>;
// 等同于 string | number
```

对于多个函数，可以定义一个工具类型：

```typescript
type ReturnUnion<T extends Array<(...args: any[]) => any>> = 
  T extends [infer F, ...infer R] 
    ? ReturnType<F> | ReturnUnion<R> 
    : never;

type Funcs = [() => string, () => number, () => boolean];
type UnionReturn = ReturnUnion<Funcs>;
// 等同于 string | number | boolean
```

---

## 四、实用技巧与最佳实践

### 1. 使用 `as` 进行键的重映射

在映射类型中，可以使用 `as` 子句对键进行重映射，实现更灵活的类型转换。

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// 等同于 { getName: () => string; getAge: () => number; }
```

### 2. 过滤掉某些属性

结合条件类型与映射类型，可以过滤掉不需要的属性。

```typescript
type FilterProperties<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

interface MixedData {
  name: string;
  age: number;
  email: string;
  isActive: boolean;
}

type StringPropsOnly = FilterProperties<MixedData, string>;
// 等同于 { name: string; email: string; }
```

### 3. 动态生成类型

利用泛型和条件类型，可以根据输入动态生成新的类型。

```typescript
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface Data {
  id: number;
  name: string;
}

type NullableData = Nullable<Data>;
// 等同于 { id: number | null; name: string | null; }
```

---

## 五、总结

TypeScript 提供了丰富的内置工具类型和强大的类型操作能力，允许开发者从已有类型中提取、转换和组合出新的类型。以下是主要的方法汇总：

1. **内置工具类型**
   - `Partial`, `Required`, `Readonly`
   - `Record`, `Pick`, `Omit`
   - `Exclude`, `Extract`, `NonNullable`
   - `ReturnType`, `Parameters`, `ConstructorParameters`
   - 字符串转换工具类型：`Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`

2. **高级类型操作**
   - 条件类型与 `infer` 关键字
   - 映射类型与键的重映射 (`as`)
   - 索引访问类型 (`T[K]`)
   - 模板字面量类型
   - 递归类型定义

3. **组合与实用技巧**
   - 组合多个工具类型实现复杂类型转换
   - 使用 `as` 进行键的重命名
   - 动态生成类型基于输入
   - 过滤和筛选特定类型的属性

掌握这些方法，可以极大地提升 TypeScript 的类型安全性与代码的可维护性，使得类型系统成为开发中的强大助手，而不仅仅是约束工具。