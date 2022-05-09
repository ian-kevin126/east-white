---
title: Reflect
author: ian_kevin
date: 2022-04-19
---

# 反射

Go 是一门具有良好反射支持的静态语言。 本文将解释`reflect`标准库包中提供的反射功能。

在阅读本剩下的部分之前，最好先阅读[Go 类型系统概述](https://gfw.go101.org/article/type-system-overview.html)和[接口](https://gfw.go101.org/article/interface.html)两篇文章。

## 一、反射概述

从[上一篇文章](https://gfw.go101.org/article/generic.html)中，我们得知目前 Go 缺少自定义泛型支持。 Go 中提供的反射功能带来了很多动态特性，从而从一定程度上弥补了 Go 缺少自定义泛型而导致的不便（尽管反射比泛型的运行效率低）。 很多标准库，比如`fmt`和很多`encoding`包，均十分依赖于反射机制。

我们可以通过`reflect`库包中`Type`和`Value`两个类型提供的功能来观察不同的 Go 值。 本文下面的内容将介绍如何使用这两个类型。

### 1、变量的内在机制

Go语言中的变量是分为两部分的:

- 类型信息：预先定义好的元信息。
- 值信息：程序运行过程中可动态变化的。

### 2、反射介绍

反射是指在程序运行期对程序本身进行访问和修改的能力。程序在编译时，变量被转换为内存地址，变量名不会被编译器写入到可执行部分。在运行程序时，程序无法获取自身的信息。

支持反射的语言可以在程序编译期将变量的反射信息，如字段名称、类型信息、结构体信息等整合到可执行文件中，并给程序提供接口访问反射信息，这样就可以在程序运行期获取类型的反射信息，并且有能力修改它们。

Go程序在运行期使用reflect包访问程序的反射信息。

在上一篇博客中我们介绍了空接口。 空接口可以存储任意类型的变量，那我们如何知道这个空接口保存的数据是什么呢？ 反射就是在运行时动态的获取一个变量的类型信息和值信息。

Go 反射机制设计的目标之一是任何非反射操作都可以通过反射机制来完成。 由于各种各样的原因，此目标并没有得到 100%的实现。 但是，目前大部分的非反射操作都可以通过反射机制来完成。 另一方面，通过反射，我们也可以完成一些使用非反射操作不可能完成的操作。 不能或者只能通过反射完成的操作将在下面的讲解中提及。

### 3、reflect包

在Go语言的反射机制中，任何接口值都由是`一个具体类型`和`具体类型的值`两部分组成的(我们在上一篇接口的博客中有介绍相关概念)。 在Go语言中反射的相关功能由内置的reflect包提供，任意接口值在反射中都可以理解为由`reflect.Type`和`reflect.Value`两部分组成，并且reflect包提供了`reflect.TypeOf`和`reflect.ValueOf`两个函数来获取任意对象的Value和Type。

### 4、TypeOf

在Go语言中，使用`reflect.TypeOf()`函数可以获得任意值的类型对象（reflect.Type），程序通过类型对象可以访问任意值的类型信息。

```go
package main

import (
	"fmt"
	"reflect"
)

func reflectType(x interface{}) {
  // 我们是不知道调用这个函数的时候会传进来什么类型的变量
  // 方法一：借助类型断言
  // 方法二：借助反射
	v := reflect.TypeOf(x)
	fmt.Printf("type:%v\n", v)
}

func main() {
	var a float32 = 3.14
	reflectType(a) // type:float32
	var b int64 = 100
	reflectType(b) // type:int64
}
```

#### type name和type kind

在反射中关于类型还划分为两种：`类型（Type）`和`种类（Kind）`。因为在Go语言中我们可以使用type关键字构造很多自定义类型，而`种类（Kind）`就是指底层的类型，但在反射中，当需要区分指针、结构体等大品种的类型时，就会用到`种类（Kind）`。 举个例子，我们定义了两个指针类型和两个结构体类型，通过反射查看它们的类型和种类。

```go
package main

import (
	"fmt"
	"reflect"
)

type myInt int64

func reflectType(x interface{}) {
	t := reflect.TypeOf(x)
	fmt.Printf("type:%v kind:%v\n", t.Name(), t.Kind())
}

func main() {
	var a *float32 // 指针
	var b myInt    // 自定义类型
	var c rune     // 类型别名
	reflectType(a) // type: kind:ptr
	reflectType(b) // type:myInt kind:int64
	reflectType(c) // type:int32 kind:int32

	type person struct {
		name string
		age  int
	}
	type book struct{ title string }
	var d = person{
		name: "沙河小王子",
		age:  18,
	}
	var e = book{title: "《跟小王子学Go语言》"}
	reflectType(d) // type:person kind:struct
	reflectType(e) // type:book kind:struct
}
```

Go语言的反射中像数组、切片、Map、指针等类型的变量，它们的`.Name()`都是返回`空`。

在`reflect`包中定义的Kind类型如下：

```go
type Kind uint
const (
    Invalid Kind = iota  // 非法类型
    Bool                 // 布尔型
    Int                  // 有符号整型
    Int8                 // 有符号8位整型
    Int16                // 有符号16位整型
    Int32                // 有符号32位整型
    Int64                // 有符号64位整型
    Uint                 // 无符号整型
    Uint8                // 无符号8位整型
    Uint16               // 无符号16位整型
    Uint32               // 无符号32位整型
    Uint64               // 无符号64位整型
    Uintptr              // 指针
    Float32              // 单精度浮点数
    Float64              // 双精度浮点数
    Complex64            // 64位复数类型
    Complex128           // 128位复数类型
    Array                // 数组
    Chan                 // 通道
    Func                 // 函数
    Interface            // 接口
    Map                  // 映射
    Ptr                  // 指针
    Slice                // 切片
    String               // 字符串
    Struct               // 结构体
    UnsafePointer        // 底层指针
)
```

### 5、ValueOf

`reflect.ValueOf()`返回的是`reflect.Value`类型，其中包含了原始值的值信息。`reflect.Value`与原始值之间可以互相转换。

`reflect.Value`类型提供的获取原始值的方法如下：

|           方法           | 说明                                                         |
| :----------------------: | :----------------------------------------------------------- |
| Interface() interface {} | 将值以 interface{} 类型返回，可以通过类型断言转换为指定类型  |
|       Int() int64        | 将值以 int 类型返回，所有有符号整型均可以此方式返回          |
|      Uint() uint64       | 将值以 uint 类型返回，所有无符号整型均可以此方式返回         |
|     Float() float64      | 将值以双精度（float64）类型返回，所有浮点数（float32、float64）均可以此方式返回 |
|       Bool() bool        | 将值以 bool 类型返回                                         |
|     Bytes() []bytes      | 将值以字节数组 []bytes 类型返回                              |
|     String() string      | 将值以字符串类型返回                                         |

### 6、通过反射获取值

```go
func reflectValue(x interface{}) {
	v := reflect.ValueOf(x)
	k := v.Kind()
	switch k {
	case reflect.Int64:
		// v.Int()从反射中获取整型的原始值，然后通过int64()强制类型转换
		fmt.Printf("type is int64, value is %d\n", int64(v.Int()))
	case reflect.Float32:
		// v.Float()从反射中获取浮点型的原始值，然后通过float32()强制类型转换
		fmt.Printf("type is float32, value is %f\n", float32(v.Float()))
	case reflect.Float64:
		// v.Float()从反射中获取浮点型的原始值，然后通过float64()强制类型转换
		fmt.Printf("type is float64, value is %f\n", float64(v.Float()))
	}
}

func main() {
	var a float32 = 3.14
	var b int64 = 100
	reflectValue(a) // type is float32, value is 3.140000
	reflectValue(b) // type is int64, value is 100
	// 将int类型的原始值转换为reflect.Value类型
	c := reflect.ValueOf(10)
	fmt.Printf("type c :%T\n", c) // type c :reflect.Value
}
```

### 7、通过反射设置变量的值

想要在函数中通过反射修改变量的值，需要注意函数参数传递的是值拷贝，必须传递变量地址才能修改变量值。而反射中使用专有的`Elem()`方法来获取指针对应的值。

```go
package main

import (
	"fmt"
	"reflect"
)

func reflectSetValue1(x interface{}) {
	v := reflect.ValueOf(x)
	if v.Kind() == reflect.Int64 {
		v.SetInt(200) //修改的是副本，reflect包会引发panic
	}
}

func reflectSetValue2(x interface{}) {
	v := reflect.ValueOf(x)
	// 反射中使用 Elem()方法获取指针对应的值
	if v.Elem().Kind() == reflect.Int64 {
		v.Elem().SetInt(200)
	}
}

func main() {
	var a int64 = 100
	// reflectSetValue1(a) //panic: reflect: reflect.Value.SetInt using unaddressable value
	reflectSetValue2(&a)
	fmt.Println(a)
}
```

### 8、isNil()和isValid()

#### 8.1 isNil()

```go
func (v Value) IsNil() bool
```

`IsNil()`报告v持有的值是否为nil。v持有的值的分类必须是通道、函数、接口、映射、指针、切片之一；否则IsNil函数会导致panic。

#### 8.2 isValid()

```go
func (v Value) IsValid() bool
```

`IsValid()`返回v是否持有一个值。如果v是Value零值会返回假，此时v除了IsValid、String、Kind之外的方法都会导致panic。

#### 8.3 举个例子

`IsNil()`常被用于判断指针是否为空；`IsValid()`常被用于判定返回值是否有效。

```go
func main() {
	// *int类型空指针
	var a *int
	fmt.Println("var a *int IsNil:", reflect.ValueOf(a).IsNil())
	// nil值
	fmt.Println("nil IsValid:", reflect.ValueOf(nil).IsValid())
	// 实例化一个匿名结构体
	b := struct{}{}
	// 尝试从结构体中查找"abc"字段
	fmt.Println("不存在的结构体成员:", reflect.ValueOf(b).FieldByName("abc").IsValid())
	// 尝试从结构体中查找"abc"方法
	fmt.Println("不存在的结构体方法:", reflect.ValueOf(b).MethodByName("abc").IsValid())
	// map
	c := map[string]int{}
	// 尝试从map中查找一个不存在的键
	fmt.Println("map中不存在的键：", reflect.ValueOf(c).MapIndex(reflect.ValueOf("娜扎")).IsValid())
}
```

## 二、结构体反射

### 1、与结构体相关的方法

任意值通过`reflect.TypeOf()`获得反射对象信息后，如果它的类型是结构体，可以通过反射值对象（`reflect.Type`）的`NumField()`和`Field()`方法获得结构体成员的详细信息。

`reflect.Type`中与获取结构体成员相关的的方法如下表所示。

|                            方法                             | 说明                                                         |
| :---------------------------------------------------------: | :----------------------------------------------------------- |
|                  Field(i int) StructField                   | 根据索引，返回索引对应的结构体字段的信息。                   |
|                       NumField() int                        | 返回结构体成员字段数量。                                     |
|        FieldByName(name string) (StructField, bool)         | 根据给定字符串返回字符串对应的结构体字段的信息。             |
|            FieldByIndex(index []int) StructField            | 多层成员访问时，根据 []int 提供的每个结构体的字段索引，返回字段的信息。 |
| FieldByNameFunc(match func(string) bool) (StructField,bool) | 根据传入的匹配函数匹配需要的字段。                           |
|                       NumMethod() int                       | 返回该类型的方法集中方法的数目                               |
|                     Method(int) Method                      | 返回该类型方法集中的第i个方法                                |
|             MethodByName(string)(Method, bool)              | 根据方法名返回该类型方法集中的方法                           |

### 2、StructField类型

`StructField`类型用来描述结构体中的一个字段的信息。

`StructField`的定义如下：

```go
type StructField struct {
    // Name是字段的名字。PkgPath是非导出字段的包路径，对导出字段该字段为""。
    // 参见http://golang.org/ref/spec#Uniqueness_of_identifiers
    Name    string
    PkgPath string
    Type      Type      // 字段的类型
    Tag       StructTag // 字段的标签
    Offset    uintptr   // 字段在结构体中的字节偏移量
    Index     []int     // 用于Type.FieldByIndex时的索引切片
    Anonymous bool      // 是否匿名字段
}
```

### 3、结构体反射示例

当我们使用反射得到一个结构体数据之后可以通过索引依次获取其字段信息，也可以通过字段名去获取指定的字段信息。

```go
type student struct {
	Name  string `json:"name"`
	Score int    `json:"score"`
}

func main() {
	stu1 := student{
		Name:  "小王子",
		Score: 90,
	}

	t := reflect.TypeOf(stu1)
	fmt.Println(t.Name(), t.Kind()) // student struct
	// 通过for循环遍历结构体的所有字段信息
	for i := 0; i < t.NumField(); i++ {
		field := t.Field(i)
		fmt.Printf("name:%s index:%d type:%v json tag:%v\n", field.Name, field.Index, field.Type, field.Tag.Get("json"))
	}

	// 通过字段名获取指定结构体字段信息
	if scoreField, ok := t.FieldByName("Score"); ok {
		fmt.Printf("name:%s index:%d type:%v json tag:%v\n", scoreField.Name, scoreField.Index, scoreField.Type, scoreField.Tag.Get("json"))
	}
}
```

接下来编写一个函数`printMethod(s interface{})`来遍历打印s包含的方法。

```go
// 给student添加两个方法 Study和Sleep(注意首字母大写)
func (s student) Study() string {
	msg := "好好学习，天天向上。"
	fmt.Println(msg)
	return msg
}

func (s student) Sleep() string {
	msg := "好好睡觉，快快长大。"
	fmt.Println(msg)
	return msg
}

func printMethod(x interface{}) {
	t := reflect.TypeOf(x)
	v := reflect.ValueOf(x)

	fmt.Println(t.NumMethod())
	for i := 0; i < v.NumMethod(); i++ {
		methodType := v.Method(i).Type()
		fmt.Printf("method name:%s\n", t.Method(i).Name)
		fmt.Printf("method:%s\n", methodType)
		// 通过反射调用方法传递的参数必须是 []reflect.Value 类型
		var args = []reflect.Value{}
		v.Method(i).Call(args)
	}
}
```

### 4、反射是把双刃剑

反射是一个强大并富有表现力的工具，能让我们写出更灵活的代码。但是反射不应该被滥用，原因有以下三个。

1. 基于反射的代码是极其脆弱的，反射中的类型错误会在真正运行的时候才会引发panic，那很可能是在代码写完的很长时间之后。
2. 大量使用反射的代码通常难以理解。
3. 反射的性能低下，基于反射实现的代码通常比正常代码运行速度慢一到两个数量级。

## 三、类型和值

### 1、`reflect.Type`

通过调用`reflect.TypeOf`函数，我们可以从一个任何非接口类型的值创建一个`reflect.Type`值。 此`reflect.Type`值表示着此非接口值的类型。通过此值，我们可以得到很多此非接口类型的信息。 当然，我们也可以将一个接口值传递给一个`reflect.TypeOf`函数调用，但是此调用将返回一个表示着此接口值的动态类型的`reflect.Type`值。 实际上，`reflect.TypeOf`函数的唯一参数的类型为`interface{}`， `reflect.TypeOf`函数将总是返回一个表示着此唯一接口参数值的动态类型的`reflect.Type`值。 那如何得到一个表示着某个接口类型的`reflect.Type`值呢？ 我们必须通过下面将要介绍的一些间接途径来达到这一目的。

类型`reflect.Type`为一个接口类型，它指定了[若干方法](https://golang.google.cn/pkg/reflect/#Type)。 通过这些方法，我们能够观察到一个`reflect.Type`值所表示的 Go 类型的各种信息。 这些方法中的有些适用于[所有种类](https://golang.google.cn/pkg/reflect/#Kind)的类型，有些只适用于一种或几种类型。 通过不合适的`reflect.Type`属主值调用某个方法将在运行时产生一个恐慌。 请阅读`reflect`代码库中各个方法的文档来获取如何正确地使用这些方法。

一个例子：

```go
package main

import "fmt"
import "reflect"

func main() {
  type A = [16]int16
  var c <-chan map[A][]byte
  tc := reflect.TypeOf(c)
  fmt.Println(tc.Kind())    // chan
  fmt.Println(tc.ChanDir()) // <-chan
  tm := tc.Elem()
  ta, tb := tm.Key(), tm.Elem()
  fmt.Println(tm.Kind(), ta.Kind(), tb.Kind()) // map array slice
  tx, ty := ta.Elem(), tb.Elem()

  // byte是uint8类型的别名。
  fmt.Println(tx.Kind(), ty.Kind()) // int16 uint8
  fmt.Println(tx.Bits(), ty.Bits()) // 16 8
  fmt.Println(tx.ConvertibleTo(ty)) // true
  fmt.Println(tb.ConvertibleTo(ta)) // false

  // 切片类型和映射类型都是不可比较类型。
  fmt.Println(tb.Comparable()) // false
  fmt.Println(tm.Comparable()) // false
  fmt.Println(ta.Comparable()) // true
  fmt.Println(tc.Comparable()) // true
}
```

目前，Go 支持[26 种种类的类型](https://golang.google.cn/pkg/reflect/#Kind)。

在上面这个例子中，我们使用方法`Elem`来得到某些类型的元素类型。 实际上，此方法也可以用来得到一个指针类型的基类型。一个例子：

```go
package main

import "fmt"
import "reflect"

type T []interface{m()}
func (T) m() {}

func main() {
	tp := reflect.TypeOf(new(interface{}))
	tt := reflect.TypeOf(T{})
	fmt.Println(tp.Kind(), tt.Kind()) // ptr slice

	// 使用间接的方法得到表示两个接口类型的reflect.Type值。
	ti, tim := tp.Elem(), tt.Elem()
	fmt.Println(ti.Kind(), tim.Kind()) // interface interface

	fmt.Println(tt.Implements(tim))  // true
	fmt.Println(tp.Implements(tim))  // false
	fmt.Println(tim.Implements(tim)) // true

	// 所有的类型都实现了任何空接口类型。
	fmt.Println(tp.Implements(ti))  // true
	fmt.Println(tt.Implements(ti))  // true
	fmt.Println(tim.Implements(ti)) // true
	fmt.Println(ti.Implements(ti))  // true
}
```

上面这个例子同时也展示了如何通过间接的途径得到一个表示一个接口类型的`reflect.Type`值。

我们可以通过反射列出一个类型的所有方法和一个结构体类型的所有（导出和非导出）字段的类型。 我们也可以通过反射列出一个函数类型的各个输入参数和返回结果类型。

```go
package main

import "fmt"
import "reflect"

type F func(string, int) bool
func (f F) m(s string) bool {
	return f(s, 32)
}
func (f F) M() {}

type I interface{m(s string) bool; M()}

func main() {
	var x struct {
		F F
		i I
	}
	tx := reflect.TypeOf(x)
	fmt.Println(tx.Kind())        // struct
	fmt.Println(tx.NumField())    // 2
	fmt.Println(tx.Field(1).Name) // i
	// 包路径（PkgPath）是非导出字段（或者方法）的内在属性。
	fmt.Println(tx.Field(0).PkgPath) //
	fmt.Println(tx.Field(1).PkgPath) // main

	tf, ti := tx.Field(0).Type, tx.Field(1).Type
	fmt.Println(tf.Kind())               // func
	fmt.Println(tf.IsVariadic())         // false
	fmt.Println(tf.NumIn(), tf.NumOut()) // 2 1
	t0, t1, t2 := tf.In(0), tf.In(1), tf.Out(0)
	// 下一行打印出：string int bool
	fmt.Println(t0.Kind(), t1.Kind(), t2.Kind())

	fmt.Println(tf.NumMethod(), ti.NumMethod()) // 1 2
	fmt.Println(tf.Method(0).Name)              // M
	fmt.Println(ti.Method(1).Name)              // m
	_, ok1 := tf.MethodByName("m")
	_, ok2 := ti.MethodByName("m")
	fmt.Println(ok1, ok2) // false true
}
```

从上面这个例子我们可以看出：

1. 对于非接口类型，`reflect.Type.NumMethod`方法只返回一个类型的所有导出的方法（包括通过内嵌得来的隐式方法）的个数，并且 方法`reflect.Type.MethodByName`不能用来获取一个类型的非导出方法； 而对于接口类型，则并无这些限制（Go 1.16 之前的文档对这两个方法的描述不准确，并没有体现出这个差异）。 此情形同样存在于下一节将要介绍的`reflect.Value`类型上的相应方法。
2. 虽然`reflect.Type.NumField`方法返回一个结构体类型的所有字段（包括非导出字段）的数目，但是[不推荐](https://golang.org/pkg/reflect/#pkg-note-BUG)使用方法`reflect.Type.FieldByName`来获取非导出字段。

我们可以[通过反射来检视结构体字段的标签信息](https://golang.org/pkg/reflect/#StructTag)。 结构体字段标签的类型为`reflect.StructTag`，它的方法`Get`和`Lookup`用来检视字段标签中的键值对。 一个例子：

```go
package main

import "fmt"
import "reflect"

type T struct {
	X    int  `max:"99" min:"0" default:"0"`
	Y, Z bool `optional:"yes"`
}

func main() {
	t := reflect.TypeOf(T{})
	x := t.Field(0).Tag
	y := t.Field(1).Tag
	z := t.Field(2).Tag
	fmt.Println(reflect.TypeOf(x)) // reflect.StructTag
	// v的类型为string
	v, present := x.Lookup("max")
	fmt.Println(len(v), present)      // 2 true
	fmt.Println(x.Get("max"))         // 99
	fmt.Println(x.Lookup("optional")) //  false
	fmt.Println(y.Lookup("optional")) // yes true
	fmt.Println(z.Lookup("optional")) // yes true
}
```

注意：

- 键值对中的键不能包含空格（Unicode 值为 32）、双引号（Unicode 值为 34）和冒号（Unicode 值为 58）。
- 为了形成键值对，所设想的键值对形式中的冒号的后面不能紧跟着空格字符。所以
  `optional: "yes"`不形成键值对。
- 键值对中的值中的空格不会被忽略。所以
  `json:"author, omitempty“`、
  `json:" author,omitempty“`以及
  `json:"author,omitempty“`各不相同。
- 每个字段标签应该呈现为单行才能使它的整个部分都对键值对的形成有贡献。

`reflect`代码包也提供了一些其它函数来动态地创建出来一些非定义组合类型。

```go
package main

import "fmt"
import "reflect"

func main() {
	ta := reflect.ArrayOf(5, reflect.TypeOf(123))
	fmt.Println(ta) // [5]int
	tc := reflect.ChanOf(reflect.SendDir, ta)
	fmt.Println(tc) // chan<- [5]int
	tp := reflect.PtrTo(ta)
	fmt.Println(tp) // *[5]int
	ts := reflect.SliceOf(tp)
	fmt.Println(ts) // []*[5]int
	tm := reflect.MapOf(ta, tc)
	fmt.Println(tm) // map[[5]int]chan<- [5]int
	tf := reflect.FuncOf([]reflect.Type{ta},
				[]reflect.Type{tp, tc}, false)
	fmt.Println(tf) // func([5]int) (*[5]int, chan<- [5]int)
	tt := reflect.StructOf([]reflect.StructField{
		{Name: "Age", Type: reflect.TypeOf("abc")},
	})
	fmt.Println(tt)            // struct { Age string }
	fmt.Println(tt.NumField()) // 1
}
```

上面的例子并未展示和`reflect.Type`相关的所有函数和方法。 请阅读`reflect`标准库代码包的文档以获取如何使用这些函数和方法。

注意，到目前为止（Go 1.17），我们无法通过反射动态创建一个接口类型。这是 Go 反射目前的一个限制。

另一个限制是使用反射动态创建结构体类型的时候可能会有各种不完美的情况出现。

第三个限制是我们无法通过反射来声明一个新的类型。

### 2、`reflect.Value`

类似的，我们可以通过调用`reflect.ValueOf`函数，从一个非接口类型的值创建一个`reflect.Value`值。 此`reflect.Value`值代表着此非接口值。 和`reflect.TypeOf`函数类似，`reflect.ValueOf`函数也只有一个`interface{}`类型的参数。 当我们将一个接口值传递给一个`reflect.ValueOf`函数调用时，此调用返回的是代表着此接口值的动态值的一个`reflect.Value`值。 我们必须通过间接的途径获得一个代表一个接口值的`reflect.Value`值。

被一个`reflect.Value`值代表着的值常称为此`reflect.Value`值的底层值（underlying value）。

`reflect.Value`类型有[很多方法](https://golang.google.cn/pkg/reflect/)。 我们可以调用这些方法来观察和操纵一个`reflect.Value`属主值表示的 Go 值。 这些方法中的有些适用于所有种类类型的值，有些只适用于一种或几种类型的值。 通过不合适的`reflect.Value`属主值调用某个方法将在运行时产生一个恐慌。 请阅读`reflect`代码库中各个方法的文档来获取如何正确地使用这些方法。

一个`reflect.Value`值的`CanSet`方法将返回此`reflect.Value`值代表的 Go 值是否可以被修改（可以被赋值）。 如果一个 Go 值可以被修改，则我们可以调用对应的`reflect.Value`值的`Set`方法来修改此 Go 值。 注意：`reflect.ValueOf`函数直接返回的`reflect.Value`值都是不可修改的。

一个例子：

```go
package main

import "fmt"
import "reflect"

func main() {
	n := 123
	p := &n
	vp := reflect.ValueOf(p)
	fmt.Println(vp.CanSet(), vp.CanAddr()) // false false
	vn := vp.Elem() // 取得vp的底层指针值引用的值的代表值
	fmt.Println(vn.CanSet(), vn.CanAddr()) // true true
	vn.Set(reflect.ValueOf(789)) // <=> vn.SetInt(789)
	fmt.Println(n)               // 789
}
```

一个结构体值的非导出字段不能通过反射来修改。

```go
package main

import "fmt"
import "reflect"

func main() {
	var s struct {
		X interface{} // 一个导出字段
		y interface{} // 一个非导出字段
	}
	vp := reflect.ValueOf(&s)
	// 如果vp代表着一个指针，下一行等价于"vs := vp.Elem()"。
	vs := reflect.Indirect(vp)
	// vx和vy都各自代表着一个接口值。
	vx, vy := vs.Field(0), vs.Field(1)
	fmt.Println(vx.CanSet(), vx.CanAddr()) // true true
	// vy is addressable but not modifiable.
	fmt.Println(vy.CanSet(), vy.CanAddr()) // false true
	vb := reflect.ValueOf(123)
	vx.Set(vb)     // okay, 因为vx代表的值是可修改的。
	// vy.Set(vb)  // 会造成恐慌，因为vy代表的值是不可修改的。
	fmt.Println(s) // {123
	fmt.Println(vx.IsNil(), vy.IsNil()) // false true
}
```

上例中同时也展示了如何间接地获取底层值为接口值的`reflect.Value`值。

从上两例中，我们可以得知有两种方法获取一个代表着一个指针所引用着的值的`reflect.Value`值：

1. 通过调用代表着此指针值的`reflect.Value`值的`Elem`方法。
2. 将代表着此指针值的`reflect.Value`值的传递给一个`reflect.Indirect`函数调用。 （如果传递给一个`reflect.Indirect`函数调用的实参不代表着一个指针值，则此调用返回此实参的一个复制。）

注意：`reflect.Value.Elem`方法也可以用来获取一个代表着一个接口值的动态值的`reflect.Value`值，比如下例中所示。

```go
package main

import "fmt"
import "reflect"

func main() {
	var z = 123
	var y = &z
	var x interface{} = y
	v := reflect.ValueOf(&x)
	vx := v.Elem()
	vy := vx.Elem()
	vz := vy.Elem()
	vz.Set(reflect.ValueOf(789))
	fmt.Println(z) // 789
}
```

`reflect`标准库包中也提供了一些对应着内置函数或者各种非反射功能的函数。 下面这个例子展示了如何利用这些函数将一个自定义泛型函数绑定到不同的类型的函数值上。

```go
package main

import "fmt"
import "reflect"

func InvertSlice(args []reflect.Value) []reflect.Value {
	inSlice, n := args[0], args[0].Len()
	outSlice := reflect.MakeSlice(inSlice.Type(), 0, n)
	for i := n-1; i >= 0; i-- {
		element := inSlice.Index(i)
		outSlice = reflect.Append(outSlice, element)
	}
	return []reflect.Value{outSlice}
}

func Bind(p interface{},
		f func ([]reflect.Value) []reflect.Value) {
	// invert代表着一个函数值。
	invert := reflect.ValueOf(p).Elem()
	invert.Set(reflect.MakeFunc(invert.Type(), f))
}

func main() {
	var invertInts func([]int) []int
	Bind(&invertInts, InvertSlice)
	fmt.Println(invertInts([]int{2, 3, 5})) // [5 3 2]

	var invertStrs func([]string) []string
	Bind(&invertStrs, InvertSlice)
	fmt.Println(invertStrs([]string{"Go", "C"})) // [C Go]
}
```

如果一个`reflect.Value`值的底层值为一个函数值，则我们可以调用此`reflect.Value`值的`Call`方法来调用此函数。 每个`Call`方法调用接受一个`[]reflect.Value`类型的参数（表示传递给相应函数调用的各个实参）并返回一个同类型结果（表示相应函数调用返回的各个结果）。

```go
package main

import "fmt"
import "reflect"

type T struct {
	A, b int
}

func (t T) AddSubThenScale(n int) (int, int) {
	return n * (t.A + t.b), n * (t.A - t.b)
}

func main() {
	t := T{5, 2}
	vt := reflect.ValueOf(t)
	vm := vt.MethodByName("AddSubThenScale")
	results := vm.Call([]reflect.Value{reflect.ValueOf(3)})
	fmt.Println(results[0].Int(), results[1].Int()) // 21 9

	neg := func(x int) int {
		return -x
	}
	vf := reflect.ValueOf(neg)
	fmt.Println(vf.Call(results[:1])[0].Int()) // -21
	fmt.Println(vf.Call([]reflect.Value{
		vt.FieldByName("A"), // 如果是字段b，则造成恐慌
	})[0].Int()) // -5
}
```

请注意：非导出结构体字段值不能用做反射函数调用中的实参。 如果上例中的`vt.FieldByName("A")`被替换为`vt.FieldByName("b")`，则将产生一个恐慌。

下面是一个使用映射反射值的例子。

```go
package main

import "fmt"
import "reflect"

func main() {
	valueOf := reflect.ValueOf
	m := map[string]int{"Unix": 1973, "Windows": 1985}
	v := valueOf(m)
	// 第二个实参为Value零值时，表示删除一个映射条目。
	v.SetMapIndex(valueOf("Windows"), reflect.Value{})
	v.SetMapIndex(valueOf("Linux"), valueOf(1991))
	for i := v.MapRange(); i.Next(); {
		fmt.Println(i.Key(), "\t:", i.Value())
	}
}
```

注意：方法`reflect.Value.MapRange`方法是从 Go 1.12 开始才支持的。

下面是一个使用通道反射值的例子。

```go
package main

import "fmt"
import "reflect"

func main() {
	c := make(chan string, 2)
	vc := reflect.ValueOf(c)
	vc.Send(reflect.ValueOf("C"))
	succeeded := vc.TrySend(reflect.ValueOf("Go"))
	fmt.Println(succeeded) // true
	succeeded = vc.TrySend(reflect.ValueOf("C++"))
	fmt.Println(succeeded) // false
	fmt.Println(vc.Len(), vc.Cap()) // 2 2
	vs, succeeded := vc.TryRecv()
	fmt.Println(vs.String(), succeeded) // C true
	vs, sentBeforeClosed := vc.Recv()
	fmt.Println(vs.String(), sentBeforeClosed) // Go false
	vs, succeeded = vc.TryRecv()
	fmt.Println(vs.String()) //
	fmt.Println(succeeded)   // false
}
```

`reflect.Value`类型的`TrySend`和`TryRecv`方法对应着只有一个`case`分支和一个`default`分支的[`select`流程控制代码块](https://gfw.go101.org/article/channel.html#select)。

我们可以使用`reflect.Select`函数在运行时刻来模拟具有不定`case`分支数量的`select`流程控制代码块。

```go
package main

import "fmt"
import "reflect"

func main() {
	c := make(chan int, 1)
	vc := reflect.ValueOf(c)
	succeeded := vc.TrySend(reflect.ValueOf(123))
	fmt.Println(succeeded, vc.Len(), vc.Cap()) // true 1 1

	vSend, vZero := reflect.ValueOf(789), reflect.Value{}
	branches := []reflect.SelectCase{
		{Dir: reflect.SelectDefault, Chan: vZero, Send: vZero},
		{Dir: reflect.SelectRecv, Chan: vc, Send: vZero},
		{Dir: reflect.SelectSend, Chan: vc, Send: vSend},
	}
	selIndex, vRecv, sentBeforeClosed := reflect.Select(branches)
	fmt.Println(selIndex)         // 1
	fmt.Println(sentBeforeClosed) // true
	fmt.Println(vRecv.Int())      // 123
	vc.Close()
	// 再模拟一次select流程控制代码块。因为vc已经关闭了，
	// 所以需将最后一个case分支去除，否则它可能会造成一个恐慌。
	selIndex, _, sentBeforeClosed = reflect.Select(branches[:2])
	fmt.Println(selIndex, sentBeforeClosed) // 1 false
}
```

一些`reflect.Value`值可能表示着不合法的 Go 值。 这样的值为`reflect.Value`类型的零值（即没有底层值的`reflect.Value`值）。

```go
package main

import "reflect"
import "fmt"

func main() {
	var z reflect.Value // 一个reflect.Value零值
	fmt.Println(z)      //
	v := reflect.ValueOf((*int)(nil)).Elem()
	fmt.Println(v)      //
	fmt.Println(v == z) // true
	var i = reflect.ValueOf([]interface{}{nil}).Index(0)
	fmt.Println(i)             //
	fmt.Println(i.Elem())      //
	fmt.Println(i.Elem() == z) // true
}
```

从上面的例子中，我们知道，使用空接口`interface{}`值做为中介，一个 Go 值可以转换为一个`reflect.Value`值。 逆过程类似，通过调用一个`reflect.Value`值的`Interface`方法得到一个`interface{}`值，然后将此`interface{}`断言为原来的 Go 值。 但是，请注意，调用一个代表着非导出字段的`reflect.Value`值的`Interface`方法将导致一个恐慌。

```go
package main

import (
	"fmt"
	"reflect"
	"time"
)

func main() {
	vx := reflect.ValueOf(123)
	vy := reflect.ValueOf("abc")
	vz := reflect.ValueOf([]bool{false, true})
	vt := reflect.ValueOf(time.Time{})

	x := vx.Interface().(int)
	y := vy.Interface().(string)
	z := vz.Interface().([]bool)
	m := vt.MethodByName("IsZero").Interface().(func() bool)
	fmt.Println(x, y, z, m()) // 123 abc [false true] true

	type T struct {x int}
	t := &T{3}
	v := reflect.ValueOf(t).Elem().Field(0)
	fmt.Println(v)             // 3
	fmt.Println(v.Interface()) // panic
}
```

`Value.IsZero`方法是 Go 1.13 中引进的，此方法用来查看一个值是否为零值。

从 Go 1.17 开始，[一个切片可以被转化为一个相同元素类型的数组的指针类型](https://gfw.go101.org/article/container.html#slice-to-array-pointer)。 但是如果在这样的一个转换中数组类型的长度过长，将导致恐慌产生。 因此 Go 1.17 同时引入了一个`Value.CanConvert(T Type)`方法，用来检查一个转换是否会成功（即不会产生恐慌）。

一个使用了`CanConvert`方法的例子：

```go
package main

import (
	"fmt"
	"reflect"
)

func main() {
	s := reflect.ValueOf([]int{1, 2, 3, 4, 5})
	ts := s.Type()
	t1 := reflect.TypeOf(&[5]int{})
	t2 := reflect.TypeOf(&[6]int{})
	fmt.Println(ts.ConvertibleTo(t1)) // true
	fmt.Println(ts.ConvertibleTo(t2)) // true
	fmt.Println(s.CanConvert(t1))     // true
	fmt.Println(s.CanConvert(t2))     // false
}
```



## 参考

- [Go 反射](https://gfw.go101.org/article/reflection.html)
- [Go 通关 08：断言、反射的理解与使用！](https://mp.weixin.qq.com/s?__biz=Mzk0NzI3Mjk1Mg==&mid=2247484506&idx=1&sn=bbce6d455af7ee6ea8be738abdb18dba&source=41#wechat_redirect)
- [Go 语言：运行时反射，深度解析！](https://segmentfault.com/a/1190000040396513)
- [go-talent 反射机制](https://github.com/datawhalechina/go-talent/blob/master/10.%E5%8F%8D%E5%B0%84%E6%9C%BA%E5%88%B6.md)
- [Go语言基础之反射](https://www.liwenzhou.com/posts/Go/13_reflect/)
