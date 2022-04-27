---
title: 封装
date: 2022-04-26
---

# 封装

## 一、封装简介

封装的好处：

- 隐藏实现细节；
- 可以对数据进行验证，保证数据安全合理。

如何体现封装：

- 对结构体中的属性进行封装；
- 通过方法，包，实现封装。

封装的实现步骤：

- 将结构体、字段的首字母小写；
- 给结构体所在的包提供一个工厂模式的函数，首字母大写，类似一个构造函数；
- 提供一个首字母大写的 Set 方法（类似其它语言的 public），用于对属性判断并赋值；
- 提供一个首字母大写的 Get 方法（类似其它语言的 public），用于获取属性的值。

【示例】对于员工，不能随便查看年龄，工资等隐私，并对输入的年龄进行合理的验证。代码结构如下：

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/4-1ZZ6101Q0445.gif)

person.go

```go
package model

import "fmt"

type person struct {
  Name string
  age int   //其它包不能直接访问..
  sal float64
}

//写一个工厂模式的函数，相当于构造函数
func NewPerson(name string) *person {
  return &person{
    Name : name,
  }
}

//为了访问age 和 sal 我们编写一对SetXxx的方法和GetXxx的方法
func (p *person) SetAge(age int) {
  if age >0 && age <150 {
    p.age = age
  } else {
    fmt.Println("年龄范围不正确..")
    //给程序员给一个默认值
  }
}

func (p *person) GetAge() int {
  return p.age
}

func (p *person) SetSal(sal float64) {
  if sal >= 3000 && sal <= 30000 {
    p.sal = sal
  } else {
    fmt.Println("薪水范围不正确..")
  }
}

func (p *person) GetSal() float64 {
  return p.sal
}
```

main.go

```go
package main

import (
  "fmt"
  "../model"
)

func main() {

  p := model.NewPerson("smith")
  p.SetAge(18)
  p.SetSal(5000)
  fmt.Println(p) // &{smith, 18, 5000}
  fmt.Println(p.Name, " age =", p.GetAge(), " sal = ", p.GetSal())
  // smith age = 18 sal = 5000
}
```

## 二、导出包内标识符

在 Go 语言中，如果想在一个包里引用另外一个包里的标识符（如类型、变量、常量等）时，必须首先将被引用的标识符导出，将要导出的标识符的首字母大写就可以让引用者可以访问这些标识符了。

```go
package mypkg

var myVar = 100

const myConst = "hello"

type myStruct struct {}
```

将 myStruct 和 myConst 首字母大写，导出这些标识符，修改后代码如下：

```go
package mypkg

var myVar = 100

const MyConst = "hello"

type MyStruct struct {}
```

此时，MyConst 和 MyStruct 可以被外部访问，而 myVar 由于首字母是小写，因此只能在 mypkg 包内使用，不能被外部包引用。

## 三、导出结构体及接口成员

在被导出的结构体或接口中，如果它们的字段或方法首字母是大写，外部可以访问这些字段和方法，代码如下：

```go
type MyStruct struct {

  // 包外可以访问的字段
  ExportedField int

  // 仅限包内访问的字段
  privateField int
}

type MyInterface interface {

  // 包外可以访问的方法
  ExportedMethod()

  // 仅限包内访问的方法
  privateMethod()
}
```

在代码中，MyStruct 的 ExportedField 和 MyInterface 的 ExportedMethod() 可以被包外访问。

## 参考

- [Go 语言封装简介和实现细节](http://c.biancheng.net/view/5715.html)
- [Go 语言导出包中标识符](http://c.biancheng.net/view/90.html)
