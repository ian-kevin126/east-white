---
title: Channel
author: ian_kevin
date: 2022-04-19
---

# Channel

## 一、channel简介

单纯地将函数并发执行是没有意义的。函数与函数间需要交换数据才能体现并发执行函数的意义。

虽然可以使用共享内存进行数据交换，但是共享内存在不同的 goroutine 中容易发生竞态问题。为了保证数据交换的正确性，很多并发模型中必须使用互斥量对内存进行加锁，这种做法势必造成性能问题。

Go语言采用的并发模型是`CSP（Communicating Sequential Processes）`，提倡**通过通信共享内存**而不是**通过共享内存而实现通信**。

如果说 goroutine 是Go程序并发的执行体，`channel`就是它们之间的连接。`channel`是可以让一个 `goroutine` 发送特定值到另一个 goroutine 的通信机制。

Go 语言中的通道（channel）是一种特殊的类型。通道像一个传送带或者队列，总是遵循先入先出（First In First Out）的规则，保证收发数据的顺序。每一个通道都是一个具体类型的导管，也就是声明channel的时候需要为其指定元素类型。

channel 俗称管道，用于数据传递或数据共享，其本质是一个先进先出的队列，使用 goroutine + channel 进行数据通讯简单高效，同时也线程安全，多个 goroutine 可同时修改一个 channel，不需要加锁。

channel 可分为三种类型：

- 只读 channel：只能读 channel 里面数据，不可写入

- 只写 channel：只能写数据，不可读

- 一般 channel：可读可写

### 1、channel类型

`channel`是 Go 语言中一种特有的类型。声明通道类型变量的格式如下：

```go
var 变量名称 chan 元素类型
```

其中：

- chan：是关键字
- 元素类型：是指通道中传递元素的类型

举几个例子：

```go
var ch1 chan int   // 声明一个传递整型的通道
var ch2 chan bool  // 声明一个传递布尔型的通道
var ch3 chan []int // 声明一个传递int切片的通道
```

### 2、channel零值

未初始化的通道类型变量其默认零值是`nil`。

```go
var ch chan int
fmt.Println(ch) // <nil>
```

### 3、初始化channel

声明的通道类型变量需要使用内置的`make`函数初始化之后才能使用。具体格式如下：

```go
make(chan 元素类型, [缓冲大小])
```

其中：

- channel的缓冲大小是可选的。

举几个例子：

```go
ch4 := make(chan int)
ch5 := make(chan bool, 1)  // 声明一个缓冲区大小为1的通道
```

### 4、channel操作

通道共有发送（send）、接收(receive）和关闭（close）三种操作。而发送和接收操作都使用`<-`符号。

现在我们先使用以下语句定义一个通道：

```go
ch := make(chan int)
```

#### 4.1 发送

将一个值发送到通道中。

```go
ch <- 10 // 把10发送到ch中
```

#### 4.2 接收

从一个通道中接收值。

```go
x := <- ch // 从ch中接收值并赋值给变量x
<-ch       // 从ch中接收值，忽略结果
```

#### 4.3 关闭

我们通过调用内置的`close`函数来关闭通道。

```go
close(ch)
```

**注意：**一个通道值是可以被垃圾回收掉的。通道通常由发送方执行关闭操作，并且只有在接收方明确等待通道关闭的信号时才需要执行关闭操作。它和关闭文件不一样，通常在结束操作之后关闭文件是必须要做的，但关闭通道不是必须的。

关闭后的通道有以下特点：

1. 对一个关闭的通道再发送值就会导致 panic。
2. 对一个关闭的通道进行接收会一直获取值直到通道为空。
3. 对一个关闭的并且没有值的通道执行接收操作会得到对应类型的零值。
4. 关闭一个已经关闭的通道会导致 panic。


## 二、channel 使用

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

### 1、读写数据

需要注意的是：

- 管道如果未关闭，在读取超时会则会引发 deadlock 异常
- 管道如果关闭进行写入数据会 pannic
- 当管道中没有数据时候再行读取或读取到默认值，如 int 类型默认值是 0

```go
ch <- “wd” // 写数据
a := <- ch // 读取数据
a, ok := <-ch // 优雅的读取数据
```

### 2、循环管道

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

### 3、带缓冲区 channe 和不带缓冲区 channel

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

#### 3.1 无缓冲的通道

无缓冲的通道又称为阻塞的通道。我们来看一下如下代码片段。

```go
func main() {
	ch := make(chan int)
	ch <- 10
	fmt.Println("发送成功")
}
```

上面这段代码能够通过编译，但是执行的时候会出现以下错误：

```bash
fatal error: all goroutines are asleep - deadlock!

goroutine 1 [chan send]:
main.main()
        .../main.go:8 +0x54
```

`deadlock`表示我们程序中的 goroutine 都被挂起导致程序死锁了。为什么会出现`deadlock`错误呢？

因为我们使用`ch := make(chan int)`创建的是无缓冲的通道，无缓冲的通道只有在有接收方能够接收值的时候才能发送成功，否则会一直处于等待发送的阶段。同理，如果对一个无缓冲通道执行接收操作时，没有任何向通道中发送值的操作那么也会导致接收操作阻塞。就像田径比赛中的4x100接力赛，想要完成交棒必须有一个能够接棒的运动员，否则只能等待。简单来说就是无缓冲的通道必须有至少一个接收方才能发送成功。

上面的代码会阻塞在`ch <- 10`这一行代码形成死锁，那如何解决这个问题呢？

其中一种可行的方法是创建一个 goroutine 去接收值，例如：

```go
func recv(c chan int) {
	ret := <-c
	fmt.Println("接收成功", ret)
}

func main() {
	ch := make(chan int)
	go recv(ch) // 创建一个 goroutine 从通道接收值
	ch <- 10
	fmt.Println("发送成功")
}
```

首先无缓冲通道`ch`上的发送操作会阻塞，直到另一个 goroutine 在该通道上执行接收操作，这时数字10才能发送成功，两个 goroutine 将继续执行。相反，如果接收操作先执行，接收方所在的 goroutine 将阻塞，直到 main goroutine 中向该通道发送数字10。

使用无缓冲通道进行通信将导致发送和接收的 goroutine 同步化。因此，无缓冲通道也被称为`同步通道`。

#### 3.2 有缓冲的通道

还有另外一种解决上面死锁问题的方法，那就是使用有缓冲区的通道。我们可以在使用 make 函数初始化通道时，可以为其指定通道的容量，例如：

```go
func main() {
	ch := make(chan int, 1) // 创建一个容量为1的有缓冲区通道
	ch <- 10
	fmt.Println("发送成功")
}
```

只要通道的容量大于零，那么该通道就属于有缓冲的通道，通道的容量表示通道中最大能存放的元素数量。当通道内已有元素数达到最大容量后，再向通道执行发送操作就会阻塞，除非有从通道执行接收操作。就像你小区的快递柜只有那么个多格子，格子满了就装不下了，就阻塞了，等到别人取走一个快递员就能往里面放一个。

我们可以使用内置的`len`函数获取通道内元素的数量，使用`cap`函数获取通道的容量，虽然我们很少会这么做。

### 4、channel 实现作业池

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
#### 4.1 多返回值模式

当向通道中发送完数据时，我们可以通过`close`函数来关闭通道。当一个通道被关闭后，再往该通道发送值会引发`panic`，从该通道取值的操作会先取完通道中的值。通道内的值被接收完后再对通道执行接收操作得到的值会一直都是对应元素类型的零值。那我们如何判断一个通道是否被关闭了呢？

对一个通道执行接收操作时支持使用如下多返回值模式。

```go
value, ok := <- ch
```

其中：

- value：从通道中取出的值，如果通道被关闭则返回对应类型的零值。
- ok：通道ch关闭时返回 false，否则返回 true。

下面代码片段中的`f2`函数会循环从通道`ch`中接收所有值，直到通道被关闭后退出。

```go
func f2(ch chan int) {
	for {
		v, ok := <-ch
		if !ok {
			fmt.Println("通道已关闭")
			break
		}
		fmt.Printf("v:%#v ok:%#v\n", v, ok)
	}
}

func main() {
	ch := make(chan int, 2)
	ch <- 1
	ch <- 2
	close(ch)
	f2(ch)
}
```

#### 4.2 for range接收值

通常我们会选择使用`for range`循环从通道中接收值，当通道被关闭后，会在通道内的所有值被接收完毕后会自动退出循环。上面那个示例我们使用`for range`改写后会很简洁。

```go
func f3(ch chan int) {
	for v := range ch {
		fmt.Println(v)
	}
}
```

**注意：**目前Go语言中并没有提供一个不对通道进行读取操作就能判断通道是否被关闭的方法。不能简单的通过`len(ch)`操作来判断通道是否被关闭。

### 5、只读 channel 和只写 channel

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

#### 单向通道

在某些场景下我们可能会将通道作为参数在多个任务函数间进行传递，通常我们会选择在不同的任务函数中对通道的使用进行限制，比如限制通道在某个函数中只能执行发送或只能执行接收操作。想象一下，我们现在有`Producer`和`Consumer`两个函数，其中`Producer`函数会返回一个通道，并且会持续将符合条件的数据发送至该通道，并在发送完成后将该通道关闭。而`Consumer`函数的任务是从通道中接收值进行计算，这两个函数之间通过`Processer`函数返回的通道进行通信。完整的示例代码如下。

```go
package main

import (
	"fmt"
)

// Producer 返回一个通道
// 并持续将符合条件的数据发送至返回的通道中
// 数据发送完成后会将返回的通道关闭
func Producer() chan int {
	ch := make(chan int, 2)
	// 创建一个新的goroutine执行发送数据的任务
	go func() {
		for i := 0; i < 10; i++ {
			if i%2 == 1 {
				ch <- i
			}
		}
		close(ch) // 任务完成后关闭通道
	}()

	return ch
}

// Consumer 从通道中接收数据进行计算
func Consumer(ch chan int) int {
	sum := 0
	for v := range ch {
		sum += v
	}
	return sum
}

func main() {
	ch := Producer()

	res := Consumer(ch)
	fmt.Println(res) // 25

}
```

从上面的示例代码中可以看出正常情况下`Consumer`函数中只会对通道进行接收操作，但是这不代表不可以在`Consumer`函数中对通道进行发送操作。作为`Producer`函数的提供者，我们在返回通道的时候可能只希望调用方拿到返回的通道后只能对其进行接收操作。但是我们没有办法阻止在`Consumer`函数中对通道进行发送操作。

Go语言中提供了**单向通道**来处理这种需要限制通道只能进行某种操作的情况。

```go
<- chan int // 只接收通道，只能接收不能发送
chan <- int // 只发送通道，只能发送不能接收
```

其中，箭头`<-`和关键字`chan`的相对位置表明了当前通道允许的操作，这种限制将在编译阶段进行检测。另外对一个只接收通道执行close也是不允许的，因为默认通道的关闭操作应该由发送方来完成。

我们使用单向通道将上面的示例代码进行如下改造。

```go
// Producer2 返回一个接收通道
func Producer2() <-chan int {
	ch := make(chan int, 2)
	// 创建一个新的goroutine执行发送数据的任务
	go func() {
		for i := 0; i < 10; i++ {
			if i%2 == 1 {
				ch <- i
			}
		}
		close(ch) // 任务完成后关闭通道
	}()

	return ch
}

// Consumer2 参数为接收通道
func Consumer2(ch <-chan int) int {
	sum := 0
	for v := range ch {
		sum += v
	}
	return sum
}

func main() {
	ch2 := Producer2()
  
	res2 := Consumer2(ch2)
	fmt.Println(res2) // 25
}
```

这一次，`Producer`函数返回的是一个只接收通道，这就从代码层面限制了该函数返回的通道只能进行接收操作，保证了数据安全。很多读者看到这个示例可能会觉着这样的限制是多余的，但是试想一下如果`Producer`函数可以在其他地方被其他人调用，你该如何限制他人不对该通道执行发送操作呢？并且返回限制操作的单向通道也会让代码语义更清晰、更易读。

在函数传参及任何赋值操作中全向通道（正常通道）可以转换为单向通道，但是无法反向转换。

```go
var ch3 = make(chan int, 1)
ch3 <- 10
close(ch3)
Consumer2(ch3) // 函数传参时将ch3转为单向通道

var ch4 = make(chan int, 1)
ch4 <- 10
var ch5 <-chan int // 声明一个只接收通道ch5
ch5 = ch4          // 变量赋值时将ch4转为单向通道
<-ch5
```

### 6、select-case 实现非阻塞 channel

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

### 7、channel 频率控制

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

### 8、总结

下面的表格中总结了对不同状态下的通道执行相应操作的结果。

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/channel.png)

**注意：**对已经关闭的通道再执行 close 也会引发 panic。

## 三、channel 与协程间通信

go 中有一种数据类型 chan，它本身的用途是消息通道，用来在 goroutines 间实现接收、发送消息。同时有缓存功能，因此可视它为跨协程队列。 

> 注意，是语言级别上的支持，不同函数库支持。这一点可以让它的表达语法设计得更简单。 这个跨协程消息通信功能，可以非常简单地实现其它语言中较麻烦的并发任务系统、工作队列系统。

*channel* 是一个通道、队列，那么我们关心的应该就是如何创建这个通道、将数据装到通道中、从通道中提取数据。 golang 为它设计了一个操作符，`left <- right`，当 `left` 为 channel 时，表示向通道中写入数据（发送），当 `right` 为通道时，表示从通道提取数据（接收）。

```go
package main

import  "fmt"

func main() {
  // fmt.Println("😀😀 有悟的 go channel 示例 😀😀")
  simpleChan()
}

func simpleChan() {
  // 声明一 chan 类型的变量
  var ch chan string
  ch = make(chan string)
  // 向 channel 中发送 string 类型数据
  go func() {
    ch <- "ping"
  }()
  // 创建一个 string 类型的变量，用来保存从 channel 队列提取的数据
  var v string
  v = <-ch
  fmt.Println(v) // ping
}
```

根据 go 变量声明的语法，上面可以简写为：

```go
// channel.go
...
    ch := make(chan string)
    go func() {
     ch <- "ping"
    }()
    v := <-ch
    fmt.Println(v)
...
```

两个操作语句就可以完成了数据入队列（`ch <- "ping"`），数据出队列(`v = <-ch`)的动作。这里有个问题需要注意，*channel 的接收与发送需要分别在两个 goroutine* 中，如果你是直接看英文的文档、或者其他介绍的文章，可能没有指出这个要求。它是 *跨* 协程的。

```go
┌─┐                                ┌─┐
│g│                                │g│
│o│                                │o│
│r│                                │r│
│o│                                │o│
│u│                                │u│
│t│                                │t│
│i│ receive/             send/     │i│
│n│ queue out┌─────────┐ queue in  │n│
│e│◀─────────│ channel │◀──────────│e│
│1│          └─────────┘           │2│
└─┘                                └─┘
```

若发送与接收没有分布在两个 goroutine 中，会出现这样的报错信息：

```go
// channel.go
ch := make(chan string)
ch <- "ping"
v := <-ch

// 报错
➜  go build channel.go && ./channel
fatal error: all goroutines are asleep - deadlock!
```

用一句话总结：channel 是连接 concurrent goroutines 的管道（pipe）。

### 场景示例

**简单的 worker pool 编程模型**

用 channel 的跨协程消息通讯（数据传输）功能，我们可以实现一个 worker pool。

- 一个 jobs 队列，缓存需要处理的 jobs
- 几个 worker 工作协程，从 jobs 队列取任务来处理
- 一个 results 队列，保存任务处理结果

```go
// channel.go
package main

import (
  "fmt"
  "time"
)

func main() {
  workpools()
}

func workpools() {
  const number_of_jobs = 5
  const number_of_workers = 2
  jobs := make(chan int, number_of_jobs)
  results := make(chan string, number_of_jobs)

  // 控制并行度，每个 worker 函数都运行在单独的 goroutine 中
  for w := 1; w <= number_of_workers; w++ {
    go worker(w, jobs, results)
  }

  // 向 任务队列写入任务
  for i := 1; i <= number_of_jobs; i++ {
    jobs <- i
  }
  fmt.Println("布置 job 后，关闭 jobs channel")
  close(jobs)

  // 监听 results channel，只要有内容就会被取走
  for i := 1; i <= number_of_jobs; i++ {
    fmt.Printf("结果: %s\n", <-results)
  }
}

// worker 逻辑：一个不断从 jobs chan 中取任务的循环
// 并将结果放在 out channel 中待取
func worker(id int, jobs <-chan int, out chan<- string) {
  fmt.Printf("worker #%d 启动\n", id)
  for job := range jobs {
    fmt.Printf("worker #%d 开始 工作%d\n", id, job)
    // sleep 模拟 『正在处理任务』
    time.Sleep(time.Millisecond * 500)
    fmt.Printf("worker #%d 结束 工作%d\n", id, job)

    out <- fmt.Sprintf("worker #%d 工作%d", id, job)
  }
  fmt.Printf("worker #%d 退出\n", id)
}
```

> 本例仅用于讲解演示，请勿在生产系统的程序中照搬。

上面过程，使用了 `go func(){}()`（生成 go协程）、`chan`（传递数据的管道） 简单地实现了一个具有并发功能的 工作者资源池模型。在例子中，设定了一定并发度的 worker routine，这些函数会从 jobs 任务 队列中获取任务来处理，并把结果发送到 results channel 中。

go 运行时按照自己的调度规则，来协调多个 worker 和主协程之间的运行。 worker 协程启动后，等待 jobs channel 被写入数据。对于熟悉 java、c++ 等其它编程语言的人来说，`for job := range jobs` 非常有迷惑性，它并不需要 jobs 的长度是已知的。`for range` 非常神奇，在 jobs channel 有值时才进行循环迭代。

```
                            ┌─┐                      
                            │w│                      
┌─┐                         │o│                      
│m│                         │r│                      
│a│                         │k│   save               
│i│               poll job──│e│──result─────┐        
│n│               ▼         │r│             ▼        
│r│send job  ╔═════════╗    │#│┌─┐     ╔═════════╗   
│o│─────────▶║  jobs   ║    │1││w│     ║ results ║◀─┐
│u│          ╚═════════╝    └─┘│o│     ╚═════════╝  │
│t│               ▲            │r│          ▲       │
│i│               │            │k│     save │       │
│n│              poll job──────│e│────result┘       │
│e│                            │r│                  │
└─┘                            │#│                  │
 │                             │2│                  │
 │              poll           └─┘                  │
 └─────────────result───────────────────────────────┘
```

> 提醒 ：注意 `worker` 函数的两个参数类型的区别，`jobs`、`out`，一个是 `<-chan int`，另一个是 `chan<- string` 。

编译并运行：

```sh
➜  go build channel.go && ./channel
布置 job 后，关闭 jobs channel
worker #2 启动
worker #2 开始 工作1
worker #1 启动
worker #1 开始 工作2
worker #1 结束 工作2
worker #1 开始 工作3
结果: worker #1 工作2
worker #2 结束 工作1
worker #2 开始 工作4
结果: worker #2 工作1
worker #2 结束 工作4
worker #2 开始 工作5
结果: worker #2 工作4
worker #1 结束 工作3
worker #1 退出
结果: worker #1 工作3
worker #2 结束 工作5
worker #2 退出
结果: worker #2 工作5
```

> 自己动手：
>
> 1. 把 `jobs := make(chan int, number_of_jobs)` 改为 `make(chan int, 0)` 会出现 “fatal error: all goroutines are asleep - deadlock!”
> 2. 把 `jobs := make(chan int, number_of_jobs)` 改为 `make(chan int, 1)`、`make(chan int, 2)`，观察 『布置 job 后，关闭 jobs channel』 这一句打印的位置

## 四、select多路复用

在某些场景下我们可能需要同时从多个通道接收数据。通道在接收数据时，如果没有数据可以被接收那么当前 goroutine 将会发生阻塞。你也许会写出如下代码尝试使用遍历的方式来实现从多个通道中接收值。

```go
for{
    // 尝试从ch1接收值
    data, ok := <-ch1
    // 尝试从ch2接收值
    data, ok := <-ch2
    …
}
```

这种方式虽然可以实现从多个通道接收值的需求，但是程序的运行性能会差很多。Go 语言内置了`select`关键字，使用它可以同时响应多个通道的操作。

Select 的使用方式类似于之前学到的 switch 语句，它也有一系列 case 分支和一个默认的分支。每个 case 分支会对应一个通道的通信（接收或发送）过程。select 会一直等待，直到其中的某个 case 的通信操作完成时，就会执行该 case 分支对应的语句。具体格式如下：

```go
select {
case <-ch1:
	//...
case data := <-ch2:
	//...
case ch3 <- 10:
	//...
default:
	//默认操作
}
```

Select 语句具有以下特点。

- 可处理一个或多个 channel 的发送/接收操作。
- 如果多个 case 同时满足，select 会**随机**选择一个执行。
- 对于没有 case 的 select 会一直阻塞，可用于阻塞 main 函数，防止退出。

下面的示例代码能够在终端打印出10以内的奇数，我们借助这个代码片段来看一下 select 的具体使用。

```go
package main

import "fmt"

func main() {
	ch := make(chan int, 1)
	for i := 1; i <= 10; i++ {
		select {
		case x := <-ch:
			fmt.Println(x)
		case ch <- i:
		}
	}
}
```

上面的代码输出内容如下。

```bash
1
3
5
7
9
```

示例中的代码首先是创建了一个缓冲区大小为1的通道 ch，进入 for 循环后：

- 第一次循环时 i = 1，select 语句中包含两个 case 分支，此时由于通道中没有值可以接收，所以`x := <-ch` 这个 case 分支不满足，而`ch <- i`这个分支可以执行，会把1发送到通道中，结束本次 for 循环；
- 第二次 for 循环时，i = 2，由于通道缓冲区已满，所以`ch <- i`这个分支不满足，而`x := <-ch`这个分支可以执行，从通道接收值1并赋值给变量 x ，所以会在终端打印出 1；
- 后续的 for 循环以此类推会依次打印出3、5、7、9。

## 五、通道误用示例

接下来，我们将展示两个因误用通道导致程序出现 bug 的代码片段，希望能够加深读者对通道操作的印象。

### 1、示例1

各位读者可以查看以下示例代码，尝试找出其中存在的问题。

```go
// demo1 通道误用导致的bug
func demo1() {
	wg := sync.WaitGroup{}

	ch := make(chan int, 10)
	for i := 0; i < 10; i++ {
		ch <- i
	}
	close(ch)

	wg.Add(3)
	for j := 0; j < 3; j++ {
		go func() {
			for {
				task := <-ch
				// 这里假设对接收的数据执行某些操作
				fmt.Println(task)
			}
			wg.Done()
		}()
	}
	wg.Wait()
}
```

将上述代码编译执行后，匿名函数所在的 goroutine 并不会按照预期在通道被关闭后退出。因为`task := <- ch`的接收操作在通道被关闭后会一直接收到零值，而不会退出。此处的接收操作应该使用`task, ok := <- ch`，通过判断布尔值`ok`为假时退出；或者使用select 来处理通道。

### 2、示例2

各位读者阅读下方代码片段，尝试找出其中存在的问题。

```go
// demo2 通道误用导致的bug
func demo2() {
	ch := make(chan string)
	go func() {
		// 这里假设执行一些耗时的操作
		time.Sleep(3 * time.Second)
		ch <- "job result"
	}()

	select {
	case result := <-ch:
		fmt.Println(result)
	case <-time.After(time.Second): // 较小的超时时间
		return
	}
}
```

上述代码片段可能导致 goroutine 泄露（goroutine 并未按预期退出并销毁）。由于 select 命中了超时逻辑，导致通道没有消费者（无接收操作），而其定义的通道为无缓冲通道，因此 goroutine 中的`ch <- "job result"`操作会一直阻塞，最终导致 goroutine 泄露。

## 六、并发安全和锁

有时候我们的代码中可能会存在多个 goroutine 同时操作一个资源（临界区）的情况，这种情况下就会发生`竞态问题`（数据竞态）。这就好比现实生活中十字路口被各个方向的汽车竞争，还有火车上的卫生间被车厢里的人竞争。

我们用下面的代码演示一个数据竞争的示例。

```go
package main

import (
	"fmt"
	"sync"
)

var (
	x int64

	wg sync.WaitGroup // 等待组
)

// add 对全局变量x执行5000次加1操作
func add() {
	for i := 0; i < 5000; i++ {
		x = x + 1
	}
	wg.Done()
}

func main() {
	wg.Add(2)

	go add()
	go add()

	wg.Wait()
	fmt.Println(x)
}
```

我们将上面的代码编译后执行，不出意外每次执行都会输出诸如9537、5865、6527等不同的结果。这是为什么呢？

在上面的示例代码片中，我们开启了两个 goroutine 分别执行 add 函数，这两个 goroutine 在访问和修改全局的`x`变量时就会存在数据竞争，某个 goroutine 中对全局变量`x`的修改可能会覆盖掉另一个 goroutine 中的操作，所以导致最后的结果与预期不符。

### 6.1 互斥锁

互斥锁是一种常用的控制共享资源访问的方法，它能够保证同一时间只有一个 goroutine 可以访问共享资源。Go 语言中使用`sync`包中提供的`Mutex`类型来实现互斥锁。

`sync.Mutex`提供了两个方法供我们使用。

|          方法名          |    功能    |
| :----------------------: | :--------: |
|  func (m *Mutex) Lock()  | 获取互斥锁 |
| func (m *Mutex) Unlock() | 释放互斥锁 |

我们在下面的示例代码中使用互斥锁限制每次只有一个 goroutine 才能修改全局变量`x`，从而修复上面代码中的问题。

```go
package main

import (
	"fmt"
	"sync"
)

// sync.Mutex

var (
	x int64

	wg sync.WaitGroup // 等待组

	m sync.Mutex // 互斥锁
)

// add 对全局变量x执行5000次加1操作
func add() {
	for i := 0; i < 5000; i++ {
		m.Lock() // 修改x前加锁
		x = x + 1
		m.Unlock() // 改完解锁
	}
	wg.Done()
}

func main() {
	wg.Add(2)

	go add()
	go add()

	wg.Wait()
	fmt.Println(x)
}
```

将上面的代码编译后多次执行，每一次都会得到预期中的结果——10000。

使用互斥锁能够保证同一时间有且只有一个 goroutine 进入临界区，其他的 goroutine 则在等待锁；当互斥锁释放后，等待的 goroutine 才可以获取锁进入临界区，多个 goroutine 同时等待一个锁时，唤醒的策略是随机的。

### 6.2 读写互斥锁

互斥锁是完全互斥的，但是实际上有很多场景是读多写少的，当我们并发的去读取一个资源而不涉及资源修改的时候是没有必要加互斥锁的，这种场景下使用读写锁是更好的一种选择。读写锁在 Go 语言中使用`sync`包中的`RWMutex`类型。

`sync.RWMutex`提供了以下5个方法。

|               方法名                |              功能              |
| :---------------------------------: | :----------------------------: |
|      func (rw *RWMutex) Lock()      |            获取写锁            |
|     func (rw *RWMutex) Unlock()     |            释放写锁            |
|     func (rw *RWMutex) RLock()      |            获取读锁            |
|    func (rw *RWMutex) RUnlock()     |            释放读锁            |
| func (rw *RWMutex) RLocker() Locker | 返回一个实现Locker接口的读写锁 |

读写锁分为两种：读锁和写锁。当一个 goroutine 获取到读锁之后，其他的 goroutine 如果是获取读锁会继续获得锁，如果是获取写锁就会等待；而当一个 goroutine 获取写锁之后，其他的 goroutine 无论是获取读锁还是写锁都会等待。

下面我们使用代码构造一个读多写少的场景，然后分别使用互斥锁和读写锁查看它们的性能差异。

```go
var (
	x       int64
	wg      sync.WaitGroup
	mutex   sync.Mutex
	rwMutex sync.RWMutex
)

// writeWithLock 使用互斥锁的写操作
func writeWithLock() {
	mutex.Lock() // 加互斥锁
	x = x + 1
	time.Sleep(10 * time.Millisecond) // 假设读操作耗时10毫秒
	mutex.Unlock()                    // 解互斥锁
	wg.Done()
}

// readWithLock 使用互斥锁的读操作
func readWithLock() {
	mutex.Lock()                 // 加互斥锁
	time.Sleep(time.Millisecond) // 假设读操作耗时1毫秒
	mutex.Unlock()               // 释放互斥锁
	wg.Done()
}

// writeWithLock 使用读写互斥锁的写操作
func writeWithRWLock() {
	rwMutex.Lock() // 加写锁
	x = x + 1
	time.Sleep(10 * time.Millisecond) // 假设读操作耗时10毫秒
	rwMutex.Unlock()                  // 释放写锁
	wg.Done()
}

// readWithRWLock 使用读写互斥锁的读操作
func readWithRWLock() {
	rwMutex.RLock()              // 加读锁
	time.Sleep(time.Millisecond) // 假设读操作耗时1毫秒
	rwMutex.RUnlock()            // 释放读锁
	wg.Done()
}

func do(wf, rf func(), wc, rc int) {
	start := time.Now()
	// wc个并发写操作
	for i := 0; i < wc; i++ {
		wg.Add(1)
		go wf()
	}

	//  rc个并发读操作
	for i := 0; i < rc; i++ {
		wg.Add(1)
		go rf()
	}

	wg.Wait()
	cost := time.Since(start)
	fmt.Printf("x:%v cost:%v\n", x, cost)

}
```

我们假设每一次读操作都会耗时1ms，而每一次写操作会耗时10ms，我们分别测试使用互斥锁和读写互斥锁执行10次并发写和1000次并发读的耗时数据。

```go
// 使用互斥锁，10并发写，1000并发读
do(writeWithLock, readWithLock, 10, 1000) // x:10 cost:1.466500951s

// 使用读写互斥锁，10并发写，1000并发读
do(writeWithRWLock, readWithRWLock, 10, 1000) // x:10 cost:117.207592ms
```

从最终的执行结果可以看出，使用读写互斥锁在读多写少的场景下能够极大地提高程序的性能。不过需要注意的是如果一个程序中的读操作和写操作数量级差别不大，那么读写互斥锁的优势就发挥不出来。

### 6.3 sync.WaitGroup

在代码中生硬的使用`time.Sleep`肯定是不合适的，Go语言中可以使用`sync.WaitGroup`来实现并发任务的同步。 `sync.WaitGroup`有以下几个方法：

|                方法名                |        功能         |
| :----------------------------------: | :-----------------: |
| func (wg * WaitGroup) Add(delta int) |    计数器+delta     |
|        (wg *WaitGroup) Done()        |      计数器-1       |
|        (wg *WaitGroup) Wait()        | 阻塞直到计数器变为0 |

`sync.WaitGroup`内部维护着一个计数器，计数器的值可以增加和减少。例如当我们启动了 N 个并发任务时，就将计数器值增加N。每个任务完成时通过调用 Done 方法将计数器减1。通过调用 Wait 来等待并发任务执行完，当计数器值为 0 时，表示所有并发任务已经完成。

我们利用`sync.WaitGroup`将上面的代码优化一下：

```go
var wg sync.WaitGroup

func hello() {
	defer wg.Done()
	fmt.Println("Hello Goroutine!")
}
func main() {
	wg.Add(1)
	go hello() // 启动另外一个goroutine去执行hello函数
	fmt.Println("main goroutine done!")
	wg.Wait()
}
```

需要注意`sync.WaitGroup`是一个结构体，进行参数传递的时候要传递指针。

### 6.4 sync.Once

在某些场景下我们需要确保某些操作即使在高并发的场景下也只会被执行一次，例如只加载一次配置文件等。

Go语言中的`sync`包中提供了一个针对只执行一次场景的解决方案——`sync.Once`，`sync.Once`只有一个`Do`方法，其签名如下：

```go
func (o *Once) Do(f func())
```

**注意：**如果要执行的函数`f`需要传递参数就需要搭配闭包来使用。

#### 6.4.1 加载配置文件示例

延迟一个开销很大的初始化操作到真正用到它的时候再执行是一个很好的实践。因为预先初始化一个变量（比如在init函数中完成初始化）会增加程序的启动耗时，而且有可能实际执行过程中这个变量没有用上，那么这个初始化操作就不是必须要做的。我们来看一个例子：

```go
var icons map[string]image.Image

func loadIcons() {
	icons = map[string]image.Image{
		"left":  loadIcon("left.png"),
		"up":    loadIcon("up.png"),
		"right": loadIcon("right.png"),
		"down":  loadIcon("down.png"),
	}
}

// Icon 被多个goroutine调用时不是并发安全的
func Icon(name string) image.Image {
	if icons == nil {
		loadIcons()
	}
	return icons[name]
}
```

多个 goroutine 并发调用Icon函数时不是并发安全的，现代的编译器和CPU可能会在保证每个 goroutine 都满足串行一致的基础上自由地重排访问内存的顺序。loadIcons函数可能会被重排为以下结果：

```go
func loadIcons() {
	icons = make(map[string]image.Image)
	icons["left"] = loadIcon("left.png")
	icons["up"] = loadIcon("up.png")
	icons["right"] = loadIcon("right.png")
	icons["down"] = loadIcon("down.png")
}
```

在这种情况下就会出现即使判断了`icons`不是nil也不意味着变量初始化完成了。考虑到这种情况，我们能想到的办法就是添加互斥锁，保证初始化`icons`的时候不会被其他的 goroutine 操作，但是这样做又会引发性能问题。

使用`sync.Once`改造的示例代码如下：

```go
var icons map[string]image.Image

var loadIconsOnce sync.Once

func loadIcons() {
	icons = map[string]image.Image{
		"left":  loadIcon("left.png"),
		"up":    loadIcon("up.png"),
		"right": loadIcon("right.png"),
		"down":  loadIcon("down.png"),
	}
}

// Icon 是并发安全的
func Icon(name string) image.Image {
	loadIconsOnce.Do(loadIcons)
	return icons[name]
}
```

#### 6.4.2 并发安全的单例模式

下面是借助`sync.Once`实现的并发安全的单例模式：

```go
package singleton

import (
    "sync"
)

type singleton struct {}

var instance *singleton
var once sync.Once

func GetInstance() *singleton {
    once.Do(func() {
        instance = &singleton{}
    })
    return instance
}
```

`sync.Once`其实内部包含一个互斥锁和一个布尔值，互斥锁保证布尔值和数据的安全，而布尔值用来记录初始化是否完成。这样设计就能保证初始化操作的时候是并发安全的并且初始化操作也不会被执行多次。

### 6.5 sync.Map

Go 语言中内置的 map 不是并发安全的，请看下面这段示例代码。

```go
package main

import (
	"fmt"
	"strconv"
	"sync"
)

var m = make(map[string]int)

func get(key string) int {
	return m[key]
}

func set(key string, value int) {
	m[key] = value
}

func main() {
	wg := sync.WaitGroup{}
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func(n int) {
			key := strconv.Itoa(n)
			set(key, n)
			fmt.Printf("k=:%v,v:=%v\n", key, get(key))
			wg.Done()
		}(i)
	}
	wg.Wait()
}
```

将上面的代码编译后执行，会报出`fatal error: concurrent map writes`错误。我们不能在多个 goroutine 中并发对内置的 map 进行读写操作，否则会存在数据竞争问题。

像这种场景下就需要为 map 加锁来保证并发的安全性了，Go语言的`sync`包中提供了一个开箱即用的并发安全版 map——`sync.Map`。开箱即用表示其不用像内置的 map 一样使用 make 函数初始化就能直接使用。同时`sync.Map`内置了诸如`Store`、`Load`、`LoadOrStore`、`Delete`、`Range`等操作方法。

|                            方法名                            |              功能               |
| :----------------------------------------------------------: | :-----------------------------: |
|         func (m *Map) Store(key, value interface{})          |        存储key-value数据        |
| func (m *Map) Load(key interface{}) (value interface{}, ok bool) |       查询key对应的value        |
| func (m *Map) LoadOrStore(key, value interface{}) (actual interface{}, loaded bool) |    查询或存储key对应的value     |
| func (m *Map) LoadAndDelete(key interface{}) (value interface{}, loaded bool) |          查询并删除key          |
|            func (m *Map) Delete(key interface{})             |             删除key             |
|   func (m *Map) Range(f func(key, value interface{}) bool)   | 对map中的每个key-value依次调用f |

下面的代码示例演示了并发读写`sync.Map`。

```go
package main

import (
	"fmt"
	"strconv"
	"sync"
)

// 并发安全的map
var m = sync.Map{}

func main() {
	wg := sync.WaitGroup{}
	// 对m执行20个并发的读写操作
	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func(n int) {
			key := strconv.Itoa(n)
			m.Store(key, n)         // 存储key-value
			value, _ := m.Load(key) // 根据key取值
			fmt.Printf("k=:%v,v:=%v\n", key, value)
			wg.Done()
		}(i)
	}
	wg.Wait()
}
```

## 七、原子操作

针对整数数据类型（int32、uint32、int64、uint64）我们还可以使用原子操作来保证并发安全，通常直接使用原子操作比使用锁操作效率更高。Go语言中原子操作由内置的标准库`sync/atomic`提供。

### 7.1 atomic包

| 方法                                                         |      解释      |
| :----------------------------------------------------------- | :------------: |
| func LoadInt32(addr *int32) (val int32) func LoadInt64(addr *int64) (val int64) func LoadUint32(addr *uint32) (val uint32) func LoadUint64(addr *uint64) (val uint64) func LoadUintptr(addr *uintptr) (val uintptr) func LoadPointer(addr *unsafe.Pointer) (val unsafe.Pointer) |    读取操作    |
| func StoreInt32(addr *int32, val int32) func StoreInt64(addr *int64, val int64) func StoreUint32(addr *uint32, val uint32) func StoreUint64(addr *uint64, val uint64) func StoreUintptr(addr *uintptr, val uintptr) func StorePointer(addr *unsafe.Pointer, val unsafe.Pointer) |    写入操作    |
| func AddInt32(addr *int32, delta int32) (new int32) func AddInt64(addr *int64, delta int64) (new int64) func AddUint32(addr *uint32, delta uint32) (new uint32) func AddUint64(addr *uint64, delta uint64) (new uint64) func AddUintptr(addr *uintptr, delta uintptr) (new uintptr) |    修改操作    |
| func SwapInt32(addr *int32, new int32) (old int32) func SwapInt64(addr *int64, new int64) (old int64) func SwapUint32(addr *uint32, new uint32) (old uint32) func SwapUint64(addr *uint64, new uint64) (old uint64) func SwapUintptr(addr *uintptr, new uintptr) (old uintptr) func SwapPointer(addr *unsafe.Pointer, new unsafe.Pointer) (old unsafe.Pointer) |    交换操作    |
| func CompareAndSwapInt32(addr *int32, old, new int32) (swapped bool) func CompareAndSwapInt64(addr *int64, old, new int64) (swapped bool) func CompareAndSwapUint32(addr *uint32, old, new uint32) (swapped bool) func CompareAndSwapUint64(addr *uint64, old, new uint64) (swapped bool) func CompareAndSwapUintptr(addr *uintptr, old, new uintptr) (swapped bool) func CompareAndSwapPointer(addr *unsafe.Pointer, old, new unsafe.Pointer) (swapped bool) | 比较并交换操作 |

### 7.2 示例

我们填写一个示例来比较下互斥锁和原子操作的性能。

```go
package main

import (
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

type Counter interface {
	Inc()
	Load() int64
}

// 普通版
type CommonCounter struct {
	counter int64
}

func (c CommonCounter) Inc() {
	c.counter++
}

func (c CommonCounter) Load() int64 {
	return c.counter
}

// 互斥锁版
type MutexCounter struct {
	counter int64
	lock    sync.Mutex
}

func (m *MutexCounter) Inc() {
	m.lock.Lock()
	defer m.lock.Unlock()
	m.counter++
}

func (m *MutexCounter) Load() int64 {
	m.lock.Lock()
	defer m.lock.Unlock()
	return m.counter
}

// 原子操作版
type AtomicCounter struct {
	counter int64
}

func (a *AtomicCounter) Inc() {
	atomic.AddInt64(&a.counter, 1)
}

func (a *AtomicCounter) Load() int64 {
	return atomic.LoadInt64(&a.counter)
}

func test(c Counter) {
	var wg sync.WaitGroup
	start := time.Now()
	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			c.Inc()
			wg.Done()
		}()
	}
	wg.Wait()
	end := time.Now()
	fmt.Println(c.Load(), end.Sub(start))
}

func main() {
	c1 := CommonCounter{} // 非并发安全
	test(c1)
	c2 := MutexCounter{} // 使用互斥锁实现并发安全
	test(&c2)
	c3 := AtomicCounter{} // 并发安全且比互斥锁效率更高
	test(&c3)
}
```

`atomic`包提供了底层的原子级内存操作，对于同步算法的实现很有用。这些函数必须谨慎地保证正确使用。除了某些特殊的底层应用，使用通道或者 sync 包的函数/类型实现同步更好。

## 八、练习题

使用 goroutine 和 channel 实现一个计算int64随机数各位数和的程序，例如生成随机数61345，计算其每个位数上的数字之和为19。

- 开启一个 goroutine 循环生成int64类型的随机数，发送到`jobChan`
- 开启24个 goroutine 从`jobChan`中取出随机数计算各位数的和，将结果发送到`resultChan`
- 主 goroutine 从`resultChan`取出结果并打印到终端输出



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

- [Go语言中chennel与协程间通信](https://youwu.today/skill/backend/golang-channel/)
