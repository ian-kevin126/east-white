---
title: 结构体
author: ian_kevin
date: 2022-04-25
---

# 结构体

Go 语言中没有“类”的概念，也不支持“类”的继承等面向对象的概念。Go 语言中通过结构体的内嵌再配合接口比面向对象具有更高的扩展性和灵活性。

## 一、类型别名和自定义类型

### 1、自定义类型

在 Go 语言中有一些基本的数据类型，如 string、整型、浮点型、布尔等数据类型，Go 语言中可以使用 type 关键字来定义自定义类型。

自定义类型是定义了一个全新的类型。我们可以基于内置的基本类型定义，也可以通过 struct 定义。例如：

```go
//将MyInt定义为int类型
type MyInt int
```

通过 Type 关键字的定义，MyInt 就是一种新的类型，它具有 int 的特性。

### 2、类型别名

类型别名是 Go1.9 版本添加的新功能。

类型别名规定：TypeAlias 只是 Type 的别名，本质上 TypeAlias 与 Type 是同一个类型。就像一个孩子小时候有小名、乳名，上学后用学名，英语老师又会给他起英文名，但这些名字都指的是他本人。

```go
type TypeAlias = Type
```

我们之前见过的 rune 和 byte 就是类型别名，他们的定义如下：

```go
type byte = uint8
type rune = int32
```

### 3、类型定义和类型别名的区别

类型别名与类型定义表面上看只有一个等号的差异，我们通过下面的这段代码来理解它们之间的区别。

```go
//类型定义
type NewInt int

//类型别名
type MyInt = int

func main() {
  var a NewInt
  var b MyInt

  fmt.Printf("type of a:%T\n", a) //type of a:main.NewInt
  fmt.Printf("type of b:%T\n", b) //type of b:int
}
```

结果显示 a 的类型是 main.NewInt，表示 main 包下定义的 NewInt 类型。b 的类型是 int。MyInt 类型只会在代码中存在，编译完成时并不会有 MyInt 类型。

## 二、结构体

Go 语言中的基础数据类型可以表示一些事物的基本属性，但是当我们想表达一个事物的全部或部分属性时，这时候再用单一的基本数据类型明显就无法满足需求了，Go 语言提供了一种自定义数据类型，可以封装多个基本数据类型，这种数据类型叫结构体，英文名称 struct。 也就是我们可以通过 struct 来定义自己的类型了。

Go 语言中通过 struct 来实现面向对象。

### 1、结构体的定义

结构体成员也可以称为“字段”，这些字段有以下特性：

- 字段拥有自己的类型和值；
- 字段名必须唯一；
- 字段的类型也可以是结构体，甚至是字段所在结构体的类型。

使用关键字 **type** 可以将各种基本类型定义为自定义类型，基本类型包括整型、字符串、布尔等。结构体是一种复合的基本类型，通过 type 定义为自定义类型后，使结构体更便于使用。具体代码格式如下：

```go
type 类型名 struct {
    字段1 字段1类型
    字段2 字段2类型
    …
}
```

其中：

1. 类型名：标识自定义结构体的名称，在同一个包内不能重复。
2. struct{}：表示结构体类型，`type 类型名 struct{}`可以理解为将 struct{} 结构体定义为类型名的类型。
3. 字段1、字段2……：表示结构体字段名，结构体中的字段名必须唯一。
4. 字段1类型、字段2类型……：表示结构体各个字段的类型。

举个例子，我们定义一个 Person（人）结构体，代码如下：

```go
type person struct {
  name string
  city string
  age  int8
}
```

同样类型的字段也可以写在一行，

```go
type person struct {
  name, city string
  age        int8
}
```

这样我们就拥有了一个 person 的自定义类型，它有 name、city、age 三个字段，分别表示姓名、城市和年龄。这样我们使用这个 person 结构体就能够很方便的在程序中表示和存储人信息了。

语言内置的基础数据类型是用来描述一个值的，而结构体是用来描述一组值的。比如一个人有名字、年龄和居住城市等，本质上是一种聚合型的数据类型

### 2、结构体实例化

只有当结构体实例化时，才会真正地分配内存。也就是必须实例化后才能使用结构体的字段。

结构体本身也是一种类型，我们可以像声明内置类型一样使用 var 关键字声明结构体类型。

```go
var 结构体实例 结构体类型
```

实例化就是根据结构体定义的格式创建一份与格式一致的内存区域，结构体实例与实例间的内存是完全独立的。

**基本的实例化形式:**

结构体本身是一种类型，可以像整型、字符串等类型一样，以 var 的方式声明结构体即可完成实例化。

~~~go
var ins T
~~~

`T `为结构体类型，`ins `为结构体的实例。

~~~go
package main

import "fmt"

type Point struct {
	X int
	Y int
}
func main() {
    //使用.来访问结构体的成员变量,结构体成员变量的赋值方法与普通变量一致。
	var p Point
	p.X = 1
	p.Y = 2
	fmt.Printf("%v,x=%d,y=%d",p,p.X,p.Y )
}

~~~

~~~go
package main

import "fmt"

type Point struct {
	X int
	Y int
}
func main() {

	var p Point
	//p.X = 1
	//p.Y = 2
    //如果不赋值 结构体中的变量会使用零值初始化
	fmt.Printf("%v,x=%d,y=%d",p,p.X,p.Y )
}

~~~

~~~go
package main

import "fmt"

type Point struct {
	X int
	Y int
}
func main() {
	//可以使用
	var p = Point{
		X: 1,
		Y: 2,
	}
    var p = Point{
		1,
		2,
	}
	fmt.Printf("%v,x=%d,y=%d",p,p.X,p.Y )
}

~~~

**创建指针类型的结构体：**

Go语言中，还可以使用 new 关键字对类型（包括结构体、整型、浮点数、字符串等）进行实例化，结构体在实例化后会形成指针类型的结构体。

~~~go
ins := new(T)
~~~

- T 为类型，可以是结构体、整型、字符串等。
- ins：T 类型被实例化后保存到 ins 变量中，ins 的类型为 *T，属于指针。

下面的例子定义了一个玩家（Player）的结构，玩家拥有名字、生命值和魔法值：

~~~go
type Player struct{
    Name string
    HealthPoint int
    MagicPoint int
}
tank := new(Player)
tank.Name = "码神"
tank.HealthPoint = 300
~~~

 **new 实例化的结构体实例在成员赋值上与基本实例化的写法一致。**

**取结构体的地址实例化:**

在Go语言中，对结构体进行`&`取地址操作时，视为对该类型进行一次 new 的实例化操作，取地址格式如下：

~~~go
ins := &T{}
~~~

其中：

- T 表示结构体类型。
- ins 为结构体的实例，类型为 *T，是指针类型。

示例：

~~~go
package main

import "fmt"

type Command struct {
	Name    string    // 指令名称
	Var     *int      // 指令绑定的变量
	Comment string    // 指令的注释
}

func newCommand(name string, varRef *int, comment string) *Command {
	return &Command{
		Name:    name,
		Var:     varRef,
		Comment: comment,
	}
}

var version = 1
func main() {
	cmd := newCommand(
		"version",
		&version,
		"show version",
	)
	fmt.Println(cmd)
}

~~~

### 3、结构体访问

```go
type person struct {
  name string
  city string
  age  int8
}

func main() {
  var p1 person
  p1.name = "pprof.cn"
  p1.city = "北京"
  p1.age = 18
  fmt.Printf("p1=%v\n", p1)  //p1={pprof.cn 北京 18}
  fmt.Printf("p1=%#v\n", p1) //p1=main.person{name:"pprof.cn", city:"北京", age:18}
}
```

我们通过.来访问结构体的字段（成员变量）,例如 p1.name 和 p1.age 等。

### 4、匿名结构体

在定义一些临时数据结构等场景下还可以使用匿名结构体。

```go
package main

import (
  "fmt"
)

func main() {
  var user struct{Name string; Age int}
  user.Name = "pprof.cn"
  user.Age = 18
  fmt.Printf("%#v\n", user)
}
```

匿名结构体没有类型名称，无须通过 type 关键字定义就可以直接使用。

~~~go
ins := struct {
    // 匿名结构体字段定义
    字段1 字段类型1
    字段2 字段类型2
    …
}{
    // 字段值初始化
    初始化字段1: 字段1的值,
    初始化字段2: 字段2的值,
    …
}
~~~

- 字段1、字段2……：结构体定义的字段名。
- 初始化字段1、初始化字段2……：结构体初始化时的字段名，可选择性地对字段初始化。
- 字段类型1、字段类型2……：结构体定义字段的类型。
- 字段1的值、字段2的值……：结构体初始化字段的初始值。

~~~go
package main
import (
	"fmt"
)
// 打印消息类型, 传入匿名结构体
func printMsgType(msg *struct {
	id   int
	data string
}) {
	// 使用动词%T打印msg的类型
	fmt.Printf("%T\n, msg:%v", msg,msg)
}
func main() {
	// 实例化一个匿名结构体
	msg := &struct {  // 定义部分
		id   int
		data string
	}{  // 值初始化部分
		1024,
		"hello",
	}
	printMsgType(msg)
}
~~~

### 5、创建指针类型结构体

我们还可以通过使用 new 关键字对结构体进行实例化，得到的是结构体的地址。 格式如下：

```go
package main

import (
  "fmt"
)

type person struct {
  name string
  city string
  age  int8
}

func main() {
  var p2 = new(person)
  fmt.Printf("%T\n", p2)     //*main.person
  fmt.Printf("p2=%#v\n", p2) //p2=&main.person{name:"", city:"", age:0}
}
```

从打印的结果中我们可以看出 p2 是一个结构体指针。

需要注意的是在 Go 语言中支持对结构体指针直接使用.来访问结构体的成员。

```go
var p2 = new(person)
p2.name = "测试"
p2.age = 18
p2.city = "北京"
fmt.Printf("p2=%#v\n", p2) //p2=&main.person{name:"测试", city:"北京", age:18}
```

### 6、取结构体的地址实例化

使用&对结构体进行取地址操作相当于对该结构体类型进行了一次 new 实例化操作。

```go
p3 := &person{}
fmt.Printf("%T\n", p3)     //*main.person
fmt.Printf("p3=%#v\n", p3) //p3=&main.person{name:"", city:"", age:0}
p3.name = "博客"
p3.age = 30
p3.city = "成都"
fmt.Printf("p3=%#v\n", p3) //p3=&main.person{name:"博客", city:"成都", age:30}
```

p3.name = "博客"其实在底层是(\*p3).name = "博客"，这是 Go 语言帮我们实现的语法糖。

## 三、结构体初始化

```go
type person struct {
  name string
  city string
  age  int8
}

func main() {
  var p4 person
  fmt.Printf("p4=%#v\n", p4) //p4=main.person{name:"", city:"", age:0}
}
```

### 1、使用键值对初始化

使用键值对对结构体进行初始化时，键对应结构体的字段，值对应该字段的初始值。

```go
p5 := person{
  name: "pprof.cn",
  city: "北京",
  age:  18,
}
fmt.Printf("p5=%#v\n", p5) //p5=main.person{name:"pprof.cn", city:"北京", age:18}
```

也可以对结构体指针进行键值对初始化，例如：

```go
p6 := &person{
  name: "pprof.cn",
  city: "北京",
  age:  18,
}
fmt.Printf("p6=%#v\n", p6) //p6=&main.person{name:"pprof.cn", city:"北京", age:18}
```

当某些字段没有初始值的时候，该字段可以不写。此时，没有指定初始值的字段的值就是该字段类型的零值。

```go
p7 := &person{
  city: "北京",
}
fmt.Printf("p7=%#v\n", p7) //p7=&main.person{name:"", city:"北京", age:0}
```

### 2、使用值的列表初始化

初始化结构体的时候可以简写，也就是初始化的时候不写键，直接写值：

```go
p8 := &person{
  "pprof.cn",
  "北京",
  18,
}
fmt.Printf("p8=%#v\n", p8) //p8=&main.person{name:"pprof.cn", city:"北京", age:18}
```

使用这种格式初始化时，需要注意：

- 必须初始化结构体的所有字段。
- 初始值的填充顺序必须与字段在结构体中的声明顺序一致。
- 该方式不能和键值初始化方式混用。

## 四、结构体内存布局

```go
type test struct {
  a int8
  b int8
  c int8
  d int8
}
n := test{
  1, 2, 3, 4,
}
fmt.Printf("n.a %p\n", &n.a)
fmt.Printf("n.b %p\n", &n.b)
fmt.Printf("n.c %p\n", &n.c)
fmt.Printf("n.d %p\n", &n.d)
```

输出：

```go
n.a 0xc0000a0060
n.b 0xc0000a0061
n.c 0xc0000a0062
n.d 0xc0000a0063
```

【进阶知识点】关于Go语言中的内存对齐推荐阅读:[在 Go 中恰到好处的内存对齐](https://segmentfault.com/a/1190000017527311?utm_campaign=studygolang.com&utm_medium=studygolang.com&utm_source=studygolang.com)

### 1、空结构体

空结构体是不占用空间的。

```go
var v struct{}
fmt.Println(unsafe.Sizeof(v))  // 0
```

### 2、面试题

```go
type student struct {
  name string
  age  int
}

func main() {
  m := make(map[string]*student)
  stus := []student{
    {name: "pprof.cn", age: 18},
    {name: "测试", age: 23},
    {name: "博客", age: 28},
  }

  for _, stu := range stus {
    m[stu.name] = &stu
  }
  for k, v := range m {
    fmt.Println(k, "=>", v.name)
  }
}
```

## 五、构造函数

Go 语言的结构体没有构造函数，我们可以自己实现。 例如，下方的代码就实现了一个 person 的构造函数。 因为 struct 是值类型，如果结构体比较复杂的话，值拷贝性能开销会比较大，所以该构造函数返回的是结构体指针类型。

```go
package main

import "fmt"

type person struct {
	name string
	age  int8
	city string
}

func main() {
  // 调用构造函数
	p9 := newPerson("pprof.cn", "测试", 90)
	fmt.Printf("%#v\n", p9) // &main.person{name:"pprof.cn", age:90, city:"测试"}
}

// 构造函数
func newPerson(name, city string, age int8) *person {
	return &person{
		name: name,
		city: city,
		age:  age,
	}
}
```

## 六、方法和接收者

Go 语言中的方法（Method）是一种作用于特定类型变量的函数。这种特定类型变量叫做接收者（Receiver）。接收者的概念就类似于其他语言中的 this 或者 self。

方法的定义格式如下：

```go
func (接收者变量 接收者类型) 方法名(参数列表) (返回参数) {
  函数体
}
```

其中，

- 接收者变量：接收者中的参数变量名在命名时，官方建议使用接收者类型名的第一个小写字母，而不是self、this之类的命名。例如，Person类型的接收者变量应该命名为 p，Connector类型的接收者变量应该命名为c等。
- 接收者类型：接收者类型和参数类似，可以是指针类型和非指针类型。
- 方法名、参数列表、返回参数：具体格式与函数定义相同。

举个例子：

```go
package main

import "fmt"

//Person 结构体
type Person struct {
	name string
	age  int8
}

//NewPerson 构造函数
func NewPerson(name string, age int8) *Person {
	return &Person{
		name: name,
		age:  age,
	}
}

//Dream Person做梦的方法
func (p Person) Dream() {
	fmt.Printf("%s的梦想是学好Go语言！\n", p.name)
}

// 指针接收者：指的就是接收者的类型是指针
func (p *Person) SetAge(a int8) {
	p.age = a
}

// 值接收者
func (p Person) SetAge2(a int8) {
	p.age = a
}

func main() {
	p1 := NewPerson("测试", 25)
	p1.Dream() // 测试的梦想是学好Go语言！

	fmt.Println(p1.age) // 25
	p1.SetAge(30)
	fmt.Println(p1.age) // 30
	p1.SetAge2(100)
	fmt.Println(p1.age) // 30
}
```

方法与函数的区别是，函数不属于任何类型，方法属于特定的类型。

### 1、指针类型的接收者

指针类型的接收者由一个结构体的指针组成，由于指针的特性，调用方法时修改接收者指针的任意成员变量，在方法结束后，修改都是有效的。这种方式就十分接近于其他语言中面向对象中的 this 或者 self。 例如我们为 Person 添加一个 SetAge 方法，来修改实例变量的年龄。

```go
// SetAge 设置p的年龄
// 使用指针接收者
func (p *Person) SetAge(newAge int8) {
  p.age = newAge
}
```

调用该方法：

```go
func main() {
  p1 := NewPerson("测试", 25)
  fmt.Println(p1.age) // 25
  p1.SetAge(30)
  fmt.Println(p1.age) // 30
}
```

### 2、值类型的接收者

当方法作用于值类型接收者时，Go 语言会在代码运行时将接收者的值复制一份。在值类型接收者的方法中可以获取接收者的成员值，但修改操作只是针对副本，无法修改接收者变量本身。

```go
// SetAge2 设置p的年龄
// 使用值接收者
func (p Person) SetAge2(newAge int8) {
  p.age = newAge
}

func main() {
  p1 := NewPerson("测试", 25)
  p1.Dream()
  fmt.Println(p1.age) // 25
  p1.SetAge2(30) // (*p1).SetAge2(30)
  fmt.Println(p1.age) // 25
}
```

### 3、什么时候应该使用指针类型接收者

- 需要修改接收者中的值
- 接收者是拷贝代价比较大的大对象
- 保证一致性，如果有某个方法使用了指针接收者，那么其他的方法也应该使用指针接收者。

### 4、示例

```go
package main

import "fmt"

type Person struct {
	Name string
	Age  int
}

func main() {
	person1 := Person{
		Name: "kevin",
		Age:  18,
	}
	changeName1(person1)
	fmt.Println("person1: ", person1, person1.Name) // person1:  {kevin 18} kevin

	person2 := &Person{
		Name: "kevin",
		Age:  18,
	}
	changeName2(person2)
	fmt.Println("person2: ", person2, person2.Name) // person2:  &{ian 18} ian
}

func changeName1(p Person) {
	p.Name = "ian"
}

func changeName2(p *Person) {
	p.Name = "ian"
}
```

#### 二维矢量模拟玩家移动

在游戏中，一般使用二维矢量保存玩家的位置，使用矢量运算可以计算出玩家移动的位置，本例子中，首先实现二维矢量对象，接着构造玩家对象，最后使用矢量对象和玩家对象共同模拟玩家移动的过程。

**实现二维矢量结构:**

矢量是数学中的概念，二维矢量拥有两个方向的信息，同时可以进行加、减、乘（缩放）、距离、单位化等计算，在计算机中，使用拥有 X 和 Y 两个分量的 Vec2 结构体实现数学中二维向量的概念。

~~~go
package main
import "math"
type Vec2 struct {
    X, Y float32
}
// 加
func (v Vec2) Add(other Vec2) Vec2 {
    return Vec2{
        v.X + other.X,
        v.Y + other.Y,
    }
}
// 减
func (v Vec2) Sub(other Vec2) Vec2 {
    return Vec2{
        v.X - other.X,
        v.Y - other.Y,
    }
}
// 乘 缩放或者叫矢量乘法，是对矢量的每个分量乘上缩放比，Scale() 方法传入一个参数同时乘两个分量，表示这个缩放是一个等比缩放
func (v Vec2) Scale(s float32) Vec2 {
    return Vec2{v.X * s, v.Y * s}
}
// 距离 计算两个矢量的距离，math.Sqrt() 是开方函数，参数是 float64，在使用时需要转换，返回值也是 float64，需要转换回 float32
func (v Vec2) DistanceTo(other Vec2) float32 {
    dx := v.X - other.X
    dy := v.Y - other.Y
    return float32(math.Sqrt(float64(dx*dx + dy*dy)))
}
// 矢量单位化
func (v Vec2) Normalize() Vec2 {
    mag := v.X*v.X + v.Y*v.Y
    if mag > 0 {
        oneOverMag := 1 / float32(math.Sqrt(float64(mag)))
        return Vec2{v.X * oneOverMag, v.Y * oneOverMag}
    }
    return Vec2{0, 0}
}
~~~

**实现玩家对象：**

玩家对象负责存储玩家的当前位置、目标位置和速度，使用 MoveTo() 方法为玩家设定移动的目标，使用 Update() 方法更新玩家位置，在 Update() 方法中，通过一系列的矢量计算获得玩家移动后的新位置。

1. 使用矢量减法，将目标位置（targetPos）减去当前位置（currPos）即可计算出位于两个位置之间的新矢量
2. 使用 Normalize() 方法将方向矢量变为模为 1 的单位化矢量，这里需要将矢量单位化后才能进行后续计算
3. 获得方向后，将单位化方向矢量根据速度进行等比缩放，速度越快，速度数值越大，乘上方向后生成的矢量就越长（模很大）
4. 将缩放后的方向添加到当前位置后形成新的位置



~~~go
package main
type Player struct {
    currPos   Vec2    // 当前位置
    targetPos Vec2    // 目标位置
    speed     float32 // 移动速度
}
// 移动到某个点就是设置目标位置
//逻辑层通过这个函数告知玩家要去的目标位置，随后的移动过程由 Update() 方法负责
func (p *Player) MoveTo(v Vec2) {
    p.targetPos = v
}
// 获取当前的位置
func (p *Player) Pos() Vec2 {
    return p.currPos
}

//判断玩家是否到达目标点，玩家每次移动的半径就是速度（speed），因此，如果与目标点的距离小于速度，表示已经非常靠近目标，可以视为到达目标。
func (p *Player) IsArrived() bool {
    // 通过计算当前玩家位置与目标位置的距离不超过移动的步长，判断已经到达目标点
    return p.currPos.DistanceTo(p.targetPos) < p.speed
}
// 逻辑更新
func (p *Player) Update() {
    if !p.IsArrived() {
        // 计算出当前位置指向目标的朝向
        //数学中，两矢量相减将获得指向被减矢量的新矢量
        dir := p.targetPos.Sub(p.currPos).Normalize()
        // 添加速度矢量生成新的位置
        newPos := p.currPos.Add(dir.Scale(p.speed))
        // 移动完成后，更新当前位置
        p.currPos = newPos
    }
}
// 创建新玩家
func NewPlayer(speed float32) *Player {
    return &Player{
        speed: speed,
    }
}
~~~

**处理移动逻辑：**

将 Player 实例化后，设定玩家移动的最终目标点，之后开始进行移动的过程，这是一个不断更新位置的循环过程，每次检测玩家是否靠近目标点附近，如果还没有到达，则不断地更新位置，让玩家朝着目标点不停的修改当前位置，如下代码所示：

~~~go
package main
import "fmt"

func main() {
	// 实例化玩家对象，并设速度为0.5
	p := NewPlayer(0.5)
	// 让玩家移动到3,1点
	p.MoveTo(Vec2{3, 1})
	// 如果没有到达就一直循环
	for !p.IsArrived() {
		// 更新玩家位置
		p.Update()
		// 打印每次移动后的玩家位置
		fmt.Println(p.Pos())
	}
	fmt.Printf("到达了：%v",p.Pos())
}
~~~

## 七、任意类型添加方法

Go语言可以对任何类型添加方法，给一种类型添加方法就像给结构体添加方法一样，因为结构体也是一种类型。

**为基本类型添加方法：**

在Go语言中，使用 type 关键字可以定义出新的自定义类型，之后就可以为自定义类型添加各种方法了。我们习惯于使用面向过程的方式判断一个值是否为 0，例如：

~~~go
if  v == 0 {
    // v等于0
}
~~~

如果将 v 当做整型对象，那么判断 v 值就可以增加一个 IsZero() 方法，通过这个方法就可以判断 v 值是否为 0，例如：

~~~go
if  v.IsZero() {
    // v等于0
}
~~~

为基本类型添加方法的详细实现流程如下：

~~~go
package main
import (
    "fmt"
)
// 将int定义为MyInt类型
type MyInt int
// 为MyInt添加IsZero()方法
func (m MyInt) IsZero() bool {
    return m == 0
}
// 为MyInt添加Add()方法
func (m MyInt) Add(other int) int {
    return other + int(m)
}
func main() {
    var b MyInt
    fmt.Println(b.IsZero())
    b = 1
    fmt.Println(b.Add(2))
}
~~~

注意事项： 非本地类型不能定义方法，也就是说我们不能给别的包的类型定义方法。

## 八、结构体的匿名字段

### 1、匿名字段

结构体允许其成员字段在声明时没有字段名而只有类型，这种没有名字的字段就称为匿名字段。

```go
//Person 结构体Person类型
type Person struct {
  string
  int
}

func main() {
  p1 := Person{
    "pprof.cn",
    18,
  }
  fmt.Printf("%#v\n", p1)        //main.Person{string:"pprof.cn", int:18}
  fmt.Println(p1.string, p1.int) //pprof.cn 18
}
```

> 匿名字段默认采用类型名作为字段名，结构体要求字段名称必须唯一，因此一个结构体中同种类型的匿名字段只能有一个。

结构体可以包含一个或多个匿名（或内嵌）字段，即这些字段没有显式的名字，只有字段的类型是必须的，此时类型也就是字段的名字。

匿名字段本身可以是一个结构体类型，即结构体可以包含内嵌结构体。

Go语言中的继承是通过内嵌或组合来实现的，所以可以说，在Go语言中，相比较于继承，组合更受青睐。

~~~go
package main

import "fmt"

type User struct {
    id   int
    name string
}

type Manager struct {
    User
}

func (self *User) ToString() string { // receiver = &(Manager.User)
    return fmt.Sprintf("User: %p, %v", self, self)
}

func main() {
    m := Manager{User{1, "Tom"}}
    fmt.Printf("Manager: %p\n", &m)
    fmt.Println(m.ToString())
}
~~~

类似于重写的功能：

~~~go
package main

import "fmt"

type User struct {
    id   int
    name string
}

type Manager struct {
    User
    title string
}

func (self *User) ToString() string {
    return fmt.Sprintf("User: %p, %v", self, self)
}

func (self *Manager) ToString() string {
    return fmt.Sprintf("Manager: %p, %v", self, self)
}

func main() {
    m := Manager{User{1, "Tom"}, "Administrator"}

    fmt.Println(m.ToString())

    fmt.Println(m.User.ToString())
}
~~~

### 2、嵌入字段

```go
package main

import "fmt"

// go支持只提供类型而不写字段名的方式，也就是匿名字段，也称为嵌入字段

type Person struct {
	name string
	sex  string
	age  int
}

type Student struct {
	Person
	id   int
	addr string
}

func main() {
	// 初始化
	s1 := Student{Person{"5lmh", "man", 20}, 1, "bj"}
	fmt.Println(s1) // {{5lmh man 20} 1 bj}

	s2 := Student{Person: Person{"5lmh", "man", 20}}
	fmt.Println(s2) // {{5lmh man 20} 0 }

	s3 := Student{Person: Person{name: "5lmh"}}
	fmt.Println(s3) // {{5lmh  0} 0 }
}
```

#### 2.1 同名字段的情况

```go
package main

import "fmt"

//人
type Person struct {
  name string
  sex  string
  age  int
}

type Student struct {
  Person
  id   int
  addr string
  //同名字段
  name string
}

func main() {
  var s Student
  // 给自己字段赋值了
  s.name = "5lmh"
  fmt.Println(s)

  // 若给父类同名字段赋值，如下
  s.Person.name = "枯藤"
  fmt.Println(s)
}
```

输出结果：

```
{{  0} 0  5lmh}
{{枯藤  0} 0  5lmh}
```

**所有的内置类型和自定义类型都是可以作为匿名字段去使用**

```go
package main

import "fmt"

//人
type Person struct {
  name string
  sex  string
  age  int
}

// 自定义类型
type mystr string

// 学生
type Student struct {
  Person
  int
  mystr
}

func main() {
  s1 := Student{Person{"5lmh", "man", 18}, 1, "bj"}
  fmt.Println(s1)
}
```

输出结果：

```
{{5lmh man 18} 1 bj}
```

#### 2.2 指针类型匿名字段

```go
package main

import "fmt"

//人
type Person struct {
  name string
  sex  string
  age  int
}

// 学生
type Student struct {
  *Person
  id   int
  addr string
}

func main() {
  s1 := Student{&Person{"5lmh", "man", 18}, 1, "bj"}
  fmt.Println(s1)
  fmt.Println(s1.name)
  fmt.Println(s1.Person.name)
}
```

输出结果：

```
{0xc00005c360 1 bj}
zs
zs
```

## 九、嵌套结构体

一个结构体中可以嵌套包含另一个结构体或结构体指针。

```go
//Address 地址结构体
type Address struct {
  Province string
  City     string
}

//User 用户结构体
type User struct {
  Name    string
  Gender  string
  Address Address
}

func main() {
  user1 := User{
    Name:   "pprof",
    Gender: "女",
    Address: Address{
      Province: "黑龙江",
      City:     "哈尔滨",
    },
  }
  fmt.Printf("user1=%#v\n", user1)//user1=main.User{Name:"pprof", Gender:"女", Address:main.Address{Province:"黑龙江", City:"哈尔滨"}}
}
```

### 1、嵌套匿名结构体

```go
//Address 地址结构体
type Address struct {
  Province string
  City     string
}

//User 用户结构体
type User struct {
  Name    string
  Gender  string
  Address //匿名结构体
}

func main() {
  var user2 User
  user2.Name = "pprof"
  user2.Gender = "女"
  user2.Address.Province = "黑龙江"    //通过匿名结构体.字段名访问
  user2.City = "哈尔滨"                //直接访问匿名结构体的字段名
  fmt.Printf("user2=%#v\n", user2) //user2=main.User{Name:"pprof", Gender:"女", Address:main.Address{Province:"黑龙江", City:"哈尔滨"}}
}
```

当访问结构体成员时会先在结构体中查找该字段，找不到再去匿名结构体中查找。

### 2、嵌套结构体的字段名冲突

嵌套结构体内部可能存在相同的字段名。这个时候为了避免歧义需要指定具体的内嵌结构体的字段。

```go
//Address 地址结构体
type Address struct {
  Province   string
  City       string
  CreateTime string
}

//Email 邮箱结构体
type Email struct {
  Account    string
  CreateTime string
}

//User 用户结构体
type User struct {
  Name   string
  Gender string
  Address
  Email
}

func main() {
  var user3 User
  user3.Name = "pprof"
  user3.Gender = "女"
  // user3.CreateTime = "2019" //ambiguous selector user3.CreateTime
  user3.Address.CreateTime = "2000" //指定Address结构体中的CreateTime
  user3.Email.CreateTime = "2000"   //指定Email结构体中的CreateTime
}
```

## 十、结构体的“继承”

Go 语言中使用结构体也可以实现其他编程语言中面向对象的继承。

```go
//Animal 动物
type Animal struct {
  name string
}

func (a *Animal) move() {
  fmt.Printf("%s会动！\n", a.name)
}

//Dog 狗
type Dog struct {
  Feet    int8
  *Animal //通过嵌套匿名结构体实现继承
}

func (d *Dog) wang() {
  fmt.Printf("%s会汪汪汪~\n", d.name)
}

func main() {
  d1 := &Dog{
    Feet: 4,
    Animal: &Animal{ //注意嵌套的是结构体指针
      name: "乐乐",
    },
  }
  d1.wang() //乐乐会汪汪汪~
  d1.move() //乐乐会动！
}
```

## 十一、结构体字段的可见性

结构体中字段大写开头表示可公开访问，小写表示私有（仅在定义当前结构体的包中可访问）。

## 十二、结构体与 JSON 序列化

JSON(JavaScript Object Notation) 是一种轻量级的数据交换格式。易于人阅读和编写。同时也易于机器解析和生成。JSON 键值对是用来保存 JS 对象的一种方式，键/值对组合中的键名写在前面并用双引号""包裹，使用冒号:分隔，然后紧接着值；多个键值之间使用英文,分隔。

```go
package main

import (
	"encoding/json"
	"fmt"
)

//Student 学生
type Student struct {
	ID     int
	Gender string
	Name   string
}

//Class 班级
type Class struct {
	Title    string
	Students []*Student
}

func main() {
	c := &Class{
		Title:    "101",
		Students: make([]*Student, 0, 200),
	}
	for i := 0; i < 10; i++ {
		stu := &Student{
			Name:   fmt.Sprintf("stu%02d", i),
			Gender: "男",
			ID:     i,
		}
		c.Students = append(c.Students, stu)
	}

	//JSON序列化：结构体-->JSON格式的字符串
	data, err := json.Marshal(c)
	if err != nil {
		fmt.Println("json marshal failed")
		return
	}
	fmt.Printf("json:%s\n", data)
	/*
		json:{"Title":"101","Students":[{"ID":0,"Gender":"男","Name":"stu00"},{"ID":1,"Gender":"男","Name":"stu01"},
		{"ID":2,"Gender":"男","Name":"stu02"},{"ID":3,"Gender":"男","Name":"stu03"},{"ID":4,"Gender":"男","Namtu04"},
		{"ID":5,"Gender":"男","Name":"stu05"},{"ID":6,"Gender":"男","Name":"stu06"},{"ID":7,"Gender":"男","Name":"stu07"},
		{"ID":8,"Gender":"男","Name":"stu08"},{"ID":9,"Gender":"男","Name":"stu09"}]}
	*/

	fmt.Println("\n")

	//JSON反序列化：JSON格式的字符串-->结构体
	str := `{
		"Title":"101",
		"Students":[
		{"ID":0,"Gender":"男","Name":"stu00"},
		{"ID":1,"Gender":"男","Name":"stu01"},
		{"ID":2,"Gender":"男","Name":"stu02"},
		{"ID":3,"Gender":"男","Name":"stu03"},
		{"ID":4,"Gender":"男","Name":"stu04"},
		{"ID":5,"Gender":"男","Name":"stu05"},
		{"ID":6,"Gender":"男","Name":"stu06"},
		{"ID":7,"Gender":"男","Name":"stu07"},
		{"ID":8,"Gender":"男","Name":"stu08"},
		{"ID":9,"Gender":"男","Name":"stu09"}
		]}`
	c1 := &Class{}
	err = json.Unmarshal([]byte(str), c1)
	if err != nil {
		fmt.Println("json unmarshal failed!")
		return
	}
	fmt.Printf("%#v\n", c1)
	/*
			&main.Class{Title:"101", Students:[]*main.Student{(*main.Student)(0xc0000706c0),
		(*main.Student)(0xc0000706f0), (*main.Student)(0xc000070720), (*main.Student)(0xc000070750),
		(*main.Student)(0xc0000707b0), (*main.Student)(0xc0000707e0), (*main.Student)(0xc000070810),
		(*main.Student)(0xc000070840), (*main.Student)(0xc000070870), (*main.Student)(0xc0000708a0)}}
	*/
}
```

## 十三、结构体标签（Tag）

Tag 是结构体的元信息，可以在运行的时候通过反射的机制读取出来。

Tag 在结构体字段的后方定义，由一对反引号包裹起来，具体的格式如下：

```go
`key1:"value1" key2:"value2"`
```

结构体标签由一个或多个键值对组成。键与值使用冒号分隔，值用双引号括起来。键值对之间使用一个空格分隔。 注意事项： 为结构体编写 Tag 时，必须严格遵守键值对的规则。结构体标签的解析代码的容错能力很差，一旦格式写错，编译和运行时都不会提示任何错误，通过反射也无法正确取值。例如不要在 key 和 value 之间添加空格。

例如我们为 Student 结构体的每个字段定义 json 序列化时使用的 Tag：

```go
//Student 学生
type Student struct {
  ID     int    `json:"id"` //通过指定tag实现json序列化该字段时的key
  Gender string //json序列化是默认使用字段名作为key
  name   string //私有不能被json包访问
}

func main() {
  s1 := Student{
    ID:     1,
    Gender: "女",
    name:   "pprof",
  }
  data, err := json.Marshal(s1)
  if err != nil {
    fmt.Println("json marshal failed!")
    return
  }
  fmt.Printf("json str:%s\n", data) //json str:{"id":1,"Gender":"女"}
}
```

## 十四、结构体和方法补充知识点

因为slice和map这两种数据类型都包含了指向底层数据的指针，因此我们在需要复制它们时要特别注意。我们来看下面的例子：

```go
type Person struct {
	name   string
	age    int8
	dreams []string
}

func (p *Person) SetDreams(dreams []string) {
	p.dreams = dreams
}

func main() {
	p1 := Person{name: "小王子", age: 18}
	data := []string{"吃饭", "睡觉", "打豆豆"}
	p1.SetDreams(data)

	// 你真的想要修改 p1.dreams 吗？
	data[1] = "不睡觉"
	fmt.Println(p1.dreams)  // ?
}
```

正确的做法是在方法中使用传入的slice的拷贝进行结构体赋值。

```go
func (p *Person) SetDreams(dreams []string) {
	p.dreams = make([]string, len(dreams))
	copy(p.dreams, dreams)
}
```

同样的问题也存在于返回值slice和map的情况，在实际编码过程中一定要注意这个问题。

## 十五、小练习：

猜一下下列代码运行的结果是什么

```go
package main

import "fmt"

type student struct {
  id   int
  name string
  age  int
}

func demo(ce []student) {
  //切片是引用传递，是可以改变值的
  ce[1].age = 999
  // ce = append(ce, student{3, "xiaowang", 56})
  // return ce
}
func main() {
  var ce []student  //定义一个切片类型的结构体
  ce = []student{
    student{1, "xiaoming", 22},
    student{2, "xiaozhang", 33},
  }
  fmt.Println(ce)
  demo(ce)
  fmt.Println(ce)
}
```

### 1、删除 map 类型的结构体

```go
package main

import "fmt"

type student struct {
  id   int
  name string
  age  int
}

func main() {
  ce := make(map[int]student)
  ce[1] = student{1, "xiaolizi", 22}
  ce[2] = student{2, "wang", 23}
  fmt.Println(ce)
  delete(ce, 2)
  fmt.Println(ce)
}
```

### 2、实现 map 有序输出(面试经常问到)

```go
package main

import (
  "fmt"
  "sort"
)

func main() {
  map1 := make(map[int]string, 5)
  map1[1] = "www.topgoer.com"
  map1[2] = "rpc.topgoer.com"
  map1[5] = "ceshi"
  map1[3] = "xiaohong"
  map1[4] = "xiaohuang"
  sli := []int{}
  for k, _ := range map1 {
    sli = append(sli, k)
  }
  sort.Ints(sli)
  for i := 0; i < len(map1); i++ {
    fmt.Println(map1[sli[i]])
  }
}
```

### 3、小案例

采用切片类型的结构体接受查询数据库信息返回的参数

地址：https://github.com/lu569368/struct

## 参考

- [结构体](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/%E7%BB%93%E6%9E%84%E4%BD%93.html)
