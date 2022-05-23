---
title: 指针
author: ian_kevin
date: 2022-04-19
---

# 指针

区别于 C/C++中的指针，Go 语言中的指针不能进行偏移和运算，是安全指针。

要搞明白 Go 语言中的指针需要先知道 3 个概念：指针地址、指针类型和指针取值。

## 一、Go 语言中的指针

指针（pointer）在Go语言中可以被拆分为两个核心概念：

- 类型指针，允许对这个指针类型的数据进行修改，传递数据可以直接使用指针，而无须拷贝数据，类型指针不能进行偏移和运算。
- 切片，由指向起始元素的原始指针、元素数量和容量组成。

受益于这样的约束和拆分，Go语言的指针类型变量即拥有指针高效访问的特点，又不会发生指针偏移，从而避免了非法修改关键性数据的问题。

同时，`垃圾回收`也比较容易对不会发生偏移的指针进行检索和回收。

切片比原始指针具备更强大的特性，而且更为安全。

切片在发生越界时，运行时会报出宕机，并打出堆栈，而原始指针只会崩溃。

### 1、如何理解指针

> var a int = 10

如果用大白话来解释上述语句：

**在内存中开辟了一片空间，空间内存放着数值10，这片空间在整个内存当中，有一个唯一的地址，用来进行标识，指向这个地址的变量就称为指针**

如果用类比的说明：

内存比作酒店，每个房间就是一块内存，上述代码表示为：定了一间房间a，让10住进了房间，房间有一个门牌号px，这个px就是房间的地址，房卡可以理解为就是指针，指向这个地址。



> 一个指针变量可以指向任何一个值的内存地址，它所指向的值的内存地址在 32 和 64 位机器上分别占用 4 或 8 个字节，占用字节的大小与所指向的值的大小无关。

当一个指针被定义后`没有分配到任何变量`时，它的默认值为 `nil`。

每个变量在运行时都拥有一个地址，这个地址代表变量在内存中的位置。

Go语言中使用在变量名前面添加`&`操作符（前缀）来获取变量的内存地址（取地址操作），格式如下：

~~~go
//其中 v 代表被取地址的变量，变量 v 的地址使用变量 ptr 进行接收，ptr 的类型为*T，称做 T 的指针类型，*代表指针。
ptr := &v    // v 的类型为 T
~~~

~~~go
package main
import (
    "fmt"
)
func main() {
    var cat int = 1
    var str string = "码神之路"
    fmt.Printf("%p %p", &cat, &str)
}
~~~

**变量、指针和地址三者的关系是，每个变量都拥有地址，指针的值就是地址**

> 当使用`&`操作符对普通变量进行取地址操作并得到变量的指针后，可以对指针使用`*`操作符，也就是指针取值

~~~go
// 指针与变量
	var room int = 10  // room房间 里面放的 变量10
	var ptr = &room  // 门牌号px  指针  0xc00000a0a8

	fmt.Printf("%p\n", &room)  // 变量的内存地址 0xc00000a0a8

	fmt.Printf("%T, %p\n", ptr, ptr)  // *int, 0xc00000a0a8

	fmt.Println("指针地址",ptr)   // 0xc00000a0a8
	fmt.Println("指针地址代表的值", *ptr)  // 10
~~~

取地址操作符`&`和取值操作符`*`是一对互补操作符，`&`取出地址，`*`根据地址取出地址指向的值

变量、指针地址、指针变量、取地址、取值的相互关系和特性如下：

- 对变量进行取地址操作使用`&`操作符，可以获得这个变量的指针变量。
- 指针变量的值是指针地址。
- 对指针变量进行取值操作使用`*`操作符，可以获得指针变量指向的原变量的值。

任何程序数据载入内存后，在内存都有他们的地址，这就是指针。而为了保存一个数据在内存中的地址，我们就需要指针变量。

> 比如，“永远不要高估自己”这句话是我的座右铭，我想把它写入程序中，程序一启动这句话是要加载到内存（假设内存地址0x123456），我在程序中把这段话赋值给变量`A`，把内存地址赋值给变量`B`。这时候变量`B`就是一个指针变量。通过变量`A`和变量`B`都能找到我的座右铭。

Go 语言中的函数传参都是值拷贝，当我们想要修改某个变量的时候，我们可以创建一个指向该变量地址的指针变量。传递数据使用指针，而无须拷贝数据。类型指针不能进行偏移和运算。

Go 语言中的指针操作非常简单，只需要记住两个符号：`&`（取地址）和`*`（根据地址取值）。

### 2、指针地址和指针类型

每个变量在运行时都拥有一个地址，这个地址代表变量在内存中的位置。Go 语言中使用&字符放在变量前面对变量进行“取地址”操作。 Go 语言中的值类型`（int、float、bool、string、array、struct）`都有对应的指针类型，如：`*int、*int64、*string`等。

取变量指针的语法如下：

```go
ptr := &v    // v的类型为T
```

其中：

> v：代表被取地址的变量，类型为 T
>
> ptr：用于接收地址的变量，ptr 的类型就为*T，称做 T 的指针类型。*代表指针。

举个例子：

```go
func main() {
  a := 10
  b := &a
  fmt.Printf("a:%d ptr:%p\n", a, &a) // a:10 ptr:0xc00001a078
  fmt.Printf("b:%p type:%T\n", b, b) // b:0xc00001a078 type:*int
  fmt.Println(&b)                    // 0xc00000e018
}
```

我们来看一下`b := &a`的图示：

![指针](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/1.png)

### 3、指针取值

在对普通变量使用&操作符取地址后会获得这个变量的指针，然后可以对指针使用`*`操作，也就是指针取值，代码如下。

```go
func main() {
  //指针取值
  a := 10
  b := &a // 取变量a的地址，将指针保存到b中
  fmt.Printf("type of b:%T\n", b)
  c := *b // 指针取值（根据指针去内存取值）
  fmt.Printf("type of c:%T\n", c)
  fmt.Printf("value of c:%v\n", c)
}
```

输出如下：

```go
type of b:*int
type of c:int
value of c:10
```

总结： 取地址操作符&和取值操作符`*`是一对互补操作符，`&`取出地址，`*`根据地址取出地址指向的值。

变量、指针地址、指针变量、取地址、取值的相互关系和特性如下：

- 对变量进行取地址（&）操作，可以获得这个变量的指针变量。
- 指针变量的值是指针地址。
- 对指针变量进行取值（*）操作，可以获得指针变量指向的原变量的值。

指针传值示例：

```go
func modify1(x int) {
  x = 100
}

func modify2(x *int) {
  *x = 100
}

func main() {
  a := 10
  modify1(a)
  fmt.Println(a) // 10
  modify2(&a)
  fmt.Println(a) // 100
}
```

### 4、空指针

- 当一个指针被定义后没有分配到任何变量时，它的值为 nil
- 空指针的判断

```go
package main

import "fmt"

func main() {
  var p *string
  fmt.Println(p)
  fmt.Printf("p的值是%v\n", p)
  if p != nil {
    fmt.Println("非空")
  } else {
    fmt.Println("空值")
  }
}
```

### 5、使用指针修改值

通过指针不仅可以取值，也可以修改值。

~~~go
package main

func main(){
    // 利用指针修改值
	var num = 10
	modifyFromPoint(num)
	fmt.Println("未使用指针，方法外",num)

	var num2 = 22
	newModifyFromPoint(&num2)  // 传入指针
	fmt.Println("使用指针 方法外",num2)
}

func modifyFromPoint(num int)  {
	// 未使用指针
	num = 10000
	fmt.Println("未使用指针，方法内:",num)
}

func newModifyFromPoint(ptr *int)  {
	// 使用指针
	*ptr = 1000   // 修改指针地址指向的值
	fmt.Println("使用指针，方法内:",*ptr)
}
~~~

### 6、new 和 make

我们先来看一个例子：

```go
func main() {
  var a *int
  *a = 100
  fmt.Println(*a)

  var b map[string]int
  b["测试"] = 100
  fmt.Println(b)
}
```

执行上面的代码会引发 panic，为什么呢？ 在 Go 语言中对于引用类型的变量，我们在使用的时候不仅要声明它，还要为它分配内存空间，否则我们的值就没办法存储。而对于值类型的声明不需要分配内存空间，是因为它们在声明的时候已经默认分配好了内存空间。要分配内存，就引出来今天的 new 和 make。 Go 语言中 new 和 make 是内建的两个函数，主要用来分配内存

#### 6.1 new

new 是一个内置的函数，它的函数签名如下：

```go
func new(Type) *Type
```

其中，

> 1.Type 表示类型，new 函数只接受一个参数，这个参数是一个类型
>
> 2.\*Type 表示类型指针，new 函数返回一个指向该类型内存地址的指针。

new 函数不太常用，使用 new 函数得到的是一个类型的指针，并且该指针对应的值为该类型的零值。举个例子：

```go
func main() {
  a := new(int)
  b := new(bool)
  fmt.Printf("%T\n", a) // *int
  fmt.Printf("%T\n", b) // *bool
  fmt.Println(*a)       // 0
  fmt.Println(*b)       // false
}
```

本节开始的示例代码中`var a *int`只是声明了一个指针变量 a 但是没有初始化，指针作为引用类型需要初始化后才会拥有内存空间，才可以给它赋值。应该按照如下方式使用内置的 new 函数对 a 进行初始化之后就可以正常对其赋值了：

```go
func main() {
  var a *int
  a = new(int)
  *a = 10
  fmt.Println(*a)
}
```

#### 6.2 make

make 也是用于内存分配的，区别于 new，它只用于 slice、map 以及 chan 的内存创建，而且它返回的类型就是这三个类型本身，而不是他们的指针类型，因为这三种类型就是引用类型，所以就没有必要返回他们的指针了。make 函数的函数签名如下：

```go
func make(t Type, size ...IntegerType) Type
```

make 函数是无可替代的，我们在使用 slice、map 以及 channel 的时候，都需要使用 make 进行初始化，然后才可以对它们进行操作。这个我们在上一章中都有说明，关于 channel 我们会在后续的章节详细说明。

本节开始的示例中`var b map[string]int`只是声明变量 b 是一个 map 类型的变量，需要像下面的示例代码一样使用 make 函数进行初始化操作之后，才能对其进行键值对赋值：

```go
func main() {
  var b map[string]int
  b = make(map[string]int, 10)
  b["测试"] = 100
  fmt.Println(b)
}
```

#### 6.3 new 与 make 的区别

1. 二者都是用来做内存分配的。
2. make 只用于 slice、map 以及 channel 的初始化，返回的还是这三个引用类型本身；
3. 而 new 用于类型的内存分配，并且内存对应的值为类型零值，返回的是指向类型的指针。

### 7、指针小练习

- 程序定义一个 int 变量 num 的地址并打印
- 将 num 的地址赋给指针 ptr，并通过 ptr 去修改 num 的值

```go
package main

import "fmt"

func main() {
  var a int
  fmt.Println(&a)
  var p *int
  p = &a
  *p = 20
  fmt.Println(a)
}
```

> 获取命令行的输入信息

Go语言内置的 flag 包实现了对命令行参数的解析，flag 包使得开发命令行工具更为简单。

~~~go
package main
// 导入系统包
import (
    "flag"
    "fmt"
)
// 定义命令行参数
var mode = flag.String("mode", "", "fast模式能让程序运行的更快")

func main() {
	// 解析命令行参数
	flag.Parse()
	fmt.Println(*mode)
}

~~~



## 参考

- [指针](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/%E6%8C%87%E9%92%88.html)
- [Go语言基础之指针](https://www.liwenzhou.com/posts/Go/07_pointer/)
