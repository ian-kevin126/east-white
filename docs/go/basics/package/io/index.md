---
title: I/O操作
---

# I/O操作

I/O操作也叫输入输出操作。其中I是指Input，O是指Output，用于读或者写数据的，有些语言中也叫流操作，是指数据通信的通道。

Golang 标准库对 IO 的抽象非常精巧，各个组件可以随意组合，可以作为接口设计的典范。

io包中提供I/O原始操作的一系列接口。

它主要包装了一些已有的实现，如 os 包中的那些，并将这些抽象成为实用性的功能和一些其他相关的接口。

由于这些接口和原始的操作以不同的实现包装了低级操作，客户不应假定它们对于并行执行是安全的。

**io库比较常用的接口有三个，分别是Reader，Writer和Closer。**

## 一、Reader

Reader接口的定义，Read()方法用于读取数据。

~~~go
type Reader interface {
        Read(p []byte) (n int, err error)
}
~~~

io.Reader 表示一个读取器，它将数据从某个资源读取到传输缓冲区。在缓冲区中，数据可以被流式传输和使用。

- 对于要用作读取器的类型，它必须实现 io.Reader 接口的唯一一个方法 Read(p []byte)。
- 换句话说，只要实现了 Read(p []byte) ，那它就是一个读取器。
- Read() 方法有两个返回值，一个是读取到的字节数，一个是发生错误时的错误。

通过 string.NewReader(string) 创建一个字符串读取器，然后流式地按字节读取：

~~~go
package main

import (
	"io"
	"log"
	"os"
	"strings"
)

func main() {

	reader := strings.NewReader("mszlu test123 123")
	// 每次读取4个字节
	p := make([]byte, 4)
	for {

		n, err := reader.Read(p)
		if err != nil {
			if err == io.EOF {
				log.Printf("读完了:eof错误 :%d", n)
				break
			}
			log.Printf("其他错误:%v", err)
			os.Exit(2)
		}
		log.Printf("[读取到的字节数为:%d][内容:%v]", n, string(p[:n]))
	}

}
~~~

~~~go
 [读取到的字节数为:4][内容:mszl]
 [读取到的字节数为:4][内容:u te]
 [读取到的字节数为:4][内容:st12]
 [读取到的字节数为:4][内容:3 12]
 [读取到的字节数为:1][内容:3]
 读完了:eof错误 :0
~~~

* 最后一次返回的 n 值有可能小于缓冲区大小。
* io.EOF 来表示输入流已经读取到头

strings.Reader.Read方法:

~~~go
func (r *Reader) Read(b []byte) (n int, err error) {
	if r.i >= int64(len(r.s)) {
		return 0, io.EOF
	}
	r.prevRune = -1
	n = copy(b, r.s[r.i:])
	r.i += int64(n)
	return
}
~~~

### 1.1 文件操作相关API

- ```go
  func Create(name string) (file *File, err Error)
  ```

  - 根据提供的文件名创建新的文件，返回一个文件对象，默认权限是0666

- ```go
  func NewFile(fd uintptr, name string) *File
  ```

  - 根据文件描述符创建相应的文件，返回一个文件对象

- ```go
  func Open(name string) (file *File, err Error)
  ```

  - 只读方式打开一个名称为name的文件

- ```go
  func OpenFile(name string, flag int, perm uint32) (file *File, err Error)
  ```

  - 打开名称为name的文件，flag是打开的方式，只读、读写等，perm是权限

- ```go
  func (file *File) Write(b []byte) (n int, err Error)
  ```

  - 写入byte类型的信息到文件

- ```go
  func (file *File) WriteAt(b []byte, off int64) (n int, err Error)
  ```

  - 在指定位置开始写入byte类型的信息

- ```go
  func (file *File) WriteString(s string) (ret int, err Error)
  ```

  - 写入string信息到文件

- ```go
  func (file *File) Read(b []byte) (n int, err Error)
  ```

  - 读取数据到b中

- ```go
  func (file *File) ReadAt(b []byte, off int64) (n int, err Error)
  ```

  - 从off开始读取数据到b中

- ```go
  func Remove(name string) Error
  ```

  - 删除文件名为name的文件

### 1.2 读文件

~~~go
type Closer interface {
    Close() error
}
~~~



`os.Open()`函数能够打开一个文件，返回一个`*File`和一个`err`。对得到的文件实例调用`Close()`方法能够关闭文件。

文件读取可以用file.Read()，读到文件末尾会返回io.EOF的错误

~~~go
package main

import (
    "fmt"
    "io"
    "os"
)

func main() {
    // 打开文件
    file, err := os.Open("./xxx.txt")
    if err != nil {
        fmt.Println("open file err :", err)
        return
    }
    defer file.Close()
    // 定义接收文件读取的字节数组
    var buf [128]byte
    var content []byte
    for {
        n, err := file.Read(buf[:])
        if err == io.EOF {
            // 读取结束
            break
        }
        if err != nil {
            fmt.Println("read file err ", err)
            return
        }
        content = append(content, buf[:n]...)
    }
    fmt.Println(string(content))
}
~~~

## 二、Writer

~~~go
type Writer interface {
    //Write() 方法有两个返回值，一个是写入到目标资源的字节数，一个是发生错误时的错误。
    Write(p []byte) (n int, err error)
}
~~~

- io.Writer 表示一个写入器，它从缓冲区读取数据，并将数据写入目标资源。
- 对于要用作编写器的类型，必须实现 io.Writer 接口的唯一一个方法 Write(p []byte)
- 同样，只要实现了 Write(p []byte) ，那它就是一个编写器。

写文件：

~~~go
package main

import (
    "fmt"
    "os"
)

func main() {
    // 新建文件
    file, err := os.Create("./test.txt")
    if err != nil {
        fmt.Println(err)
        return
    }
    defer file.Close()
    for i := 0; i < 5; i++ {
        file.WriteString("ab\n")
        file.Write([]byte("cd\n"))
    }
}
~~~

## 三、bufio

- bufio包实现了带缓冲区的读写，是对文件读写的封装
- bufio缓冲写数据

| 模式        | 含义     |
| ----------- | -------- |
| os.O_WRONLY | 只写     |
| os.O_CREATE | 创建文件 |
| os.O_RDONLY | 只读     |
| os.O_RDWR   | 读写     |
| os.O_TRUNC  | 清空     |
| os.O_APPEND | 追加     |

**bufio读写数据**

~~~go
package main

import (
    "bufio"
    "fmt"
    "io"
    "os"
)

func wr() {
    // 参数2：打开模式，所有模式d都在上面
    // 参数3是权限控制
    // w写 r读 x执行   w  2   r  4   x  1
    //特殊权限位，拥有者位，同组用户位，其余用户位
    file, err := os.OpenFile("./xxx.txt", os.O_CREATE|os.O_WRONLY, 0666)
    if err != nil {
        return
    }
    defer file.Close()
    // 获取writer对象
    writer := bufio.NewWriter(file)
    for i := 0; i < 10; i++ {
        writer.WriteString("hello\n")
    }
    // 刷新缓冲区，强制写出
    writer.Flush()
}

func re() {
    file, err := os.Open("./xxx.txt")
    if err != nil {
        return
    }
    defer file.Close()
    reader := bufio.NewReader(file)
    for {
        line, _, err := reader.ReadLine()
        if err == io.EOF {
            break
        }
        if err != nil {
            return
        }
        fmt.Println(string(line))
    }

}

func main() {
    re()
}
~~~



## 四、ioutil工具包

- ioutil库包含在io目录下，它的主要作用是`作为一个工具包`，里面有一些比较实用的函数
- 比如 `ReadAll(从某个源读取数据)、ReadFile（读取文件内容）、WriteFile（将数据写入文件）、ReadDir（获取目录）`

~~~go
package main

import (
   "fmt"
   "io/ioutil"
)

func wr() {
   err := ioutil.WriteFile("./yyy.txt", []byte("码神之路"), 0666)
   if err != nil {
      fmt.Println(err)
      return
   }
}

func re() {
   content, err := ioutil.ReadFile("./yyy.txt")
   if err != nil {
      fmt.Println(err)
      return
   }
   fmt.Println(string(content))
}

func main() {
   re()
}
~~~

## 五、实现一个cat命令

使用文件操作相关知识，模拟实现linux平台cat命令的功能。

~~~go
package main

import (
    "bufio"
    "flag"
    "fmt"
    "io"
    "os"
)

// cat命令实现
func cat(r *bufio.Reader) {
    for {
        buf, err := r.ReadBytes('\n') //注意是字符
        if err == io.EOF {
            break
        }
        fmt.Fprintf(os.Stdout, "%s", buf)
    }
}

func main() {
    flag.Parse() // 解析命令行参数
    if flag.NArg() == 0 {
        // 如果没有参数默认从标准输入读取内容
        cat(bufio.NewReader(os.Stdin))
    }
    // 依次读取每个指定文件的内容并打印到终端
    for i := 0; i < flag.NArg(); i++ {
        f, err := os.Open(flag.Arg(i))
        if err != nil {
            fmt.Fprintf(os.Stdout, "reading from %s failed, err:%v\n", flag.Arg(i), err)
            continue
        }
        cat(bufio.NewReader(f))
    }
}
~~~

