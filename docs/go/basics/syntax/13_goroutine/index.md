---
title: Goroutine
author: ian_kevin
date: 2022-04-19
---

# Goroutine

## 一、goroutine简介

goroutine 是 go 语言中最为 NB 的设计，也是其魅力所在，goroutine 的本质是协程，是实现并行计算的核心。goroutine 使用方式非常的简单，只需使用 go 关键字即可启动一个协程，并且它是处于异步方式运行，你不需要等它运行完成以后在执行以后的代码。

```go
go func () // 通过 go 关键字启动一个协程来运行函数
```

### 1、几个概念

- **并发**

  一个 cpu 上能同时执行多项任务，在很短时间内，cpu 来回切换任务执行 (在某段很短时间内执行程序 a，然后又迅速得切换到程序 b 去执行)，有时间上的重叠（宏观上是同时的，微观仍是顺序执行）, 这样看起来多个任务像是同时执行，这就是并发。

- **并行**

  当系统有多个 CPU 时，每个 CPU 同一时刻都运行任务，互不抢占自己所在的 CPU 资源，同时进行，称为并行。

- **进程**

  cpu 在切换程序的时候，如果不保存上一个程序的状态（也就是我们常说的 context–上下文），直接切换下一个程序，就会丢失上一个程序的一系列状态，于是引入了进程这个概念，用以划分好程序运行时所需要的资源。因此进程就是一个程序运行时候的所需要的基本资源单位（也可以说是程序运行的一个实体）。

- **线程**

  cpu 切换多个进程的时候，会花费不少的时间，因为切换进程需要切换到内核态，而每次调度需要内核态都需要读取用户态的数据，进程一旦多起来，cpu 调度会消耗一大堆资源，因此引入了线程的概念，线程本身几乎不占有资源，他们共享进程里的资源，内核调度起来不会那么像进程切换那么耗费资源。

- **协程**

  协程拥有自己的寄存器上下文和栈。协程调度切换时，将寄存器上下文和栈保存到其他地方，在切回来的时候，恢复先前保存的寄存器上下文和栈。因此，协程能保留上一次调用时的状态（即所有局部状态的一个特定组合），每次过程重入时，就相当于进入上一次调用的状态，换种说法：进入上一次离开时所处逻辑流的位置。线程和进程的操作是由程序触发系统接口，最后的执行者是系统；协程的操作执行者则是用户自身程序，goroutine 也是协程。

#### 1.1 串行、并发与并行

串行：我们都是先读小学，小学毕业后再读初中，读完初中再读高中。

并发：同一时间段内执行多个任务（你在用微信和两个女朋友聊天）。

并行：同一时刻执行多个任务（你和你朋友都在用微信和女朋友聊天）。

#### 1.2 进程、线程和协程

进程（process）：程序在操作系统中的一次执行过程，系统进行资源分配和调度的一个独立单位。

线程（thread）：操作系统基于进程开启的轻量级进程，是操作系统调度执行的最小单位。

协程（coroutine）：非操作系统提供而是由用户自行创建和控制的用户态‘线程’，比线程更轻量级。

#### 1.3 并发模型

业界将如何实现并发编程总结归纳为各式各样的并发模型，常见的并发模型有以下几种：

- 线程&锁模型
- Actor模型
- CSP模型
- Fork&Join模型

Go语言中的并发程序主要是通过基于CSP（communicating sequential processes）的goroutine和channel来实现，当然也支持使用传统的多线程共享内存的并发方式。

### 2、调度模型简介

groutine 能拥有强大的并发实现是通过 GPM 调度模型实现，下面就来解释下 goroutine 的调度模型。

Go 的调度器内部有四个重要的结构：M，P，G，Sched：

- M：M 代表内核级线程，一个 M 就是一个线程，goroutine 就是跑在 M 之上的；M 是一个很大的结构，里面维护小对象内存 cache（mcache）、当前执行的 goroutine、随机数发生器等等非常多的信息
- G：代表一个 goroutine，它有自己的栈，instruction pointer 和其他信息（正在等待的 channel 等等），用于调度。
- P：P 全称是 Processor，处理器，它的主要用途就是用来执行 goroutine 的，所以它也维护了一个 goroutine 队列，里面存储了所有需要它来执行的 goroutine
- Sched：代表调度器，它维护有存储 M 和 G 的队列以及调度器的一些状态信息等。

#### 调度实现

![](https://cdn.learnku.com/uploads/images/202006/03/12604/hJXPS8PNtS.jpeg!large)

- 从上图中看，有 2 个物理线程 M，每一个 M 都拥有一个处理器 P，每一个也都有一个正在运行的 goroutine。
- P 的数量可以通过 GOMAXPROCS () 来设置，它其实也就代表了真正的并发度，即有多少个 goroutine 可以同时运行。
- 图中灰色的那些 goroutine 并没有运行，而是出于 ready 的就绪态，正在等待被调度。P 维护着这个队列（称之为 runqueue）。
- Go 语言里，启动一个 goroutine 很容易：go function 就行，所以每有一个 go 语句被执行，runqueue 队列就在其末尾加入一个goroutine，在下一个调度点，就从 runqueue 中取出（如何决定取哪个 goroutine？）一个 goroutine 执行。

当一个 OS 线程 M0 陷入阻塞时（如下图)，P 转而在运行 M1，图中的 M1 可能是正被创建，或者从线程缓存中取出。

![](https://cdn.learnku.com/uploads/images/202006/03/12604/IF1xdSfr3q.jpeg!large)

当 MO 返回时，它必须尝试取得一个 P 来运行 goroutine，一般情况下，它会从其他的 OS 线程那里拿一个 P 过来，

如果没有拿到的话，它就把 goroutine 放在一个 global runqueue 里，然后自己睡眠（放入线程缓存里）。所有的 P 也会周期性的检查 global runqueue 并运行其中的 goroutine，否则 global runqueue 上的 goroutine 永远无法执行。

另一种情况是 P 所分配的任务 G 很快就执行完了（分配不均），这就导致了这个处理器 P 很忙，但是其他的 P 还有任务，此时如果 global runqueue 没有任务 G 了，那么 P 不得不从其他的 P 里拿一些 G 来执行。一般来说，如果 P 从其他的 P 那里要拿任务的话，一般就拿 run queue 的一半，这就确保了每个 OS 线程都能充分的使用，如下图：

![](https://cdn.learnku.com/uploads/images/202003/11/12604/oWxZmCSyUr.jpeg!large)

[参考地址](https://morsmachine.dk/go-scheduler)

## 二、goroutine的使用

`Goroutine` 是 Go 语言支持并发的核心，在一个Go程序中同时创建成百上千个goroutine是非常普遍的，一个goroutine会以一个很小的栈开始其生命周期，一般只需要2KB。区别于操作系统线程由系统内核进行调度， goroutine 是由Go运行时（runtime）负责调度。例如Go运行时会智能地将 m个goroutine 合理地分配给n个操作系统线程，实现类似m:n的调度机制，不再需要Go开发者自行在代码层面维护一个线程池。

Goroutine 是 Go 程序中最基本的并发执行单元。每一个 Go 程序都至少包含一个 goroutine——main goroutine，当 Go 程序启动时它会自动创建。

在Go语言编程中你不需要去自己写进程、线程、协程，你的技能包里只有一个技能——goroutine，当你需要让某个任务并发执行的时候，你只需要把这个任务包装成一个函数，开启一个 goroutine 去执行这个函数就可以了，就是这么简单粗暴。

### 1、基本使用

设置 goroutine 运行的 CPU 数量，最新版本的 go 已经默认已经设置了。

```go
num := runtime.NumCPU () // 获取主机的逻辑 CPU 个数
runtime.GOMAXPROCS (num) // 设置可同时执行的最大 CPU 数
```

使用示例：

```go
package main

import (
  "fmt"
  "time"
)

func cal(a int , b int )  {
  c := a + b
  fmt.Printf("%d + %d = %d\n",a,b,c)
}

func main() {
  for i :=0 ; i<10 ;i++{
    go cal(i,i+1)  // 启动10个goroutine 来计算
  }
  
  time.Sleep(time.Second * 2) // sleep作用是为了等待所有任务完成
}
```

结果：

```go
//结果
//8 + 9 = 17
//9 + 10 = 19
//4 + 5 = 9
//5 + 6 = 11
//0 + 1 = 1
//1 + 2 = 3
//2 + 3 = 5
//3 + 4 = 7
//7 + 8 = 15
//6 + 7 = 13
```

### 2、go关键字

Go语言中使用 goroutine 非常简单，只需要在函数或方法调用前加上`go`关键字就可以创建一个 goroutine ，从而让该函数或方法在新创建的 goroutine 中执行。

```go
go f()  // 创建一个新的 goroutine 运行函数f
```

匿名函数也支持使用`go`关键字创建 goroutine 去执行。

```go
go func(){
  // ...
}()
```

一个 goroutine 必定对应一个函数/方法，可以创建多个 goroutine 去执行相同的函数/方法。

### 3、启动单个goroutine

启动 goroutine 的方式非常简单，只需要在调用函数（普通函数和匿名函数）前加上一个`go`关键字。

我们先来看一个在 main 函数中执行普通函数调用的示例。

```go
package main

import (
	"fmt"
)

func hello() {
	fmt.Println("hello")
}

func main() {
	hello()
	fmt.Println("你好")
}
```

将上面的代码编译后执行，得到的结果如下：

```bash
hello
你好
```

代码中 hello 函数和其后面的打印语句是串行的。

![main goroutine](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/goroutine01.png)

接下来我们在调用 hello 函数前面加上关键字`go`，也就是启动一个 goroutine 去执行 hello 这个函数。

```go
func main() {
	go hello() // 启动另外一个goroutine去执行hello函数
	fmt.Println("main goroutine done!")
}
```

将上述代码重新编译后执行，得到输出结果如下。

```bash
你好
```

这一次的执行结果只在终端打印了”你好”，并没有打印 `hello`。这是为什么呢？

其实在 Go 程序启动时，Go 程序就会为 main 函数创建一个默认的 goroutine 。在上面的代码中我们在 main 函数中使用 go 关键字创建了另外一个 goroutine 去执行 hello 函数，而此时 `main goroutine` 还在继续往下执行，我们的程序中此时存在两个并发执行的 `goroutine`。当 main 函数结束时整个程序也就结束了，同时 `main goroutine` 也结束了，所有由 `main goroutine` 创建的 `goroutine` 也会一同退出。也就是说我们的 main 函数退出太快，另外一个 `goroutine` 中的函数还未执行完程序就退出了，导致未打印出“hello”。

`main goroutine` 就像是《权利的游戏》中的夜王，其他的 `goroutine` 都是夜王转化出的异鬼，夜王一死它转化的那些异鬼也就全部GG了。

所以我们要想办法让 main 函数‘“等一等”将在另一个 goroutine 中运行的 hello 函数。其中最简单粗暴的方式就是在 main 函数中“time.Sleep”一秒钟了（这里的1秒钟只是我们为了保证新的 goroutine 能够被正常创建和执行而设置的一个值）。

按如下方式修改我们的示例代码。

```go
package main

import (
	"fmt"
	"time"
)

func hello() {
	fmt.Println("hello")
}

func main() {
	go hello()
	fmt.Println("你好")
	time.Sleep(time.Second)
}
```

将我们的程序重新编译后再次执行，程序会在终端输出如下结果，并且会短暂停顿一会儿。

```bash
你好
hello
```

为什么会先打印`你好`呢？

这是因为在程序中创建 goroutine 执行函数需要一定的开销，而与此同时 main 函数所在的 goroutine 是继续执行的。

![main goroutine和hello goorutine](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/goroutine02.png)

在上面的程序中使用`time.Sleep`让 main goroutine 等待 hello goroutine执行结束是不优雅的，当然也是不准确的。

Go 语言中通过`sync`包为我们提供了一些常用的并发原语，我们会在后面的小节单独介绍`sync`包中的内容。在这一小节，我们会先介绍一下 sync 包中的`WaitGroup`。当你并不关心并发操作的结果或者有其它方式收集并发操作的结果时，`WaitGroup`是实现等待一组并发操作完成的好方法。

下面的示例代码中我们在 main goroutine 中使用`sync.WaitGroup`来等待 hello goroutine 完成后再退出。

```go
package main

import (
	"fmt"
	"sync"
)

// 声明全局等待组变量
var wg sync.WaitGroup

func hello() {
	fmt.Println("hello")
	wg.Done() // 告知当前goroutine完成
}

func main() {
	wg.Add(1) // 登记1个goroutine
	go hello()
	fmt.Println("你好")
	wg.Wait() // 阻塞等待登记的goroutine完成
}
```

将代码编译后再执行，得到的输出结果和之前一致，但是这一次程序不再会有多余的停顿，hello goroutine 执行完毕后程序直接退出。

### 4、启动多个goroutine

在 Go 语言中实现并发就是这样简单，我们还可以启动多个 goroutine 。让我们再来看一个新的代码示例。这里同样使用了`sync.WaitGroup`来实现 goroutine 的同步。

```go
package main

import (
	"fmt"
	"sync"
)

var wg sync.WaitGroup

func hello(i int) {
	defer wg.Done() // goroutine结束就登记-1
	fmt.Println("hello", i)
}
func main() {
	for i := 0; i < 10; i++ {
		wg.Add(1) // 启动一个goroutine就登记+1
		go hello(i)
	}
	wg.Wait() // 等待所有登记的goroutine都结束
}
```

多次执行上面的代码会发现每次终端上打印数字的顺序都不一致。这是因为10个 goroutine 是并发执行的，而 goroutine 的调度是随机的。

### 5、动态栈

操作系统的线程一般都有固定的栈内存（通常为2MB）,而 Go 语言中的 goroutine 非常轻量级，一个 goroutine 的初始栈空间很小（一般为2KB），所以在 Go 语言中一次创建数万个 goroutine 也是可能的。并且 goroutine 的栈不是固定的，可以根据需要动态地增大或缩小， Go 的 runtime 会自动为 goroutine 分配合适的栈空间。

### 6、goroutine调度

操作系统的线程会被操作系统内核调度时会挂起当前执行的线程并将它的寄存器内容保存到内存中，选出下一次要执行的线程并从内存中恢复该线程的寄存器信息，然后恢复执行该线程的现场并开始执行线程。从一个线程切换到另一个线程需要完整的上下文切换。因为可能需要多次内存访问，索引这个切换上下文的操作开销较大，会增加运行的cpu周期。

区别于操作系统内核调度操作系统线程，goroutine 的调度是Go语言运行时（runtime）层面的实现，是完全由 Go 语言本身实现的一套调度系统——go scheduler。它的作用是按照一定的规则将所有的 goroutine 调度到操作系统线程上执行。

在经历数个版本的迭代之后，目前 Go 语言的调度器采用的是 `GPM` 调度模型。

![gpm](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/gpm.png)

其中：

- G：表示 goroutine，每执行一次`go f()`就创建一个 G，包含要执行的函数和上下文信息。
- 全局队列（Global Queue）：存放等待运行的 G。
- P：表示 goroutine 执行所需的资源，最多有 GOMAXPROCS 个。
- P 的本地队列：同全局队列类似，存放的也是等待运行的G，存的数量有限，不超过256个。新建 G 时，G 优先加入到 P 的本地队列，如果本地队列满了会批量移动部分 G 到全局队列。
- M：线程想运行任务就得获取 P，从 P 的本地队列获取 G，当 P 的本地队列为空时，M 也会尝试从全局队列或其他 P 的本地队列获取 G。M 运行 G，G 执行之后，M 会从 P 获取下一个 G，不断重复下去。
- Goroutine 调度器和操作系统调度器是通过 M 结合起来的，每个 M 都代表了1个内核线程，操作系统调度器负责把内核线程分配到 CPU 的核上执行。

单从线程调度讲，Go语言相比起其他语言的优势在于OS线程是由OS内核来调度的， goroutine 则是由Go运行时（runtime）自己的调度器调度的，完全是在用户态下完成的， 不涉及内核态与用户态之间的频繁切换，包括内存的分配与释放，都是在用户态维护着一块大的内存池， 不直接调用系统的malloc函数（除非内存池需要改变），成本比调度OS线程低很多。 另一方面充分利用了多核的硬件资源，近似的把若干goroutine均分在物理线程上， 再加上本身 goroutine 的超轻量级，以上种种特性保证了 goroutine 调度方面的性能。

### 7、GOMAXPROCS

Go运行时的调度器使用`GOMAXPROCS`参数来确定需要使用多少个 OS 线程来同时执行 Go 代码。默认值是机器上的 CPU 核心数。例如在一个 8 核心的机器上，GOMAXPROCS 默认为 8。Go语言中可以通过`runtime.GOMAXPROCS`函数设置当前程序并发时占用的 CPU逻辑核心数。（Go1.5版本之前，默认使用的是单核心执行。Go1.5 版本之后，默认使用全部的CPU 逻辑核心数。）

```go
package main

import (
	"fmt"
	"runtime"
	"sync"
)

var wg sync.WaitGroup

func a() {
	for i := 1; i < 10; i++ {
		fmt.Println("A: ", i)
	}
	wg.Done()
}

func b() {
	for i := 1; i < 10; i++ {
		fmt.Println("B: ", i)
	}
	wg.Done()
}

func main() {
	runtime.GOMAXPROCS(1)
	wg.Add(2)
	go a()
	go b()
	wg.Wait()
}
```

输出结果：

```go
B:  1
B:  2
B:  3
B:  4
B:  5
B:  6
B:  7
B:  8
B:  9
A:  1
A:  2
A:  3
A:  4
A:  5
A:  6
A:  7
A:  8
A:  9
```

如果改成 `runtime.GOMAXPROCS(2)` 之后，输出结果：

```go
B:  1
B:  2
B:  3
B:  4
A:  1
A:  2
A:  3
A:  4
A:  5
A:  6
A:  7
A:  8
A:  9
B:  5
B:  6
B:  7
B:  8
B:  9
```

### 8、goroutine 异常捕捉

当启动多个 goroutine 时，如果其中一个 goroutine 异常了，并且我们并没有对进行异常处理，那么整个程序都会终止，所以我们在编写程序时候最好每个 goroutine 所运行的函数都做异常处理，异常处理采用 recover：

```go
package main

import (
  "fmt"
  "time"
)

func addele(a []int ,i int)  {
  defer func() {    //匿名函数捕获错误
    err := recover()
    if err != nil {
      fmt.Println("add ele fail")
    }
  }()
  a[i]=i
  fmt.Println(a)
}

func main() {
  Arry := make([]int,4)
  for i :=0 ; i<10 ;i++{
    go addele(Arry,i)
  }
  time.Sleep(time.Second * 2)
}
```

结果：

```go
add ele fail
[0 0 0 0]
[0 1 0 0]
[0 1 2 0]
[0 1 2 3]
add ele fail
add ele fail
add ele fail
add ele fail
add ele fail
```

### 9、同步的 goroutine

由于 goroutine 是异步执行的，那很有可能出现主程序退出时还有 goroutine 没有执行完，此时 goroutine 也会跟着退出。此时如果想等到所有 goroutine 任务执行完毕才退出，go 提供了 sync 包和 channel 来解决同步问题，当然如果你能预测每个 goroutine 执行的时间，你还可以通过 time.Sleep 方式等待所有的 groutine 执行完成以后在退出程序 (如上面的列子)。

#### 示例一：使用 sync 包同步 goroutine

sync 大致实现方式：WaitGroup 等待一组 goroutinue 执行完毕。主程序调用 Add 添加等待的 goroutinue 数量。每个 goroutinue 在执行结束时调用 Done ，此时等待队列数量减 1.，主程序通过 Wait 阻塞，直到等待队列为 0。

```go
package main

import (
    "fmt"
    "sync"
)

func cal(a int , b int ,n *sync.WaitGroup)  {
    c := a+b
    fmt.Printf("%d + %d = %d\n",a,b,c)
    defer n.Done() //goroutinue完成后, WaitGroup的计数-1

}

func main() {
    var go_sync sync.WaitGroup //声明一个WaitGroup变量
    for i :=0 ; i<10 ;i++{
        go_sync.Add(1) // WaitGroup的计数加1
        go cal(i,i+1,&go_sync)  
    }
    go_sync.Wait()  //等待所有goroutine执行完毕
}
```

结果：

```go
// 结果
9 + 10 = 19
2 + 3 = 5
3 + 4 = 7
4 + 5 = 9
5 + 6 = 11
1 + 2 = 3
6 + 7 = 13
7 + 8 = 15
0 + 1 = 1
8 + 9 = 17
```

#### 示例二：通过 channel 实现 goroutine 之间的同步

实现方式：通过 channel 能在多个 groutine 之间通讯，当一个 goroutine 完成时候向 channel 发送退出信号，等所有 goroutine 退出时候，利用 for 循环 channe 去 channel 中的信号，若取不到数据会阻塞原理，等待所有 goroutine 执行完毕，使用该方法有个前提是你已经知道了你启动了多少个 goroutine。

```go
package main

import (
  "fmt"
  "time"
)

func cal(a int , b int ,Exitchan chan bool)  {
  c := a+b
  fmt.Printf("%d + %d = %d\n",a,b,c)
  time.Sleep(time.Second*2)
  Exitchan <- true
}

func main() {

  Exitchan := make(chan bool,10)  //声明并分配管道内存
  for i :=0 ; i<10 ;i++{
    go cal(i,i+1,Exitchan)
  }
  
  for j :=0; j<10; j++{   
    <- Exitchan  //取信号数据，如果取不到则会阻塞
  }
  
  close(Exitchan) // 关闭管道
}
```
### 10、goroutine 之间的通讯

goroutine 本质上是协程，可以理解为不受内核调度，而受 go 调度器管理的线程。goroutine 之间可以通过 channel 进行通信或者说是数据共享，当然你也可以使用全局变量来进行数据共享。

示例：使用 channel 模拟消费者和生产者模式

```go
package main

import (
  "fmt"
  "sync"
)

func Productor(mychan chan int,data int,wait *sync.WaitGroup)  {
  mychan <- data
  fmt.Println("product data：",data)
  wait.Done()
}

func Consumer(mychan chan int,wait *sync.WaitGroup)  {
  a := <- mychan
  fmt.Println("consumer data：",a)
  wait.Done()
}

func main() {
  datachan := make(chan int, 100)   //通讯数据管道
  var wg sync.WaitGroup

  for i := 0; i < 10; i++ {
    go Productor(datachan, i,&wg) //生产数据
    wg.Add(1)
  }
  
  for j := 0; j < 10; j++ {
    go Consumer(datachan,&wg)  //消费数据
    wg.Add(1)
  }
  
  wg.Wait()
}
```

结果：

```go
consumer data： 4
product data： 5
product data： 6
product data： 7
product data： 8
product data： 9
consumer data： 1
consumer data： 5
consumer data： 6
consumer data： 7
consumer data： 8
consumer data： 9
product data： 2
consumer data： 2
product data： 3
consumer data： 3
product data： 4
consumer data： 0
product data： 0
product data： 1
```

### 11、练习题

请写出下面程序的执行结果。

```go
   for i := 0; i < 5; i++ {
   	go func() {
   		fmt.Println(i)
   	}()
   }
```



## 参考

- [goroutine](https://www.topgoer.com/%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B/goroutine.html)
- [go 语言之行--golang 核武器 goroutine 调度原理、channel 详解](https://learnku.com/articles/41668)
- [Go 语言 goroutine（轻量级线程）](http://c.biancheng.net/view/93.html)
- [Go 语言基础— goroutine. 下面的代码 - Yunjie Ding](https://ll3178292.medium.com/go语言-goroutine-87baabee3869)
- [Go 语言 goroutine - Ding-Log - GitBook](https://dingyj.gitbook.io/blog/golang/basic/go-yu-yan-xue-xi-bi-ji/g-yu-yan-goroutine)
- [Go 语言之 goroutine 和通道 - 掘金](https://juejin.cn/post/7041088216002199565)
- [深入 golang 之---goroutine 并发控制与通信 - 知乎专栏](https://zhuanlan.zhihu.com/p/36907022)
