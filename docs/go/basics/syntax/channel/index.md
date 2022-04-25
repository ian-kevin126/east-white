---
title: Channel
author: ian_kevin
date: 2022-04-19
---

# Channel

## 一、channel简介

channel 俗称管道，用于数据传递或数据共享，其本质是一个先进先出的队列，使用 goroutine + channel 进行数据通讯简单高效，同时也线程安全，多个 goroutine 可同时修改一个 channel，不需要加锁。

channel 可分为三种类型：

- 只读 channel：只能读 channel 里面数据，不可写入

- 只写 channel：只能写数据，不可读

- 一般 channel：可读可写


### 1、channel 使用

定义和声明

```go
var readOnlyChan <-chan int            // 只读chan
var writeOnlyChan chan<- int           // 只写chan
var mychan  chan int                     //读写channel

//定义完成以后需要make来分配内存空间，不然使用会deadlock
mychannel = make(chan int,10)

//或者
read_only := make (<-chan int,10)//定义只读的channel
write_only := make (chan<- int,10)//定义只写的channel
read_write := make (chan int,10)//可同时读写
```

#### 1）读写数据

需要注意的是：

- 管道如果未关闭，在读取超时会则会引发 deadlock 异常
- 管道如果关闭进行写入数据会 pannic
- 当管道中没有数据时候再行读取或读取到默认值，如 int 类型默认值是 0

```go
ch <- “wd” // 写数据
a := <- ch // 读取数据
a, ok := <-ch // 优雅的读取数据
```

#### 2）循环管道

需要注意的是：

- 使用 range 循环管道，如果管道未关闭会引发 deadlock 错误。

- 如果采用 for 死循环已经关闭的管道，当管道没有数据时候，读取的数据会是管道的默认值，并且循环不会退出。

```go
package main

import (
  "fmt"
  "time"
)

func main() {
  mychannel := make(chan int,10)
  for i := 0;i < 10;i++{
    mychannel <- i
  }
  close(mychannel)  //关闭管道
  fmt.Println("data lenght: ",len(mychannel))
  for  v := range mychannel {  //循环管道
    fmt.Println(v)
  }
  fmt.Printf("data lenght:  %d",len(mychannel))
}
```

#### 3）带缓冲区 channe 和不带缓冲区 channel

- 带缓冲区 channel：定义声明时候制定了缓冲区大小 (长度)，可以保存多个数据。
- 不带缓冲区 channel：只能存一个数据，并且只有当该数据被取出时候才能存下一个数据。


```go
ch := make(chan int) //不带缓冲区
ch := make(chan int ,10) //带缓冲区
```

不带缓冲区示例：

```go
package main

import "fmt"

func test(c chan int) {
  for i := 0; i < 10; i++ {
    fmt.Println("send ", i)
    c <- i
  }
}

func main() {
  ch := make(chan int)
  go test(ch)
  for j := 0; j < 10; j++ {
    fmt.Println("get ", <-ch)
  }
}
```

结果：
```go
send  0
send  1
get  0
get  1
send  2
send  3
get  2
get  3
send  4
send  5
get  4
get  5
send  6
send  7
get  6
get  7
send  8
send  9
get  8
get  9
```

#### 4）channel 实现作业池

我们创建三个 channel，一个 channel 用于接受任务，一个 channel 用于保持结果，还有个 channel 用于决定程序退出的时候。


```go

package main

import (
  "fmt"
)

func Task(taskch, resch chan int, exitch chan bool) {
  defer func() {   //异常处理
    err := recover()
    if err != nil {
      fmt.Println("do task error：", err)
      return
    }
  }()
  
  for t := range taskch { //  处理任务
    fmt.Println("do task :", t)
    resch <- t //
  }
  exitch <- true //处理完发送退出信号
}

func main() {
  taskch := make(chan int, 20) //任务管道
  resch := make(chan int, 20)  //结果管道
  exitch := make(chan bool, 5) //退出管道
  go func() {
    for i := 0; i < 10; i++ {
      taskch <- i
    }
    close(taskch)
  }()
  
  for i := 0; i < 5; i++ {  //启动5个goroutine做任务
    go Task(taskch, resch, exitch)
  }

  go func() { //等5个goroutine结束
    for i := 0; i < 5; i++ {
      <-exitch
    }
    close(resch)  //任务处理完成关闭结果管道，不然range报错
    close(exitch)  //关闭退出管道
  }()

  for res := range resch{  //打印结果
    fmt.Println("task res：",res)
  }
}
```
#### 5）只读 channel 和只写 channel

一般定义只读和只写的管道意义不大，更多时候我们可以在参数传递时候指明管道可读还是可写，即使当前管道是可读写的。

```go
package main

import (
  "fmt"
  "time"
)

//只能向chan里写数据
func send(c chan<- int) {
  for i := 0; i < 10; i++ {
    c <- i
  }
}

//只能取channel中的数据
func get(c <-chan int) {
  for i := range c {
    fmt.Println(i)
  }
}

func main() {
  c := make(chan int)
  go send(c)
  go get(c)
  time.Sleep(time.Second*1)
}
```

结果：

```go
0
1
2
3
4
5
6
7
8
9
```

#### 6）select-case 实现非阻塞 channel

原理通过 select+case 加入一组管道，当满足（这里说的满足意思是有数据可读或者可写) select 中的某个 case 时候，那么该 case 返回，若都不满足 case，则走 default 分支。

```go
package main

import (
  "fmt"
)

func send(c chan int)  {
  for i :=1 ; i<10 ;i++  {
    c <-i
    fmt.Println("send data : ",i)
  }
}

func main() {
  resch := make(chan int,20)
  strch := make(chan string,10)
  go send(resch)
  strch <- "wd"
  select {
    case a := <-resch:
    fmt.Println("get data : ", a)
    case b := <-strch:
    fmt.Println("get data : ", b)
    default:
    fmt.Println("no channel actvie")
  }
}
```

结果：

```go
get data :  wd
```

#### 7）channel 频率控制

在对 channel 进行读写的时，go 还提供了非常人性化的操作，那就是对读写的频率控制，通过 time.Ticke 实现

示例：

```go
package main

import (
  "time"
  "fmt"
)

func main(){
  requests:= make(chan int ,5)
  for i:=1;i<5;i++{
    requests<-i
  }
  
  close(requests)
  limiter := time.Tick(time.Second*1)
  
  for req:=range requests{
    <-limiter
    fmt.Println("requets",req,time.Now()) //执行到这里，需要隔1秒才继续往下执行，time.Tick(timer)上面已定义
  }
}
```

结果：

```go
requets 1 2018-07-06 10:17:35.98056403 +0800 CST m=+1.004248763
requets 2 2018-07-06 10:17:36.978123472 +0800 CST m=+2.001798205
requets 3 2018-07-06 10:17:37.980869517 +0800 CST m=+3.004544250
requets 4 2018-07-06 10:17:38.976868836 +0800 CST m=+4.000533569
```





















## 参考

- [Channel](https://www.topgoer.com/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B/channel.html)

- [Go Channel 详解 - 鸟窝](https://colobu.com/2016/04/14/Golang-Channels/)

- [Go 语言通道（chan）——goroutine 之间通信的管道](http://c.biancheng.net/view/97.html)

- [【golang】channel 详解- SegmentFault 思否](https://segmentfault.com/a/1190000023961580)

- [Golang 使用系列---- channel](https://kingjcy.github.io/post/golang/go-channel/)

- [go 语言中的 channel 与协程间通信 - 有悟](https://youwu.today/skill/backend/golang-channel/)

- [channel · 深入解析 Go](https://tiancaiamao.gitbooks.io/go-internals/content/zh/07.1.html)

- [go 语言之行--golang 核武器 goroutine 调度原理、channel 详解](https://learnku.com/articles/41668)

- [【Golang】类型- Channel - 西维蜀黍的博客](https://swsmile.info/post/golang-channel/)
