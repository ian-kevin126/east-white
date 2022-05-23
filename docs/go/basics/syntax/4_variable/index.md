---
title: 变量和类型
author: ian_kevin
date: 2022-04-24
---

# 变量和类型

## 一、变量

程序运行过程中的数据都是保存在内存中，我们想要在代码中操作某个数据时就需要去内存上找到这个变量，但是如果我们直接在代码中通过内存地址去操作变量的话，代码的可读性会非常差而且还容易出错，所以我们就利用变量将这个数据的内存地址保存起来，以后直接通过这个变量就能找到内存上对应的数据了。

变量`（Variable）`的功能是存储数据。不同的变量保存的数据类型可能会不一样。经过半个多世纪的发展，编程语言已经基本形成了一套固定的类型，常见变量的数据类型有：整型、浮点型、布尔型等。

Go语言中的每一个变量都有自己的类型，并且变量必须经过声明才能开始使用。

### 1、变量声明

#### 1.1 标准声明

Go语言的变量声明格式为：

```go
var 变量名 变量类型
```

变量声明以关键字`var`开头，变量类型放在变量的后面，行尾无需分号。 举个例子：

```go
var name string
var age int
var isOk bool
```

#### 1.2 批量声明

每声明一个变量就需要写`var`关键字会比较繁琐，go语言中还支持批量变量声明：

```go
var (
  a string
  b int
  c bool
  d float32
)
```

- [golang 中的零值问题与判断为空](https://books.studygolang.com/Mastering_Go_ZH_CN/)

### 2、变量的初始化

Go语言在声明变量的时候，会自动对变量对应的内存区域进行初始化操作。每个变量会被初始化成其类型的默认值，例如： 整型和浮点型变量的默认值为0。 字符串变量的默认值为空字符串。 布尔型变量默认为`false`。 切片、函数、指针变量的默认为`nil`。

当然我们也可在声明变量的时候为其指定初始值。变量初始化的标准格式如下：

```go
var 变量名 类型 = 表达式
```

举个例子：

```go
var name string = "pprof.cn"
var sex int = 1
```

或者一次初始化多个变量

```go
var name, sex = "pprof.cn", 1
```

#### 2.1 类型推导

有时候我们会将变量的类型省略，这个时候编译器会根据等号右边的值来推导变量的类型完成初始化。

```go
var name = "pprof.cn"
var sex = 1
```

#### 2.2 短变量声明

在函数内部，可以使用更简略的 := 方式声明并初始化变量。

```go
package main

import (
    "fmt"
)
// 全局变量m
var m = 100

func main() {
    n := 10
    m := 200 // 此处声明局部变量m
    fmt.Println(m, n)
}
```

#### 2.3 匿名变量

在使用多重赋值时，如果想要忽略某个值，可以使用`匿名变量（anonymous variable）`。 匿名变量用一个下划线_表示，例如：

```go
func foo() (int, string) {
  return 10, "Q1mi"
}

func main() {
  x, _ := foo()
  _, y := foo()
  fmt.Println("x=", x)
  fmt.Println("y=", y)
}
```

匿名变量不占用命名空间，不会分配内存，所以匿名变量之间不存在重复声明。 (在Lua等编程语言里，匿名变量也被叫做哑元变量。)

>  注意事项：
>
> 1. 函数外的每个语句都必须以关键字开始（var、const、func等）
> 2. := 不能使用在函数外。
> 3. _ 多用于占位，表示忽略值。

> “_”本身就是一个特殊的标识符，被称为空白标识符。它可以像其他标识符那样用于变量的声明或赋值（任何类型都可以赋值给它），但任何赋给这个标识符的值都将被抛弃，因此这些值不能在后续的代码中使用，也不可以使用这个标识符作为变量对其它变量进行赋值或运算。

#### 2.4 基本类型

**计算机中数据存储的最小单位为bit（位），0或者1**

**byte：计算机中数据的基本单元，1字节=8bit，数据在计算机中存储或者计算，至少为1个字节**

- bool
- string
- int（随系统，一般是占用4个字节）、int8(占一个字节)、int16(占两个字节)、int32(占4个字节)、int64（占8个字节）
- uint（无符号整数）、uint8、uint16、uint32、uint64、uintptr
- byte // `uint8 的别名`
- rune // `int32 的别名 代表一个 Unicode 码`
- float32、float64
- complex64、complex128

> 有符号和无符号的区别：int8 范围 -128-127，uint8 范围：0-255

当一个变量被声明之后，系统自动赋予它该类型的零值：

`int 为 0`，`float 为 0.0`，`bool 为 false`，`string 为空字符串`，`指针为 nil `

**所有的内存在 Go 中都是经过初始化的。**

~~~go
package main

import "fmt"

var age int
func main() {

	fmt.Println(age);
}
~~~

#### 2.5 批量格式

> 觉得每行都用 var 声明变量比较烦琐？Go语言提供了批量声明的方式

~~~go
var (
    a int
    b string
    c []float32
)
~~~

~~~go
package main

import "fmt"


var (
	a int
	b string
	c []float32
)
func main() {
    //%d 整数占位符，%s 字符串占位符， %f 浮点数占位符(默认精度为6)
	fmt.Printf("%d,%s,%f",a,b,c)
}
~~~

### 3、变量的生命周期

> 变量的生命周期指的是在程序运行期间变量有效存在的时间间隔。

变量的生命周期与变量的作用域有不可分割的联系：

1. 全局变量：它的生命周期和整个程序的运行周期是一致的；
2. 局部变量：它的生命周期则是动态的，从创建这个变量的声明语句开始，到这个变量不再被引用为止；
3. 形式参数和函数返回值：它们都属于局部变量，在函数被调用的时候创建，函数调用结束后被销毁。

go的内存中应用了两种数据结构用于存放变量：

1. 堆（heap）：堆是用于存放进程执行中被动态分配的内存段。它的大小并不固定，可动态扩张或缩减。当进程调用 malloc 等函数分配内存时，新分配的内存就被动态加入到堆上（堆被扩张）。当利用 free 等函数释放内存时，被释放的内存从堆中被剔除（堆被缩减）；
2. 栈(stack)：栈又称堆栈， 用来存放程序暂时创建的局部变量，也就是我们函数的大括号`{ }`中定义的局部变量。

**栈是先进后出，往栈中放元素的过程，称为入栈，取元素的过程称为出栈。**

**栈可用于内存分配，栈的分配和回收速度非常快**

在程序的编译阶段，编译器会根据实际情况`自动选择`在`栈`或者`堆`上分配局部变量的存储空间，不论使用 var 还是 new 关键字声明变量都不会影响编译器的选择。

~~~go
var global *int

func f() {
    var x int
    x = 1
    global = &x
}

func g() {
    y := new(int)
    *y = 1
}
~~~

上述代码中，函数 f 里的变量 x 必须在堆上分配，因为它在函数退出后依然可以通过包一级的 global 变量找到，虽然它是在函数内部定义的。

`用Go语言的术语说，这个局部变量 x 从函数 f 中逃逸了。`

相反，当函数 g 返回时，变量 y 不再被使用，也就是说可以马上被回收的。因此，y 并没有从函数 g 中逃逸，编译器可以选择在栈上分配 *y 的存储空间，也可以选择在堆上分配，然后由Go语言的 GC（垃圾回收机制）回收这个变量的内存空间。

## 二、常量

Go语言中的常量使用关键字` const `定义，用于存储不会改变的数据，常量是在编译时被创建的，即使定义在函数内部也是如此，并且只能是`布尔型`、`数字型`（整数型、浮点型和复数）和`字符串型`。

由于编译时的限制，定义常量的表达式必须为能被编译器求值的常量表达式。

声明格式：

~~~go
const name [type] = value
~~~

例如：

~~~go
const pi = 3.14159
~~~

**type可以省略**

**和变量声明一样，可以批量声明多个常量：**

~~~go
const (
    e  = 2.7182818
    pi = 3.1415926
)
~~~

> 所有常量的运算都可以在编译期完成，这样不仅可以减少运行时的工作，也方便其他代码的编译优化，当操作数是常量时，一些运行时的错误也可以在编译时被发现，例如整数除零、字符串索引越界、任何导致无效浮点数的操作等。

常量间的所有算术运算、逻辑运算和比较运算的结果也是常量，对常量的类型转换操作或以下函数调用都是返回常量结果：len、cap、real、imag、complex 和 unsafe.Sizeof。

因为它们的值是在编译期就确定的，因此常量可以是构成类型的一部分

**如果是批量声明的常量，除了第一个外其它的常量右边的初始化表达式都可以省略，如果省略初始化表达式则表示使用前面常量的初始化表达式，对应的常量类型也是一样的。例如：**

~~~go
const (
    a = 1
    b
    c = 2
    d
)
fmt.Println(a, b, c, d) // "1 1 2 2"
~~~

### 1、iota

`iota`是`go`语言的常量计数器，只能在常量的表达式中使用。 `iota`在`const`关键字出现时将被重置为`0`。`const`中每新增一行常量声明将使`iota`计数一次(`iota`可理解为`const`语句块中的行索引)。 使用`iota`能简化定义，在定义枚举时很有用。

> 常量声明可以使用 iota 常量生成器初始化，它用于生成一组以相似规则初始化的常量，但是不用每行都写一遍初始化表达式。

**在一个 const 声明语句中，在第一个声明的常量所在的行，iota 将会被置为 0，然后在每一个有常量声明的行加1**

比如，定义星期日到星期六，从0-6

~~~go
const (
    Sunday  = iota //0
    Monday
    Tuesday
    Wednesday
    Thursday
    Friday
    Saturday  //6
)
~~~

再举个例子：

```go
const (
  n1 = iota //0
  n2        //1
  n3        //2
  n4        //3
)
```

### 2、几个常见的iota示例:

使用_跳过某些值

```go
const (
  n1 = iota //0
  n2        //1
  _
  n4        //3
)
```

`iota`声明中间插队

```go
const (
  n1 = iota //0
  n2 = 100  //100
  n3 = iota //2
  n4        //3
)
const n5 = iota //0
```

定义数量级 （这里的`<<`表示左移操作，`1<<10`表示将`1`的二进制表示向左移`10`位，也就是由`1`变成了`10000000000`，也就是十进制的`1024`。同理`2<<2`表示将`2`的二进制表示向左移`2`位，也就是由`10`变成了`1000`，也就是十进制的`8`。）

```go
const (
  _  = iota
  KB = 1 << (10 * iota)
  MB = 1 << (10 * iota)
  GB = 1 << (10 * iota)
  TB = 1 << (10 * iota)
  PB = 1 << (10 * iota)
)
```

多个`iota`定义在一行

```go
const (
  a, b = iota + 1, iota + 2 //1,2
  c, d                      //2,3
  e, f                      //3,4
)
```

## 三、基本类型

### 1、基本类型介绍

Golang 更明确的数字类型命名，支持 Unicode，支持常用数据结构。

| 类型          | 长度(字节) | 默认值 | 说明                                      |
| ------------- | ---------- | ------ | ----------------------------------------- |
| bool          | 1          | false  |                                           |
| byte          | 1          | 0      | uint8                                     |
| rune          | 4          | 0      | Unicode Code Point, int32                 |
| int, uint     | 4或8       | 0      | 32 或 64 位                               |
| int8, uint8   | 1          | 0      | -128 ~ 127, 0 ~ 255，byte是uint8 的别名   |
| int16, uint16 | 2          | 0      | -32768 ~ 32767, 0 ~ 65535                 |
| int32, uint32 | 4          | 0      | -21亿~ 21亿, 0 ~ 42亿，rune是int32 的别名 |
| int64, uint64 | 8          | 0      |                                           |
| float32       | 4          | 0.0    |                                           |
| float64       | 8          | 0.0    |                                           |
| complex64     | 8          |        |                                           |
| complex128    | 16         |        |                                           |
| uintptr       | 4或8       |        | 以存储指针的 uint32 或 uint64 整数        |
| array         |            |        | 值类型                                    |
| struct        |            |        | 值类型                                    |
| string        |            | ""     | UTF-8 字符串                              |
| slice         |            | nil    | 引用类型                                  |
| map           |            | nil    | 引用类型                                  |
| channel       |            | nil    | 引用类型                                  |
| interface     |            | nil    | 接口                                      |
| function      |            | nil    | 函数                                      |

支持八进制、 六进制，以及科学记数法。标准库 math 定义了各数字类型取值范围。

```go
a, b, c, d := 071, 0x1F, 1e9, math.MinInt16
```

空指针值 `nil`，而非`C/C++ NULL`。

#### 1.1 整型

整型分为以下两个大类： 按长度分为：`int8`、`int16`、`int32`、`int64` 对应的无符号整型：

> `uint8`、`uint16`、`uint32`、`uint64`

其中，`uint8`就是我们熟知的 `byte` 型，`int16` 对应C语言中的 `short` 型，`int64` 对应C语言中的 `long` 型。

Go语言同时提供了有符号和无符号的整数类型。

* 有符号整型：int、int8、int64、int32、int64
* 无符号整型：uint、uint8、uint64、uint32、uint64、uintptr

> 有符号整型范围：`-2^(n-1) 到 2^(n-1)-1`
>
> 无符号整型范围: ` 0 到 2^n-1`

**实际开发中由于编译器和计算机硬件的不同，int 和 uint 所能表示的整数大小会在 32bit 或 64bit 之间变化。**

> uint在硬件开发中使用

用来表示 Unicode 字符的 `rune 类型`和 `int32 类型`是等价的，通常用于表示一个 `Unicode 码点`。这两个名称可以互换使用。同样，`byte` 和 `uint8` 也是等价类型，byte 类型一般用于强调数值是一个`原始的数据`而不是一个小的整数。

> 无符号的整数类型 `uintptr`，它没有指定具体的 bit 大小但是足以容纳指针。uintptr 类型只有在`底层编程`时才需要，特别是Go语言和C语言函数库或操作系统接口相交互的地方。
>
> 在二进制传输、读写文件的结构描述时，为了保持文件的结构不会受到不同编译目标平台字节长度的影响，不要使用 int 和 uint。

|  类型  | 描述                                                         |
| :----: | :----------------------------------------------------------- |
| uint8  | 无符号 8位整型 (0 到 255)                                    |
| uint16 | 无符号 16位整型 (0 到 65535)                                 |
| uint32 | 无符号 32位整型 (0 到 4294967295)                            |
| uint64 | 无符号 64位整型 (0 到 18446744073709551615)                  |
|  int8  | 有符号 8位整型 (-128 到 127)                                 |
| int16  | 有符号 16位整型 (-32768 到 32767)                            |
| int32  | 有符号 32位整型 (-2147483648 到 2147483647)                  |
| int64  | 有符号 64位整型 (-9223372036854775808 到 9223372036854775807) |

##### 特殊整型

|  类型   | 描述                                                   |
| :-----: | :----------------------------------------------------- |
|  uint   | 32位操作系统上就是`uint32`，64位操作系统上就是`uint64` |
|   int   | 32位操作系统上就是`int32`，64位操作系统上就是`int64`   |
| uintptr | 无符号整型，用于存放一个指针                           |

> **注意：** 在使用`int`和 `uint`类型时，不能假定它是32位或64位的整型，而是考虑`int`和`uint`可能在不同平台上的差异。

> **注意事项** 获取对象的长度的内建`len()`函数返回的长度可以根据不同平台的字节长度进行变化。实际使用中，切片或 map 的元素数量等都可以用`int`来表示。在涉及到二进制传输、读写文件的结构描述时，为了保持文件的结构不会受到不同编译目标平台字节长度的影响，不要使用`int`和 `uint`。

##### 数字字面量语法（Number literals syntax）

`Go1.13` 版本之后引入了数字字面量语法，这样便于开发者以二进制、八进制或十六进制浮点数的格式定义数字，例如：

`v := 0b00101101`， 代表二进制的 `101101`，相当于十进制的 `45`。 `v := 0o377`，代表八进制的 `377`，相当于十进制的 `255`。 `v := 0x1p-2`，代表十六进制的 `1` 除以 `2²`，也就是 `0.25`。

而且还允许我们用 `_` 来分隔数字，比如说： `v := 123_456` 表示 v 的值等于 `123456`。

我们可以借助 `fmt` 函数来将一个整数以不同进制形式展示。

```go
package main
 
import "fmt"
 
func main(){
	// 十进制
	var a int = 10
	fmt.Printf("%d \n", a)  // 10
	fmt.Printf("%b \n", a)  // 1010  占位符%b表示二进制
 
	// 八进制  以0开头
	var b int = 077
	fmt.Printf("%o \n", b)  // 77
 
	// 十六进制  以0x开头
	var c int = 0xff
	fmt.Printf("%x \n", c)  // ff
	fmt.Printf("%X \n", c)  // FF
}
```

#### 1.2 浮点型

Go语言支持两种浮点型数：`float32`和`float64`。这两种浮点型数据格式遵循`IEEE 754`标准： `float32` 的浮点数的最大范围约为`3.4e38`，可以使用常量定义：`math.MaxFloat32`。 `float64` 的浮点数的最大范围约为 `1.8e308`，可以使用一个常量定义：`math.MaxFloat64`。

1. `float32` ： 范围 约1.4e-45 到 约3.4e38
2. `float64` ：范围约4.9e-324 到 约1.8e308

~~~go
floatStr1 := 3.2
//保留小数点位数
fmt.Printf("%.2f\n", floatStr1)
~~~

> 算术规范由 IEEE754 浮点数国际标准定义，该浮点数规范被所有现代的 CPU 支持

**通常应该优先使用 float64 类型，因为 float32 类型的累计计算误差很容易扩散，并且 float32 能精确表示的正整数并不是很大。**

~~~go
var f float32 = 1 << 24;
fmt.Println(f == f+1) // true
~~~

**浮点数在声明的时候可以只写整数部分或者小数部分**

~~~go
var e = .71828 // 0.71828
var f = 1.     // 1
fmt.Printf("%.5f,%.1f",e,f)
~~~

**很小或很大的数最好用科学计数法书写，通过 e 或 E 来指定指数部分**

~~~go
var avogadro = 6.02214129e23  // 阿伏伽德罗常数
var planck   = 6.62606957e-34 // 普朗克常数
fmt.Printf("%f,%.35f",avogadro,planck)
~~~

打印浮点数时，可以使用`fmt`包配合动词`%f`，代码如下：

```go
package main

import (
	"fmt"
	"math"
)

func main() {
	fmt.Printf("%f\n", math.Pi)   // 3.141593
	fmt.Printf("%.2f\n", math.Pi) // 3.14
}
```

#### 1.3 复数

`complex64` 和 `complex128`

```go
package main

import (
	"fmt"
)

func main() {
	var c1 complex64
	c1 = 1 + 2i

	var c2 complex128
	c2 = 2 + 3i

	fmt.Println(c1) // (1+2i)
	fmt.Println(c2) // (2+3i)
}
```

复数有实部和虚部，`complex64`的实部和虚部为32位，`complex128`的实部和虚部为64位。

#### 1.4 布尔值

Go语言中以`bool`类型进行声明布尔型数据，布尔型数据只有`true（真）`和`false（假）`两个值。

注意：

- 布尔类型变量的默认值为false。

- Go 语言中不允许将整型强制转换为布尔型.

- 布尔型无法参与数值运算，也无法与其他类型进行转换。

在Go语言中，以bool类型进行声明：

~~~go
var 变量名 bool
~~~

`==`,`>`,`<`，`<=`, `>=`,`&&(AND)`,`||(OR)`等都会产生bool值

~~~go
var aVar = 10
aVar == 5  // false
aVar == 10 // true
aVar != 5  // true
aVar != 10 // false
~~~

> Go语言对于值之间的比较有非常严格的限制，只有两个相同类型的值才可以进行比较，如果值的类型是接口（interface），那么它们也必须都实现了相同的接口。
>
> 如果其中一个值是`常量`，那么另外一个值可以不是常量，但是类型必须和该常量类型相同。
>
> 如果以上条件都不满足，则必须将其中一个值的类型转换为和另外一个值的类型相同之后才可以进行比较。

`&&(AND)`,`||(OR)`是具有短路行为的，如果运算符左边的值已经可以确定整个布尔表达式的值，那么运算符右边的值将不再被求值。(&&优先级高于||)

~~~go
var a = 10
	//因为a>11已经不满足了，所以a < 30不会走，整个表达式为false
	if(a > 11 && a < 30){
		fmt.Println("正确")
	}else{
		fmt.Println("错误")
	}

	//因为a > 5已经满足了，所以a < 30不会走，整个表达式为true
	if(a > 5 || a < 30){
		fmt.Println("正确")
	}else{
		fmt.Println("错误")
	}
~~~

**布尔型数据只有true和false，且不能参与任何计算以及类型转换**

#### 1.5 字符

Go语言的字符有以下两种：

- 一种是 uint8 类型，或者叫 byte 型，代表了 ASCII 码的一个字符。
- 另一种是 rune 类型，代表一个 UTF-8 字符，当需要处理中文、日文或者其他复合字符时，则需要用到 rune 类型。rune 类型等价于 int32 类型。

**byte 类型是 uint8 的别名，rune 类型是int32的别名**

**ASCII 码的一个字符占一个字节**

**ASCII** 定义 128 个字符，由码位 0 – 127 标识。它涵盖英文字母，拉丁数字和其他一些字符。

字符的定义：

~~~go
//使用单引号 表示一个字符
var ch byte = 'A'
//在 ASCII 码表中，A 的值是 65,也可以这么定义
var ch byte = 65
//65使用十六进制表示是41，所以也可以这么定义 \x 总是紧跟着长度为 2 的 16 进制数
var ch byte = '\x41'
//65的八进制表示是101，所以使用八进制定义 \后面紧跟着长度为 3 的八进制数
var ch byte = '\101'

fmt.Printf("%c",ch)
~~~

**Unicode** 是 ASCII 的超集，它定义了 1,114,112 个代码点的代码空间。 Unicode 版本 10.0 涵盖 139 个现代和历史文本集（包括符文字母，但不包括 Klingon ）以及多个符号集。

Go语言同样支持 Unicode（UTF-8）, `用rune来表示`, 在内存中使用 int 来表示。

在书写 Unicode 字符时，需要在 16 进制数之前加上前缀`\u`或者`\U`。如果需要使用到 4 字节，则使用`\u`前缀，如果需要使用到 8 个字节，则使用`\U`前缀。

~~~go
var ch rune = '\u0041'
	var ch1 int64 = '\U00000041'
	//格式化说明符%c用于表示字符，%v或%d会输出用于表示该字符的整数，%U输出格式为 U+hhhh 的字符串。
	fmt.Printf("%c,%c,%U",ch,ch1,ch)
~~~

Unicode 包中内置了一些用于测试字符的函数，这些函数的返回值都是一个布尔值，如下所示（其中 ch 代表字符）：

- 判断是否为字母：unicode.IsLetter(ch)
- 判断是否为数字：unicode.IsDigit(ch)
- 判断是否为空白符号：unicode.IsSpace(ch)

##### UTF-8 和 Unicode 有何区别？

Unicode 与 ASCII 类似，都是一种字符集。

字符集为每个字符分配一个唯一的 ID，我们使用到的所有字符在 Unicode 字符集中都有一个唯一的 ID，例如 a 在 Unicode 与 ASCII 中的编码都是 97。汉字“你”在 Unicode 中的编码为 20320，在不同国家的字符集中，字符所对应的 ID 也会不同。而无论任何情况下，Unicode 中的字符的 ID 都是不会变化的。

UTF-8 是编码规则，将 Unicode 中字符的 ID 以某种方式进行编码，UTF-8 的是一种变长编码规则，从 1 到 4 个字节不等。编码规则如下：

- 0xxxxxx 表示文字符号 0～127，兼容 ASCII 字符集。
- 从 128 到 0x10ffff 表示其他字符。


根据这个规则，拉丁文语系的字符编码一般情况下每个字符占用一个字节，而中文每个字符占用 3 个字节。

广义的 Unicode 指的是一个标准，它定义了字符集及编码规则，即 Unicode 字符集和 UTF-8、UTF-16 编码等。

#### 1.6 字符串

Go语言中的字符串以原生数据类型出现，使用字符串就像使用其他原生数据类型`（int、bool、float32、float64 等）`一样。 Go 语言里的字符串的内部实现使用`UTF-8`编码。 字符串的值为双引号`(")`中的内容，可以在Go语言的源码中直接添加非`ASCII`码字符，例如：

```go
s1 := "hello"
s2 := "你好"
```

一个字符串是一个不可改变的字节序列，字符串可以包含任意的数据，但是通常是用来包含可读的文本，字符串是 UTF-8 字符的一个序列。字符串的定义：

~~~go
var mystr string = "hello"
~~~

**go语言从底层就支持UTF-8编码。**

> UTF-8 是一种被广泛使用的编码格式，是文本文件的标准编码。
>
> 由于该编码对占用字节长度的不定性，在Go语言中字符串也可能根据需要占用 1 至 4 个字节，这与其它编程语言不同。
>
> Go语言这样做不仅减少了内存和硬盘空间占用，同时也不用像其它语言那样需要对使用 UTF-8 字符集的文本进行编码和解码。

`字符串是一种值类型，且值不可变，即创建某个文本后将无法再次修改这个文本的内容。`

`当字符为 ASCII 码表上的字符时则占用 1 个字节`

**字符串中可以使用转义字符来实现换行、缩进等效果，常用的转义字符包括回车、换行、单双引号、制表符等，如下表所示:**

| 转义         | 含义                               |
| ------------ | ---------------------------------- |
| \r           | 回车符（返回行首）                 |
| \n           | 换行符（直接跳到下一行的同列位置） |
| \t           | 制表符                             |
| \'           | 单引号                             |
| \"           | 双引号                             |
| \            | 反斜杠                             |
| `\u 或 \U：` | Unicode 字符                       |

举个例子，我们要打印一个`Windows`平台下的一个文件路径：

```go
package main

import (
    "fmt"
)

func main() {
    fmt.Println("str := \"c:\\pprof\\main.exe\"")
}
```

~~~go
var str = "码神之路\nGo大法好"
fmt.Print(str)
~~~

> 如果使用``反引号，会被原样进行赋值和输出

~~~go
 fmt.Println(`\t 码神之路Go大法好`)  // \t 码神之路Go大法好
 fmt.Println(`\t 码神之路
 Go大法好`) //使用反引号 可以进行字符串换行
//反引号一般用在 需要将内容进行原样输出的时候 使用
~~~

**字符串是字节的定长数组，byte 和 rune 都是字符类型，若多个字符放在一起，就组成了字符串**

比如 `hello` ，对照 ascii 编码表，每个字母对应的编号是：104,101,108,108,111

~~~go
import (
    "fmt"
)

func main() {
    var mystr01 string = "hello"
    var mystr02 [5]byte = [5]byte{104, 101, 108, 108, 111}
    fmt.Printf("myStr01: %s\n", mystr01)
    fmt.Printf("myStr02: %s", mystr02)
}
~~~

思考：hello，码神之路 占用几个字节

~~~go
package main

import (
	"fmt"
)

func main() {
   //中文三字节，字母一个字节
var myStr01 string = "hello,码神之路"
fmt.Printf("mystr01: %d\n", len(myStr01))
}
~~~

#### 1.7 字符串的应用

一般的比较运算符（==、!=、<、<=、>=、>）是通过在内存中按字节比较来实现字符串比较的，因此比较的结果是字符串自然编码的顺序。

字符串所占的字节长度可以通过函数 len() 来获取，例如 len(str)。

字符串的内容（纯字节）可以通过标准索引法来获取，在方括号`[ ]`内写入索引，索引从 0 开始计数：

- 字符串 str 的第 1 个字节：str[0]
- 第 i 个字节：str[i - 1]
- 最后 1 个字节：str[len(str)-1]


需要注意的是，这种转换方案只对纯 ASCII 码的字符串有效。

> 注意：获取字符串中某个字节的地址属于非法行为，例如 &str[i]。

ASCII字符使用`len()`函数

Unicode字符串长度使用`utf8.RuneCountInString()`函数

~~~go
  //如何计算字符串的长度
    str3 := "hello"
    str4 := "你好"
    fmt.Println(len(str3))  // 1个字母占1个字节
    fmt.Println(len(str4))  // 1个中文占3个字节，go从底层支持utf8
    fmt.Println(utf8.RuneCountInString(str4)) // 2
~~~

**字符串拼接符“+”**

两个字符串 s1 和 s2 可以通过 s := s1 + s2 拼接在一起。将 s2 追加到 s1 尾部并生成一个新的字符串 s。

~~~go
//因为编译器会在行尾自动补全分号，所以拼接字符串用的加号“+”必须放在第一行末尾。
	str := "第一部分 " +
		"第二部分"
~~~

也可以使用“+=”来对字符串进行拼接：

~~~go
s := "hel" + "lo,"
s += "world!"
fmt.Println(s) //输出 “hello, world!”
~~~

除了使用`+`进行拼接，我们也可以使用`WriteString()`

~~~go
	str1 := "你好,"
	str2 := "码神之路"
	var stringBuilder bytes.Buffer
	//节省内存分配，提高处理效率
	stringBuilder.WriteString(str1)
	stringBuilder.WriteString(str2)
	fmt.Println(stringBuilder.String())
~~~



**如果从字符串 `hello 码神之路` 中获取 `码` 该如何获取呢？**

直接索引对rune类型无效，可以使用string方法转换

~~~go
string([]rune(str6)[0])
~~~

~~~go
var myStr01 string = "hello,码神之路"
fmt.Println(string([]rune(myStr01)[6]))
~~~

**遍历**

unicode字符集使用`for range`进行遍历，ascii字符集可以使用`for range`或者`for`循环遍历

~~~go
	var str1 string = "hello"
	var str2 string = "hello,码神之路"
	// 遍历
	for i :=0; i< len(str1); i++{
		fmt.Printf("ascii: %c %d\n", str1[i], str1[i])
	}
	for _, s := range  str1{
		fmt.Printf("unicode: %c %d\n ", s, s)
	}
	// 中文只能用 for range
	for _, s := range  str2{
		fmt.Printf("unicode: %c %d\n ", s, s)
	}
~~~

**字符串的格式化**

* `print ：` 结果写到标准输出
* `Sprint：`结果会以字符串形式返回

~~~go
	str1 := "你好,"
	str2 := "码神之路"
	var stringBuilder bytes.Buffer
	stringBuilder.WriteString(str1)
	stringBuilder.WriteString(str2)
// Sprint 以字符串形式返回
result := fmt.Sprintf(stringBuilder.String())
fmt.Println(result)
~~~

```go
%c  单一字符
%T  动态类型
%v  本来值的输出
%+v 字段名+值打印
%d  十进制打印数字
%p  指针，十六进制
%f  浮点数
%b 二进制
%s string
```

**字符串查找**

如何获取字符串中的某一段字符?

* strings.Index()： 正向搜索子字符串
* strings.LastIndex()：反向搜索子字符串

~~~go
package main

import (
	"fmt"
	"strings"
)

func main() {
	// 查找
	tracer := "码神来了,码神bye bye"

	// 正向搜索字符串
	comma := strings.Index(tracer, ",")
	fmt.Println(",所在的位置:",comma)
	fmt.Println(tracer[comma+1:])  // 码神bye bye

	add := strings.Index(tracer, "+")
	fmt.Println("+所在的位置:",add)  // +所在的位置: -1

	pos := strings.Index(tracer[comma:], "码神")
	fmt.Println("码神，所在的位置", pos) // 码神，所在的位置 1

	fmt.Println(comma, pos, tracer[5+pos:])  // 12 1 码神bye bye
}

~~~

#### 1.8 多行字符串

Go语言中要定义一个多行字符串时，就必须使用`反引号`字符：

```go
s1 := `第一行
    第二行
    第三行
    `
fmt.Println(s1)
```

反引号间换行将被作为字符串中的换行，但是所有的转义字符均无效，文本将会原样输出。

#### 1.9 字符串的常用操作

| 方法                                          | 介绍           |
| --------------------------------------------- | -------------- |
| `len(str)`                                    | 求长度         |
| `+`或`fmt.Sprintf`                            | 拼接字符串     |
| `strings.Split`                               | 分割           |
| `strings.Contains`                            | 判断是否包含   |
| `strings.HasPrefix` <br />`strings.HasSuffix` | 前缀/后缀判断  |
| `strings.Index()`<br />`strings.LastIndex()`  | 子串出现的位置 |
| `strings.Join(a[]string, sep string)`         | join操作       |

```go
package main

import (
	"fmt"
	"strings"
)

func main() {
	// 1，求字符串长度
	s1 := "hello"
	fmt.Println(len(s1)) // 5
	s2 := "hello热巴"
	fmt.Println(len(s2)) // 11

	// 2，拼接字符串
	fmt.Println(s1 + s2) // hellohello热巴
	s3 := fmt.Sprintf("%s - %s", s1, s2)
	fmt.Println("s3", s3) // s3 hello - hello热巴

	// 3，字符串分割
	s4 := "How are you?"
	fmt.Println(strings.Split(s4, " "))        // [How are you?]
	fmt.Printf("%T\n", strings.Split(s4, " ")) // []string  表示字符串切片

	// 4，判断是否包含子字符串
	fmt.Println(strings.Contains(s4, "are")) // true

	// 5，判断前缀、后缀
	fmt.Println(strings.HasPrefix(s4, "How")) // true
	fmt.Println(strings.HasSuffix(s4, "?"))   // true

	// 6，判断子串的未知
	fmt.Println(strings.Index(s4, "are"))     // 4
	fmt.Println(strings.LastIndex(s4, "you")) // 8

	// 7，字符串连接
	s5 := []string{"how", "do", "you", "do"}
	fmt.Println(strings.Join(s5, "-")) // how-do-you-do
}
```

#### 1.10 `byte`和`rune`类型

组成每个字符串的元素叫做“字符”，可以通过遍历或者单个获取字符串元素获得字符。 字符用单引号（’）包裹起来，如：

```go
var a := '中'
var b := 'x'
```

Go 语言的字符有以下两种：

1. `uint8` 类型，或者叫 `byte` 型，代表了`ASCII`  码的一个字符。
2. `rune` 类型，代表一个 `UTF-8` 字符。



当需要处理中文、日文或者其他复合字符时，则需要用到`rune`类型。`rune`类型实际是一个`int32`。 Go 使用了特殊的 `rune` 类型来处理 `Unicode`，让基于 `Unicode`的文本处理更为方便，也可以使用 `byte` 型进行默认字符串处理，性能和扩展性都有照顾

```go
// 遍历字符串
func traversalString() {
  s := "pprof.cn博客"
  
  for i := 0; i < len(s); i++ { //byte
    fmt.Printf("%v(%c) ", s[i], s[i])
  }
  fmt.Println()
  
  for _, r := range s { //rune
    fmt.Printf("%v(%c) ", r, r)
  }
  fmt.Println()
}
```

输出：

```go
112(p) 112(p) 114(r) 111(o) 102(f) 46(.) 99(c) 110(n) 229(å) 141() 154() 229(å) 174(®) 162(¢)
112(p) 112(p) 114(r) 111(o) 102(f) 46(.) 99(c) 110(n) 21338(博) 23458(客)
```

因为UTF8编码下一个中文汉字由`3~4`个字节组成，所以我们不能简单的按照字节去遍历一个包含中文的字符串，否则就会出现上面输出中第一行的结果。

字符串底层是一个byte数组，所以可以和[]byte类型相互转换。字符串是不能修改的 字符串是由byte字节组成，所以字符串的长度是byte字节的长度。 rune类型用来表示utf8字符，一个rune字符由一个或多个byte组成。

#### 1.11 修改字符串

Golang语言的字符串是`不可变的`

修改字符串时，可以将字符串`转换为[]byte`进行修改

**[]byte和string可以通过强制类型转换**

> 案例：将8080改为8081

~~~go
package main

import "fmt"

func main() {

	s1 := "localhost:8080"
	fmt.Println(s1)
	// 强制类型转换 string to byte
	strByte := []byte(s1)

	// 下标修改
	strByte[len(s1)-1] = '1'
	fmt.Println(strByte)

	// 强制类型转换 []byte to string
	s2 := string(strByte)
	fmt.Println(s2)
}

~~~

要修改字符串，需要先将其转换成`[]rune或[]byte`，完成后再转换为`string`。无论哪种转换，都会重新分配内存，并复制字节数组。

```go
package main

import (
	"fmt"
)

func main() {
	s1 := "hello"
	// 强制类型转换
	byteS1 := []byte(s1)
	byteS1[0] = 'H'
	fmt.Println(string(byteS1)) // Hello

	s2 := "博客"
	runeS2 := []rune(s2)
	runeS2[0] = '狗'
	fmt.Println(string(runeS2)) // 狗客
}
```

#### 1.12 类型转换

Go语言中只有强制类型转换，没有隐式类型转换。该语法只能在两个类型之间支持相互转换的时候使用。

强制类型转换的基本语法如下：

```go
T(表达式)
```

其中，T表示要转换的类型。表达式包括变量、复杂算子和函数返回值等.

比如计算直角三角形的斜边长时使用math包的Sqrt()函数，该函数接收的是float64类型的参数，而变量a和b都是int类型的，这个时候就需要将a和b强制类型转换为float64类型。

```go
func sqrtDemo() {
  var a, b = 3, 4
  var c int
  // math.Sqrt()接收的参数是float64类型，需要强制转换
  c = int(math.Sqrt(float64(a*a + b*b)))
  fmt.Println(c)
}
```

在必要以及可行的情况下，一个类型的值可以被转换成另一种类型的值。由于Go语言不存在隐式类型转换，因此所有的类型转换都必须显式的声明：

~~~go
//类型 B 的值 = 类型 B(类型 A 的值)
valueOfTypeB = type B(valueOfTypeA)
~~~

示例：

~~~go
a := 5.0
b := int(a)
~~~

类型转换只能在定义正确的情况下转换成功，例如从一个取值范围较小的类型转换到一个取值范围较大的类型（将 int16 转换为 int32）。

当从一个取值范围较大的类型转换到取值范围较小的类型时（将 int32 转换为 int16 或将 float32 转换为 int），会发生`精度丢失`的情况。

只有相同底层类型的变量之间可以进行相互转换（如将 int16 类型转换成 int32 类型），不同底层类型的变量相互转换时会引发编译错误（如将 bool 类型转换为 int 类型）：

~~~go
package main
import (
        "fmt"
        "math"
)
func main() {
        // 输出各数值范围
        fmt.Println("int8 range:", math.MinInt8, math.MaxInt8)
        fmt.Println("int16 range:", math.MinInt16, math.MaxInt16)
        fmt.Println("int32 range:", math.MinInt32, math.MaxInt32)
        fmt.Println("int64 range:", math.MinInt64, math.MaxInt64)
        // 初始化一个32位整型值
        var a int32 = 1047483647
        // 输出变量的十六进制形式和十进制值
        fmt.Printf("int32: 0x%x %d\n", a, a)
        // 将a变量数值转换为十六进制, 发生数值截断
        b := int16(a)
        // 输出变量的十六进制形式和十进制值
        fmt.Printf("int16: 0x%x %d\n", b, b)
        // 将常量保存为float32类型
        var c float32 = math.Pi
        // 转换为int类型, 浮点发生精度丢失
        fmt.Println(int(c))
}
~~~

~~~go
//结果
int8 range: -128 127
int16 range: -32768 32767
int32 range: -2147483648 2147483647
int64 range: -9223372036854775808 9223372036854775807
int32: 0x3e6f54ff 1047483647
int16: 0x54ff 21759
3
~~~

根据输出结果，16 位有符号整型的范围是 -32768～32767，而变量 a 的值 1047483647 不在这个范围内。1047483647 对应的十六进制为 0x3e6f54ff，转为 int16 类型后，长度缩短一半，也就是在十六进制上砍掉一半，变成 0x54ff，对应的十进制值为 21759。

浮点数在转换为整型时，会将小数部分去掉，只保留整数部分。

#### 1.13 字符串与其他数据类型的转换

1. 整数与字符串

   ~~~go
   // 字符串与其他类型的转换
   // str 转 int
   newStr1 := "1"
   intValue, _ := strconv.Atoi(newStr1)
   fmt.Printf("%T,%d\n", intValue, intValue)  // int,1
   
   // int 转 str
   intValue2 := 1
   strValue := strconv.Itoa(intValue2)
   fmt.Printf("%T, %s\n", strValue, strValue)
   ~~~

2. 浮点数与字符串

   ~~~java
       // str 转  float
       string3 := "3.1415926"
       f,_ := strconv.ParseFloat(string3, 32)
       fmt.Printf("%T, %f\n", f, f)  // float64, 3.141593
       //float 转 string
   	floatValue := 3.1415926
   	//4个参数，1：要转换的浮点数 2. 格式标记（b、e、E、f、g、G）
   	//3. 精度 4. 指定浮点类型（32:float32、64:float64）
   	// 格式标记：
   	// ‘b’ (-ddddp±ddd，二进制指数)
   	// ‘e’ (-d.dddde±dd，十进制指数)
   	// ‘E’ (-d.ddddE±dd，十进制指数)
   	// ‘f’ (-ddd.dddd，没有指数)
   	// ‘g’ (‘e’:大指数，‘f’:其它情况)
   	// ‘G’ (‘E’:大指数，‘f’:其它情况)
   	//
   	// 如果格式标记为 ‘e’，‘E’和’f’，则 prec 表示小数点后的数字位数
   	// 如果格式标记为 ‘g’，‘G’，则 prec 表示总的数字位数（整数部分+小数部分）
   	formatFloat := strconv.FormatFloat(floatValue, 'f', 2, 64)
   	fmt.Printf("%T,%s",formatFloat,formatFloat)
   ~~~

#### 1.14 小练习

> 字符串替换, 比如将 "Hello, 码神之路Java教程" 替换为  "Hello, 码神之路Go教程"

思路：

1. 找到Java所在的位置
2. 根据Java的长度将其分为两部分
3. 加上Go总共三部分，进行拼接

~~~go
package main

import (
	"bytes"
	"fmt"
	"strings"
)

func main() {
	str1 := "Hello, 码神之路Java教程"
	source := "Java"
	target := "Go"
	index := strings.Index(str1, source)
	sourceLength := len(source)
	start := str1[:index]
	end := str1[index+sourceLength:]

	var stringBuilder bytes.Buffer
	stringBuilder.WriteString(start)
	stringBuilder.WriteString(target)
	stringBuilder.WriteString(end)
	fmt.Println(stringBuilder.String())
}
~~~

## 四、运算符

运算符用于在程序运行时执行数学或逻辑运算。Go 语言内置的运算符有：

1. 算术运算符
2. 关系运算符
3. 逻辑运算符
4. 位运算符
5. 赋值运算符

### 1、算术运算符

| 运算符 | 描述 |
| :----: | :--: |
|   +    | 相加 |
|   -    | 相减 |
|   *    | 相乘 |
|   /    | 相除 |
|   %    | 求余 |

**注意：** `++`（自增）和`--`（自减）在Go语言中是单独的语句，并不是运算符。

### 2、关系运算符

| 运算符 | 描述                                                         |
| :----: | :----------------------------------------------------------- |
|   ==   | 检查两个值是否相等，如果相等返回 True 否则返回 False。       |
|   !=   | 检查两个值是否不相等，如果不相等返回 True 否则返回 False。   |
|   >    | 检查左边值是否大于右边值，如果是返回 True 否则返回 False。   |
|   >=   | 检查左边值是否大于等于右边值，如果是返回 True 否则返回 False。 |
|   <    | 检查左边值是否小于右边值，如果是返回 True 否则返回 False。   |
|   <=   | 检查左边值是否小于等于右边值，如果是返回 True 否则返回 False。 |

### 3、逻辑运算符

| 运算符 | 描述                                                         |
| :----: | :----------------------------------------------------------- |
|   &&   | 逻辑 AND 运算符。 如果两边的操作数都是 True，则为 True，否则为 False。 |
|  \|\|  | 逻辑 OR 运算符。 如果两边的操作数有一个 True，则为 True，否则为 False。 |
|   !    | 逻辑 NOT 运算符。 如果条件为 True，则为 False，否则为 True。 |

### 4、位运算符

位运算符对整数在内存中的二进制位进行操作。

| 运算符 | 描述                                                         |
| :----: | :----------------------------------------------------------- |
|   &    | 参与运算的两数各对应的二进位相与。 （两位均为1才为1）        |
|   \|   | 参与运算的两数各对应的二进位相或。 （两位有一个为1就为1）    |
|   ^    | 参与运算的两数各对应的二进位相异或，当两对应的二进位相异时，结果为1。 （两位不一样则为1） |
|   <<   | 左移n位就是乘以2的n次方。 “a<<b”是把a的各二进位全部左移b位，高位丢弃，低位补0。 |
|   >>   | 右移n位就是除以2的n次方。 “a>>b”是把a的各二进位全部右移b位。 |

### 5、赋值运算符

| 运算符 | 描述                                           |
| :----: | :--------------------------------------------- |
|   =    | 简单的赋值运算符，将一个表达式的值赋给一个左值 |
|   +=   | 相加后再赋值                                   |
|   -=   | 相减后再赋值                                   |
|   *=   | 相乘后再赋值                                   |
|   /=   | 相除后再赋值                                   |
|   %=   | 求余后再赋值                                   |
|  <<=   | 左移后赋值                                     |
|  >>=   | 右移后赋值                                     |
|   &=   | 按位与后赋值                                   |
|  \|=   | 按位或后赋值                                   |
|   ^=   | 按位异或后赋值                                 |

## 五、内置类型和函数

### 1、内置类型

#### 1.1 值类型

```go
bool
int(32 or 64), int8, int16, int32, int64
uint(32 or 64), uint8(byte), uint16, uint32, uint64
float32, float64
string
complex64, complex128
array // 固定长度的数组
```

#### 1.2 引用类型(指针类型)

```go
slice   // 序列数组(最常用)
map     // 映射
chan    // 管道
```

### 2、内置函数

Go 语言拥有一些不需要进行导入操作就可以使用的内置函数。它们有时可以针对不同的类型进行操作，例如：len、cap 和 append，或必须用于系统级的操作，例如：panic。因此，它们需要直接获得编译器的支持。

```go
append           // 用来追加元素到数组、slice中,返回修改后的数组、slice
close            // 主要用来关闭channel
delete           // 从map中删除key对应的value
panic            // 停止常规的goroutine  （panic和recover：用来做错误处理）
recover          // 允许程序定义goroutine的panic动作
real             // 返回complex的实部   （complex、real imag：用于创建和操作复数）
imag             // 返回complex的虚部
make             // 用来分配内存，返回Type本身(只能应用于slice, map, channel)
new              // 用来分配内存，主要用来分配值类型，比如int、struct。返回指向Type的指针
cap              // capacity是容量的意思，用于返回某个类型的最大容量（只能用于切片和 map）
copy             // 用于复制和连接slice，返回复制的数目
len              // 来求长度，比如string、array、slice、map、channel ，返回长度
print、println   // 底层打印函数，在部署环境中建议使用 fmt 包
```

### 3、内置接口error

```go
// 只要实现了Error()函数，返回值为String的都实现了err接口
type error interface { 
  Error()    String
}
```

## 六、init函数和main函数

初始化函数，是编程语言、编程框架为程序运行过程中的函数调用提供数据初始设置的手段。比如在大家熟悉的 java、python 中，我们可以为类实例成对象时，在构造函数或者初始化函数中对对象的初始值进行设置。在非面向对象的编程中，我们通过按照某种约定或者人为的，在一个重任务启动之前，调用一个数据设置方法用来对环境数据进行初始化。

golang 不是面向对象的语言，没有构造函数，但同样提供了可以用来实现数据初始化的机制，这是语言级别的原生支持。

### 1、init函数

Go语言中，init函数用于包（package）的初始化，该函数是Go语言的一个重要特性，有如下的特征：

1. init函数是用于程序执行前做包的初始化的函数，比如初始化包里的变量等
2. 每个包可以拥有多个init函数
3. 包的每个源文件也可以拥有多个init函数
4. 同一个包中多个init函数的执行顺序，go语言没有明确的定义（说明）
5. 不同包的init函数按照包导入的依赖关系决定该初始化函数的执行顺序
6. init函数不能被其他函数调用，而是main函数执行之前，自动被调用

#### 1.1 在 init 函数中初始化

golang 为我们提供了 `init()` 函数，这个函数是隐式调用的，即会在包引入就执行。

```go
// helloinit.go
package main

import (
  "fmt"
)

var initA string
var initB = "我是 initB"
var initC string

func init() {
  initC = "设置为 hello"
}

func main() {
  fmt.Println("youwu.today say hi...😀")

  fmt.Println("* 变量 initA: ", initA)
  fmt.Println("* 变量 initB: ", initB)
  fmt.Println("* 变量 initC: ", initC)
}
```

输出：

```go
* 变量 initA:
* 变量 initB:  我是 initB
* 变量 initC:  设置为 hello
```

在 `main()` 函数中并没有直接调用`init()`，go在编译的时候，已经确保 `init` 会在 `main`执行之前就被调用，这种方式就是隐式。

#### 1.2 在包中的init函数

上节演示变量在被声明时、`init` 函数中进行初始化的手段，那么问题来了。如果你的代码比较长，又使用包的方式组织，为了更清楚的表达，你想在包中每个 go 代码中都来一个 `init` 函数，不知道是否可行？因为我们知道，在一个 go 的包(package)中，全局变量与函数一样，不管在哪个 go 代码文件中声明，名称是全包内唯一，不能重复的。

例如，像以下的样子，该怎么办？`init`函数应该怎么样组织，又可以有哪些作为？

```
┌──────────────────────────────────────────┐
│Package initdemo                          │
│                                          │
│     ┌──────────────────────────────────┐ │
│     │   initdemo1.go  init()?          │ │
│     └──────────────────────────────────┘ │
│     ┌──────────────────────────────────┐ │
│     │   initdemo2.go  init()?          │ │
│     └──────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

`init` 是 go 中的特殊函数，接受特别的对待。它是 go 中唯一可以在一个包内的不同代码文件中多次定义的函数名称。

> 即使可以这么做，事实上可能不建议，因为这会让初始化代码看起来很混乱，对维护不友好。你应该根据实际需要来设计代码的组织方式。不过下面我们还是来看看被引用包中的 `init` 函数。

我们来改进下例子，创建一个名为 `demo` 的 `package`，并新建两个 go 文件，*initdemoA.go* 和 *initdemo2.go*（它们都包含了 init 函数，内容如下），并在 *helloinit.go* 中引用，看看它们的初始化函数执行顺序：

```go
// initdemoA.go
package demo

import "fmt"

func init() {
    fmt.Println("initdemo1.go 的 init 函数给你打招呼了")
    VarInDemo_Initdemo1 = "VarInDemo_Initdemo1"
}

var VarInDemo_Initdemo1 string
```

```go
// initdemo2.go
package demo

import "fmt"

func init() {
  fmt.Println("initdemo2.go 的 init 函数给你打招呼了")
  VarInDemo_Initdemo2 = "VarInDemo_Initdemo2"
}

var VarInDemo_Initdemo2 string
```

```go
// helloinit.go
package main

import (
  "fmt"
  "initdemo/demo"
)

var initA string
var initB = "我是 initB"
var initC string

func init() {
  fmt.Println("main 初始化")
  initC = "设置为 hello"
}

func main() {
  fmt.Println("youwu.today say hi...😀")
  fmt.Println("* 变量 initA: ", initA)
  fmt.Println("* 变量 initB: ", initB)
  fmt.Println("* 变量 initC: ", initC)

  fmt.Println(demo.VarInDemo_Initdemo1)
}
```

输出：

```go
* 变量 initA:
* 变量 initB:  我是 initB
* 变量 initC:  设置为 hello
VarInDemo_Initdemo1
```

在 *helloinit.go* 中引入 `initdemo/demo`，在 `main` 函数执行之前，先是执行被引入包的 `init` 函数，再执行当前 `main` 包的 `init` 函数。 上面还体现了一个细节，就是包 `demo` 中的多个 `init` 函数的执行顺序，是按所在 go 代码文件名称的排序来确定执行顺序的。

```
┌────────────────────────────────┐    ┌───────────────────────────────┐
│package main                    │    │package demo                   │
│                                │    │   ┌───────────────────────┐   │
│  ┌──────────────────────────┐  │    │   │                       │   │
│  │  import "initdemo/demo"  │◀─┼────│   │init() in initdemoA.go │   │
│  └──────────────────────────┘  │    │   │ [2]                   │   │
│                                │    │   └───────────────────────┘   │
│  ┌──────────────────────────┐  │    │   ┌───────────────────────┐   │
│  │ init() in helloinit.go   │  │    │   │                       │   │
│  │  [3]                     │  │    │   │init() in initdemo2.go │   │
│  │ main() in helloinit.go   │  │    │   │ [1]                   │   │
│  └──────────────────────────┘  │    │   └───────────────────────┘   │
└────────────────────────────────┘    └───────────────────────────────┘ 
```

> 再次强调，如果包中有多个需要初始化的地方，把 `init()` 函数定义在每一个 go 代码文件中可能不是你想要的代码组织方式，尽可能将多个 `init` 函数的逻辑放到一个文件单独管理起来可能是更好的选择，比如你还可以将该文件命名为 *init.go*，看到文件名会能猜到它的用途。

### 2、main函数

main函数是Go语言程序的默认入口函数（主函数）

```go
func main(){
  // 函数体
}
```

### 3、init和main函数的异同

- 相同点
  - 两个函数在定义时不能有任何的参数和返回值，且Go程序自动调用
- 不同点
  - init函数可以应用于任意包中，且可以重复定义多个
  - main函数只能用于main包中，且只能定义一个

两个函数的执行顺序：

- 对于同一个go文件，init函数调用顺序是从上至下的
- 对于同一个package中不同文件是按文件名字符串比较“从小到大”顺序调用各文件中的init函数
- 对于不同的package
  - 如果不相互依赖的话，按照main包中“先import的后调用”的顺序调用包中的init函数
  - 如果存在依赖，则先调用最早被依赖的package中的init函数，最后调用main函数

> 如果init函数使用了println()或者print()，你会发现在执行过程中，这两个不会按照你想象的顺序执行，这两个函数官方只推荐在测试环境中使用，正式环境不要使用。



## 参考：

- [变量和常量](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/%E5%8F%98%E9%87%8F%E5%92%8C%E5%B8%B8%E9%87%8F.html)
- [Golang内置类型和函数](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/Golang%E5%86%85%E7%BD%AE%E7%B1%BB%E5%9E%8B%E5%92%8C%E5%87%BD%E6%95%B0.html)
- [init函数和main函数](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/Init%E5%87%BD%E6%95%B0%E5%92%8Cmain%E5%87%BD%E6%95%B0.html)
- [基本类型](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/%E5%9F%BA%E6%9C%AC%E7%B1%BB%E5%9E%8B.html)
- [Go语言的初始化函数init](https://youwu.today/skill/backend/init-function-in-golang/)
- [Go语言基础之变量和常量](https://www.liwenzhou.com/posts/Go/01_var_and_const/)
- [Go语言基础之数据类型](https://www.liwenzhou.com/posts/Go/02_datatype/)
- [Go语言基础之运算符](https://www.liwenzhou.com/posts/Go/03_operators/)