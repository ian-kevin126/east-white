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



注意事项：

1. 函数外的每个语句都必须以关键字开始（var、const、func等）

2. := 不能使用在函数外。

3. _ 多用于占位，表示忽略值。

## 二、常量

相对于变量，常量是恒定不变的值，多用于定义程序运行期间不会改变的那些值。 常量的声明和变量声明非常类似，只是把`var`换成了`const`，常量在定义的时候必须赋值。

```go
const pi = 3.1415
const e = 2.7182
```

声明了`pi`和`e`这两个常量之后，在整个程序运行期间它们的值都不能再发生变化了。

多个常量也可以一起声明：

```go
const (
  pi = 3.1415
  e = 2.7182
)
```

`const`同时声明多个常量时，如果省略了值则表示和上面一行的值相同。 例如：

```go
const (
  n1 = 100
  n2
  n3
)
```

上面示例中，常量`n1、n2、n3`的值都是`100`。

### 1、iota

`iota`是`go`语言的常量计数器，只能在常量的表达式中使用。 `iota`在`const`关键字出现时将被重置为`0`。`const`中每新增一行常量声明将使`iota`计数一次(`iota`可理解为`const`语句块中的行索引)。 使用`iota`能简化定义，在定义枚举时很有用。

举个例子：

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

整型分为以下两个大类： 按长度分为：`int8`、`int16`、`int32`、`int64` 对应的无符号整型：`uint8`、`uint16`、`uint32`、`uint64`。

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

#### 1.5 字符串

Go语言中的字符串以原生数据类型出现，使用字符串就像使用其他原生数据类型`（int、bool、float32、float64 等）`一样。 Go 语言里的字符串的内部实现使用`UTF-8`编码。 字符串的值为双引号`(")`中的内容，可以在Go语言的源码中直接添加非`ASCII`码字符，例如：

```go
s1 := "hello"
s2 := "你好"
```

#### 1.6 字符串转义符

Go 语言的字符串常见转义符包含回车、换行、单双引号、制表符等，如下表所示。

| 转义 | 含义                               |
| ---- | ---------------------------------- |
| \r   | 回车符（返回行首）                 |
| \n   | 换行符（直接跳到下一行的同列位置） |
| \t   | 制表符                             |
| \'   | 单引号                             |
| \"   | 双引号                             |
| \    | 反斜杠                             |

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

#### 1.7 多行字符串

Go语言中要定义一个多行字符串时，就必须使用`反引号`字符：

```go
s1 := `第一行
    第二行
    第三行
    `
fmt.Println(s1)
```

反引号间换行将被作为字符串中的换行，但是所有的转义字符均无效，文本将会原样输出。

#### 1.8 字符串的常用操作

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

#### 1.9 `byte`和`rune`类型

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

#### 1.10 修改字符串

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

#### 1.11 类型转换

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