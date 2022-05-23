---
title: 函数
author: ian_kevin
date: 2022-04-19
---

# 函数

## 一、函数定义

### 1、golang 函数特点

- 无需声明原型。
- 支持不定变参。
- 支持多返回值。
- 支持命名返回参数。
- 支持匿名函数和闭包。
- 函数也是一种类型，一个函数可以赋值给变量。



- 不支持 嵌套 (nested) 一个包不能有两个名字一样的函数。
- 不支持 重载 (overload)
- 不支持 默认参数 (default parameter)。

### 2、函数声明

Go语言中定义函数使用`func`关键字，函数声明包含一个函数名，参数列表， 返回值列表和函数体。如果函数没有返回值，则返回列表可以省略。函数从第一条语句开始执行，直到执行 return 语句或者执行函数的最后一条语句。

- 函数可以没有参数或接受多个参数

- 类型在变量名之后 

- 当两个或多个连续的函数命名参数是同一类型，则除了最后一个类型之外，其他都可以省略

- 函数可以返回任意数量的返回值



具体格式如下：

```go
func function_name( [parameter list] ) [return_types] {
   函数体
}
```

其中：

- func：函数由 func 开始声明
- function_name：函数名称，函数名和参数列表一起构成了函数签名。
- parameter list：参数列表，参数就像一个占位符，当函数被调用时，你可以将值传递给参数，这个值被称为`实际参数`。参数列表指定的是参数类型、顺序、及参数个数。参数是可选的，也就是说函数也可以不包含参数。
- return_types：`返回类型，函数返回一列值`。return_types 是该列值的数据类型。有些功能不需要返回值，这种情况下 return_types 不是必须的。
- 函数体：函数定义的代码集合。

> Go语言是编译型语言，所以函数编写的顺序是无关紧要的，鉴于可读性的需求，最好把 main() 函数写在文件的前面，其他函数按照一定逻辑顺序进行编写（例如函数被调用的顺序）。

我们先来定义一个求两个数之和的函数：

```go
func intSum(x int, y int) int {
	return x + y
}
```

函数的参数和返回值都是可选的，例如我们可以实现一个既不需要参数也没有返回值的函数：

```go
func sayHello() {
	fmt.Println("Hello world")
}
```

使用关键字 func 定义函数，左大括号依旧不能另起一行。

```go
func test(x, y int, s string) (int, string) {
  // 类型相同的相邻参数，参数类型可合并。 多返回值必须用括号。
  n := x + y
  return n, fmt.Sprintf(s, n)
}
```

函数是第一类对象，可作为参数传递。建议将复杂签名定义为函数类型，以便于阅读。

```go
package main

import "fmt"

func test(fn func() int) int {
  return fn()
}

// 定义函数类型
type FormatFunc func(s string, x, y int) string

func format(fn FormatFunc, s string, x, y int) string {
  return fn(s, x, y)
}

func main() {
  s1 := test(func() int { return 100 }) // 直接将匿名函数当参数。

  s2 := format(func(s string, x, y int) string {
    return fmt.Sprintf(s, x, y)
  }, "%d, %d", 10, 20)

  println(s1, s2)
}
```

输出结果：

```go
100 10, 20
```

有返回值的函数，必须有明确的终止语句，否则会引发编译错误。

你可能会偶尔遇到没有函数体的函数声明，这表示该函数不是以 Go 实现的。这样的声明定义了函数标识符。

```go
package math

func Sin(x float64) float //implemented in assembly language
```

### 3、函数的调用

定义了函数之后，我们可以通过`函数名()`的方式调用函数。 例如我们调用上面定义的两个函数，代码如下：

```go
func main() {
	sayHello()
	ret := intSum(10, 20)
	fmt.Println(ret)
}
```

注意，调用有返回值的函数时，可以不接收其返回值。

## 二、函数参数

### 1、类型简写

函数的参数中如果相邻变量的类型相同，则可以省略类型，例如：

```go
func intSum(x, y int) int {
	return x + y
}
```

上面的代码中，`intSum`函数有两个参数，这两个参数的类型均为`int`，因此可以省略`x`的类型，因为`y`后面有类型说明，`x`参数也是该类型。

### 2、可变参数

可变参数是指函数的参数数量不固定。Go语言中的可变参数通过在参数名后加`...`来标识。

注意：可变参数通常要作为函数的最后一个参数。

举个例子：

```go
func intSum2(x ...int) int {
	fmt.Println(x) //x是一个切片
	sum := 0
	for _, v := range x {
		sum = sum + v
	}
	return sum
}
```

调用上面的函数：

```go
ret1 := intSum2()
ret2 := intSum2(10)
ret3 := intSum2(10, 20)
ret4 := intSum2(10, 20, 30)
fmt.Println(ret1, ret2, ret3, ret4) //0 10 30 60
```

固定参数搭配可变参数使用时，可变参数要放在固定参数的后面，示例代码如下：

```go
func intSum3(x int, y ...int) int {
	fmt.Println(x, y)
	sum := x
	for _, v := range y {
		sum = sum + v
	}
	return sum
}
```

调用上述函数：

```go
ret5 := intSum3(100)
ret6 := intSum3(100, 10)
ret7 := intSum3(100, 10, 20)
ret8 := intSum3(100, 10, 20, 30)
fmt.Println(ret5, ret6, ret7, ret8) //100 110 130 160
```

本质上，函数的可变参数是通过切片来实现的。

### 3、参数传递

函数定义时指出，函数定义时有参数，该变量可称为函数的形参。形参就像定义在函数体内的局部变量。

但当调用函数，传递过来的变量就是函数的实参，函数可以通过两种方式来传递参数：

#### 3.1 值传递

指在调用函数时将实际参数复制一份传递到函数中，这样在函数中如果对参数进行修改，将不会影响到实际参数。

```go
func swap(x, y int) int {
  ... ...
}
```

#### 3.2 参数值传递

指在调用函数时将实际参数的地址传递到函数中，那么在函数中对参数所进行的修改，将影响到实际参数。

```go
package main

import (
  "fmt"
)

/* 定义相互交换值的函数 */
func swap(x, y *int) {
  var temp int

  temp = *x /* 保存 x 的值 */
  *x = *y   /* 将 y 值赋给 x */
  *y = temp /* 将 temp 值赋给 y*/

}

func main() {
  var a, b int = 1, 2
  /*
        调用 swap() 函数
        &a 指向 a 指针，a 变量的地址
        &b 指向 b 指针，b 变量的地址
    */
  swap(&a, &b)

  fmt.Println(a, b)
}
```

输出结果：

```go
2 1
```

在默认情况下，Go 语言使用的是值传递，即在调用过程中不会影响到实际参数。

> 注意 1：无论是值传递，还是引用传递，传递给函数的都是变量的副本，不过，值传递是值的拷贝。引用传递是地址的拷贝，一般来说，地址拷贝更为高效。而值拷贝取决于拷贝的对象大小，对象越大，则性能越低。

> 注意 2：map、slice、chan、指针、interface 默认以引用的方式传递。

不定参数传值 就是函数的参数不是固定的，后面的类型是固定的。（可变参数）

Golang 可变参数本质上就是 slice。只能有一个，且必须是最后一个。

在参数赋值时可以不用用一个一个的赋值，可以直接传递一个数组或者切片，特别注意的是在参数后加上“…”即可。

```go
func myfunc(args ...int) {    //0个或多个参数
}

func add(a int, args…int) int {    //1个或多个参数
}

func add(a int, b int, args…int) int {    //2个或多个参数
}
```

> 注意：其中 args 是一个 slice，我们可以通过 arg[index]依次访问所有参数,通过 len(arg)来判断传递参数的个数.

任意类型的不定参数： 就是函数的参数和每个参数的类型都不是固定的。

用 interface{}传递任意类型数据是 Go 语言的惯例用法，而且 interface{}是类型安全的。

```go
func myfunc(args ...interface{}) {}
```

代码：

```go
package main

import (
  "fmt"
)

func test(s string, n ...int) string {
  var x int
  for _, i := range n {
    x += i
  }

  return fmt.Sprintf(s, x)
}

func main() {
  println(test("sum: %d", 1, 2, 3))
}
```

输出结果：

```go
sum: 6
```

使用 slice 对象做变参时，必须展开。`（slice...）`

```go
package main

import (
  "fmt"
)

func test(s string, n ...int) string {
  var x int
  for _, i := range n {
    x += i
  }

  return fmt.Sprintf(s, x)
}

func main() {
  s := []int{1, 2, 3}
  res := test("sum: %d", s...)    // slice... 展开slice
  println(res)
}
```

## 三、函数返回值

Go语言中通过`return`关键字向外输出返回值。

### 1、多返回值

> Go语言中函数支持多返回值，函数如果有多个返回值时必须用`()`将所有返回值包裹起来。

~~~go
//多个返回值 用括号扩起来
func sum(a,b int) (int,int)  {
	return a,b
}
func main(){
    a,b := sum(2,3)
	fmt.Println(a,b)
}
~~~

~~~go
package main

import "fmt"
//支持返回值 命名 ，默认值为类型零值,命名返回参数可看做与形参类似的局部变量,由return隐式返回
func f1() (names []string, m map[string]int, num int) {
   m = make(map[string]int)
   m["k1"] = 2

   return
}

func main() {
   a, b, c := f1()
   fmt.Println(a, b, c)
}
~~~

### 2、返回值命名

函数定义时可以给返回值命名，并在函数体中直接使用这些变量，最后通过`return`关键字返回。

例如：

```go
func calc(x, y int) (sum, sub int) {
	sum = x + y
	sub = x - y
	return
}
```

### 3、返回值补充

当我们的一个函数返回值类型为slice时，nil可以看做是一个有效的slice，没必要显示返回一个长度为0的切片。

```go
func someFunc(x string) []int {
	if x == "" {
		return nil // 没必要返回[]int{}
	}
	...
}
```

### 4、函数返回值

- `"_"`标识符，用来忽略函数的某个返回值
- Go 的返回值可以被命名，并且就像在函数体开头声明的变量那样使用。

- 返回值的名称应当具有一定的意义，可以作为文档使用。

- 没有参数的 return 语句返回各个返回变量的当前值。这种用法被称作“裸”返回。




直接返回语句仅应当用在像下面这样的短函数中。在长的函数中它们会影响代码的可读性。

```go
package main

import (
  "fmt"
)

func add(a, b int) (c int) {
  c = a + b
  return
}

func calc(a, b int) (sum int, avg int) {
  sum = a + b
  avg = (a + b) / 2

  return
}

func main() {
  var a, b int = 1, 2
  c := add(a, b)
  sum, avg := calc(a, b)
  fmt.Println(a, b, c, sum, avg)
}
```

输出结果：

```go
1 2 3 3 1
```

Golang 返回值不能用容器对象接收多返回值。只能用多个变量，或 `"_"` 忽略。

```go
package main

func test() (int, int) {
  return 1, 2
}

func main() {
  // s := make([]int, 2)
  // s = test()   // Error: multiple-value test() in single-value context

  x, _ := test()
  println(x)
}
```

输出结果：

```go
1
```

多返回值可直接作为其他函数调用实参。

```go
package main

func test() (int, int) {
  return 1, 2
}

func add(x, y int) int {
  return x + y
}

func sum(n ...int) int {
  var x int
  for _, i := range n {
    x += i
  }

  return x
}

func main() {
  println(add(test()))
  println(sum(test()))
}
```

输出结果：

```
3
3
```

命名返回参数可看做与形参类似的局部变量，最后由 return 隐式返回。

```go
package main

func add(x, y int) (z int) {
  z = x + y
  return
}

func main() {
  println(add(1, 2))
}
```

输出结果：

```
3
```

命名返回参数可被同名局部变量遮蔽，此时需要显式返回。

```go
func add(x, y int) (z int) {
  { // 不能在一个级别，引发 "z redeclared in this block" 错误。
    var z = x + y
    // return   // Error: z is shadowed during return
    return z // 必须显式返回。
  }
}
```

命名返回参数允许 defer 延迟调用通过闭包读取和修改。

```go
package main

func add(x, y int) (z int) {
  defer func() {
    z += 100
  }()

  z = x + y
  return
}

func main() {
  println(add(1, 2))
}
```

输出结果：

```go
103
```

显式 return 返回前，会先修改命名返回参数。

```go
package main

func add(x, y int) (z int) {
  defer func() {
    println(z) // 输出: 203
  }()

  z = x + y
  return z + 200 // 执行顺序: (z = z + 200) -> (call defer) -> (return)
}

func main() {
  println(add(1, 2)) // 输出: 203
}
```

输出结果：

```go
203
203
```

## 四、匿名函数

### 1、匿名函数定义

- 匿名函数是指不需要定义函数名的一种函数实现方式。1958 年 LISP 首先采用匿名函数。

- 在 Go 里面，函数可以像普通变量一样被传递或使用，Go 语言支持随时在代码里定义匿名函数。

- 匿名函数由一个不带函数名的函数声明和函数体组成。匿名函数的优越性在于可以直接使用函数内的变量，不必申明。
- 函数当然还可以作为返回值，但是在Go语言中函数内部不能再像之前那样定义函数了，只能定义匿名函数。

匿名函数就是没有函数名的函数，匿名函数的定义格式如下：

```go
func(参数)(返回值){
    函数体
}
```

匿名函数因为没有函数名，所以没办法像普通函数那样调用，所以匿名函数需要保存到某个变量或者作为立即执行函数:

```go
func main() {
	// 将匿名函数保存到变量
	add := func(x, y int) {
		fmt.Println(x + y)
	}
	add(10, 20) // 通过变量调用匿名函数

	//自执行函数：匿名函数定义完加()直接执行
	func(x, y int) {
		fmt.Println(x + y)
	}(10, 20)
}
```

匿名函数多用于实现回调函数和闭包。

```go
package main

import (
  "fmt"
  "math"
)

func main() {
  getSqrt := func(a float64) float64 {
    return math.Sqrt(a)
  }
  fmt.Println(getSqrt(4))
}
```

输出结果：

```
2
```

上面先定义了一个名为 getSqrt 的变量，初始化该变量时和之前的变量初始化有些不同，使用了 func，func 是定义函数的，可是这个函数和上面说的函数最大不同就是没有函数名，也就是匿名函数。这里将一个函数当做一个变量一样的操作。

### 2、匿名函数作为变量

Golang 匿名函数可赋值给变量，做为结构字段，或者在 channel 里传送。

```go
package main

func main() {
  // --- function variable ---
  fn := func() { println("Hello, World!") }
  fn()

  // --- function collection ---
  fns := [](func(x int) int){
    func(x int) int { return x + 1 },
    func(x int) int { return x + 2 },
  }
  println(fns[0](100))

  // --- function as field ---
  d := struct {
    fn func() string
  }{
    fn: func() string { return "Hello, World!" },
  }
  println(d.fn())

  // --- channel of function ---
  fc := make(chan func() string, 2)
  fc <- func() string { return "Hello, World!" }
  println((<-fc)())
}
```

输出结果：

```
Hello, World!
101
Hello, World!
Hello, World!
```

> 匿名函数是指不需要定义函数名的一种函数实现方式。

在Go里面，函数可以像普通变量一样被传递或使用，Go语言支持随时在代码里定义匿名函数。

匿名函数由一个不带函数名的函数声明和函数体组成。匿名函数的优越性在于可以直接使用函数内的变量，不必声明。

匿名函数的定义格式如下：

~~~go
func(参数列表)(返回参数列表){
    函数体
}
~~~

示例：

~~~go
package main

import (
    "fmt"
    "math"
)

func main() {
    //这里将一个函数当做一个变量一样的操作。
    getSqrt := func(a float64) float64 {
        return math.Sqrt(a)
    }
    fmt.Println(getSqrt(4))
}
~~~

**在定义时调用匿名函数**

匿名函数可以在声明后调用，例如：

~~~go
func(data int) {
    fmt.Println("hello", data)
}(100) //(100)，表示对匿名函数进行调用，传递参数为 100。
~~~

**匿名函数用作回调函数**

匿名函数作为回调函数的设计在Go语言也比较常见

~~~go
package main
import (
    "fmt"
)
// 遍历切片的每个元素, 通过给定函数进行元素访问
func visit(list []int, f func(int)) {
    for _, v := range list {
        f(v)
    }
}
func main() {
    // 使用匿名函数打印切片内容
    visit([]int{1, 2, 3, 4}, func(v int) {
        fmt.Println(v)
    })
}
~~~

**返回多个匿名函数**

~~~go
package main

import "fmt"

func FGen(x, y int) (func() int, func(int) int) {

	//求和的匿名函数
	sum := func() int {
		return x + y
	}

	// (x+y) *z 的匿名函数
	avg := func(z int) int {
		return (x + y) * z
	}
	return sum, avg
}

func main() {

	f1, f2 := FGen(1, 2)
	fmt.Println(f1())
	fmt.Println(f2(3))
}
~~~

## 五、函数类型与变量

### 1、定义函数类型

我们可以使用`type`关键字来定义一个函数类型，具体格式如下：

```go
type calculation func(int, int) int
```

上面语句定义了一个`calculation`类型，它是一种函数类型，这种函数接收两个int类型的参数并且返回一个int类型的返回值。

简单来说，凡是满足这个条件的函数都是calculation类型的函数，例如下面的add和sub是calculation类型。

```go
func add(x, y int) int {
	return x + y
}

func sub(x, y int) int {
	return x - y
}
```

add和sub都能赋值给calculation类型的变量。

```go
var c calculation
c = add
```

### 2、函数类型变量

我们可以声明函数类型的变量并且为该变量赋值：

```go
func main() {
	var c calculation               // 声明一个calculation类型的变量c
	c = add                         // 把add赋值给c
	fmt.Printf("type of c:%T\n", c) // type of c:main.calculation
	fmt.Println(c(1, 2))            // 像调用add一样调用c

	f := add                        // 将函数add赋值给变量f1
	fmt.Printf("type of f:%T\n", f) // type of f:func(int, int) int
	fmt.Println(f(10, 20))          // 像调用add一样调用f
}
```

## 六、高阶函数

高阶函数分为函数作为参数和函数作为返回值两部分。

### 1、函数作为参数

> 函数做为一等公民，可以做为参数传递。

~~~go
func test(fn func() int) int {
    return fn()
}
func fn()  int{
	return 200
}
func main() {
    //这是直接使用匿名函数
    s1 := test(func() int { return 100 }) 
    //这是传入一个函数
    s1 := test(fn)
	fmt.Println(s1)
}
~~~

**在将函数做为参数的时候，我们可以使用类型定义，将函数定义为类型，这样便于阅读**

~~~go
// 定义函数类型。
type FormatFunc func(s string, x, y int) string

func format(fn FormatFunc, s string, x, y int) string {
	return fn(s, x, y)
}
func formatFun(s string,x,y int) string  {
	return fmt.Sprintf(s,x,y)
}
func main() {
    s2 := format(formatFun,"%d, %d",10,20)
	fmt.Println(s2)
}
~~~

有返回值的函数，必须有明确的终止语句，否则会引发编译错误。

```go
func add(x, y int) int {
	return x + y
}

func calc(x, y int, op func(int, int) int) int {
	return op(x, y)
}

func main() {
	ret2 := calc(10, 20, add)
	fmt.Println(ret2) //30
}
```

### 2、函数作为返回值

函数也可以作为返回值：

```go
func do(s string) (func(int, int) int, error) {
	switch s {
	case "+":
		return add, nil
	case "-":
		return sub, nil
	default:
		err := errors.New("无法识别的操作符")
		return nil, err
	}
}
```

## 七、闭包、递归

### 1、闭包详解

闭包的应该都听过，但到底什么是闭包呢？

> 闭包是由函数及其相关引用环境组合而成的实体(即：闭包 = 函数+引用环境)。

> “官方”的解释是：所谓“闭包”，指的是一个拥有许多变量和绑定了这些变量的环境的表达式（通常是一个函数），因而这些变量也是该表达式的一部分。

> 维基百科讲，闭包`（Closure）`，是引用了自由变量的函数。这个被引用的自由变量将和这个函数一同存在，即使已经离开了创造它的环境也不例外。所以，有另一种说法认为闭包是由函数和与其相关的引用环境组合而成的实体。闭包在运行时可以有多个实例，不同的引用环境和相同的函数组合可以产生不同的实例。

看着上面的描述，会发现闭包和匿名函数似乎有些像。可是可能还是有些云里雾里的。因为跳过闭包的创建过程直接理解闭包的定义是非常困难的。目前在 `JavaScript`、`Go`、`PHP`、`Scala`、`Scheme`、`Common Lisp`、`Smalltalk`、`Groovy`、`Ruby`、 `Python`、`Lua`、`objective c`、`Swift` 以及 `Java8` 以上等语言中都能找到对闭包不同程度的支持。通过支持闭包的语法可以发现一个特点，他们都有垃圾回收 `(GC)` 机制。 javascript 应该是普及度比较高的编程语言了，通过这个来举例应该好理解写。看下面的代码，只要关注 `script` 里方法的定义和调用就可以了。

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <title></title>
  </head>
  <body></body>
</html>
<script
  src="http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js"
  type="text/javascript"
></script>
<script>
  function a() {
    var i = 0;
    function b() {
      console.log(++i);
      document.write("<h1>" + i + "</h1>");
    }
    return b;
  }

  $(function () {
    var c = a();
    c();
    c();
    c();
    //a(); //不会有信息输出
    document.write("<h1>=============</h1>");
    var c2 = a();
    c2();
    c2();
  });
</script>
```

这段代码有两个特点：

> 函数 b 嵌套在函数 a 内部 函数 a 返回函数 b 这样在执行完 var c=a()后，变量 c 实际上是指向了函数 b()，再执行函数 c()后就会显示 i 的值，第一次为 1，第二次为 2，第三次为 3，以此类推。 其实，这段代码就创建了一个闭包。因为函数 a()外的变量 c 引用了函数 a()内的函数 b()，就是说：

> 当函数 a()的内部函数 b()被函数 a()外的一个变量引用的时候，就创建了一个闭包。 在上面的例子中，由于闭包的存在使得函数 a()返回后，a 中的 i 始终存在，这样每次执行 c()，i 都是自加 1 后的值。 从上面可以看出闭包的作用就是在 a()执行完并返回后，闭包使得 Javascript 的垃圾回收机制 GC 不会收回 a()所占用的资源，因为 a()的内部函数 b()的执行需要依赖 a()中的变量 i。

在给定函数被多次调用的过程中，这些私有变量能够保持其持久性。变量的作用域仅限于包含它们的函数，因此无法从其它程序代码部分进行访问。不过，变量的生存期是可以很长，在一次函数调用期间所创建所生成的值在下次函数调用时仍然存在。正因为这一特点，闭包可以用来完成信息隐藏，并进而应用于需要状态表达的某些编程范型中。 下面来想象另一种情况，如果 a()返回的不是函数 b()，情况就完全不同了。因为 a()执行完后，b()没有被返回给 a()的外界，只是被 a()所引用，而此时 a()也只会被 b()引 用，因此函数 a()和 b()互相引用但又不被外界打扰（被外界引用），函数 a 和 b 就会被 GC 回收。所以直接调用 a();是页面并没有信息输出。

下面来说闭包的另一要素引用环境。c()跟 c2()引用的是不同的环境，在调用 i++时修改的不是同一个 i，因此两次的输出都是 1。函数 a()每进入一次，就形成了一个新的环境，对应的闭包中，函数都是同一个函数，环境却是引用不同的环境。这和 c()和 c()的调用顺序都是无关的。

### 2、变量作用域

#### 2.1 全局变量

全局变量是定义在函数外部的变量，它在程序整个运行周期内都有效。 在函数中可以访问到全局变量。

```go
package main

import "fmt"

//定义全局变量num
var num int64 = 10

func testGlobalVar() {
	fmt.Printf("num=%d\n", num) //函数中可以访问全局变量num
}

func main() {
	testGlobalVar() //num=10
}
```

#### 2.2 局部变量

局部变量又分为两种： 函数内定义的变量无法在该函数外使用，例如下面的示例代码main函数中无法使用testLocalVar函数中定义的变量x：

```go
func testLocalVar() {
	//定义一个函数局部变量x,仅在该函数内生效
	var x int64 = 100
	fmt.Printf("x=%d\n", x)
}

func main() {
	testLocalVar()
	fmt.Println(x) // 此时无法使用变量x
}
```

如果局部变量和全局变量重名，优先访问局部变量。

```go
package main

import "fmt"

//定义全局变量num
var num int64 = 10

func testNum() {
	num := 100
	fmt.Printf("num=%d\n", num) // 函数中优先使用局部变量
}

func main() {
	testNum() // num=100
}
```

接下来我们来看一下语句块定义的变量，通常我们会在if条件判断、for循环、switch语句上使用这种定义变量的方式。

```go
func testLocalVar2(x, y int) {
	fmt.Println(x, y) //函数的参数也是只在本函数中生效
	if x > 0 {
		z := 100 //变量z只在if语句块生效
		fmt.Println(z)
	}
	//fmt.Println(z)//此处无法使用变量z
}
```

还有我们之前讲过的for循环语句中定义的变量，也是只在for语句块中生效：

```go
func testLocalVar3() {
	for i := 0; i < 10; i++ {
		fmt.Println(i) //变量i只在当前for语句块中生效
	}
	//fmt.Println(i) //此处无法使用变量i
}
```

### 3、Go 的闭包

Go 语言是支持闭包的，这里只是简单地讲一下在 Go 语言中闭包是如何实现的。 下面我来将之前的 JavaScript 的闭包例子用 Go 来实现。

```go
package main

import (
  "fmt"
)

func a() func() int {
  i := 0
  b := func() int {
    i++
    fmt.Println(i)
    return i
  }
  return b
}

func main() {
  c := a()
  c()
  c()
  c()

  a() //不会输出i
}
```

输出结果：

```
1
2
3
```

可以发现，输出和之前的 JavaScript 的代码是一致的。具体的原因和上面的也是一样的，这说明 Go 语言是支持闭包的。

闭包复制的是原对象指针，这就很容易解释延迟引用现象。

```go
package main

import "fmt"

func test() func() {
  x := 100
  fmt.Printf("x (%p) = %d\n", &x, x)

  return func() {
    fmt.Printf("x (%p) = %d\n", &x, x)
  }
}

func main() {
  f := test()
  f()
}
```

输出:

```
x (0xc42007c008) = 100
x (0xc42007c008) = 100
```

在汇编层 ，test 实际返回的是 FuncVal 对象，其中包含了匿名函数地址、闭包对象指针。当调 匿名函数时，只需以某个寄存器传递该对象即可。

```
FuncVal { func_address, closure_var_pointer ... }
```

外部引用函数参数局部变量

```go
package main

import "fmt"

// 外部引用函数参数局部变量
func add(base int) func(int) int {
  return func(i int) int {
    base += i
    return base
  }
}

func main() {
  tmp1 := add(10)
  fmt.Println(tmp1(1), tmp1(2))
  // 此时tmp1和tmp2不是一个实体了
  tmp2 := add(100)
  fmt.Println(tmp2(1), tmp2(2))
}
```

返回 2 个闭包

```go
package main

import "fmt"

// 返回2个函数类型的返回值
func test01(base int) (func(int) int, func(int) int) {
  // 定义2个函数，并返回
  // 相加
  add := func(i int) int {
    base += i
    return base
  }
  // 相减
  sub := func(i int) int {
    base -= i
    return base
  }
  // 返回
  return add, sub
}

func main() {
  f1, f2 := test01(10)
  // base一直是没有消
  fmt.Println(f1(1), f2(2))
  // 此时base是9
  fmt.Println(f1(3), f2(4))
}
```

#### 闭包进阶示例

闭包指的是一个函数和与其相关的引用环境组合而成的实体。简单来说，`闭包=函数+引用环境`。 首先我们来看一个例子：

```go
func adder() func(int) int {
	var x int
	return func(y int) int {
		x += y
		return x
	}
}
func main() {
	var f = adder()
	fmt.Println(f(10)) //10
	fmt.Println(f(20)) //30
	fmt.Println(f(30)) //60

	f1 := adder()
	fmt.Println(f1(40)) //40
	fmt.Println(f1(50)) //90
}
```

变量`f`是一个函数并且它引用了其外部作用域中的`x`变量，此时`f`就是一个闭包。 在`f`的生命周期内，变量`x`也一直有效。 

闭包进阶示例1：

```go
func adder2(x int) func(int) int {
	return func(y int) int {
		x += y
		return x
	}
}
func main() {
	var f = adder2(10)
	fmt.Println(f(10)) //20
	fmt.Println(f(20)) //40
	fmt.Println(f(30)) //70

	f1 := adder2(20)
	fmt.Println(f1(40)) //60
	fmt.Println(f1(50)) //110
}
```

闭包进阶示例2：

```go
func makeSuffixFunc(suffix string) func(string) string {
	return func(name string) string {
		if !strings.HasSuffix(name, suffix) {
			return name + suffix
		}
		return name
	}
}

func main() {
	jpgFunc := makeSuffixFunc(".jpg")
	txtFunc := makeSuffixFunc(".txt")
	fmt.Println(jpgFunc("test")) //test.jpg
	fmt.Println(txtFunc("test")) //test.txt
}
```

闭包进阶示例3：

```go
func calc(base int) (func(int) int, func(int) int) {
	add := func(i int) int {
		base += i
		return base
	}

	sub := func(i int) int {
		base -= i
		return base
	}
	return add, sub
}

func main() {
	f1, f2 := calc(10)
	fmt.Println(f1(1), f2(2)) //11 9
	fmt.Println(f1(3), f2(4)) //12 8
	fmt.Println(f1(5), f2(6)) //13 7
}
```

闭包其实并不复杂，只要牢记`闭包=函数+引用环境`。

### 4、Go 语言递归函数

递归，就是在运行的过程中调用自己。 一个函数调用自己，就叫做递归函数。

构成递归需具备的条件：

```
1.子问题须与原始问题为同样的事，且更为简单。
2.不能无限制地调用本身，须有个出口，化简为非递归状况处理。
```

#### 数字阶乘

一个正整数的阶乘（factorial）是所有小于及等于该数的正整数的积，并且 0 的阶乘为 1。自然数 n 的阶乘写作 n!。1808 年，基斯顿·卡曼引进这个表示法。

```go
package main

import "fmt"

func factorial(i int) int {
  if i <= 1 {
    return 1
  }
  return i * factorial(i-1)
}

func main() {
  var i int = 7
  fmt.Printf("Factorial of %d is %d\n", i, factorial(i))
}
```

输出结果：

```
Factorial of 7 is 5040
```

### 5、斐波那契数列(Fibonacci)

这个数列从第 3 项开始，每一项都等于前两项之和。

```go
package main

import "fmt"

func fibonaci(i int) int {
  if i == 0 {
    return 0
  }
  if i == 1 {
    return 1
  }
  return fibonaci(i-1) + fibonaci(i-2)
}

func main() {
  var i int
  for i = 0; i < 10; i++ {
    fmt.Printf("%d\n", fibonaci(i))
  }
}
```

输出结果：

```
0
1
1
2
3
5
8
13
21
34
```

## 八、延迟调用（defer）

- go 语言的 defer 功能强大，对于资源管理非常方便，但是如果没用好，也会有陷阱。

- defer 是先进后出


这个很自然,后面的语句会依赖前面的资源，因此如果先前面的资源先释放了，后面的语句就没法执行了。

```go
package main

import "fmt"

func main() {
  var whatever [5]struct{}

  for i := range whatever {
    defer fmt.Println(i)
  }
}
```

输出结果：

```
4
3
2
1
0
```



Go语言中的`defer`语句会将其后面跟随的语句进行延迟处理。在`defer`归属的函数即将返回时，将延迟处理的语句按`defer`定义的逆序进行执行，也就是说，先被`defer`的语句最后被执行，最后被`defer`的语句，最先被执行。

举个例子：

```go
func main() {
	fmt.Println("start")
	defer fmt.Println(1)
	defer fmt.Println(2)
	defer fmt.Println(3)
	fmt.Println("end")
}
```

输出结果：

```go
start
end
3
2
1
```

由于`defer`语句延迟调用的特性，所以`defer`语句能非常方便的处理资源释放问题。比如：资源清理、文件关闭、解锁及记录时间等。

### 1、Golang 延迟调用

#### 1.1 defer 特性

1. 关键字 defer 用于注册延迟调用。
2. 这些调用直到 return 前才被执。因此，可以用来做资源清理。
3. 多个defer语句，按先进后出的方式执行。
4. defer语句中的变量，在defer声明时就决定了。

#### 1.2 defer 用途

1. 关闭文件句柄
2. 锁资源释放
3. 数据库连接释放

**go 语言的defer功能强大，对于资源管理非常方便，但是如果没用好，也会有陷阱。**

~~~go
package main

import "fmt"

func main() {
	var whatever = [5]int{1,2,3,4,5}

	for i := range whatever {
		defer fmt.Println(i)
	}
}
~~~

看下面的示例：

~~~go
package main

import (
	"log"
	"time"
)

func main() {
	start := time.Now()
	log.Printf("开始时间为：%v", start)
  defer log.Printf("时间差：%v", time.Since(start))  // Now()此时已经copy进去了
    //不受这3秒睡眠的影响
	time.Sleep(3 * time.Second)

	log.Printf("函数结束")
}
~~~

* Go 语言中所有的`函数调用都是传值的`
* 调用 defer 关键字会`立刻拷贝函数中引用的外部参数` ，包括start 和time.Since中的Now
* defer的函数在`压栈的时候也会保存参数的值，并非在执行时取值`。

如何解决上述问题：使用defer fun()

~~~go
package main

import (
	"log"
	"time"
)

func main() {
	start := time.Now()
	log.Printf("开始时间为：%v", start)
	defer func() {
		log.Printf("开始调用defer")
		log.Printf("时间差：%v", time.Since(start))
		log.Printf("结束调用defer")
	}()
	time.Sleep(3 * time.Second)

	log.Printf("函数结束")
}
~~~

**因为拷贝的是`函数指针`,函数属于引用传递**

在来看一个问题：

~~~go
package main

import "fmt"

func main() {
	var whatever = [5]int{1,2,3,4,5}
	for i,_ := range whatever {
        //函数正常执行,由于闭包用到的变量 i 在执行的时候已经变成4,所以输出全都是4.
		defer func() { fmt.Println(i) }()
	}
}
~~~

怎么解决：

~~~go
package main

import "fmt"

func main() {
	var whatever = [5]int{1,2,3,4,5}
	for i,_ := range whatever {
		i := i
		defer func() { fmt.Println(i) }()
	}
}
~~~

#### 1.3 defer 碰上闭包

```go
package main

import "fmt"

func main() {
  var whatever [5]struct{}
  for i := range whatever {
    defer func() { 
      fmt.Println(i) 
    }()
  }
}
```

输出结果：

```
4
4
4
4
4
```

其实 go 说的很清楚,我们一起来看看 go spec 如何说的

> Each time a "defer" statement executes, the function value and parameters to the call are evaluated as usualand saved anew but the actual function is not invoked.

也就是说函数正常执行,由于闭包用到的变量 i 在执行的时候已经变成 4,所以输出全都是 4.

#### 1.4 defer f.Close

这个大家用的都很频繁,但是 go 语言编程举了一个可能一不小心会犯错的例子.

```go
package main

import "fmt"

type Test struct {
  name string
}

func (t *Test) Close() {
  fmt.Println(t.name, " closed")
}
func main() {
  ts := []Test{{"a"}, {"b"}, {"c"}}
  for _, t := range ts {
    defer t.Close()
  }
}
```

输出结果：

```
c  closed
c  closed
c  closed
```

这个输出并不会像我们预计的输出 c b a,而是输出 c c c

可是按照前面的 go spec 中的说明,应该输出 c b a 才对啊.

那我们换一种方式来调用一下.

```go
package main

import "fmt"

type Test struct {
  name string
}

func (t *Test) Close() {
  fmt.Println(t.name, " closed")
}
func Close(t Test) {
  t.Close()
}
func main() {
  ts := []Test{{"a"}, {"b"}, {"c"}}
  for _, t := range ts {
    defer Close(t)
  }
}
```

输出结果：

```
c  closed
b  closed
a  closed
```

这个时候输出的就是 c b a

当然,如果你不想多写一个函数,也很简单,可以像下面这样,同样会输出 c b a

看似多此一举的声明

```go
package main

import "fmt"

type Test struct {
  name string
}

func (t *Test) Close() {
  fmt.Println(t.name, " closed")
}
func main() {
  ts := []Test{{"a"}, {"b"}, {"c"}}
  for _, t := range ts {
    t2 := t
    defer t2.Close()
  }
}
```

输出结果：

```
c  closed
b  closed
a  closed
```

通过以上例子，结合

> Each time a "defer" statement executes, the function value and parameters to the call are evaluated as usualand saved anew but the actual function is not invoked.

这句话。可以得出下面的结论：

> defer 后面的语句在执行的时候，函数调用的参数会被保存起来，但是不执行。也就是复制了一份。但是并没有说 struct 这里的 this 指针如何处理，通过这个例子可以看出 go 语言并没有把这个明确写出来的 this 指针当作参数来看待。

多个 defer 注册，按 FILO 次序执行 ( 先进后出 )。哪怕函数或某个延迟调用发生错误，这些调用依旧会被执行。

```go
package main

func test(x int) {
  defer println("a")
  defer println("b")

  defer func() {
    println(100 / x) // div0 异常未被捕获，逐步往外传递，最终终止进程。
  }()

  defer println("c")
}

func main() {
  test(0)
}
```

输出结果:

```
c
b
a
panic: runtime error: integer divide by zero
```

`*`延迟调用参数在注册时求值或复制，可用指针或闭包 "延迟" 读取。

```go
package main

func test() {
  x, y := 10, 20

  defer func(i int) {
    println("defer:", i, y) // y 闭包引用
  }(x) // x 被复制

  x += 10
  y += 100
  println("x =", x, "y =", y)
}

func main() {
  test()
}
```

输出结果:

```
x = 20 y = 120
defer: 10 120
```

`*`滥用 defer 可能会导致性能问题，尤其是在一个 "大循环" 里。

```go
package main

import (
  "fmt"
  "sync"
  "time"
)

var lock sync.Mutex

func test() {
  lock.Lock()
  lock.Unlock()
}

func testdefer() {
  lock.Lock()
  defer lock.Unlock()
}

func main() {
  func() {
    t1 := time.Now()

    for i := 0; i < 10000; i++ {
      test()
    }
    elapsed := time.Since(t1)
    fmt.Println("test elapsed: ", elapsed)
  }()
  func() {
    t1 := time.Now()

    for i := 0; i < 10000; i++ {
      testdefer()
    }
    elapsed := time.Since(t1)
    fmt.Println("testdefer elapsed: ", elapsed)
  }()

}
```

输出结果:

```
test elapsed:  223.162µs
testdefer elapsed:  781.304µs
```

### 2、defer执行时机

在Go语言的函数中`return`语句在底层并不是原子操作，它分为给返回值赋值和RET指令两步。而`defer`语句执行的时机就在返回值赋值操作后，RET指令执行前。具体如下图所示：![defer执行时机](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/defer.png)

### 3、defer经典案例

阅读下面的代码，写出最后的打印结果。

```go
func f1() int {
	x := 5
	defer func() {
		x++
	}()
	return x
}

func f2() (x int) {
	defer func() {
		x++
	}()
	return 5
}

func f3() (y int) {
	x := 5
	defer func() {
		x++
	}()
	return x
}
func f4() (x int) {
	defer func(x int) {
		x++
	}(x)
	return 5
}
func main() {
	fmt.Println(f1())
	fmt.Println(f2())
	fmt.Println(f3())
	fmt.Println(f4())
}
```

### 4、defer 陷阱

#### 4.1 defer 与 closure

```go
package main

import (
  "errors"
  "fmt"
)

func foo(a, b int) (i int, err error) {
  defer fmt.Printf("first defer err %v\n", err)
  defer func(err error) { fmt.Printf("second defer err %v\n", err) }(err)
  defer func() { fmt.Printf("third defer err %v\n", err) }()
  if b == 0 {
    err = errors.New("divided by zero!")
    return
  }

  i = a / b
  return
}

func main() {
  foo(2, 0)
}
```

输出结果：

```
third defer err divided by zero!
second defer err <nil>
first defer err <nil>
```

解释：如果 defer 后面跟的不是一个 closure 最后执行的时候我们得到的并不是最新的值。

#### 4.2 defer 与 return

```go
package main

import "fmt"

func foo() (i int) {

  i = 0
  defer func() {
    fmt.Println(i)
  }()

  return 2
}

func main() {
  foo()
}
```

输出结果：

```
2
```

解释：在有具名返回值的函数中（这里具名返回值为 i），执行 return 2 的时候实际上已经将 i 的值重新赋值为 2。所以 defer closure 输出结果为 2 而不是 1。

#### 4.3 defer nil 函数

```go
package main

import (
  "fmt"
)

func test() {
  var run func() = nil
  defer run()
  fmt.Println("runs")
}

func main() {
  defer func() {
    if err := recover(); err != nil {
      fmt.Println(err)
    }
  }()
  test()
}
```

输出结果：

```
runs
runtime error: invalid memory address or nil pointer dereference
```

解释：名为 test 的函数一直运行至结束，然后 defer 函数会被执行且会因为值为 nil 而产生 panic 异常。然而值得注意的是，run() 的声明是没有问题，因为在 test 函数运行完成后它才会被调用。

#### 4.4 在错误的位置使用 defer

当 http.Get 失败时会抛出异常。

```go
package main

import "net/http"

func do() error {
  res, err := http.Get("http://www.google.com")
  defer res.Body.Close()
  if err != nil {
    return err
  }

  // ..code...

  return nil
}

func main() {
  do()
}
```

输出结果：

```
panic: runtime error: invalid memory address or nil pointer dereference
```

因为在这里我们并没有检查我们的请求是否成功执行，当它失败的时候，我们访问了 Body 中的空变量 res ，因此会抛出异常

#### 4.5 解决方案

总是在一次成功的资源分配下面使用 defer ，对于这种情况来说意味着：当且仅当 http.Get 成功执行时才使用 defer

```go
package main

import "net/http"

func do() error {
  res, err := http.Get("http://xxxxxxxxxx")
  if res != nil {
    defer res.Body.Close()
  }

  if err != nil {
    return err
  }

  // ..code...

  return nil
}

func main() {
  do()
}
```

在上述的代码中，当有错误的时候，err 会被返回，否则当整个函数返回的时候，会关闭 res.Body 。

> 解释：在这里，你同样需要检查 res 的值是否为 nil ，这是 http.Get 中的一个警告。通常情况下，出错的时候，返回的内容应为空并且错误会被返回，可当你获得的是一个重定向 error 时， res 的值并不会为 nil ，但其又会将错误返回。上面的代码保证了无论如何 Body 都会被关闭，如果你没有打算使用其中的数据，那么你还需要丢弃已经接收的数据。

#### 4.6 不检查错误

在这里，f.Close() 可能会返回一个错误，可这个错误会被我们忽略掉

```go
package main

import "os"

func do() error {
  f, err := os.Open("book.txt")
  if err != nil {
    return err
  }

  if f != nil {
    defer f.Close()
  }

  // ..code...

  return nil
}

func main() {
  do()
}
```

改进一下

```go
package main

import "os"

func do() error {
  f, err := os.Open("book.txt")
  if err != nil {
    return err
  }

  if f != nil {
    defer func() {
      if err := f.Close(); err != nil {
        // log etc
      }
    }()
  }

  // ..code...

  return nil
}

func main() {
  do()
}
```

再改进一下

通过命名的返回变量来返回 defer 内的错误。

```go
package main

import "os"

func do() (err error) {
  f, err := os.Open("book.txt")
  if err != nil {
    return err
  }

  if f != nil {
    defer func() {
      if ferr := f.Close(); ferr != nil {
        err = ferr
      }
    }()
  }

  // ..code...

  return nil
}

func main() {
  do()
}
```

释放相同的资源

如果你尝试使用相同的变量释放不同的资源，那么这个操作可能无法正常执行。

```go
package main

import (
  "fmt"
  "os"
)

func do() error {
  f, err := os.Open("book.txt")
  if err != nil {
    return err
  }
  if f != nil {
    defer func() {
      if err := f.Close(); err != nil {
        fmt.Printf("defer close book.txt err %v\n", err)
      }
    }()
  }

  // ..code...

  f, err = os.Open("another-book.txt")
  if err != nil {
    return err
  }
  if f != nil {
    defer func() {
      if err := f.Close(); err != nil {
        fmt.Printf("defer close another-book.txt err %v\n", err)
      }
    }()
  }

  return nil
}

func main() {
  do()
}
```

输出结果： defer close book.txt err close ./another-book.txt: file already closed

当延迟函数执行时，只有最后一个变量会被用到，因此，f 变量 会成为最后那个资源 (another-book.txt)。而且两个 defer 都会将这个资源作为最后的资源来关闭

解决方案：

```go
package main

import (
  "fmt"
  "io"
  "os"
)

func do() error {
  f, err := os.Open("book.txt")
  if err != nil {
    return err
  }
  if f != nil {
    defer func(f io.Closer) {
      if err := f.Close(); err != nil {
        fmt.Printf("defer close book.txt err %v\n", err)
      }
    }(f)
  }

  // ..code...

  f, err = os.Open("another-book.txt")
  if err != nil {
    return err
  }
  if f != nil {
    defer func(f io.Closer) {
      if err := f.Close(); err != nil {
        fmt.Printf("defer close another-book.txt err %v\n", err)
      }
    }(f)
  }

  return nil
}

func main() {
  do()
}
```

### 5、defer面试题

```go
func calc(index string, a, b int) int {
	ret := a + b
	fmt.Println(index, a, b, ret)
	return ret
}

func main() {
	x := 1
	y := 2
	defer calc("AA", x, calc("A", x, y))
	x = 10
	defer calc("BB", x, calc("B", x, y))
	y = 20
}
```

问，上面代码的输出结果是？（提示：defer注册要延迟执行的函数时该函数所有的参数都需要确定其值）

## 九、内置函数介绍

|    内置函数    | 介绍                                                         |
| :------------: | :----------------------------------------------------------- |
|     close      | 主要用来关闭channel                                          |
|      len       | 用来求长度，比如string、array、slice、map、channel           |
|      new       | 用来分配内存，主要用来分配值类型，比如int、struct。返回的是指针 |
|      make      | 用来分配内存，主要用来分配引用类型，比如chan、map、slice     |
|     append     | 用来追加元素到数组、slice中                                  |
| panic和recover | 用来做错误处理                                               |

### 1、panic/recover

Go语言中目前（Go1.12）是没有异常机制，但是使用`panic/recover`模式来处理错误。 `panic`可以在任何地方引发，但`recover`只有在`defer`调用的函数中有效。 首先来看一个例子：

```go
func funcA() {
	fmt.Println("func A")
}

func funcB() {
	panic("panic in B")
}

func funcC() {
	fmt.Println("func C")
}
func main() {
	funcA()
	funcB()
	funcC()
}
```

输出：

```bash
func A
panic: panic in B

goroutine 1 [running]:
main.funcB(...)
        .../code/func/main.go:12
main.main()
        .../code/func/main.go:20 +0x98
```

程序运行期间`funcB`中引发了`panic`导致程序崩溃，异常退出了。这个时候我们就可以通过`recover`将程序恢复回来，继续往后执行。

```go
package main

import (
	"fmt"
)

func funcA() {
	fmt.Println("func A")
}

func funcB() {
	defer func() {
		err := recover()
		//如果程序出出现了panic错误,可以通过recover恢复过来
		if err != nil {
			fmt.Println("recover in B")
		}
	}()
	panic("panic in B")
}

func funcC() {
	fmt.Println("func C")
}

func main() {
	funcA()
	funcB()
	funcC()
}

/*
func A
recover in B
func C
*/
```

**注意：**

1. `recover()`必须搭配`defer`使用。
2. `defer`一定要在可能引发`panic`的语句之前定义。

### 2、异常处理

Golang 没有结构化异常，使用 panic 抛出错误，recover 捕获错误。

异常的使用场景简单描述：Go 中可以抛出一个 panic 的异常，然后在 defer 中通过 recover 捕获这个异常，然后正常处理。

panic：

- 假如函数F中书写了panic语句，会终止其后要执行的代码，在panic所在函数F内如果存在要执行的defer函数列表，按照defer的逆序执行
- 返回函数F的调用者G，在G中，调用函数F语句之后的代码不会执行，假如函数G中存在要执行的defer函数列表，按照defer的逆序执行
- 直到goroutine整个退出，并报告错误

recover：

- 用来控制一个goroutine的panicking行为，捕获panic，从而影响应用的行为
- 一般的调用建议
  - 在defer函数中，通过recever来终止一个goroutine的panicking过程，从而恢复正常代码的执行
  - 可以获取通过panic传递的error

注意:

```go
/*
1.利用recover处理panic指令，defer 必须放在 panic 之前定义，另外 recover 只有在 defer 调用的函数中才有效。否则当panic时，recover无法捕获到panic，无法防止panic扩散。
2.recover 处理异常后，逻辑并不会恢复到 panic 那个点去，函数跑到 defer 之后的那个点。
3.多个 defer 会形成 defer 栈，后定义的 defer 语句会被最先调用。
*/
package main

func main() {
  test()
}

func test() {
  defer func() {
    if err := recover(); err != nil {
      println(err.(string)) // 将 interface{} 转型为具体类型。
    }
  }()

  panic("panic error!")
}
```

输出结果：

```
panic error!
```

由于 panic、recover 参数类型为 interface{}，因此可抛出任何类型对象。

```
func panic(v interface{})
func recover() interface{}
```

向已关闭的通道发送数据会引发 panic

```go
package main

import (
  "fmt"
)

func main() {
  defer func() {
    if err := recover(); err != nil {
      fmt.Println(err)
    }
  }()

  var ch chan int = make(chan int, 10)
  close(ch)
  ch <- 1
}
```

输出结果：

```
send on closed channel
```

延迟调用中引发的错误，可被后续延迟调用捕获，但仅最后一个错误可被捕获。

```go
package main

import "fmt"

func test() {
  defer func() {
    fmt.Println(recover())
  }()

  defer func() {
    panic("defer panic")
  }()

  panic("test panic")
}

func main() {
  test()
}
```

输出:

```
defer panic
```

捕获函数 recover 只有在延迟调用内直接调用才会终止错误，否则总是返回 nil。任何未捕获的错误都会沿调用堆栈向外传递。

```go
package main

import "fmt"

func test() {
  defer func() {
    fmt.Println(recover()) //有效
  }()
  defer recover()              //无效！
  defer fmt.Println(recover()) //无效！
  defer func() {
    func() {
      println("defer inner")
      recover() //无效！
    }()
  }()

  panic("test panic")
}

func main() {
  test()
}
```

输出:

```
defer inner
<nil>
test panic
```

使用延迟匿名函数或下面这样都是有效的。

```go
package main

import (
  "fmt"
)

func except() {
  fmt.Println(recover())
}

func test() {
  defer except()
  panic("test panic")
}

func main() {
  test()
}
```

输出结果：

```
test panic
```

如果需要保护代码段，可将代码块重构成匿名函数，如此可确保后续代码被执 。

```go
package main

import "fmt"

func test(x, y int) {
  var z int

  func() {
    defer func() {
      if recover() != nil {
        z = 0
      }
    }()
    panic("test panic")
    z = x / y
    return
  }()

  fmt.Printf("x / y = %d\n", z)
}

func main() {
  test(2, 1)
}
```

输出结果：

```
x / y = 0
```

除用 panic 引发中断性错误外，还可返回 error 类型错误对象来表示函数调用状态。

```go
type error interface {
  Error() string
}
```

标准库 errors.New 和 fmt.Errorf 函数用于创建实现 error 接口的错误对象。通过判断错误对象实例来确定具体错误类型。

```go
package main

import (
  "errors"
  "fmt"
)

var ErrDivByZero = errors.New("division by zero")

func div(x, y int) (int, error) {
  if y == 0 {
    return 0, ErrDivByZero
  }
  return x / y, nil
}

func main() {
  defer func() {
    fmt.Println(recover())
  }()
  switch z, err := div(10, 0); err {
    case nil:
    println(z)
    case ErrDivByZero:
    panic(err)
  }
}
```

输出结果：

```
division by zero
```

Go 实现类似 try catch 的异常处理

```go
package main

import "fmt"

func Try(fun func(), handler func(interface{})) {
  defer func() {
    if err := recover(); err != nil {
      handler(err)
    }
  }()
  fun()
}

func main() {
  Try(func() {
    panic("test panic")
  }, func(err interface{}) {
    fmt.Println(err)
  })
}
```

输出结果：

```
test panic
```

如何区别使用 panic 和 error 两种方式?

惯例是:导致关键流程出现不可修复性错误的使用 panic，其他使用 error。

## 十、练习题

1. 分金币

```go
/*
你有50枚金币，需要分配给以下几个人：Matthew,Sarah,Augustus,Heidi,Emilie,Peter,Giana,Adriano,Aaron,Elizabeth。
分配规则如下：
a. 名字中每包含1个'e'或'E'分1枚金币
b. 名字中每包含1个'i'或'I'分2枚金币
c. 名字中每包含1个'o'或'O'分3枚金币
d: 名字中每包含1个'u'或'U'分4枚金币
写一个程序，计算每个用户分到多少金币，以及最后剩余多少金币？
程序结构如下，请实现 ‘dispatchCoin’ 函数
*/
var (
	coins = 50
	users = []string{
		"Matthew", "Sarah", "Augustus", "Heidi", "Emilie", "Peter", "Giana", "Adriano", "Aaron", "Elizabeth",
	}
	distribution = make(map[string]int, len(users))
)

func main() {
	left := dispatchCoin()
	fmt.Println("剩下：", left)
}
```

## 参考

- [函数定义](https://www.topgoer.com/%E5%87%BD%E6%95%B0/%E5%87%BD%E6%95%B0%E5%AE%9A%E4%B9%89.html)
- [参数](https://www.topgoer.com/%E5%87%BD%E6%95%B0/%E5%8F%82%E6%95%B0.html)
- [返回值](https://www.topgoer.com/%E5%87%BD%E6%95%B0/%E8%BF%94%E5%9B%9E%E5%80%BC.html)
- [倪匿名函数](https://www.topgoer.com/%E5%87%BD%E6%95%B0/%E5%8C%BF%E5%90%8D%E5%87%BD%E6%95%B0.html)
- [闭包与递归](https://www.topgoer.com/%E5%87%BD%E6%95%B0/%E9%97%AD%E5%8C%85%E9%80%92%E5%BD%92.html)
- [延迟调用](https://www.topgoer.com/%E5%87%BD%E6%95%B0/%E5%BB%B6%E8%BF%9F%E8%B0%83%E7%94%A8defer.html)
- [异常处理](https://www.topgoer.com/%E5%87%BD%E6%95%B0/%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86.html)
- [GO语言基础之函数](https://www.liwenzhou.com/posts/Go/09_function/)
