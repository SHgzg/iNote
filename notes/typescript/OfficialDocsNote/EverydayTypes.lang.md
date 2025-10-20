# TypeScript: Everyday Types

## Introduction

In this chapter, we'll cover some of the most common types of values you'll find in JavaScript code, and explain the corresponding ways to describe those types in TypeScript. This isn't an exhaustive list, and future chapters will describe more ways to name and use other types.
> 在本章中，我们将覆盖你在 javascript 代码中会用到的大部分值类型，并解释在 TypeScript 中描述这些类型的对应方法。这不是一份详尽的清单，在未来的章节中将会介绍定义和使用其他类型的更多方法。

> corresponding, exhaustive


Types can also appear in many more places than just type annotations. As we learn about the types themselves, we'll also learn about the places where we can refer to these types to form new constructs.
> 类型见于很多地方而非仅仅是类型注释。当我们学习类型本身时，我们也会学习到在哪些地方使用它

> 类型不仅可以出现在类型注解中，还能出现在更多地方。在我们学习类型本身的同时，我们也将学习在哪些地方可以引用这些类型以构建新的结构

> annotations, refer to, form

We'll start by reviewing the most basic and common types you might encounter when writing JavaScript or TypeScript code. These will later form the core building blocks of more complex types.
> 我们将以复习你在写 JavaScript 和 TypeScript 代码时会用到的最基本和常见的类型开始。它们稍后将会组成更复杂类型的核心部分

> 我们将从回顾您在编写 JavaScript 或 TypeScript 代码时可能遇到的最基本和最常见的类型开始。这些类型随后将构成更复杂类型的核心构建模块

> encounter， building blocks

## The Primitives: `string`, `number`, and `boolean`

JavaScript has three very commonly used primitives: `string`, `number`, and `boolean`. Each has a corresponding type in TypeScript.
> JavaScript 有三个经常使用的基本数据类型：`string`, `number`, 和 `boolean`。它们都有一个在 TypeScript 中的对应类型

> JavaScript 拥有三种最常用的原始数据类型：string、number和 boolean。在 TypeScript 中，每一种都有其对应的类型

> primitives

As you might expect, these are the same names you'd see if you used the JavaScript `typeof` operator on a value of those types:
> 如你所想，他们的命名和你已经见过的在使用 JavaScript `typeof` 运算符获取一个变量的类型相同

> 正如你所料，如果你在对应类型的值上使用 JavaScript 的 typeof操作符，看到的名称与这些类型名完全相同。

- `string` represents string values like `"Hello, world"`
- `number` is for numbers like `42`. JavaScript does not have a special runtime value for integers, so there's no equivalent to `int` or `float` - everything is simply `number`
- `boolean` is for the two values `true` and `false`
> equivalent

> **Note:** The type names `String`, `Number`, and `Boolean` (starting with capital letters) are legal, but refer to some special built-in types that will very rarely appear in your code. Always use `string`, `number`, or `boolean` for types.
> String, Number, 和 Boolean (大写字母开头) 的类型是合法的,但是他们使用一些你的代码中很少见的特殊内建类型。请总是使用 `string`, `number`, 或者 `boolean` 

> 类型名 String、Number和 Boolean（首字母大写）是合法的，但它们指向一些在代码中极少出现的特殊内置类型。请始终使用 string、number或 boolean来标注类型

## Arrays

To specify the type of an array like `[1, 2, 3]`, you can use the syntax `number[]`; this syntax works for any type (e.g. `string[]` is an array of strings, and so on).

You may also see this written as `Array<number>`, which means the same thing. We'll learn more about the syntax `T<U>` when we cover generics.

> **Note:** `[number]` is a different thing; refer to the section on Tuples.

> 要指定像 [1, 2, 3]这类数组的类型，你可以使用 number[]这样的语法；这种语法适用于任何类型（例如，string[]表示字符串数组，依此类推）。   
你也会看到这种写法 Array<number>，它的含义是相同的。我们将在讲解泛型时进一步了解 T<U> 这种语法。  
注意：​​ [number] 是另一种不同的类型；请参考关于元组（Tuple）的章节

## `any`

TypeScript also has a special type, `any`, that you can use whenever you don't want a particular value to cause typechecking errors.
> TypeScript 也有一个特殊类型 any，可以在你不想一个不确定的变量造成类型检查错误时使用

>TypeScript 还提供了一种特殊的类型 any，当您不希望某个特定值引发类型检查错误时，可以使用此类型。

When a value is of type `any`, you can access any properties of it (which will in turn be of type `any`), call it like a function, assign it to (or from) a value of any type, or pretty much anything else that's syntactically legal:
> 当一个变量的类型是 any 时，你能访问它的任意属性（）像函数一样调用它，给他赋值任何类型的变量或者其他 js 中的合法操作

> 当一个值的类型为 any时，你可以访问它的任何属性（这些属性的类型同样会是 any），可以像调用函数一样调用它，可以将它赋值给任意类型的变量（或从任意类型的变量赋值给它），或者进行几乎所有语法上允许的操作：

```typescript
let obj: any = { x: 0 };
// None of the following lines of code will throw compiler errors.
// Using `any` disables all further type checking, and it is assumed
// you know the environment better than TypeScript.
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

The `any` type is useful when you don't want to write out a long type just to convince TypeScript that a particular line of code is okay.
> 当我们想写一个很长的类型来说服 TypeScript 指定行的代码是合法的时，any 类型很有用

> 当你不想为了通过 TypeScript 的类型检查而编写冗长的类型声明时，any类型会很有用。

> convince

### `noImplicitAny`

When you don't specify a type, and TypeScript can't infer it from context, the compiler will typically default to `any`. You usually want to avoid this, though, because `any` isn't type-checked. Use the compiler flag `noImplicitAny` to flag any implicit `any` as an error.
> 当你没有明确的类型时，并且TypeScript 不能从上下文推断时，编译一般情况默认为 any，通常你会想避免这种情况，尽管如此，因为 any 不是一个类型检查。 使用编译配置 noImplicitAny 将 any 作为一个类型错误

> 如果你没有明确指定一个类型，并且 TypeScript 也无法从上下文推断出它的类型，编译器通常会将其默认设置为 any类型。然而，你通常需要避免这种情况，因为 any不会进行类型检查。可以使用编译器选项 noImplicitAny将任何隐式的 any类型标记为错误

## Type Annotations on Variables

When you declare a variable using `const`, `var`, or `let`, you can optionally add a type annotation to explicitly specify the type of the variable:
> 当你使用 const，var，let声明一个变量时，你可以选择加上类型声明来明确值的类型

> 当你使用 const、var或 let声明一个变量时，你可以选择性地添加一个类型注解，以显式指定该变量的类型

> explicitly,

```typescript
let myName: string = "Alice";
```

> TypeScript doesn't use "types on the left"-style declarations like `int x = 0;` Type annotations will always go after the thing being typed.
> TypeScript 不使用像“ int x = 0”一样类型在左的声明风格。类型注释始终在被声明的对象之后

> 

In most cases, though, this isn't needed. Wherever possible, TypeScript tries to automatically infer the types in your code. For example, the type of a variable is inferred based on the type of its initializer:
> 在多数情况下，尽管不必要，在任何地方 TypeScript 都会尝试自动地推断你代码里的类型。举个例子，基于自身的初始化，变量的类型被推导出来

> 然而，在大多数情况下，这是不必要的。只要可能，TypeScript 会尝试自动推断代码中的类型。例如，变量的类型是根据其初始化器的类型推断而来的：

```typescript
// No type annotation needed -- 'myName' inferred as type 'string'
let myName = "Alice";
```

For the most part you don't need to explicitly learn the rules of inference. If you're starting out, try using fewer type annotations than you think - you might be surprised how few you need for TypeScript to fully understand what's going on.
> 大多数部分你不需要深度学习inference规则，如果你刚刚开始，尝试使用比你想象中更少的类型注释 - 你可能惊讶于你只需要一点点就能完全理解 TypeScript在做什么

> 在大多数情况下，你并不需要刻意去学习类型推断的规则。如果你是初学者，尝试使用比你以为的更少的类型注解——你可能会惊讶地发现，只需要很少的注解，TypeScript 就能完全理解代码的意图

## Functions

Functions are the primary means of passing data around in JavaScript. TypeScript allows you to specify the types of both the input and output values of functions.
> 在 JavaScript中，函数是传递数据最基本的概念。TypeScript 允许你指定输入和输出值的类型

> 函数是 JavaScript 中传递数据的主要方式。TypeScript 允许您指定函数的输入值和输出值的类型

> primary mean, pass data around
### Parameter Type Annotations

When you declare a function, you can add type annotations after each parameter to declare what types of parameters the function accepts. Parameter type annotations go after the parameter name:
> 当你声明一个函数时，你能在每一个参数后面添加类型注释来声明函数接收参数的类型，参数类型注释跟在参数名后面

> 当你声明一个函数时，你可以在每个参数后面添加类型注解，以声明该函数接受的参数类型。参数类型注解位于参数名称之后：
```typescript
// Parameter type annotation
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase() + "!!");
}
```

When a parameter has a type annotation, arguments to that function will be checked:
> 当一个参数有类型注释时，函数的参数列表就会被检查

> 当参数有类型注解时，传递给该函数的参数将会被检查：

```typescript
// Would be a runtime error if executed!
greet(42);
// Argument of type 'number' is not assignable to parameter of type 'string'.
```

Even if you don't have type annotations on your parameters, TypeScript will still check that you passed the right number of arguments.
> 甚至如果你的参数没有类型注释，TypeScript也将会检查你传递的具体的参数个数

> 即使您没有为参数添加类型注解，TypeScript 仍会检查您是否传入了正确数量的参数。

### Return Type Annotations

You can also add return type annotations. Return type annotations appear after the parameter list:
>你也可以添加返回值类型注释。返回类型注释显示的位于参数列表之后：

> 您也可以添加返回类型注解。返回类型注解位于参数列表之后

```typescript
function getFavoriteNumber(): number {
  return 26;
}
```

Much like variable type annotations, you usually don't need a return type annotation because TypeScript will infer the function's return type based on its return statements. The type annotation in the above example doesn't change anything. Some codebases will explicitly specify a return type for documentation purposes, to prevent accidental changes, or just for personal preference.
> 和变量的类型注释很相似，你通常不需要一个返回值类型注释，因为TypeScript会根据返回值语句推断函数的返回类型注释。下面例子中的类型注释什么也没有改变。一些代码示例会为了文档会明确地指定返回值类型来阻止意外更改，或者知识个人偏好。

> 与变量类型注解非常相似，您通常不需要添加返回类型注解，因为 TypeScript 会根据函数中的 return 语句推断出其返回类型。上面示例中的类型注解并不会改变任何行为。有些代码库会为了文档化、防止意外更改，或者仅仅是出于个人偏好，而明确指定返回类型。

### Functions Which Return Promises

If you want to annotate the return type of a function which returns a promise, you should use the `Promise` type:
> 如果你想注释返回promise的函数的返回类型，你应该使用 Promise类型：

> 如果你想要为一个返回 Promise 的函数的返回类型添加注解，你应该使用 Promise类型

```typescript
async function getFavoriteNumber(): Promise<number> {
  return 26;
}
```

### Anonymous Functions

Anonymous functions are a little bit different from function declarations. When a function appears in a place where TypeScript can determine how it's going to be called, the parameters of that function are automatically given types.
> 匿名函数和函数声明有一些不同。当函数出现在一个TypeScript能推断出函数将会怎样被调用，函数的参数会自动的被赋予类型

> 匿名函数与函数声明略有不同。当一个函数出现在 TypeScript 能够确定其调用方式的上下文中时，该函数的参数会自动被赋予类型。

> determines
Here's an example:

```typescript
const names = ["Alice", "Bob", "Eve"];

// Contextual typing for function - parameter s inferred to have type string
names.forEach(function(s) {
  console.log(s.toUpperCase());
});

// Contextual typing also applies to arrow functions
names.forEach((s) => {
  console.log(s.toUpperCase());
});
```

Even though the parameter `s` didn't have a type annotation, TypeScript used the types of the `forEach` function, along with the inferred type of the array, to determine the type `s` will have.
> 尽管参数 s没有类型注释，TypeScript使用了被推断出参数是数组类型的forEach函数的类型来决定 s将会有的类型

> 尽管参数 s没有类型注解，TypeScript 仍根据 forEach函数的类型定义以及数组的推断类型，自动确定了参数 s应有的类型。

> along with

This process is called **contextual typing** because the context that the function occurred within informs what type it should have.

>这个程序叫做上下文类型，因为上函数本身包含了它所需要的类型信息

>这个过程被称为​​上下文类型（contextual typing）​​，因为函数所处的上下文会告知它应具有什么类型
>

Similar to the inference rules, you don't need to explicitly learn how this happens, but understanding that it does happen can help you notice when type annotations aren't needed. Later, we'll see more examples of how the context that a value occurs in can affect its type.
> 和推到规则类型，你不需要可以学习上下文类型是怎么发生的，但是理解它确实发生了有助于你知道什么时候不需要类型注释。稍后，我们将看更多的变量所处的上下文怎样影响它的类型的例子。

## Object Types

Apart from primitives, the most common sort of type you'll encounter is an **object type**. This refers to any JavaScript value with properties, which is almost all of them!
> 作为基础类型的一部分，你会遇到的最常见的是 object类型，他能推断出几乎所有 JavaScript变量的属性

> 除了原始类型之外，您最常遇到的一种类型就是​​对象类型​​。这指的是任何具有属性的 JavaScript 值，几乎所有的值都是如此！

To define an object type, we simply list its properties and their types. For example, here's a function that takes a point-like object:
> 要定义一个对象类型，我们简单地列出它的属性和属性的类型。举个例子，这是一个输入坐标地函数：

> 要定义一个对象类型，我们只需列出其属性及其类型即可。例如，以下是一个接收点状对象作为参数的函数：
```typescript
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

Here, we annotated the parameter with a type with two properties - `x` and `y` - which are both of type `number`. You can use `,` or `;` to separate the properties, and the last separator is optional either way.

The type part of each property is also optional. If you don't specify a type, it will be assumed to be `any`.
> 这里，我们为参数标注了一个包含两个属性的类型——x和 y——它们的类型都是 number。你可以使用 ,或 ;来分隔属性，并且无论哪种方式，最后一个分隔符都是可选的。
每个属性的类型标注也是可选的。如果你不指定类型，它将被假定为 any。

### Optional Properties

Object types can also specify that some or all of their properties are **optional**. To do this, add a `?` after the property name:
> 对象类型还可以指定其部分或全部属性是​​可选的​​。要实现这一点，只需在属性名后添加一个 ?：

```typescript
function printName(obj: { first: string; last?: string }) {
  // ...
}

// Both OK
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

In JavaScript, if you access a property that doesn't exist, you'll get the value `undefined` rather than a runtime error. Because of this, when you read from an optional property, you'll have to check for `undefined` before using it.

> 在 JavaScript中，如果你范文一个不存在的属性，你会得到一个 undefine而不是一个运行时错误。因此，当你读取一个可选属性是，需要在使用前检查 undefine

> 在 JavaScript 中，如果您访问一个不存在的属性，您将得到值 undefined而不是运行时错误。正因如此，当您从一个可选属性中读取值时，在使用它之前必须检查其是否为 undefined。
### Defining a Union Type
```typescript
function printName(obj: { first: string; last?: string }) {
  // Error - might crash if 'obj.last' wasn't provided!
  console.log(obj.last.toUpperCase());
  // 'obj.last' is possibly 'undefined'.

  if (obj.last !== undefined) {
    // OK
    console.log(obj.last.toUpperCase());
  }

  // A safe alternative using modern JavaScript syntax:
  console.log(obj.last?.toUpperCase());
}
```

## Union Types

TypeScript's type system allows you to build new types out of existing ones using a large variety of operators. Now that we know how to write a few types, it's time to start combining them in interesting ways.
> TypeScript 的类型系统允许你用丰富的操作符来构建新的类型。至此我们已经会使用一些类型，是时候开始用有趣的方法组装他们了

> TypeScript 的类型系统允许您使用种类繁多的操作符，基于现有类型来构建新类型。既然我们已经了解了如何编写一些基础类型，是时候开始以各种有趣的方式将它们组合起来了。

> 
### Defining a Union Type

The first way to combine types you might see is a **union type**. A union type is a type formed from two or more other types, representing values that may be any one of those types. We refer to each of these types as the union's
> 你将看到的第一种组合类型是联合类型，一个联合类型是由两个或者多个其他类型构成，代表这个变量的类型可以是这些类型中的任意一个。我们将这些类型推断成一个联合的类型

> 您可能遇到的第一种组合类型的方式是 ​​联合类型​​。联合类型是由两个或多个其他类型组合而成的类型，表示取值可以是这些类型中的任意一种。我们将这些组成类型中的每一个称为该联合类型的​​成员
**members**.

Let's write a function that can operate on strings or numbers:
> 写一个能操作字符串和数字的函数

> 让我们编写一个可以操作字符串或数字的函数。

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}

// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
// Argument of type '{ myID: number; }' is not assignable to parameter of type 'string | number'.
```

The separator of the union members is allowed before the first element, so you could also write this:
> 联合类型的分隔符允许卸载第一个元素前面，所以你可以这样写：

> 联合类型成员的分隔符允许出现在第一个元素之前，因此你也可以这样写：


```typescript
function printTextOrNumberOrBool(textOrNumberOrBool: | string | number | boolean) {
  console.log(textOrNumberOrBool);
}
```

### Working with Union Types

It's easy to provide a value matching a union type - simply provide a type matching any of the union's members. If you have a value of a union type, how do you work with it?
> 提供一个符合联合类型的值是很简单的 - 只需提供一个类型匹配任何一个成员类型。如果有一个联合类型的值，你会怎样使用它？

> 要提供一个匹配联合类型的值很容易——只需提供与联合类型中任意成员匹配的类型即可。但如果你有一个联合类型的值，该如何操作它呢？

TypeScript will only allow an operation if it is valid for every member of the union. For example, if you have the union `string | number`, you can't use methods that are only available on `string`:
> 如果它对联合类型的每一个成员都是合法的，TypeScript 仅允许一种操作操作符。举个例子，如果你有一个联合类型 string | number，你不能使用只对 string类型有效的方法。

> TypeScript 只允许那些对联合类型中​​每一个成员​​都有效的操作。例如，如果你有一个 string | number类型的联合类型，你就不能使用仅存在于 string类型上的方法

```typescript
function printId(id: number | string) {
  console.log(id.toUpperCase());
  // Property 'toUpperCase' does not exist on type 'string | number'.
  // Property 'toUpperCase' does not exist on type 'number'.
}
```

The solution is to **narrow** the union with code, the same as you would in JavaScript without type annotations. Narrowing occurs when TypeScript can deduce a more specific type for a value based on the structure of the code.
> 收窄联合类型的方案和你在没有类型注释时会在 JavaScript中做的那样。当 TypeScript基于代码结构能推断出一个更确定的值的类型时，就会类型收窄

> 解决方案是使用代码来​​缩小​​联合类型的范围，这与你在没有类型注解的 JavaScript 中所做的操作是相同的。当 TypeScript 能够根据代码的结构推断出一个值更具体的类型时，就会发生类型缩小

For example, TypeScript knows that only a `string` value will have a `typeof` value `"string"`:
> 举个例子， TypeScript知道只有 string 类型的值在 typeof操作下有值 string

> 例如，TypeScript 知道只有 string类型的值其 typeof结果才会是 "string"： 

```typescript
function printId(id: number | string) {
  if (typeof id === "string") {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase());
  } else {
    // Here, id is of type 'number'
    console.log(id);
  }
}
```

Another example is to use a function like `Array.isArray`:
> 另一个例子时使用像 Array.isArray这样的方法 

> 

```typescript
function welcomePeople(x: string[] | string) {
  if (Array.isArray(x)) {
    // Here: 'x' is 'string[]'
    console.log("Hello, " + x.join(" and "));
  } else {
    // Here: 'x' is 'string'
    console.log("Welcome lone traveler " + x);
  }
}
```

Notice that in the `else` branch, we don't need to do anything special - if `x` wasn't a `string[]`, then it must have been a `string`.
> 注意分支中的 else，我们不需要做任何特殊的操作 - 如果 x不是一个 string[]类型，一定是一个 string类型

> 注意，在 else分支中，我们不需要做任何特殊处理——如果 x不是一个 string[]类型，那么它​​必定是​​一个 string。

Sometimes you'll have a union where all the members have something in common. For example, both arrays and strings have a `slice` method. If every member in a union has a property in common, you can use that property without narrowing:
> 有时你会有一个所有成员都有一些相似之处的联合类型。例如， arrays 和 strings 都有 slice方法。如果每一个成员都有一个相同的属性，那么你能在不使用类型缩窄的情况下使用它。

> 有时，你会遇到一个​​所有成员都具有某些共同点​​的联合类型。例如，数组和字符串都拥有 slice方法。如果联合类型中的​​每一个成员都共享某个属性​​，那么你便可以​​无需收窄类型​​而直接使用该属性

```typescript
// Return type is inferred as number[] | string
function getFirstThree(x: number[] | string) {
  return x.slice(0, 3);
}
```

It might be confusing that a union of types appears to have the intersection of those types' properties. This is not an accident - the name union comes from type theory. The union `number | string` is composed by taking the union of the values from each type. Notice that given two sets with corresponding facts about each set, only the intersection of those facts applies to the union of the sets themselves.
> 可能一个类型的联合看起来有这些类型成员的交集会让人困惑。这并不意外 - 联合这个名字来自类型理论。number | string 这个联合类型由符合每一个类型的所有值组成。注意到给两个集合和每个集合对应的实际值，只有这些实际值的交集符合集合的联合。

> 联合类型​​似乎具有​​其成员类型属性的​​交集​​，这点可能令人困惑。这并非偶然——"联合"这个名称源于类型理论。number | string这个联合类型是通过取​​每种类型所有值的并集​​而构成的。请注意，给定两个集合及各自对应的某些事实（属性），则​​仅有这些事实的交集适用于集合本身的并集​​。

For example, if we had a room of tall people wearing hats, and another room of Spanish speakers wearing hats, after combining those rooms, the only thing we know about every person is that they must be wearing a hat.
> 举个例子，如果有一个屋子里有一屋子戴帽子的高个子，另一个屋子里都是戴帽子且说说西班牙语的人，合并两个屋子之后，我们唯一能确定的关于每个人的一定是带着帽子。

> 举个例子，假设一个房间里全是戴帽子的高个子，另一个房间里都是戴帽子且讲西班牙语的人。将这两个房间合并后，我们关于每个人唯一能确定的事实就是：他们一定都戴着帽子。

## Type Aliases

We've been using object types and union types by writing them directly in type annotations. This is convenient, but it's common to want to use the same type more than once and refer to it by a single name.

A **type alias** is exactly that - a **name for any type**. The syntax for a type alias is:
> 我们已经通过直接写类型注释的使用了对象类型和联合类型。这样做很方便，通常情况下，我们不止一次的使用同一个类型时，希望用一个简单的名字来引用它。  
一个类型别名正是如此 - 一个类型的名称。类型别名的语法是：

> 我们之前一直通过直接将类型写入注解来使用对象类型和联合类型。这种方式虽然方便，但通常，当我们希望​​多次​​使用同一种类型时，会希望通过一个​​单一名称​​来引用它。  
​​类型别名​​正是为此而生——它是​​任意类型​​的一个名称。定义类型别名的语法如下：

```typescript
type Point = {
  x: number;
  y: number;
};

// Exactly the same as the earlier example
function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

You can actually use a type alias to give a name to any type at all, not just an object type. For example, a type alias can name a union type:
> 实际上你可以使用类型别名给任意类型命名，而不仅仅是对象类型。例如，类型别名可以命名联合类型:

> 实际上，你可以使用类型别名来为​​任意类型​​命名，而不仅限于对象类型。例如，类型别名可以为联合类型命名：

```typescript
type ID = number | string;
```

Note that aliases are only aliases - you cannot use type aliases to create different/distinct "versions" of the same type. When you use the alias, it's exactly as if you had written the aliased type. In other words, this code might look illegal, but is OK according to TypeScript because both types are aliases for the same type:
> 需要注意别名只是别名 - 你不能用类型别名创造同一个类型的不同/相同的版本。当你使用别名，尤其是当你写了一个有别名的类型。总而言之，这段代码可能看起来不合法，但根据 TypeScript是合法的，因为两个类型都是同一个类型的别名。

> 需要注意的​​是，类型别名仅仅是别名​​——你无法用它为同一类型创建不同或独立的“版本”。当你使用别名时，​​效果完全等同于​​你直接书写了被别名的那个原始类型。换句话说，下面这段代码看起来可能不合法，但在 TypeScript 中却是允许的，因为这两个类型实质上是同一类型的别名

```typescript
type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
  return sanitize(str);
}

// Create a sanitized input
let userInput = sanitizeInput(getInput());

// Can still be re-assigned with a string though
userInput = "new input";
```

## Interfaces

An **interface declaration** is another way to name an object type:
> 接口声明是另一种命名对象类型的方法

> 接口声明是另一种命名对象类型的方法

```typescript
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 100, y: 100 });
```

Just like when we used a type alias above, the example works just as if we had used an anonymous object type. TypeScript is only concerned with the structure of the value we passed to `printCoord` - it only cares that it has the expected properties. Being concerned only with the structure and capabilities of types is why we call TypeScript a **structurally typed** type system.

### Differences Between Type Aliases and Interfaces

Type aliases and interfaces are very similar, and in many cases you can choose between them freely. Almost all features of an `interface` are available in `type`, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.

| Interface | Type |
|-----------|------|
| **Extending an interface**<br>`interface Animal { name: string; }`<br>`interface Bear extends Animal { honey: boolean; }`<br>`const bear = getBear();`<br>`bear.name;`<br>`bear.honey;` | **Extending a type via intersections**<br>`type Animal = { name: string; }`<br>`type Bear = Animal & { honey: boolean; }`<br>`const bear = getBear();`<br>`bear.name;`<br>`bear.honey;` |
| **Adding new fields to an existing interface**<br>`interface Window { title: string; }`<br>`interface Window { ts: TypeScriptAPI; }`<br>`const src = 'const a = "Hello World"';`<br>`window.ts.transpileModule(src, {});` | **A type cannot be changed after being created**<br>`type Window = { title: string; }`<br>`type Window = { ts: TypeScriptAPI; }`<br>`// Error: Duplicate identifier 'Window'.` |

You'll learn more about these concepts in later chapters, so don't worry if you don't understand all of these right away.

Prior to TypeScript version 4.2, type alias names may appear in error messages, sometimes in place of the equivalent anonymous type (which may or may not be desirable). Interfaces will always be named in error messages.

For the most part, you can choose based on personal preference, and TypeScript will tell you if it needs something to be the other kind of declaration. If you would like a heuristic, use `interface` until you need to use features from `type`.

## Type Assertions

Sometimes you will have information about the type of a value that TypeScript can't know about. For example, if you're using `document.getElementById`, TypeScript only knows that this will return some kind of `HTMLElement`, but you might know that your page will always have an `HTMLCanvasElement` with a given ID.

In this situation, you can use a **type assertion** to specify a more specific type:

```typescript
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

Like a type annotation, type assertions are removed by the compiler and won't affect the runtime behavior of your code.

You can also use the angle-bracket syntax (except if the code is in a `.tsx` file), which is equivalent:

```typescript
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

> **Reminder:** Because type assertions are removed at compile-time, there is no runtime checking associated with a type assertion. There won't be an exception or `null` generated if the type assertion is wrong.

TypeScript only allows type assertions which convert to a more specific or less specific version of a type. This rule prevents "impossible" coercions like:

```typescript
const x = "hello" as number;
// Conversion of type 'string' to type 'number' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
```

Sometimes this rule can be too conservative and will disallow more complex coercions that might be valid. If this happens, you can use two assertions, first to `any` (or `unknown`, which we'll introduce later), then to the desired type:

```typescript
const a = expr as any as T;
```

## Literal Types

In addition to the general types `string` and `number`, we can refer to specific strings and numbers in type positions.

One way to think about this is to consider how JavaScript comes with different ways to declare a variable. Both `var` and `let` allow for changing what is held inside the variable, and `const` does not. This is reflected in how TypeScript creates types for literals.

```typescript
let changingString = "Hello World";
changingString = "Olá Mundo";
// Because `changingString` can represent any possible string, that
// is how TypeScript describes it in the type system
changingString;
// let changingString: string

const constantString = "Hello World";
// Because `constantString` can only represent 1 possible string, it
// has a literal type representation
constantString;
// const constantString: "Hello World"
```

By themselves, literal types aren't very valuable:

```typescript
let x: "hello" = "hello";
// OK
x = "hello";
x = "howdy";
// Type '"howdy"' is not assignable to type '"hello"'.
```

It's not much use to have a variable that can only have one value! But by combining literals into unions, you can express a much more useful concept - for example, functions that only accept a certain set of known values:

```typescript
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}

printText("Hello, world", "left");
printText("G'day, mate", "centre");
// Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
```

Numeric literal types work the same way:

```typescript
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

Of course, you can combine these with non-literal types:

```typescript
interface Options {
  width: number;
}

function configure(x: Options | "auto") {
  // ...
}

configure({ width: 100 });
configure("auto");
configure("automatic");
// Argument of type '"automatic"' is not assignable to parameter of type 'Options | "auto"'.
```

There's one more kind of literal type: boolean literals. There are only two boolean literal types, and as you might guess, they are the types `true` and `false`. The type `boolean` itself is actually just an alias for the union `true | false`.

### Literal Inference

When you initialize a variable with an object, TypeScript assumes that the properties of that object might change values later. For example, if you wrote code like this:

```typescript
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

TypeScript doesn't assume the assignment of `1` to a field which previously had `0` is an error. Another way of saying this is that `obj.counter` must have the type `number`, not `0`, because types are used to determine both reading and writing behavior.

The same applies to strings:

```typescript
declare function handleRequest(url: string, method: "GET" | "POST"): void;

const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
// Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
```

In the above example `req.method` is inferred to be `string`, not `"GET"`. Because code can be evaluated between the creation of `req` and the call of `handleRequest` which could assign a new string like `"GUESS"` to `req.method`, TypeScript considers this code to have an error.

There are two ways to work around this. You can change the inference by adding a type assertion in either location:

```typescript
// Change 1:
const req = { url: "https://example.com", method: "GET" as "GET" };
// Change 2
handleRequest(req.url, req.method as "GET");
```

Change 1 means "I intend for `req.method` to always have the literal type `"GET"`", preventing the possible assignment of `"GUESS"` to that field after. Change 2 means "I know for other reasons that `req.method` has the value `"GET"`".

You can use `as const` to convert the entire object to be type literals:

```typescript
const req = { url: "https://example.com", method: "GET" } as const;
handleRequest(req.url, req.method);
```

The `as const` suffix acts like `const` but for the type system, ensuring that all properties are assigned the literal type instead of a more general version like `string` or `number`.

## `null` and `undefined`

JavaScript has two primitive values used to signal absent or uninitialized value: `null` and `undefined`. TypeScript has two corresponding types by the same names. How these types behave depends on whether you have the `strictNullChecks` option on.

### `strictNullChecks` off

With `strictNullChecks` off, values that might be `null` or `undefined` can still be accessed normally, and the values `null` and `undefined` can be assigned to a property of any type. This is similar to how languages without null checks (e.g. C#, Java) behave. The lack of checking for these values tends to be a major source of bugs; we always recommend people turn `strictNullChecks` on if it's practical to do so in their codebase.

### `strictNullChecks` on

With `strictNullChecks` on, when a value is `null` or `undefined`, you will need to test for those values before using methods or properties on that value.

Just like checking for `undefined` before using an optional property, we can use narrowing to check for values that might be `null`:

```typescript
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

### Non-null Assertion Operator (Postfix `!`)

TypeScript also has a special syntax for removing `null` and `undefined` from a type without doing any explicit checking. Writing `!` after any expression is effectively a type assertion that the value isn't `null` or `undefined`:

```typescript
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

Just like other type assertions, this doesn't change the runtime behavior of your code, so it's important to only use `!` when you know that the value can't be `null` or `undefined`.

## Enums

Enums are a feature added to JavaScript by TypeScript which allows for describing a value which could be one of a set of possible named constants. Unlike most TypeScript features, this is not a type-level addition to JavaScript but something added to the language and runtime. Because of this, it's a feature which you should know exists, but maybe hold off on using unless you are sure.

You can read more about enums in the https://www.typescriptlang.org/docs/handbook/enums.html.

## Less Common Primitives

It's worth mentioning the rest of the primitives in JavaScript which are represented in the type system. Though we will not go into depth here.

### `bigint`

From ES2020 onwards, there is a primitive in JavaScript used for very large integers, `BigInt`:

```typescript
// Creating a bigint via the BigInt function
const oneHundred: bigint = BigInt(100);
// Creating a BigInt via the literal syntax
const anotherHundred: bigint = 100n;
```

### `symbol`

There is a primitive in JavaScript used to create a globally unique reference via the function `Symbol()`:

```typescript
const firstName = Symbol("name");
const secondName = Symbol("name");

if (firstName === secondName) {
  // This comparison appears to be unintentional because the types 'typeof firstName' and 'typeof secondName' have no overlap.
  // Can't ever happen
}
```