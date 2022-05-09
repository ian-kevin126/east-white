---
title: 数组和切片
author: ian_kevin
date: 2022-04-19
---

# 数组和切片

## 一、数组

### 1、数组定义

Golang Array 和以往我们认知的数组有很大不同：

1. Golang 中的数组是同一种数据类型的固定长度的序列

2. 数组定义：

   ```go
   var 数组变量名 [元素数量]T
   var a [len]int
   
   /*
   比如：var a [5]int， 数组的长度必须是常量，并且长度是数组类型的一部分。
   一旦定义，长度不能变。 [5]int和[10]int是不同的类型。
   */
   
   // example
   var a [3]int
   var b [4]int
   a = b //不可以这样做，因为此时a和b是不同的类型
   ```

3. 长度是数组类型的一部分

   ```go
   var a [5]int
   // 和
   var a [10]int
   // 是不同的类型
   ```

4. 数组可以通过下标进行访问，下标是从`0`开始，最后一个元素下标是：`len-1`，访问越界（下标在合法范围之外），则触发访问越界，会panic。

   ```go
   for i := 0; i < len(a); i++ {
     // todo
   }
   
   // 或者通过 range 遍历
   for index, v := range a {
     // todo
   }
   ```

5. 数组是值类型，赋值和传参会复制整个数组，而不是其指针。因此改变副本的值，不会改变本身的值

6. 支持 "=="、"!=" 操作符，因为内存总是被初始化过的。

7. 指针数组：`[n]*T`

8. 数组指针：`*[n]T`

### 2、数组初始化

#### 2.1 方法一

初始化数组时可以使用初始化列表来设置数组元素的值。

```go
func main() {
	var testArray [3]int                            //数组会初始化为int类型的零值
	var numArray = [3]int{1, 2}                     //使用指定的初始值完成初始化
	var cityArray = [3]string{"北京", "上海", "深圳"} //使用指定的初始值完成初始化
  
	fmt.Println(testArray)                          //[0 0 0]
	fmt.Println(numArray)                           //[1 2 0]
	fmt.Println(cityArray)                          //[北京 上海 深圳]
}
```

#### 2.2 方法二

按照上面的方法每次都要确保提供的初始值和数组长度一致，一般情况下我们可以让编译器根据初始值的个数自行推断数组的长度，例如：

```go
func main() {
	var testArray [3]int
	var numArray = [...]int{1, 2}
	var cityArray = [...]string{"北京", "上海", "深圳"}
	fmt.Println(testArray)                          //[0 0 0]
	fmt.Println(numArray)                           //[1 2]
	fmt.Printf("type of numArray:%T\n", numArray)   //type of numArray:[2]int
	fmt.Println(cityArray)                          //[北京 上海 深圳]
	fmt.Printf("type of cityArray:%T\n", cityArray) //type of cityArray:[3]string
}
```

#### 2.3 方法三

我们还可以使用指定索引值的方式来初始化数组，例如:

```go
func main() {
	a := [...]int{1: 1, 3: 5}
	fmt.Println(a)                  // [0 1 0 5]
	fmt.Printf("type of a:%T\n", a) //type of a:[4]int
}
```

#### 2.4 方法四

```go
package main

import "fmt"

// 全局
var arr0 [5]int = [5]int{1, 2, 3, 4, 5}
var arr1 = [5]int{1, 2, 3, 4, 5}
var arr2 = [...]int{1, 2, 3, 4, 5, 6, 7}
var arr3 = [5]string{3: "hello", 4: "world"}

func main() {
  // 局部
	fmt.Println("arr0", arr0) // arr0 [1 2 3 4 5]
	fmt.Println("arr1", arr1) // arr1 [1 2 3 4 5]
	fmt.Println("arr2", arr2) // arr2 [1 2 3 4 5 6 7]
	fmt.Println("arr3", arr3) // arr3 [   hello world]

	a := [3]int{1, 2}
	b := [...]int{1, 2, 3, 4}
	c := [5]int{2: 100, 4: 200}
	d := [...]struct {
		name string
		age  int
	}{
		{"user1", 18},
		{"user2", 22},
	}

	fmt.Println("a", a) // a [1 2 0]
	fmt.Println("b", b) // b [1 2 3 4]
	fmt.Println("c", c) // c [0 0 100 0 200]
	fmt.Println("d", d) // d [{user1 18} {user2 22}]
}
```

### 3、数组的遍历

遍历数组a有以下两种方法：

```go
func main() {
	var a = [...]string{"北京", "上海", "深圳"}
	// 方法1：for循环遍历
	for i := 0; i < len(a); i++ {
		fmt.Println(a[i])
	}

	// 方法2：for range遍历
	for index, value := range a {
		fmt.Println(index, value)
	}
}
```

### 4、多维数组

#### 4.1 二维数组的定义

```go
func main() {
	a := [3][2]string{
		{"北京", "上海"},
		{"广州", "深圳"},
		{"成都", "重庆"},
	}
	fmt.Println(a) //[[北京 上海] [广州 深圳] [成都 重庆]]
	fmt.Println(a[2][1]) //支持索引取值:重庆
}
```

```go
package main

import "fmt"

var arr1 [2][3]int = [...][3]int{{1, 2, 3}, {4, 5, 6}}

func main() {
	fmt.Println("arr1", arr1) // arr1 [[1 2 3] [4 5 6]]

	a := [2][3]int{{1, 2, 3}, {4, 5, 6}}
	b := [...][2]int{{1, 2}, {2, 3}, {4, 5}}

	fmt.Println("a", a) // a [[1 2 3] [4 5 6]]
	fmt.Println("b", b) // b [[1 2] [2 3] [4 5]]
}
```

#### 4.2 多维数组遍历

```go
package main

import (
	"fmt"
)

func main() {
	a := [3][2]string{
		{"北京", "上海"},
		{"广州", "深圳"},
		{"成都", "重庆"},
	}

	for _, v1 := range a {
		for _, v2 := range v1 {
			fmt.Printf("%s\t", v2)
		}
		fmt.Println()
	}
}

/*
北京    上海
广州    深圳
成都    重庆
*/
```

```go
package main

import (
  "fmt"
)

func main() {

  var f [2][3]int = [...][3]int{{1, 2, 3}, {7, 8, 9}}

  for k1, v1 := range f {
    for k2, v2 := range v1 {
      fmt.Printf("(%d,%d)=%d ", k1, k2, v2)
    }
    fmt.Println()
  }
}

/*
(0,0)=1 (0,1)=2 (0,2)=3
(1,0)=7 (1,1)=8 (1,2)=9
*/
```

**注意：** 多维数组**只有第一层**可以使用`...`来让编译器推导数组长度。例如：

```go
//支持的写法
a := [...][2]string{
	{"北京", "上海"},
	{"广州", "深圳"},
	{"成都", "重庆"},
}

//不支持多维数组的内层使用...
b := [3][...]string{
	{"北京", "上海"},
	{"广州", "深圳"},
	{"成都", "重庆"},
}
```

### 5、数组拷贝和传参

#### 5.1 数组是值类型

数组是值类型，赋值和传参会复制整个数组。因此改变副本的值，不会改变本身的值。

```go
func modifyArray(x [3]int) {
	x[0] = 100
}

func modifyArray2(x [3][2]int) {
	x[2][0] = 100
}
func main() {
	a := [3]int{10, 20, 30}
	modifyArray(a) //在modify中修改的是a的副本x
	fmt.Println(a) //[10 20 30]
	b := [3][2]int{
		{1, 1},
		{1, 1},
		{1, 1},
	}
	modifyArray2(b) //在modify中修改的是b的副本x
	fmt.Println(b)  //[[1 1] [1 1] [1 1]]
}
```

**注意：**

1. 数组支持 “==“、”!=” 操作符，因为内存总是被初始化过的。
2. `[n]*T`表示指针数组，`*[n]T`表示数组指针 。

#### 5.2 数组拷贝和传参

```go
package main

import "fmt"

func printArr(arr *[5]int) {
	arr[0] = 10
	for i, v := range arr {
		fmt.Println(i, v)
	}
}

func main() {
	var arr1 [5]int
	printArr(&arr1)
	fmt.Println("arr1", arr1) // arr1 [10 0 0 0 0]

	arr2 := [...]int{2, 4, 6, 8, 10}
	printArr(&arr2)
	fmt.Println("arr2", arr2) // arr2 [10 4 6 8 10]
}
```

值拷贝行为会造成性能问题，通常会建议使用 slice，或数组指针。

```go
package main

import (
    "fmt"
)

func test(x [2]int) {
    fmt.Printf("x: %p\n", &x)
    x[1] = 1000
}

func main() {
    a := [2]int{}
    fmt.Printf("a: %p\n", &a)

    test(a)
    fmt.Println(a)
}
```

输出结果:

```go
a: 0xc42007c010
x: 0xc42007c030
[0 0]
```

内置函数 len 和 cap 都返回数组长度 (元素数量)。

```go
package main

func main() {
    a := [2]int{}
    println(len(a), cap(a))
}
```

输出结果：

```go
2 2
```

### 6、求数组元素之和

```go
package main

import (
	"fmt"
	"math/rand"
	"time"
)

// 求元素和
func sumArr(a [10]int) int {
	var sum int = 0
	for i := 0; i < len(a); i++ {
		sum += a[i]
	}
	return sum
}

func main() {
	// 若想做一个真正的随机数，要种子
	// seed()种子默认是1
	// rand.Seed(1)
	rand.Seed(time.Now().Unix())

	var b [10]int
	for i := 0; i < len(b); i++ {
		// 产生一个0到1000随机数
		b[i] = rand.Intn(1000)
	}
	sum := sumArr(b)
	fmt.Printf("sum=%d\n", sum)
}
```

### 7、两数之和

```go
package main

import "fmt"

// 找出数组中和为给定值的两个元素的下标，例如数组[1,3,5,8,7]，
// 找出两个元素之和等于8的下标分别是（0，4）和（1，2）

// 求元素和，是给定的值
func myTest(a [5]int, target int) {
    // 遍历数组
    for i := 0; i < len(a); i++ {
        other := target - a[i]
        // 继续遍历
        for j := i + 1; j < len(a); j++ {
            if a[j] == other {
                fmt.Printf("(%d,%d)\n", i, j)
            }
        }
    }
}

func main() {
    b := [5]int{1, 3, 5, 8, 7}
    myTest(b, 8)
}
```

## 二、切片

因为数组的长度是固定的并且数组长度属于类型的一部分，所以数组有很多的局限性。 例如：

```go
func arraySum(x [3]int) int{
    sum := 0
    for _, v := range x{
        sum = sum + v
    }
    return sum
}
```

这个求和函数只能接受`[3]int`类型，其他的都不支持。 再比如，

```go
a := [3]int{1, 2, 3}
```

数组a中已经有三个元素了，我们不能再继续往数组a中添加新元素了。

需要说明的是，slice 并不是数组或数组指针。它通过内部指针和相关属性引用数组片段，以实现长度可变。

### 1、切片定义

切片（Slice）是一个拥有相同类型元素的可变长度的序列。它是基于数组类型做的一层封装。它非常灵活，支持自动扩容。

切片是一个引用类型，它的内部结构包含`地址`、`长度`和`容量`。切片一般用于快速地操作一块数据集合。

- 切片：切片是数组的一个引用，因此切片是引用类型。但自身是结构体，值拷贝传递。
- 切片的长度可以改变，因此，切片是一个可变的数组。
- 切片遍历方式和数组一样，可以用 len()求长度。表示可用元素数量，读写操作不能超过该限制。
- cap 可以求出 slice 最大扩张容量，不能超出数组限制。0 <= len(slice) <= len(array)，其中 array 是 slice 引用的数组。
- 切片的定义：var 变量名 []类型，比如 var str []string var arr []int。
- 如果 slice == nil，那么 len、cap 结果都等于 0。



声明切片类型的基本语法如下：

```go
var name []T
```

其中，

- name:表示变量名
- T:表示切片中的元素类型

举个例子：

```go
func main() {
	// 声明切片类型
	var a []string              //声明一个字符串切片
	var b = []int{}             //声明一个整型切片并初始化
	var c = []bool{false, true} //声明一个布尔切片并初始化
	var d = []bool{false, true} //声明一个布尔切片并初始化
	fmt.Println(a)              //[]
	fmt.Println(b)              //[]
	fmt.Println(c)              //[false true]
	fmt.Println(a == nil)       //true
	fmt.Println(b == nil)       //false
	fmt.Println(c == nil)       //false
	// fmt.Println(c == d)   //切片是引用类型，不支持直接比较，只能和nil比较
}
```

#### 1.1 切片的长度和容量

切片拥有自己的长度和容量，我们可以通过使用内置的`len()`函数求长度，使用内置的`cap()`函数求切片的容量。

#### 1.2 切片表达式

切片表达式从字符串、数组、指向数组或切片的指针构造子字符串或切片。它有两种变体：一种指定low和high两个索引界限值的简单的形式，另一种是除了low和high索引界限值外还指定容量的完整的形式。

##### 1.2.1 简单切片表达式

切片的底层就是一个数组，所以我们可以基于数组通过切片表达式得到切片。 切片表达式中的`low`和`high`表示一个索引范围（左包含，右不包含），也就是下面代码中从数组a中选出`1<=索引值<4`的元素组成切片s，得到的切片`长度=high-low`，容量等于得到的切片的底层数组的容量。

```go
func main() {
	a := [5]int{1, 2, 3, 4, 5}
	s := a[1:3]  // s := a[low:high]
	fmt.Printf("s:%v len(s):%v cap(s):%v\n", s, len(s), cap(s))
}
```

输出：

```bash
s:[2 3] len(s):2 cap(s):4
```

为了方便起见，可以省略切片表达式中的任何索引。省略了`low`则默认为0；省略了`high`则默认为切片操作数的长度:

```go
a[2:]  // 等同于 a[2:len(a)]
a[:3]  // 等同于 a[0:3]
a[:]   // 等同于 a[0:len(a)]
```

**注意：**

对于数组或字符串，如果`0 <= low <= high <= len(a)`，则索引合法，否则就会索引越界（out of range）。

对切片再执行切片表达式时（切片再切片），`high`的上限边界是切片的容量`cap(a)`，而不是长度。**常量索引**必须是非负的，并且可以用int类型的值表示;对于数组或常量字符串，常量索引也必须在有效范围内。如果`low`和`high`两个指标都是常数，它们必须满足`low <= high`。如果索引在运行时超出范围，就会发生运行时`panic`。

```go
func main() {
	a := [5]int{1, 2, 3, 4, 5}
	s := a[1:3]  // s := a[low:high]
	fmt.Printf("s:%v len(s):%v cap(s):%v\n", s, len(s), cap(s))
	s2 := s[3:4]  // 索引的上限是cap(s)而不是len(s)
	fmt.Printf("s2:%v len(s2):%v cap(s2):%v\n", s2, len(s2), cap(s2))
}
```

输出：

```bash
s:[2 3] len(s):2 cap(s):4
s2:[5] len(s2):1 cap(s2):1
```

##### 1.2.2 完整切片表达式

对于数组，指向数组的指针，或切片a(**注意不能是字符串**)支持完整切片表达式：

```go
a[low : high : max]
```

上面的代码会构造与简单切片表达式`a[low: high]`相同类型、相同长度和元素的切片。另外，它会将得到的结果切片的容量设置为`max-low`。在完整切片表达式中只有第一个索引值（low）可以省略；它默认为0。

```go
func main() {
	a := [5]int{1, 2, 3, 4, 5}
	t := a[1:3:5]
	fmt.Printf("t:%v len(t):%v cap(t):%v\n", t, len(t), cap(t))
}
```

输出结果：

```bash
t:[2 3] len(t):2 cap(t):4
```

完整切片表达式需要满足的条件是`0 <= low <= high <= max <= cap(a)`，其他条件和简单切片表达式相同。

### 2、创建切片

```go
package main

import "fmt"

func main() {
	//1.声明切片
	var s1 []int
	if s1 == nil {
		fmt.Println("是空") // 是空
	} else {
		fmt.Println("不是空")
	}

	// 2.:=
	s2 := []int{}

	// 3.make()
	var s3 []int = make([]int, 0)
	fmt.Println(s1, s2, s3) // [] [] []

	// 4.初始化赋值
	var s4 []int = make([]int, 0, 0)
	fmt.Println(s4) // []
	s5 := []int{1, 2, 3}
	fmt.Println(s5) // [1 2 3]

	// 5.从数组切片
	arr := [5]int{1, 2, 3, 4, 5}
	var s6 []int

	// 前包后不包
	s6 = arr[1:4]
	fmt.Println(s6) // [2 3 4]
}
```

#### 使用make()函数构造切片

我们上面都是基于数组来创建的切片，如果需要动态的创建一个切片，我们就需要使用内置的`make()`函数，格式如下：

```bash
make([]T, size, cap)
```

其中：

- T:切片的元素类型
- size:切片中元素的数量
- cap:切片的容量

举个例子：

```go
func main() {
	a := make([]int, 2, 10)
	fmt.Println(a)      //[0 0]
	fmt.Println(len(a)) //2
	fmt.Println(cap(a)) //10
}
```

上面代码中`a`的内部存储空间已经分配了10个，但实际上只用了2个。 容量并不会影响当前元素的个数，所以`len(a)`返回2，`cap(a)`则返回该切片的容量。

### 3、切片初始化

```go
package main

import (
    "fmt"
)

var arr = [...]int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
var slice0 []int = arr[2:8]
var slice1 []int = arr[0:6]        //可以简写为 var slice []int = arr[:end]
var slice2 []int = arr[5:10]       //可以简写为 var slice[]int = arr[start:]
var slice3 []int = arr[0:len(arr)] //var slice []int = arr[:]
var slice4 = arr[:len(arr)-1]      //去掉切片的最后一个元素

func main() {
    fmt.Printf("全局变量：arr %v\n", arr)
    fmt.Printf("全局变量：slice0 %v\n", slice0)
    fmt.Printf("全局变量：slice1 %v\n", slice1)
    fmt.Printf("全局变量：slice2 %v\n", slice2)
    fmt.Printf("全局变量：slice3 %v\n", slice3)
    fmt.Printf("全局变量：slice4 %v\n", slice4)
    fmt.Printf("-----------------------------------\n")

    arr2 := [...]int{9, 8, 7, 6, 5, 4, 3, 2, 1, 0}
    slice5 := arr[2:8]
    slice6 := arr[0:6]         //可以简写为 slice := arr[:end]
    slice7 := arr[5:10]        //可以简写为 slice := arr[start:]
    slice8 := arr[0:len(arr)]  //slice := arr[:]
    slice9 := arr[:len(arr)-1] //去掉切片的最后一个元素

    fmt.Printf("局部变量： arr2 %v\n", arr2)
    fmt.Printf("局部变量： slice5 %v\n", slice5)
    fmt.Printf("局部变量： slice6 %v\n", slice6)
    fmt.Printf("局部变量： slice7 %v\n", slice7)
    fmt.Printf("局部变量： slice8 %v\n", slice8)
    fmt.Printf("局部变量： slice9 %v\n", slice9)
}
```

输出结果：

```
全局变量：arr [0 1 2 3 4 5 6 7 8 9]
全局变量：slice0 [2 3 4 5 6 7]
全局变量：slice1 [0 1 2 3 4 5]
全局变量：slice2 [5 6 7 8 9]
全局变量：slice3 [0 1 2 3 4 5 6 7 8 9]
全局变量：slice4 [0 1 2 3 4 5 6 7 8]
-----------------------------------
局部变量： arr2 [9 8 7 6 5 4 3 2 1 0]
局部变量： slice5 [2 3 4 5 6 7]
局部变量： slice6 [0 1 2 3 4 5]
局部变量： slice7 [5 6 7 8 9]
局部变量： slice8 [0 1 2 3 4 5 6 7 8 9]
局部变量： slice9 [0 1 2 3 4 5 6 7 8]
```

#### 切片操作

|      操作       | 含义                                                                   |
| :-------------: | ---------------------------------------------------------------------- |
|      s[n]       | 切片 s 中索引位置为 n 的元素                                           |
|      s[:]       | 从切片 s 的索引位置 0~len(s)-1 处所获得的切片                          |
|     s[low:]     | 从切片 s 的索引位置 low~len(s)-1 处所获得的切片                        |
|    s[:high]     | 从切片 s 的索引位置 0~high 处所获得的切片，len=high                    |
|   s[low:high]   | 从切片 s 的索引位置 low~high 处所获得的切片，len=high-low              |
| s[low:high:max] | 从切片 s 的索引位置 low~high 处所获得的切片，len=high-low，cap=max-low |
|     len(s)      | 切片 s 的长度，总是 <= cap(s)                                          |
|     cap(s)      | 切片 s 的容量，总是 >= len(s)                                          |

### 4、通过 make 来创建切片

```go
package main

import (
	"fmt"
)

var slice0 []int = make([]int, 10)
var slice1 = make([]int, 10)
var slice2 = make([]int, 10, 10)

func main() {
	fmt.Printf("make全局slice0 ：%v\n", slice0)
	fmt.Printf("make全局slice1 ：%v\n", slice1)
	fmt.Printf("make全局slice2 ：%v\n", slice2)
	fmt.Println("--------------------------------------")

	slice3 := make([]int, 10)
	slice4 := make([]int, 10)
	slice5 := make([]int, 10, 10)

	fmt.Printf("make局部slice3 ：%v\n", slice3)
	fmt.Printf("make局部slice4 ：%v\n", slice4)
	fmt.Printf("make局部slice5 ：%v\n", slice5)
}
```

输出结果：

```
make全局slice0 ：[0 0 0 0 0 0 0 0 0 0]
make全局slice1 ：[0 0 0 0 0 0 0 0 0 0]
make全局slice2 ：[0 0 0 0 0 0 0 0 0 0]
--------------------------------------
make局部slice3 ：[0 0 0 0 0 0 0 0 0 0]
make局部slice4 ：[0 0 0 0 0 0 0 0 0 0]
make局部slice5 ：[0 0 0 0 0 0 0 0 0 0]
```

读写操作实际目标是底层数组，只需注意索引号的差别。

```go
package main

import (
  "fmt"
)

func main() {
  data := [...]int{0, 1, 2, 3, 4, 5}

  s := data[2:4]
  s[0] += 100
  s[1] += 200

  fmt.Println(s) // [102 203]
  fmt.Println(data) // [0 1 102 203 4 5]
}
```

可直接创建 slice 对象，自动分配底层数组。

```go
package main

import "fmt"

func main() {
  s1 := []int{0, 1, 2, 3, 8: 100} // 通过初始化表达式构造，可使用索引号。
  fmt.Println(s1, len(s1), cap(s1)) // [0 1 2 3 0 0 0 0 100] 9 9

  s2 := make([]int, 6, 8) // 使用 make 创建，指定 len 和 cap 值。
  fmt.Println(s2, len(s2), cap(s2)) // [0 0 0 0 0 0] 6 8

  s3 := make([]int, 6) // 省略 cap，相当于 cap = len。
  fmt.Println(s3, len(s3), cap(s3)) // [0 0 0 0 0 0] 6 6
}
```

使用 make 动态创建 slice，避免了数组必须用常量做长度的麻烦。还可用指针直接访问底层数组，退化成普通数组操作。

```go
package main

import "fmt"

func main() {
  s := []int{0, 1, 2, 3}
  p := &s[2] // *int, 获取底层数组元素指针。
  *p += 100

  fmt.Println(s) // [0 1 102 3]
}
```

至于 [][]T，是指元素类型为 []T 。

```go
package main

import (
  "fmt"
)

func main() {
  data := [][]int{
    []int{1, 2, 3},
    []int{100, 200},
    []int{11, 22, 33, 44},
  }
  fmt.Println(data) // [[1 2 3] [100 200] [11 22 33 44]]
}
```

可直接修改 struct array/slice 成员。

```go
package main

import (
  "fmt"
)

func main() {
  d := [5]struct {
    x int
  }{}

  s := d[:]

  d[1].x = 10
  s[2].x = 20

  fmt.Println(d) // [{0} {10} {20} {0} {0}]
  fmt.Printf("%p, %p\n", &d, &d[0]) // 0xc4200160f0, 0xc4200160f0
}
```

### 5、切片 resize（调整大小）

```go
package main

import (
  "fmt"
)

func main() {
  var a = []int{1, 3, 4, 5}
  fmt.Printf("slice a : %v , len(a) : %v\n", a, len(a))
  b := a[1:2]
  fmt.Printf("slice b : %v , len(b) : %v\n", b, len(b))
  c := b[0:3]
  fmt.Printf("slice c : %v , len(c) : %v\n", c, len(c))
}
```

输出结果：

```go
slice a : [1 3 4 5] , len(a) : 4
slice b : [3] , len(b) : 1
slice c : [3 4 5] , len(c) : 3
```

### 6、数组和切片的内存布局

![切片](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/3.jpg)

### 7、字符串和切片（string and slice）

string 底层就是一个 byte 的数组，因此，也可以进行切片操作。

```go
package main

import (
  "fmt"
)

func main() {
  str := "hello world"
  s1 := str[0:5]
  fmt.Println(s1) // hello

  s2 := str[6:]
  fmt.Println(s2) // world
}
```

string 本身是不可变的，因此要改变 string 中字符。需要如下操作： 英文字符串：

```go
package main

import (
  "fmt"
)

func main() {
  str := "Hello world"
  s := []byte(str) //中文字符需要用[]rune(str)
  s[6] = 'G'
  s = s[:8]
  s = append(s, '!')
  str = string(s)
  fmt.Println(str) // Hello Go!
}
```

### 8、含有中文字符串：

```go
package main

import (
  "fmt"
)

func main() {
  str := "你好，世界！hello world！"
  s := []rune(str)
  s[3] = '够'
  s[4] = '浪'
  s[12] = 'g'
  s = s[:14]
  str = string(s)
  fmt.Println(str) // 你好，够浪！hello go
}
```

golang slice data[:6:8] 两个冒号的理解

- 常规 slice , data[6:8]，从第 6 位到第 8 位（返回 6， 7），长度 len 为 2， 最大可扩充长度 cap 为 4（6-9）

- 另一种写法： data[:6:8] 每个数字前都有个冒号， slice 内容为 data 从 0 到第 6 位，长度 len 为 6，最大扩充项 cap 设置为 8

- a[x:y:z] 切片内容 [x:y]
  - 切片长度: y-x
  - 切片容量: z-x

```go
package main

import (
	"fmt"
)

func main() {
	slice := []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
	d1 := slice[6:8]
	fmt.Println(d1, len(d1), cap(d1)) // [6 7] 2 4

	d2 := slice[:6:8]
	fmt.Println(d2, len(d2), cap(d2)) // [0 1 2 3 4 5] 6 8
}
```

数组 or 切片转字符串：

```go
strings.Replace(strings.Trim(fmt.Sprint(array_or_slice), "[]"), " ", ",", -1)
```

## 三、切片的本质

### 1、切片的本质

切片的本质就是对底层数组的封装，它包含了三个信息：底层数组的指针、切片的长度（len）和切片的容量（cap）。

举个例子，现在有一个数组`a := [8]int{0, 1, 2, 3, 4, 5, 6, 7}`，切片`s1 := a[:5]`，相应示意图如下。

![slice_01](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/slice_01.png)切片`s2 := a[3:6]`，相应示意图如下：

![slice_02](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/slice_02.png)

##### 判断切片是否为空

要检查切片是否为空，请始终使用`len(s) == 0`来判断，而不应该使用`s == nil`来判断。

### 2、切片不能直接比较

切片之间是不能比较的，我们不能使用`==`操作符来判断两个切片是否含有全部相等元素。 切片唯一合法的比较操作是和`nil`比较。 一个`nil`值的切片并没有底层数组，一个`nil`值的切片的长度和容量都是0。但是我们不能说一个长度和容量都是0的切片一定是`nil`，例如下面的示例：

```go
var s1 []int         //len(s1)=0;cap(s1)=0;s1==nil
s2 := []int{}        //len(s2)=0;cap(s2)=0;s2!=nil
s3 := make([]int, 0) //len(s3)=0;cap(s3)=0;s3!=nil
```

所以要判断一个切片是否是空的，要是用`len(s) == 0`来判断，不应该使用`s == nil`来判断。

### 3、切片的赋值拷贝

下面的代码中演示了拷贝前后两个变量共享底层数组，对一个切片的修改会影响另一个切片的内容，这点需要特别注意。

```go
func main() {
	s1 := make([]int, 3) //[0 0 0]
	s2 := s1             //将s1直接赋值给s2，s1和s2共用一个底层数组
	s2[0] = 100
	fmt.Println(s1) //[100 0 0]
	fmt.Println(s2) //[100 0 0]
}
```

### 4、切片遍历

切片的遍历方式和数组是一致的，支持索引遍历和`for range`遍历。

```go
func main() {
	s := []int{1, 3, 5}

	for i := 0; i < len(s); i++ {
		fmt.Println(i, s[i])
	}

	for index, value := range s {
		fmt.Println(index, value)
	}
}
```

#### 实例

```go
package main

import (
  "fmt"
)

func main() {
  data := [...]int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
  slice := data[:]
  for index, value := range slice {
    fmt.Printf("inde : %v , value : %v\n", index, value)
  }
}
```

输出结果：

```go
inde : 0 , value : 0
inde : 1 , value : 1
inde : 2 , value : 2
inde : 3 , value : 3
inde : 4 , value : 4
inde : 5 , value : 5
inde : 6 , value : 6
inde : 7 , value : 7
inde : 8 , value : 8
inde : 9 , value : 9
```

### 5、append()方法为切片添加元素

Go语言的内建函数`append()`可以为切片动态添加元素。 可以一次添加一个元素，可以添加多个元素，也可以添加另一个切片中的元素（后面加…）。

```go
func main(){
	var s []int
	s = append(s, 1)        // [1]
	s = append(s, 2, 3, 4)  // [1 2 3 4]
	s2 := []int{5, 6, 7}  
	s = append(s, s2...)    // [1 2 3 4 5 6 7]
}
```

**注意：**通过var声明的零值切片可以在`append()`函数直接使用，无需初始化。

```go
var s []int
s = append(s, 1, 2, 3)
```

没有必要像下面的代码一样初始化一个切片再传入`append()`函数使用，

```go
s := []int{}  // 没有必要初始化
s = append(s, 1, 2, 3)

var s = make([]int)  // 没有必要初始化
s = append(s, 1, 2, 3)
```

每个切片会指向一个底层数组，这个数组的容量够用就添加新增元素。当底层数组不能容纳新增的元素时，切片就会自动按照一定的策略进行“扩容”，此时该切片指向的底层数组就会更换。“扩容”操作往往发生在`append()`函数调用时，所以我们通常都需要用原变量接收append函数的返回值。

举个例子：

```go
func main() {
	//append()添加元素和切片扩容
	var numSlice []int
	for i := 0; i < 10; i++ {
		numSlice = append(numSlice, i)
		fmt.Printf("%v  len:%d  cap:%d  ptr:%p\n", numSlice, len(numSlice), cap(numSlice), numSlice)
	}
}
```

输出：

```bash
[0]  len:1  cap:1  ptr:0xc0000a8000
[0 1]  len:2  cap:2  ptr:0xc0000a8040
[0 1 2]  len:3  cap:4  ptr:0xc0000b2020
[0 1 2 3]  len:4  cap:4  ptr:0xc0000b2020
[0 1 2 3 4]  len:5  cap:8  ptr:0xc0000b6000
[0 1 2 3 4 5]  len:6  cap:8  ptr:0xc0000b6000
[0 1 2 3 4 5 6]  len:7  cap:8  ptr:0xc0000b6000
[0 1 2 3 4 5 6 7]  len:8  cap:8  ptr:0xc0000b6000
[0 1 2 3 4 5 6 7 8]  len:9  cap:16  ptr:0xc0000b8000
[0 1 2 3 4 5 6 7 8 9]  len:10  cap:16  ptr:0xc0000b8000
```

从上面的结果可以看出：

1. `append()`函数将元素追加到切片的最后并返回该切片。
2. 切片numSlice的容量按照1，2，4，8，16这样的规则自动进行扩容，每次扩容后都是扩容前的2倍。

append()函数还支持一次性追加多个元素。 例如：

```go
var citySlice []string
// 追加一个元素
citySlice = append(citySlice, "北京")
// 追加多个元素
citySlice = append(citySlice, "上海", "广州", "深圳")
// 追加切片
a := []string{"成都", "重庆"}
citySlice = append(citySlice, a...)
fmt.Println(citySlice) //[北京 上海 广州 深圳 成都 重庆]
```

#### 完整的append例子

```go
package main

import (
  "fmt"
)

func main() {

  var a = []int{1, 2, 3}
  fmt.Printf("slice a : %v\n", a) // slice a : [1 2 3]

  var b = []int{4, 5, 6}
  fmt.Printf("slice b : %v\n", b) // slice b : [4 5 6]

  c := append(a, b...)
  fmt.Printf("slice c : %v\n", c) // slice c : [1 2 3 4 5 6]

  d := append(c, 7)
  fmt.Printf("slice d : %v\n", d) // slice d : [1 2 3 4 5 6 7]

  e := append(d, 8, 9, 10)
  fmt.Printf("slice e : %v\n", e) // slice e : [1 2 3 4 5 6 7 8 9 10]
}
```

append ：向 slice 尾部添加数据，返回新的 slice 对象。

```go
package main

import (
  "fmt"
)

func main() {

  s1 := make([]int, 0, 5)
  fmt.Printf("%p\n", &s1) // 0xc42000a060

  s2 := append(s1, 1)
  fmt.Printf("%p\n", &s2) // 0xc42000a080

  fmt.Println(s1, s2) // [] [1]
}
```

### 6、切片的扩容策略

可以通过查看`$GOROOT/src/runtime/slice.go`源码，其中扩容相关代码如下：

```go
newcap := old.cap
doublecap := newcap + newcap
if cap > doublecap {
	newcap = cap
} else {
	if old.len < 1024 {
		newcap = doublecap
	} else {
		// Check 0 < newcap to detect overflow
		// and prevent an infinite loop.
		for 0 < newcap && newcap < cap {
			newcap += newcap / 4
		}
		// Set newcap to the requested cap when
		// the newcap calculation overflowed.
		if newcap <= 0 {
			newcap = cap
		}
	}
}
```

从上面的代码可以看出以下内容：

- 首先判断，如果新申请容量（cap）大于2倍的旧容量（old.cap），最终容量（newcap）就是新申请的容量（cap）。
- 否则判断，如果旧切片的长度小于1024，则最终容量(newcap)就是旧容量(old.cap)的两倍，即（newcap=doublecap），
- 否则判断，如果旧切片长度大于等于1024，则最终容量（newcap）从旧容量（old.cap）开始循环增加原来的1/4，即（newcap=old.cap,for {newcap += newcap/4}）直到最终容量（newcap）大于等于新申请的容量(cap)，即（newcap >= cap）
- 如果最终容量（cap）计算值溢出，则最终容量（cap）就是新申请容量（cap）。

需要注意的是，切片扩容还会根据切片中元素的类型不同而做不同的处理，比如`int`和`string`类型的处理方式就不一样。

#### 6.1 超出原 slice.cap 限制

> 就会重新分配底层数组，即便原数组并未填满。

```go
package main

import (
  "fmt"
)

func main() {

  data := [...]int{0, 1, 2, 3, 4, 10: 0}
  s := data[:2:3]

  s = append(s, 100, 200) // 一次 append 两个值，超出 s.cap 限制。

  fmt.Println(s, data) // [0 1 100 200] [0 1 2 3 4 0 0 0 0 0 0] 重新分配底层数组，与原数组无关。
  fmt.Println(&s[0], &data[0]) // 0xc4200160f0 0xc420070060 比对底层数组起始指针。
}
```

从输出结果可以看出，append 后的 s 重新分配了底层数组，并复制数据。如果只追加一个值，则不会超过 s.cap 限制，也就不会重新分配。 通常以 2 倍容量重新分配底层数组。在大批量添加数据时，建议一次性分配足够大的空间，以减少内存分配和数据复制开销。或初始化足够长的 len 属性，改用索引号进行操作。及时释放不再使用的 slice 对象，避免持有过期数组，造成 GC 无法回收。

#### 6.2 slice 中 cap 重新分配规律：

```go
package main

import (
  "fmt"
)

func main() {

  s := make([]int, 0, 1)
  c := cap(s)

  for i := 0; i < 50; i++ {
    s = append(s, i)
    if n := cap(s); n > c {
      fmt.Printf("cap: %d -> %d\n", c, n)
      c = n
    }
  }
}
```

输出结果:

```go
cap: 1 -> 2
cap: 2 -> 4
cap: 4 -> 8
cap: 8 -> 16
cap: 16 -> 32
cap: 32 -> 64
```

### 7、使用copy()函数复制切片

首先我们来看一个问题：

```go
func main() {
	a := []int{1, 2, 3, 4, 5}
	b := a
	fmt.Println(a) //[1 2 3 4 5]
	fmt.Println(b) //[1 2 3 4 5]
	b[0] = 1000
	fmt.Println(a) //[1000 2 3 4 5]
	fmt.Println(b) //[1000 2 3 4 5]
}
```

由于切片是引用类型，所以a和b其实都指向了同一块内存地址。修改b的同时a的值也会发生变化。

Go语言内建的`copy()`函数可以迅速地将一个切片的数据复制到另外一个切片空间中，`copy()`函数的使用格式如下：

```bash
copy(destSlice, srcSlice []T)
```

其中：

- srcSlice: 数据来源切片
- destSlice: 目标切片

举个例子：

```go
func main() {
	// copy()复制切片
	a := []int{1, 2, 3, 4, 5}
	c := make([]int, 5, 5)
	copy(c, a)     //使用copy()函数将切片a中的元素复制到切片c
	fmt.Println(a) //[1 2 3 4 5]
	fmt.Println(c) //[1 2 3 4 5]
	c[0] = 1000
	fmt.Println(a) //[1 2 3 4 5]
	fmt.Println(c) //[1000 2 3 4 5]
}
```

#### 完整实例

```go
package main

import (
  "fmt"
)

func main() {

  s1 := []int{1, 2, 3, 4, 5}
  fmt.Printf("slice s1 : %v\n", s1) // slice s1 : [1 2 3 4 5]

  s2 := make([]int, 10)
  fmt.Printf("slice s2 : %v\n", s2) // slice s2 : [0 0 0 0 0 0 0 0 0 0]

  copy(s2, s1)
  fmt.Printf("copied slice s1 : %v\n", s1) // copied slice s1 : [1 2 3 4 5]
  fmt.Printf("copied slice s2 : %v\n", s2) // copied slice s2 : [1 2 3 4 5 0 0 0 0 0]

  s3 := []int{1, 2, 3}
  fmt.Printf("slice s3 : %v\n", s3) // slice s3 : [1 2 3]

  s3 = append(s3, s2...)
  fmt.Printf("appended slice s3 : %v\n", s3)
  // appended slice s3 : [1 2 3 1 2 3 4 5 0 0 0 0 0]

  s3 = append(s3, 4, 5, 6)
  fmt.Printf("last slice s3 : %v\n", s3)
  // last slice s3 : [1 2 3 1 2 3 4 5 0 0 0 0 0 4 5 6]
}
```

copy ：函数 copy 在两个 slice 间复制数据，复制长度以 len 小的为准。两个 slice 可指向同一底层数组，允许元素区间重叠。

```go
package main

import (
  "fmt"
)

func main() {
  data := [...]int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
  fmt.Println("array data : ", data) // array data :  [0 1 2 3 4 5 6 7 8 9]

  s1 := data[8:]
  s2 := data[:5]
  fmt.Printf("slice s1 : %v\n", s1) // slice s1 : [8 9]
  fmt.Printf("slice s2 : %v\n", s2) // slice s2 : [0 1 2 3 4]

  copy(s2, s1)
  fmt.Printf("copied slice s1 : %v\n", s1) // copied slice s1 : [8 9]
  fmt.Printf("copied slice s2 : %v\n", s2) // copied slice s2 : [8 9 2 3 4]
  fmt.Println("last array data : ", data) // last array data :  [8 9 2 3 4 5 6 7 8 9]
}
```

应及时将所需数据 copy 到较小的 slice，以便释放超大号底层数组内存。

### 8、从切片中删除元素

Go语言中并没有删除切片元素的专用方法，我们可以使用切片本身的特性来删除元素。 代码如下：

```go
func main() {
	// 从切片中删除元素
	a := []int{30, 31, 32, 33, 34, 35, 36, 37}
	// 要删除索引为2的元素
	a = append(a[:2], a[3:]...)
	fmt.Println(a) //[30 31 33 34 35 36 37]
}
```

总结一下就是：要从切片a中删除索引为`index`的元素，操作方法是`a = append(a[:index], a[index+1:]...)`

### 9、练习题

1.请写出下面代码的输出结果。

```go
func main() {
	var a = make([]string, 5, 10)
	for i := 0; i < 10; i++ {
		a = append(a, fmt.Sprintf("%v", i))
	}
	fmt.Println(a) // [     0 1 2 3 4 5 6 7 8 9]
}
```

2.请使用内置的`sort`包对数组`var a = [...]int{3, 7, 8, 9, 1}`进行排序（附加题，自行查资料解答）。

```go
package main

import (
	"fmt"
	"sort"
)

func main() {
	var a = [...]int{3, 7, 8, 9, 1}
	// a[:]得到的是一个切片，指向了底层的数组a
	sort.Ints(a[:])
	fmt.Println(a) // [1 3 7 8 9]
}
```

## 四、切片底层实现

切片是 Go 中的一种基本的数据结构，使用这种结构可以用来管理数据集合。切片的设计想法是由动态数组概念而来，为了开发者可以更加方便的使一个数据结构可以自动增加和减少。但是切片本身并不是动态数据或者数组指针。切片常见的操作有 reslice、append、copy。与此同时，切片还具有可索引，可迭代的优秀特性。

### 1、切片和数组

在 Go 中，与 C 数组变量隐式作为指针使用不同，Go 中的数组是值类型，赋值和函数传参操作都会复制整个数组数据。

```go
package main

import (
	"fmt"
)

func main() {
	array1 := [2]int{100, 200}
	var array2 [2]int
	array2 = array1

	fmt.Printf("array1: %p, %v\n", &array1, array1) // array1: 0xc0000b0010, [100 200]
	fmt.Printf("array2: %p, %v\n", &array2, array2) // array2: 0xc0000b0020, [100 200]

	testArray(array1)
}

func testArray(array [2]int) {
	fmt.Printf("fun Array: %p, %v\n", &array, array) // fun Array: 0xc0000b0050, [100 200]
}
```

可以发现，三个内存地址都不同，这也就验证了 Go 中数组赋值和函数传参都是值赋值的。那这会导致什么问题呢？假设每次传参都是用数组，那么每次数组都要被复制一遍。如果数组大小有 100 万，在 64 位机器上就需要花费约 800 万字节，即 8MB 内存。这样会消耗掉大量的内存，于是乎就有人想到，函数传参用数组的指针。

```go
package main

import (
	"fmt"
)

func main() {
	// 1，传数组指针
	array1 := []int{100, 200}
	testArrayPoint(&array1) // fun Array: 0xc0000a4018, [100 200]

	// 2，传切片
	array2 := array1[:]
	testArrayPoint(&array2) // fun Array: 0xc0000a4048, [100 300]

	fmt.Printf("array1: %p, %v\n", &array1, array1) // array1: 0xc0000a4018, [100 400]
}

func testArrayPoint(array *[]int) {
	fmt.Printf("fun Array: %p, %v\n", array, *array)
	(*array)[1] += 100
}
```

上述示例，证明了数组指针确实达到了我们想要的效果。现在就算是传入 10 亿的数组，也只需要在栈上分配一个 8 字节的内存给指针就可以了。这样就更加高效的利用内存，性能也比之前的好。

不过传指针会有一个弊端，从打印结果可以看到，第一行和第三行指针地址都是相同的，万一原数组的指针指向更改了，那么函数里面的指针指向都会跟着改变。

切片的优势也就表现出来了，用切片传数组参数，既可以达到节约内存的目的，也可以达到合理处理好共享内存的问题。打印结果第二行就是切片，切片的指针和原来数组的指针是不同的。

由此我们可以得到结论：把第一个大数组传递给函数会消耗掉很多内存，采用切片的方式传参可以避免上述问题。切片是引用传递，所以她们不需要使用额外的内存并且比使用数组更有效率。

但是，依旧有反例：

```go
package main

import "testing"

func array() [1024]int {
  var x [1024]int
  for i := 0; i < len(x); i++ {
    x[i] = i
  }
  return x
}

func slice() []int {
  x := make([]int, 1024)
  for i := 0; i < len(x); i++ {
    x[i] = i
  }
  return x
}

func BenchmarkArray(b *testing.B) {
  for i := 0; i < b.N; i++ {
    array()
  }
}

func BenchmarkSlice(b *testing.B) {
  for i := 0; i < b.N; i++ {
    slice()
  }
}
```

我们做一次性能测试，并且禁用内联和优化，来观察切片的堆上内存分配的情况。

```go
go test -bench . -benchmem -gcflags "-N -l"
```

输出结果比较“令人意外”：

```go
BenchmarkArray-4   500000     3637 ns/op      0 B/op        0 alloc s/op
BenchmarkSlice-4   300000     4055 ns/op      8192 B/op     1 alloc s/op
```

解释一下上述结果，在测试 Array 的时候，用的是 4 核，循环次数是 500000，平均每次执行时间是 3637 ns，每次执行堆上分配内存总量是 0，分配次数也是 0 。

而切片的结果就“差”一点，同样也是用的是 4 核，循环次数是 300000，平均每次执行时间是 4055 ns，但是每次执行一次，堆上分配内存总量是 8192，分配次数也是 1 。

这样对比看来，并非所有时候都适合用切片代替数组，因为切片底层数组可能会在堆上分配内存，而且小数组在栈上拷贝的消耗也未必比 make 消耗大。

### 2、切片的数据结构

切片本身并不是动态数组或者数组指针。它内部实现的数据结构通过指针引用底层数组，设定相关属性将数据读写操作限定在指定的区域内。切片本身是一个只读对象，其工作机制类似数组指针的一种封装。

切片（slice）是对数组一个连续片段的引用，所以切片是一个引用类型（因此更类似于 C/C++ 中的数组类型，或者 Python 中的 list 类型）。这个片段可以是整个数组，或者是由起始和终止索引标识的一些项的子集。需要注意的是，终止索引标识的项不包括在切片内。切片提供了一个与指向数组的动态窗口。

给定项的切片索引可能比相关数组的相同元素的索引小。和数组不同的是，切片的长度可以在运行时修改，最小为 0 最大为相关数组的长度：切片是一个长度可变的数组。

Slice 的数据结构定义如下:

```go
type slice struct {
  array unsafe.Pointer
  len   int
  cap   int
}
```

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/slice-2.png)

切片的结构体由 3 部分构成，Pointer 是指向一个数组的指针，len 代表当前切片的长度，cap 是当前切片的容量。cap 总是大于等于 len 的。

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/slice-3.png)

如果想从 slice 中得到一块内存地址，可以这样做：

```go
s := make([]byte, 200)
ptr := unsafe.Pointer(&s[0])
```

如果反过来呢？从 Go 的内存地址中构造一个 slice。

```go
var ptr unsafe.Pointer
var s1 = struct {
  addr uintptr
  len int
  cap int
}{ptr, length, length}
s := *(*[]byte)(unsafe.Pointer(&s1))
```

构造一个虚拟的结构体，把 slice 的数据结构拼出来。

当然还有更加直接的方法，在 Go 的反射中就存在一个与之对应的数据结构 SliceHeader，我们可以用它来构造一个 slice

```go
var o []byte
sliceHeader := (*reflect.SliceHeader)((unsafe.Pointer(&o)))
sliceHeader.Cap = length
sliceHeader.Len = length
sliceHeader.Data = uintptr(ptr)
```

### 3、创建切片

make 函数允许在运行期动态指定数组长度，绕开了数组类型必须使用编译期常量的限制。

创建切片有两种形式，make 创建切片，空切片。

#### 3.1 make 和切片字面量

```go
func makeslice(et *_type, len, cap int) slice {
  // 根据切片的数据类型，获取切片的最大容量
  maxElements := maxSliceCap(et.size)
  // 比较切片的长度，长度值域应该在[0,maxElements]之间
  if len < 0 || uintptr(len) > maxElements {
    panic(errorString("makeslice: len out of range"))
  }
  // 比较切片的容量，容量值域应该在[len,maxElements]之间
  if cap < len || uintptr(cap) > maxElements {
    panic(errorString("makeslice: cap out of range"))
  }
  // 根据切片的容量申请内存
  p := mallocgc(et.size*uintptr(cap), et, true)
  // 返回申请好内存的切片的首地址
  return slice{p, len, cap}
}
```

还有一个 int64 的版本：

```go
func makeslice64(et *_type, len64, cap64 int64) slice {
  len := int(len64)
  if int64(len) != len64 {
    panic(errorString("makeslice: len out of range"))
  }

  cap := int(cap64)
  if int64(cap) != cap64 {
    panic(errorString("makeslice: cap out of range"))
  }

  return makeslice(et, len, cap)
}
```

实现原理和上面的是一样的，只不过多了把 int64 转换成 int 这一步罢了。

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/slice-4.png)

上图是用 make 函数创建的一个 len = 4， cap = 6 的切片。内存空间申请了 6 个 int 类型的内存大小。由于 len = 4，所以后面 2 个暂时访问不到，但是容量还是在的。这时候数组里面每个变量都是 0 。

除了 make 函数可以创建切片以外，字面量也可以创建切片。

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/slice-5.png)

这里是用字面量创建的一个 len = 6，cap = 6 的切片，这时候数组里面每个元素的值都初始化完成了。需要注意的是 [ ] 里面不要写数组的容量，因为如果写了个数以后就是数组了，而不是切片了。

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/slice-6.png)

还有一种简单的字面量创建切片的方法。如上图。上图就 Slice A 创建出了一个 len = 3，cap = 3 的切片。从原数组的第二位元素(0 是第一位)开始切，一直切到第四位为止(不包括第五位)。同理，Slice B 创建出了一个 len = 2，cap = 4 的切片。

#### 3.2 nil 和空切片

nil 切片和空切片也是常用的。

```go
var slice []int
```

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/slice-7.png)

nil 切片被用在很多标准库和内置函数中，描述一个不存在的切片的时候，就需要用到 nil 切片。比如函数在发生异常的时候，返回的切片就是 nil 切片。nil 切片的指针指向 nil。

空切片一般会用来表示一个空的集合。比如数据库查询，一条结果也没有查到，那么就可以返回一个空切片。

```go
silce := make( []int , 0 )
slice := []int{ }
```

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/slice-8.png)

空切片和 nil 切片的区别在于，空切片指向的地址不是 nil，指向的是一个内存地址，但是它没有分配任何内存空间，即底层元素包含 0 个元素。

最后需要说明的一点是。不管是使用 nil 切片还是空切片，对其调用内置函数 append，len 和 cap 的效果都是一样的。

### 4、切片扩容

当一个切片的容量满了，就需要扩容了。怎么扩，策略是什么？

```go
func growslice(et *_type, old slice, cap int) slice {
  if raceenabled {
    callerpc := getcallerpc(unsafe.Pointer(&et))
    racereadrangepc(old.array, uintptr(old.len*int(et.size)), callerpc, funcPC(growslice))
  }

  if msanenabled {
    msanread(old.array, uintptr(old.len*int(et.size)))
  }

  if et.size == 0 {
    // 如果新要扩容的容量比原来的容量还要小，这代表要缩容了，那么可以直接报panic了。
    if cap < old.cap {
      panic(errorString("growslice: cap out of range"))
    }

    // 如果当前切片的大小为0，还调用了扩容方法，那么就新生成一个新的容量的切片返回。
    return slice{unsafe.Pointer(&zerobase), old.len, cap}
  }

  // 这里就是扩容的策略
  newcap := old.cap
  doublecap := newcap + newcap
  if cap > doublecap {
    newcap = cap
  } else {
    if old.len < 1024 {
      newcap = doublecap
    } else {
      for newcap < cap {
        newcap += newcap / 4
      }
    }
  }

  // 计算新的切片的容量，长度。
  var lenmem, newlenmem, capmem uintptr
  const ptrSize = unsafe.Sizeof((*byte)(nil))
  switch et.size {
    case 1:
    lenmem = uintptr(old.len)
    newlenmem = uintptr(cap)
    capmem = roundupsize(uintptr(newcap))
    newcap = int(capmem)
    case ptrSize:
    lenmem = uintptr(old.len) * ptrSize
    newlenmem = uintptr(cap) * ptrSize
    capmem = roundupsize(uintptr(newcap) * ptrSize)
    newcap = int(capmem / ptrSize)
    default:
    lenmem = uintptr(old.len) * et.size
    newlenmem = uintptr(cap) * et.size
    capmem = roundupsize(uintptr(newcap) * et.size)
    newcap = int(capmem / et.size)
  }

  // 判断非法的值，保证容量是在增加，并且容量不超过最大容量
  if cap < old.cap || uintptr(newcap) > maxSliceCap(et.size) {
    panic(errorString("growslice: cap out of range"))
  }

  var p unsafe.Pointer
  if et.kind&kindNoPointers != 0 {
    // 在老的切片后面继续扩充容量
    p = mallocgc(capmem, nil, false)
    // 将 lenmem 这个多个 bytes 从 old.array地址 拷贝到 p 的地址处
    memmove(p, old.array, lenmem)
    // 先将 P 地址加上新的容量得到新切片容量的地址，然后将新切片容量地址后面的 capmem-newlenmem 个 bytes 这块内存初始化。为之后继续 append() 操作腾出空间。
    memclrNoHeapPointers(add(p, newlenmem), capmem-newlenmem)
  } else {
    // 重新申请新的数组给新切片
    // 重新申请 capmen 这个大的内存地址，并且初始化为0值
    p = mallocgc(capmem, et, true)
    if !writeBarrier.enabled {
      // 如果还不能打开写锁，那么只能把 lenmem 大小的 bytes 字节从 old.array 拷贝到 p 的地址处
      memmove(p, old.array, lenmem)
    } else {
      // 循环拷贝老的切片的值
      for i := uintptr(0); i < lenmem; i += et.size {
        typedmemmove(et, add(p, i), add(old.array, i))
      }
    }
  }

  // 返回最终新切片，容量更新为最新扩容之后的容量
  return slice{p, old.len, newcap}
}
```

上述就是扩容的实现。主要需要关注的有两点，一个是扩容时候的策略，还有一个就是扩容是生成全新的内存地址还是在原来的地址后追加。

#### 扩容策略

先看看扩容策略。

```go
func main() {
  slice := []int{10, 20, 30, 40}
  newSlice := append(slice, 50)
  fmt.Printf("Before slice = %v, Pointer = %p, len = %d, cap = %d\n", slice, &slice, len(slice), cap(slice))
  fmt.Printf("Before newSlice = %v, Pointer = %p, len = %d, cap = %d\n", newSlice, &newSlice, len(newSlice), cap(newSlice))
  newSlice[1] += 10
  fmt.Printf("After slice = %v, Pointer = %p, len = %d, cap = %d\n", slice, &slice, len(slice), cap(slice))
  fmt.Printf("After newSlice = %v, Pointer = %p, len = %d, cap = %d\n", newSlice, &newSlice, len(newSlice), cap(newSlice))
}
```

输出结果：

```go
Before slice = [10 20 30 40], Pointer = 0xc4200b0140, len = 4, cap = 4
Before newSlice = [10 20 30 40 50], Pointer = 0xc4200b0180, len = 5, cap = 8
After slice = [10 20 30 40], Pointer = 0xc4200b0140, len = 4, cap = 4
After newSlice = [10 30 30 40 50], Pointer = 0xc4200b0180, len = 5, cap = 8
```

用图表示出上述过程。

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/slice-9.png)

从图上我们可以很容易的看出，新的切片和之前的切片已经不同了，因为新的切片更改了一个值，并没有影响到原来的数组，新切片指向的数组是一个全新的数组。并且 cap 容量也发生了变化。这之间究竟发生了什么呢？

Go 中切片扩容的策略是这样的：

如果切片的容量小于 1024 个元素，于是扩容的时候就翻倍增加容量。上面那个例子也验证了这一情况，总容量从原来的 4 个翻倍到现在的 8 个。

一旦元素个数超过 1024 个元素，那么增长因子就变成 1.25 ，即每次增加原来容量的四分之一。

注意：扩容扩大的容量都是针对原来的容量而言的，而不是针对原来数组的长度而言的。

#### 新数组 or 老数组 ？

再谈谈扩容之后的数组一定是新的么？这个不一定，分两种情况。

情况一：

```go
func main() {
  array := [4]int{10, 20, 30, 40}
  slice := array[0:2]
  newSlice := append(slice, 50)
  fmt.Printf("Before slice = %v, Pointer = %p, len = %d, cap = %d\n", slice, &slice, len(slice), cap(slice))
  fmt.Printf("Before newSlice = %v, Pointer = %p, len = %d, cap = %d\n", newSlice, &newSlice, len(newSlice), cap(newSlice))
  newSlice[1] += 10
  fmt.Printf("After slice = %v, Pointer = %p, len = %d, cap = %d\n", slice, &slice, len(slice), cap(slice))
  fmt.Printf("After newSlice = %v, Pointer = %p, len = %d, cap = %d\n", newSlice, &newSlice, len(newSlice), cap(newSlice))
  fmt.Printf("After array = %v\n", array)
}
```

打印输出：

```go
Before slice = [10 20], Pointer = 0xc4200c0040, len = 2, cap = 4
Before newSlice = [10 20 50], Pointer = 0xc4200c0060, len = 3, cap = 4
After slice = [10 30], Pointer = 0xc4200c0040, len = 2, cap = 4
After newSlice = [10 30 50], Pointer = 0xc4200c0060, len = 3, cap = 4
After array = [10 30 50 40]
```

把上述过程用图表示出来，如下图。

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/slice-10.png)

通过打印的结果，我们可以看到，在这种情况下，扩容以后并没有新建一个新的数组，扩容前后的数组都是同一个，这也就导致了新的切片修改了一个值，也影响到了老的切片了。并且 append() 操作也改变了原来数组里面的值。一个 append() 操作影响了这么多地方，如果原数组上有多个切片，那么这些切片都会被影响！无意间就产生了莫名的 bug！

这种情况，由于原数组还有容量可以扩容，所以执行 append() 操作以后，会在原数组上直接操作，所以这种情况下，扩容以后的数组还是指向原来的数组。

这种情况也极容易出现在字面量创建切片时候，第三个参数 cap 传值的时候，如果用字面量创建切片，cap 并不等于指向数组的总容量，那么这种情况就会发生。

```go
slice := array[1:2:3]
```

上面这种情况非常危险，极度容易产生 bug 。

建议用字面量创建切片的时候，cap 的值一定要保持清醒，避免共享原数组导致的 bug。

情况二：

情况二其实就是在扩容策略里面举的例子，在那个例子中之所以生成了新的切片，是因为原来数组的容量已经达到了最大值，再想扩容， Go 默认会先开一片内存区域，把原来的值拷贝过来，然后再执行 append() 操作。这种情况丝毫不影响原数组。

所以建议尽量避免情况一，尽量使用情况二，避免 bug 产生。

### 5、切片拷贝

Slice 中拷贝方法有 2 个。

```go
func slicecopy(to, fm slice, width uintptr) int {
  // 如果源切片或者目标切片有一个长度为0，那么就不需要拷贝，直接 return
  if fm.len == 0 || to.len == 0 {
    return 0
  }
  // n 记录下源切片或者目标切片较短的那一个的长度
  n := fm.len
  if to.len < n {
    n = to.len
  }
  // 如果入参 width = 0，也不需要拷贝了，返回较短的切片的长度
  if width == 0 {
    return n
  }
  // 如果开启了竞争检测
  if raceenabled {
    callerpc := getcallerpc(unsafe.Pointer(&to))
    pc := funcPC(slicecopy)
    racewriterangepc(to.array, uintptr(n*int(width)), callerpc, pc)
    racereadrangepc(fm.array, uintptr(n*int(width)), callerpc, pc)
  }
  // 如果开启了 The memory sanitizer (msan)
  if msanenabled {
    msanwrite(to.array, uintptr(n*int(width)))
    msanread(fm.array, uintptr(n*int(width)))
  }

  size := uintptr(n) * width
  if size == 1 {
    // TODO: is this still worth it with new memmove impl?
    // 如果只有一个元素，那么指针直接转换即可
    *(*byte)(to.array) = *(*byte)(fm.array) // known to be a byte pointer
  } else {
    // 如果不止一个元素，那么就把 size 个 bytes 从 fm.array 地址开始，拷贝到 to.array 地址之后
    memmove(to.array, fm.array, size)
  }

  return n
}
```

在这个方法中，slicecopy 方法会把源切片值(即 fm Slice )中的元素复制到目标切片(即 to Slice )中，并返回被复制的元素个数，copy 的两个类型必须一致。slicecopy 方法最终的复制结果取决于较短的那个切片，当较短的切片复制完成，整个复制过程就全部完成了。

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/slice-11.png)

举个例子，比如：

```go
func main() {
  array := []int{10, 20, 30, 40}
  slice := make([]int, 6)
  n := copy(slice, array)
  fmt.Println(n,slice)
}
```

还有一个拷贝的方法，这个方法原理和 slicecopy 方法类似，不在赘述了，注释写在代码里面了。

```go
func slicestringcopy(to []byte, fm string) int {
  // 如果源切片或者目标切片有一个长度为0，那么就不需要拷贝，直接 return
  if len(fm) == 0 || len(to) == 0 {
    return 0
  }
  // n 记录下源切片或者目标切片较短的那一个的长度
  n := len(fm)
  if len(to) < n {
    n = len(to)
  }
  // 如果开启了竞争检测
  if raceenabled {
    callerpc := getcallerpc(unsafe.Pointer(&to))
    pc := funcPC(slicestringcopy)
    racewriterangepc(unsafe.Pointer(&to[0]), uintptr(n), callerpc, pc)
  }
  // 如果开启了 The memory sanitizer (msan)
  if msanenabled {
    msanwrite(unsafe.Pointer(&to[0]), uintptr(n))
  }
  // 拷贝字符串至字节数组
  memmove(unsafe.Pointer(&to[0]), stringStructOf(&fm).str, uintptr(n))
  return n
}
```

再举个例子，比如：

```go
func main() {
  slice := make([]byte, 3)
  n := copy(slice, "abcdef")
  fmt.Println(n,slice)
}
```

输出：

```go
3 [97,98,99]
```

说到拷贝，切片中有一个需要注意的问题。

```go
func main() {
  slice := []int{10, 20, 30, 40}
  for index, value := range slice {
    fmt.Printf("value = %d , value-addr = %x , slice-addr = %x\n", value, &value, &slice[index])
  }
}
```

输出：

```go
value = 10 , value-addr = c4200aedf8 , slice-addr = c4200b0320
value = 20 , value-addr = c4200aedf8 , slice-addr = c4200b0328
value = 30 , value-addr = c4200aedf8 , slice-addr = c4200b0330
value = 40 , value-addr = c4200aedf8 , slice-addr = c4200b0338
```

从上面结果我们可以看到，如果用 range 的方式去遍历一个切片，拿到的 Value 其实是切片里面的值拷贝。所以每次打印 Value 的地址都不变。

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/slice-12.png)

由于 Value 是值拷贝的，并非引用传递，所以直接改 Value 是达不到更改原切片值的目的的，需要通过 &slice[index] 获取真实的地址。

## 参考

- [数组 Array](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/%E6%95%B0%E7%BB%84Array.html)
- [切片 Slice](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/%E5%88%87%E7%89%87Slice.html)
- [Slice 底层实现](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/Slice%E5%BA%95%E5%B1%82%E5%AE%9E%E7%8E%B0.html)
- [深入解析 Go 中的 Slice 底层实现](https://www.jianshu.com/p/030aba2bff41)
- [Go语言基础之数组](https://www.liwenzhou.com/posts/Go/05_array/)
