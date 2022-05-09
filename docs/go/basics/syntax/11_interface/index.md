---
title: Interface
author: ian_kevin
date: 2022-04-19
---

# Interface

## 一、接口

接口`（interface）`定义了一个对象的行为规范，只定义规范不实现，由具体的对象来实现规范的细节。

**在Go语言中接口`（interface）`是一种类型，一种抽象的类型。**

相较于之前章节中讲到的那些具体类型（字符串、切片、结构体等）更注重“我是谁”，接口类型更注重“我能做什么”的问题。接口类型就像是一种约定——概括了一种类型应该具备哪些方法，在Go语言中提倡使用面向接口的编程方式实现解耦。

### 1、接口类型

在Go语言中接口`（interface）`是一种类型，一种抽象的类型。

`interface`是一组`method`的集合，是`duck-type programming`的一种体现。接口做的事情就像是定义一个协议（规则），只要一台机器有洗衣服和甩干的功能，我就称它为洗衣机。不关心属性（数据），只关心行为（方法）。

为了保护你的Go语言职业生涯，请牢记接口`（interface）`是一种类型。

### 2、为什么要使用接口

现在假设我们的代码世界里有很多小动物，下面的代码片段定义了猫和狗，它们饿了都会叫。

```go
package main

import "fmt"

type Cat struct{}

func (c Cat) Say() {
	fmt.Println("喵喵喵~")
}

type Dog struct{}

func (d Dog) Say() {
	fmt.Println("汪汪汪~")
}

func main() {
	c := Cat{}
	c.Say()
	d := Dog{}
	d.Say()
}
```

这个时候又跑来了一只羊，羊饿了也会发出叫声。

```go
type Sheep struct{}

func (s Sheep) Say() {
	fmt.Println("咩咩咩~")
}
```

我们接下来定义一个饿肚子的场景。

```go
// MakeCatHungry 猫饿了会喵喵喵~
func MakeCatHungry(c Cat) {
	c.Say()
}

// MakeSheepHungry 羊饿了会咩咩咩~
func MakeSheepHungry(s Sheep) {
	s.Say()
}
```

接下来会有越来越多的小动物跑过来，我们的代码世界该怎么拓展呢？

在饿肚子这个场景下，我们可不可以把所有动物都当成一个“会叫的类型”来处理呢？当然可以！使用接口类型就可以实现这个目标。 我们的代码其实并不关心究竟是什么动物在叫，我们只是在代码中调用它的`Say()`方法，这就足够了。

我们可以约定一个`Sayer`类型，它必须实现一个`Say()`方法，只要饿肚子了，我们就调用`Say()`方法。

```go
type Sayer interface {
    Say()
}
```

然后我们定义一个通用的`MakeHungry`函数，接收`Sayer`类型的参数。

```go
// MakeHungry 饿肚子了...
func MakeHungry(s Sayer) {
	s.Say()
}
```

我们通过使用接口类型，把所有会叫的动物当成`Sayer`类型来处理，只要实现了`Say()`方法都能当成`Sayer`类型的变量来处理。

```go
var c cat
MakeHungry(c)
var d dog
MakeHungry(d)
```

在电商系统中我们允许用户使用多种支付方式（支付宝支付、微信支付、银联支付等），我们的交易流程中可能不太在乎用户究竟使用什么支付方式，只要它能提供一个实现支付功能的`Pay`方法让调用方调用就可以了。

再比如我们需要在某个程序中添加一个将某些指标数据向外输出的功能，根据不同的需求可能要将数据输出到终端、写入到文件或者通过网络连接发送出去。在这个场景下我们可以不关注最终输出的目的地是什么，只需要它能提供一个`Write`方法让我们把内容写入就可以了。



像类似的例子在我们编程过程中会经常遇到：

比如三角形，四边形，圆形都能计算周长和面积，我们能不能把它们当成“图形”来处理呢？

比如销售、行政、程序员都能计算月薪，我们能不能把他们当成“员工”来处理呢？

Go语言中为了解决类似上面的问题，就设计了接口这个概念。接口区别于我们之前所有的具体类型，接口是一种抽象的类型。当你看到一个接口类型的值时，你不知道它是什么，唯一知道的是通过它的方法能做什么。

### 3、接口的定义

Go语言提倡面向接口编程。

- 接口是一个或多个方法签名的集合。任何类型的方法集中只要拥有该接口'对应的全部方法'签名。就表示它 "实现" 了该接口，无须在该类型上显式声明实现了哪个接口。这称为`Structural Typing`。所谓对应方法，是指有相同名称、参数列表 (不包括参数名) 以及返回值。当然，该类型还可以有其他方法。
- 接口只有方法声明，没有实现，没有数据字段。
- 接口可以匿名嵌入其他接口，或嵌入到结构中。
- 对象赋值给接口时，会发生拷贝，而接口内部存储的是指向这个复制品的指针，既无法修改复制品的状态，也无法获取指针。
- 只有当接口存储的类型和对象都为`nil`时，接口才等于`nil`。
- 接口调用不会做`receiver`的自动转换。
- 接口同样支持匿名字段方法。
- 接口也可实现类似`OOP`中的多态。
- 空接口可以作为任何类型数据的容器。
- 一个类型可实现多个接口。
- 接口命名习惯以 `er` 结尾。



接口是一种由程序员来定义的类型，一个接口类型就是一组方法的集合，它规定了需要实现的所有方法。

相较于使用结构体类型，当我们使用接口类型说明相比于它是什么更关心它能做什么。

每个接口类型由任意个方法签名组成，接口的定义格式如下：

```go
type 接口类型名 interface{
    方法名1( 参数列表1 ) 返回值列表1
    方法名2( 参数列表2 ) 返回值列表2
    …
}
```

其中：

- 接口类型名：Go语言的接口在命名时，一般会在单词后面添加`er`，如有写操作的接口叫`Writer`，有关闭操作的接口叫`closer`等。接口名最好要能突出该接口的类型含义。
- 方法名：当方法名首字母是大写且这个接口类型名首字母也是大写时，这个方法可以被接口所在的包（package）之外的代码访问。
- 参数列表、返回值列表：参数列表和返回值列表中的参数变量名可以省略。

举个例子，定义一个包含`Write`方法的`Writer`接口。

```go
type Writer interface{
    Write([]byte) error
}
```

当你看到一个`Writer`接口类型的值时，你不知道它是什么，唯一知道的就是可以通过调用它的`Write`方法来做一些事情。

### 4、实现接口的条件

一个对象只要全部实现了接口中的方法，那么就实现了这个接口。换句话说，接口就是一个需要实现的方法列表。

我们来定义一个Sayer接口：

```go
// Sayer 接口
type Sayer interface {
  say()
}
```

定义dog和cat两个结构体：

```go
type dog struct {}

type cat struct {}
```

因为Sayer接口里只有一个say方法，所以我们只需要给dog和cat 分别实现say方法就可以实现Sayer接口了。

```go
// dog实现了Sayer接口
func (d dog) say() {
  fmt.Println("汪汪汪")
}

// cat实现了Sayer接口
func (c cat) say() {
  fmt.Println("喵喵喵")
}
```

接口的实现就是这么简单，只要实现了接口中的所有方法，就实现了这个接口。

### 5、接口类型变量

那实现了接口有什么用呢？

接口类型变量能够存储所有实现了该接口的实例。 例如上面的示例中，Sayer类型的变量能够存储dog和cat类型的变量。

```go
func main() {
  var x Sayer // 声明一个Sayer类型的变量x
  a := cat{}  // 实例化一个cat
  b := dog{}  // 实例化一个dog
  x = a       // 可以把cat实例直接赋值给x
  x.say()     // 喵喵喵
  x = b       // 可以把dog实例直接赋值给x
  x.say()     // 汪汪汪
}
```

## 二、面向接口编程

PHP、Java等语言中也有接口的概念，不过在PHP和Java语言中需要显式声明一个类实现了哪些接口，在Go语言中使用隐式声明的方式实现接口。只要一个类型实现了接口中规定的所有方法，那么它就实现了这个接口。

Go语言中的这种设计符合程序开发中抽象的一般规律，例如在下面的代码示例中，我们的电商系统最开始只设计了支付宝一种支付方式：

```go
type ZhiFuBao struct {
	// 支付宝
}

// Pay 支付宝的支付方法
func (z *ZhiFuBao) Pay(amount int64) {
  fmt.Printf("使用支付宝付款：%.2f元。\n", float64(amount/100))
}

// Checkout 结账
func Checkout(obj *ZhiFuBao) {
	// 支付100元
	obj.Pay(100)
}

func main() {
	Checkout(&ZhiFuBao{})
}
```

随着业务的发展，根据用户需求添加支持微信支付。

```go
type WeChat struct {
	// 微信
}

// Pay 微信的支付方法
func (w *WeChat) Pay(amount int64) {
	fmt.Printf("使用微信付款：%.2f元。\n", float64(amount/100))
}
```

在实际的交易流程中，我们可以根据用户选择的支付方式来决定最终调用支付宝的Pay方法还是微信支付的Pay方法。

```go
// Checkout 支付宝结账
func CheckoutWithZFB(obj *ZhiFuBao) {
	// 支付100元
	obj.Pay(100)
}

// Checkout 微信支付结账
func CheckoutWithWX(obj *WeChat) {
	// 支付100元
	obj.Pay(100)
}
```

实际上，从上面的代码示例中我们可以看出，我们其实并不怎么关心用户选择的是什么支付方式，我们只关心调用Pay方法时能否正常运行。这就是典型的“不关心它是什么，只关心它能做什么”的场景。

在这种场景下我们可以将具体的支付方式抽象为一个名为`Payer`的接口类型，即任何实现了`Pay`方法的都可以称为`Payer`类型。

```go
// Payer 包含支付方法的接口类型
type Payer interface {
	Pay(int64)
}
```

此时只需要修改下原始的`Checkout`函数，它接收一个`Payer`类型的参数。这样就能够在不修改既有函数调用的基础上，支持新的支付方式。

```go
// Checkout 结账
func Checkout(obj Payer) {
	// 支付100元
	obj.Pay(100)
}

func main() {
	Checkout(&ZhiFuBao{}) // 之前调用支付宝支付

	Checkout(&WeChat{}) // 现在支持使用微信支付
}
```

像类似的例子在我们编程过程中会经常遇到：

- 比如一个网上商城可能使用支付宝、微信、银联等方式去在线支付，我们能不能把它们当成“支付方式”来处理呢？
- 比如三角形，四边形，圆形都能计算周长和面积，我们能不能把它们当成“图形”来处理呢？
- 比如满减券、立减券、打折券都属于电商场景下常见的优惠方式，我们能不能把它们当成“优惠券”来处理呢？

接口类型是Go语言提供的一种工具，在实际的编码过程中是否使用它由你自己决定，但是通常使用接口类型可以使代码更清晰易读。

## 三、值接收者和指针接收者

### 1、值接收者和指针接收者实现接口的区别

使用值接收者实现接口和使用指针接收者实现接口有什么区别呢？接下来我们通过一个例子看一下其中的区别。

我们有一个Mover接口和一个dog结构体。

```go
type Mover interface {
  move()
}

type dog struct {}
```

### 2、值接收者实现接口

```go
func (d dog) move() {
  fmt.Println("狗会动")
}
```

此时实现接口的是dog类型：

```go
func main() {
  var x Mover
  var wangcai = dog{} // 旺财是dog类型
  x = wangcai         // x可以接收dog类型
  var fugui = &dog{}  // 富贵是*dog类型
  x = fugui           // x可以接收*dog类型
  x.move()
}
```

从上面的代码中我们可以发现，使用值接收者实现接口之后，不管是dog结构体还是结构体指针`*dog`类型的变量都可以赋值给该接口变量。因为Go语言中有对指针类型变量求值的语法糖，dog指针fugui内部会自动求值`*fugui`。

### 3、指针接收者实现接口

同样的代码我们再来测试一下使用指针接收者有什么区别：

```go
func (d *dog) move() {
  fmt.Println("狗会动")
}
func main() {
  var x Mover
  var wangcai = dog{} // 旺财是dog类型
  x = wangcai         // x不可以接收dog类型
  var fugui = &dog{}  // 富贵是*dog类型
  x = fugui           // x可以接收*dog类型
}
```

此时实现Mover接口的是`*dog`类型，所以不能给x传入dog类型的wangcai，此时x只能存储`*dog`类型的值。

### 4、下面的代码是一个比较好的面试题

请问下面的代码是否能通过编译？

```go
type People interface {
  Speak(string) string
}

type Student struct{}

func (stu *Stduent) Speak(think string) (talk string) {
  if think == "sb" {
    talk = "你是个大帅比"
  } else {
    talk = "您好"
  }
  return
}

func main() {
  var peo People = Student{}
  think := "bitch"
  fmt.Println(peo.Speak(think))
}
```

## 四、类型与接口的关系

### 1、一个类型实现多个接口

一个类型可以同时实现多个接口，而接口间彼此独立，不知道对方的实现。 例如，狗可以叫，也可以动。我们就分别定义Sayer接口和Mover接口，如下： Mover接口。

```go
// Sayer 接口
type Sayer interface {
  say()
}

// Mover 接口
type Mover interface {
  move()
}
```

dog既可以实现Sayer接口，也可以实现Mover接口。

```go
type dog struct {
  name string
}

// 实现Sayer接口
func (d dog) say() {
  fmt.Printf("%s会叫汪汪汪\n", d.name)
}

// 实现Mover接口
func (d dog) move() {
  fmt.Printf("%s会动\n", d.name)
}

func main() {
  var x Sayer
  var y Mover

  var a = dog{name: "旺财"}
  x = a
  y = a
  x.say()
  y.move()
}
```

### 2、多个类型实现同一接口

Go语言中不同的类型还可以实现同一接口 首先我们定义一个Mover接口，它要求必须由一个move方法。

```go
// Mover 接口
type Mover interface {
  move()
}
```

例如狗可以动，汽车也可以动，可以使用如下代码实现这个关系：

```go
type dog struct {
  name string
}

type car struct {
  brand string
}

// dog类型实现Mover接口
func (d dog) move() {
  fmt.Printf("%s会跑\n", d.name)
}

// car类型实现Mover接口
func (c car) move() {
  fmt.Printf("%s速度70迈\n", c.brand)
}
```

这个时候我们在代码中就可以把狗和汽车当成一个会动的物体来处理了，不再需要关注它们具体是什么，只需要调用它们的move方法就可以了。

```go
func main() {
  var x Mover
  var a = dog{name: "旺财"}
  var b = car{brand: "保时捷"}
  x = a
  x.move()
  x = b
  x.move()
}
```

上面的代码执行结果如下：

```
旺财会跑
保时捷速度70迈
```

并且一个接口的方法，不一定需要由一个类型完全实现，接口的方法可以通过在类型中嵌入其他类型或者结构体来实现。

```go
// WashingMachine 洗衣机
type WashingMachine interface {
  wash()
  dry()
}

// 甩干器
type dryer struct{}

// 实现WashingMachine接口的dry()方法
func (d dryer) dry() {
  fmt.Println("甩一甩")
}

// 海尔洗衣机
type haier struct {
  dryer //嵌入甩干器
}

// 实现WashingMachine接口的wash()方法
func (h haier) wash() {
  fmt.Println("洗刷刷")
}
```

### 3、接口嵌套

接口与接口间可以通过嵌套创造出新的接口。

```go
// Sayer 接口
type Sayer interface {
  say()
}

// Mover 接口
type Mover interface {
  move()
}

// 接口嵌套
type animal interface {
  Sayer
  Mover
}
```

嵌套得到的接口的使用与普通接口一样，这里我们让cat实现animal接口：

```go
type cat struct {
  name string
}

func (c cat) say() {
  fmt.Println("喵喵喵")
}

func (c cat) move() {
  fmt.Println("猫会动")
}

func main() {
  var x animal
  x = cat{name: "花花"}
  x.move()
  x.say()
}
```

例如Go标准库`io`源码中就有很多接口之间互相组合的示例。

```go
// src/io/io.go

type Reader interface {
	Read(p []byte) (n int, err error)
}

type Writer interface {
	Write(p []byte) (n int, err error)
}

type Closer interface {
	Close() error
}

// ReadWriter 是组合Reader接口和Writer接口形成的新接口类型
type ReadWriter interface {
	Reader
	Writer
}

// ReadCloser 是组合Reader接口和Closer接口形成的新接口类型
type ReadCloser interface {
	Reader
	Closer
}

// WriteCloser 是组合Writer接口和Closer接口形成的新接口类型
type WriteCloser interface {
	Writer
	Closer
}
```

对于这种由多个接口类型组合形成的新接口类型，同样只需要实现新接口类型中规定的所有方法就算实现了该接口类型。

接口也可以作为结构体的一个字段，我们来看一段Go标准库`sort`源码中的示例。

```go
// src/sort/sort.go

// Interface 定义通过索引对元素排序的接口类型
type Interface interface {
    Len() int
    Less(i, j int) bool
    Swap(i, j int)
}


// reverse 结构体中嵌入了Interface接口
type reverse struct {
    Interface
}
```

通过在结构体中嵌入一个接口类型，从而让该结构体类型实现了该接口类型，并且还可以改写该接口的方法。

```go
// Less 为reverse类型添加Less方法，重写原Interface接口类型的Less方法
func (r reverse) Less(i, j int) bool {
	return r.Interface.Less(j, i)
}
```

`Interface`类型原本的`Less`方法签名为`Less(i, j int) bool`，此处重写为`r.Interface.Less(j, i)`，即通过将索引参数交换位置实现反转。

在这个示例中还有一个需要注意的地方是`reverse`结构体本身是不可导出的（结构体类型名称首字母小写），`sort.go`中通过定义一个可导出的`Reverse`函数来让使用者创建`reverse`结构体实例。

```go
func Reverse(data Interface) Interface {
	return &reverse{data}
}
```

这样做的目的是保证得到的`reverse`结构体中的`Interface`属性一定不为`nil`，否者`r.Interface.Less(j, i)`就会出现空指针panic。

此外在Go内置标准库`database/sql`中也有很多类似的结构体内嵌接口类型的使用示例，各位读者可自行查阅。

### 4、空接口

#### 4.1 空接口的定义

空接口是指没有定义任何方法的接口。因此任何类型都实现了空接口。

空接口类型的变量可以存储任意类型的变量。

```go
func main() {
  // 定义一个空接口x
  var x interface{}
  s := "pprof.cn"
  x = s
  fmt.Printf("type:%T value:%v\n", x, x)
  i := 100
  x = i
  fmt.Printf("type:%T value:%v\n", x, x)
  b := true
  x = b
  fmt.Printf("type:%T value:%v\n", x, x)
}
```

#### 4.2 空接口的应用

##### 4.2.1 空接口作为函数的参数

使用空接口实现可以接收任意类型的函数参数。

```go
// 空接口作为函数参数
func show(a interface{}) {
    fmt.Printf("type:%T value:%v\n", a, a)
}
```

##### 4.2.2 空接口作为map的值

使用空接口实现可以保存任意值的字典。

```go
// 空接口作为map值
var studentInfo = make(map[string]interface{})
studentInfo["name"] = "李白"
studentInfo["age"] = 18
studentInfo["married"] = false
fmt.Println(studentInfo)
```

#### 4.3 类型断言

空接口可以存储任意类型的值，那我们如何获取其存储的具体数据呢？

##### 4.3.1 接口值

由于接口类型的值可以是任意一个实现了该接口的类型值，所以接口值除了需要记录具体**值**之外，还需要记录这个值属于的**类型**。也就是说接口值由“类型”和“值”组成，鉴于这两部分会根据存入值的不同而发生变化，我们称之为接口的`动态类型`和`动态值`。

![接口值示例](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/interface01.png)

我们接下来通过一个示例来加深对接口值的理解。

下面的示例代码中，定义了一个`Mover`接口类型和两个实现了该接口的`Dog`和`Car`结构体类型。

```go
type Mover interface {
	Move()
}

type Dog struct {
	Name string
}

func (d *Dog) Move() {
	fmt.Println("狗在跑~")
}

type Car struct {
	Brand string
}

func (c *Car) Move() {
	fmt.Println("汽车在跑~")
}
```

首先，我们创建一个`Mover`接口类型的变量`m`。

```go
var m Mover
```

此时，接口变量`m`是接口类型的零值，也就是它的类型和值部分都是`nil`，就如下图所示。

![接口值示例](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/interface02.png)

我们可以使用`m == nil`来判断此时的接口值是否为空。

```go
fmt.Println(m == nil)  // true
```

**注意：**我们不能对一个空接口值调用任何方法，否则会产生panic。

```go
m.Move() // panic: runtime error: invalid memory address or nil pointer dereference
```

接下来，我们将一个`*Dog`结构体指针赋值给变量`m`。

```go
m = &Dog{Name: "旺财"}
```

此时，接口值`m`的动态类型会被设置为`*Dog`，动态值为结构体变量的拷贝。

![接口值示例](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/interface03.png)

然后，我们给接口变量`m`赋值为一个`*Car`类型的值。

```go
m = new(Car)
```

这一次，接口值的动态类型为`*Car`，动态值为`nil`。

![接口值示例](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/interface04.png)

**注意：**此时接口变量`m`与`nil`并不相等，因为它只是动态值的部分为`nil`，而动态类型部分保存着对应值的类型。

```go
fmt.Println(m == nil) // false
```

接口值是支持相互比较的，当且仅当接口值的动态类型和动态值都相等时才相等。

```go
var (
	x Mover = new(Dog)
	y Mover = new(Car)
)
fmt.Println(x == y) // false
```

但是有一种特殊情况需要特别注意，如果接口值的保存的动态类型相同，但是这个动态类型不支持互相比较（比如切片），那么对它们相互比较时就会引发panic。

```go
var z interface{} = []int{1, 2, 3}
fmt.Println(z == z) // panic: runtime error: comparing uncomparable type []int
```

##### 4.3.2 类型断言

我们来看一个具体的例子：

```go
var w io.Writer
w = os.Stdout
w = new(bytes.Buffer)
w = nil
```

请看下图分解：

![分解](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/1-20220425133601665.png)

想要判断空接口中的值这个时候就可以使用类型断言，其语法格式：

```
x.(T)
```

其中：

```
x：表示类型为interface{}的变量
T：表示断言x可能是的类型。
```

该语法返回两个参数，第一个参数是x转化为T类型后的变量，第二个值是一个布尔值，若为true则表示断言成功，为false则表示断言失败。

举个例子：

```go
func main() {
  var x interface{}
  x = "pprof.cn"
  v, ok := x.(string)
  if ok {
    fmt.Println(v)
  } else {
    fmt.Println("类型断言失败")
  }
}
```

上面的示例中如果要断言多次就需要写多个if判断，这个时候我们可以使用switch语句来实现：

```go
func justifyType(x interface{}) {
  switch v := x.(type) {
    case string:
    fmt.Printf("x is a string，value is %v\n", v)
    case int:
    fmt.Printf("x is a int is %v\n", v)
    case bool:
    fmt.Printf("x is a bool is %v\n", v)
    default:
    fmt.Println("unsupport type！")
  }
}
```

因为空接口可以存储任意类型值的特点，所以空接口在Go语言中的使用十分广泛。

由于接口类型变量能够动态存储不同类型值的特点，所以很多初学者会滥用接口类型（特别是空接口）来实现编码过程中的便捷。只有当有两个或两个以上的具体类型必须以相同的方式进行处理时才需要定义接口。切记不要为了使用接口类型而增加不必要的抽象，导致不必要的运行时损耗。

在 Go 语言中接口是一个非常重要的概念和特性，使用接口类型能够实现代码的抽象和解耦，也可以隐藏某个功能的内部实现，但是缺点就是在查看源码的时候，不太方便查找到具体实现接口的类型。

相信很多读者在刚接触到接口类型时都会有很多疑惑，请牢记接口是一种类型，一种抽象的类型。区别于我们在之前章节提到的那些具体类型（整型、数组、结构体类型等），它是一个只要求实现特定方法的抽象类型。

**小技巧：** 下面的代码可以在程序编译阶段验证某一结构体是否满足特定的接口类型。

```go
// 摘自gin框架routergroup.go
type IRouter interface{ ... }

type RouterGroup struct { ... }

var _ IRouter = &RouterGroup{}  // 确保RouterGroup实现了接口IRouter
```

上面的代码中也可以使用`var _ IRouter = (*RouterGroup)(nil)`进行验证。



## 参考

- [接口](https://www.topgoer.com/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1/%E6%8E%A5%E5%8F%A3.html)
