---
title: 简介
author: ian_kevin
date: 2022-04-19
---

# Go语言简介

## 一、来历

​		Go 语言是谷歌 2009 年首次推出并在 2012 年正式发布的一种全新的编程语言，可以在不损失应用程序性能的情况下降低代码的复杂性。谷歌首席软件工程师罗布派克(Rob Pike)说：我们之所以开发 Go，是因为过去10多年间软件开发的难度令人沮丧。Google 对 Go 寄予厚望，其设计是让软件充分发挥多核心处理器同步多工的优点，并可解决面向对象程序设计的麻烦。它具有现代的程序语言特色，如垃圾回收，帮助开发者处理琐碎但重要的内存管理问题。Go 的速度也非常快，几乎和 C 或 C++ 程序一样快，且能够快速开发应用程序。

### 主要特征

1. 自动立即回收。
2. 更丰富的内置类型。
3. 函数多返回值。
4. 错误处理。
5. 匿名函数和闭包。
6. 类型和接口。
7. 并发编程。
8. 反射。
9. 语言交互性。

## 二、思想

> 思想：Less can be more. 大道至简，小而蕴真。

1. 简洁的语法
2. 自带GC
3. 静态编译
4. 简单，没有继承、多态、类等
5. 丰富的库和开发文档
6. 语法层支持并发

## 三、命名

1.Go的函数、变量、常量、自定义类型、包`(package)`的命名方式遵循以下规则：

```go
1）首字符可以是任意的Unicode字符或者下划线
2）剩余字符可以是Unicode字符、下划线、数字
3）字符长度不限
```

2.Go只有25个关键字

```go
break        default      func         interface    select
case         defer        go           map          struct
chan         else         goto         package      switch
const        fallthrough  if           range        type
continue     for          import       return       var
```

3.Go还有37个保留字

```go
Constants:    true  false  iota  nil

Types:    int  int8  int16  int32  int64  
          uint  uint8  uint16  uint32  uint64  uintptr
          float32  float64  complex128  complex64
          bool  byte  rune  string  error

Functions:   make  len  cap  new  append  copy  close  delete
             complex  real  imag
             panic  recover
```

4.可见性：

```go
1）声明在函数内部，是函数的本地值，类似private
2）声明在函数外部，是对当前包可见(包内所有.go文件都可见)的全局值，类似protect
3）声明在函数外部且首字母大写是所有包可见的全局值,类似public
```

## 四、声明

有四种主要的声明方式：

- var：声明变量
- const：声明常量
- type：声明类型
- func：声明函数

Go的程序是保存在多个.go文件中，文件的第一行就是package XXX声明，用来说明该文件属于哪个包(package)，package声明下来就是import声明，再下来是类型，变量，常量，函数的声明。

## 五、命令

- go env：用于打印Go语言的环境信息。

- go run：命令可以编译并运行命令源码文件。
- go get：可以根据要求和实际情况从互联网上下载或更新指定的代码包及其依赖包，并对它们进行编译和安装。
- go build：命令用于编译我们指定的源码文件或代码包以及它们的依赖包。
- go install：用于编译并安装指定的代码包及它们的依赖包。
- go clean：命令会删除掉执行其它命令时产生的一些文件和目录。
- go doc：命令可以打印附于Go语言程序实体上的文档。我们可以通过把程序实体的标识符作为该命令的参数来达到查看其文档的目的。
- go test：命令用于对Go语言编写的程序进行测试。
- go list：命令的作用是列出指定的代码包的信息。
- go fix：会把指定代码包的所有Go语言源码文件中的旧版本代码修正为新版本的代码。
- go vet：是一个用于检查Go语言源码中静态错误的简单工具。
- go tool pprof：命令来交互式的访问概要文件的内容。

## 六、运算符

Go 语言内置的运算符有：

- 算术运算符
-  关系运算符
- 逻辑运算符
- 位运算符
- 赋值运算符

### 1、算数运算符

| 运算符 | 描述 |
| :----: | :--: |
|   +    | 相加 |
|   -    | 相减 |
|   *    | 相乘 |
|   /    | 相除 |
|   %    | 求余 |

> 注意： ++（自增）和--（自减）在Go语言中是单独的语句，并不是运算符。

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
|   ll   | 逻辑 OR 运算符。 如果两边的操作数有一个 True，则为 True，否则为 False。 |
|   !    | 逻辑 NOT 运算符。 如果条件为 True，则为 False，否则为 True。 |

### 1.1.4. 位运算符

位运算符对整数在内存中的二进制位进行操作。

| 运算符 | 描述                                                         |
| :----: | ------------------------------------------------------------ |
|   &    | 参与运算的两数各对应的二进位相与。（两位均为1才为1）         |
|   l    | 参与运算的两数各对应的二进位相或。（两位有一个为1就为1）     |
|   ^    | 参与运算的两数各对应的二进位相异或，当两对应的二进位相异时，结果为1。（两位不一样则为1） |
|   <<   | 左移n位就是乘以2的n次方。“a<<b”是把a的各二进位全部左移b位，高位丢弃，低位补0。 |
|   >>   | 右移n位就是除以2的n次方。“a>>b”是把a的各二进位全部右移b位。  |

### 1.1.5. 赋值运算符

| 运算符 | 描述                                           |
| :----: | ---------------------------------------------- |
|   =    | 简单的赋值运算符，将一个表达式的值赋给一个左值 |
|   +=   | 相加后再赋值                                   |
|   -=   | 相减后再赋值                                   |
|   *=   | 相乘后再赋值                                   |
|   /=   | 相除后再赋值                                   |
|   %=   | 求余后再赋值                                   |
|  <<=   | 左移后赋值                                     |
|  >>=   | 右移后赋值                                     |
|   &=   | 按位与后赋值                                   |
|   l=   | 按位或后赋值                                   |
|   ^=   | 按位异或后赋值                                 |

## 七、下划线

“_”是特殊标识符，用来忽略结果。

### 1、下划线在import中

```
在Golang里，import的作用是导入其他package。
```

import 下划线（如：import hello/imp）的作用：当导入一个包时，该包下的文件里所有init()函数都会被执行，然而，有些时候我们并不需要把整个包都导入进来，仅仅是是希望它执行init()函数而已。这个时候就可以使用 import 引用该包。即使用【import _ 包路径】只是引用该包，仅仅是为了调用init()函数，所以无法通过包名来调用包中的其他函数。 示例：

代码结构

```go
/*
    src 
    |
    +--- main.go            
    |
    +--- hello
           |
            +--- hello.go
*/
package main

import _ "./hello"

func main() {
    // hello.Print() 
    //编译报错：./main.go:6:5: undefined: hello
}
```

hello.go

```go
package hello

import "fmt"

func init() {
    fmt.Println("imp-init() come here.")
}

func Print() {
    fmt.Println("Hello!")
}
```

输出结果：

```go
imp-init() come here.
```

### 1.1.2. 下划线在代码中

```go
package main

import (
    "os"
)

func main() {
    buf := make([]byte, 1024)
    f, _ := os.Open("/Users/***/Desktop/text.txt")
    defer f.Close()
    for {
        n, _ := f.Read(buf)
        if n == 0 {
            break    

        }
        os.Stdout.Write(buf[:n])
    }
}
```

解释1：

```go
下划线意思是忽略这个变量.

比如os.Open，返回值为*os.File，error

普通写法是f,err := os.Open("xxxxxxx")

如果此时不需要知道返回的错误值

就可以用f, _ := os.Open("xxxxxx")

如此则忽略了error变量
```

解释2：

```go
占位符，意思是那个位置本应赋给某个值，但是咱们不需要这个值。
所以就把该值赋给下划线，意思是丢掉不要。
这样编译器可以更好的优化，任何类型的单个值都可以丢给下划线。
这种情况是占位用的，方法返回两个结果，而你只想要一个结果。
那另一个就用 "_" 占位，而如果用变量的话，不使用，编译器是会报错的。
```

补充：

```go
import "database/sql"
import _ "github.com/go-sql-driver/mysql"
```

第二个import就是不直接使用mysql包，只是执行一下这个包的init函数，把mysql的驱动注册到sql包里，然后程序里就可以使用sql包来访问mysql数据库了。

## 八、Go项目构建及编译

一个Go工程中主要包含以下三个目录：

```go
src：源代码文件
pkg：包文件
bin：相关bin文件
```

1. 建立工程文件夹 goproject

2. 在工程文件夹中建立src,pkg,bin文件夹

3. 在GOPATH中添加projiect路径 例 e:/goproject

4. 如工程中有自己的包examplepackage，那在src文件夹下建立以包名命名的文件夹 例 examplepackage

5. 在src文件夹下编写主程序代码代码 goproject.go

6. 在examplepackage文件夹中编写 examplepackage.go 和 包测试文件 examplepackage_test.go

7. 编译调试包

   ```go
   go build examplepackage
   
   go test examplepackage
   
   go install examplepackage
   ```

   这时在pkg文件夹中可以发现会有一个相应的操作系统文件夹如windows_386z, 在这个文件夹中会有examplepackage 文件夹，在该文件中有examplepackage.a文件

8. 编译主程序

   ```go
   go build goproject.go
   ```

   成功后会生成goproject.exe文件。

## 参考

- [Go语言的主要特征](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/Go%E8%AF%AD%E8%A8%80%E7%9A%84%E4%B8%BB%E8%A6%81%E7%89%B9%E5%BE%81.html)
- [运算符](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/%E8%BF%90%E7%AE%97%E7%AC%A6.html)
- [下划线](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/%E4%B8%8B%E5%88%92%E7%BA%BF.html)

