---
title: 8、gRPC基础实战
---

# gRPC基础实战

## 一、什么是RPC？

首先，什么是RPC？

RPC简称远程过程调用，是一个用于构建基于Client和Server分布式应用程序的技术。目前业界已经有了很多的框架能够用来构建基于RPC的分布式应用，例如SpringBoot，Dubbo和gRPC。

RPC 标准最早是由Bruce Jay Nelson 写的论文 [Implementing Remote Procedure Calls](http://www.cs.cmu.edu/~dga/15-712/F07/papers/birrell842.pdf)中提出的，后期的所有的RPC框架都是在这个标准模式的基础上构建出来的。

![image-20220517184741846](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220517184741846.png)

具体的执行过程就是下面这个样子

- 客户端发起一个远程调用,它实际上是调用本地的Client Stub
- Client Stub 将接受到的参数进行按照约定的协议规范进行编码，并封装到即将发送的Message中。
- Client Stub 将消息发送给RPC Runtime，然后通过网络将包 发送给Server端
- 服务器端的 RPCRuntime 收到请求后，交给提供方 Stub 进行解码，然后调用服务端的方法， 服务端执行方法，返回结果
- 服务端的处理结果 同样再经过Server Stub 打包，然后传递给RPC Runtime。
- 服务端的RPC Runtime再把数据通过网络发送给Client端。
- Client 端接收到消息，然后进行Unpack，处理

在gRPC中，客户端应用程序可以直接调用不同计算机上的服务应用程序上的方法，就像它是本地对象一样，使我们可以更轻松地创建分布式应用程序和服务。 与许多RPC系统一样，gRPC基于定义服务的思想，指定可以使用其参数和返回类型远程调用的方法。 在服务器端,服务端实现此接口并运行gRPC服务来处理客户端调用。 在客户端，客户端有一个存根（在某些语言中称为客户端），它提供与服务器相同的方法。服务端与客户端一一对应。

![image-20220517184957372](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220517184957372.png)

gRPC客户端和服务器可以在各种环境中相互运行和通信 ,并且可以使用任何gRPC支持的语言编写。 因此,我们可以使用Go，Python或Ruby轻松创建Java中的gRPC服务器。 此外，最新的Google API将具有gRPC版本的接口，我们可以轻松地在应用程序中构建Google功能。

### 1、HTTP 1.1 VS HTTP 2.0

首先，我们来直观的体验一下HTTP2.0 。 [HTTP/2 is the future of the Web, and it is here!](https://http2.akamai.com/demo) Akamai 公司 建立了一个在线的演示，可以直观的感受HTTP1.1与HTTP2.0的差距。

下面是查阅的一些资料，获取能让我们明白具体什么是HTTP2.0,以及它与HTTP1.1的区别。

- [HTTP/2](https://http2.github.io/)
- [Hypertext Transfer Protocol Version 2 (HTTP/2)(rfc7540)](https://httpwg.org/specs/rfc7540.html)
- [HTTP/2 简介](https://developers.google.com/web/fundamentals/performance/http2/?hl=zh-cn)
- [http2讲解]https://ye11ow.gitbooks.io/http2-explained/content/
- [gRPC over HTTP2](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md)

### 2、gRPC基于HTTP/2的优缺点

**优点**

- HTTP/2是一个经过实践检验的公开的标准
- 天然支持手机、物联网、浏览器
- 多语言实现容易，每种流行的编程语言都有自己的HTTP/2 Client
- HTTP/2支持Stream和流控
- 基于HTTP/2 在Gateway/Proxy很容易支持
- HTTP/2 安全性有保证
- HTTP/2 鉴权成熟

**缺点**

- rpc的元数据的传输不够高效
- HTTP/2 里一次gRPC调用需要解码两次,一次是HEADERS frame，一次是DATA frame
- HTTP/2 标准本身是只有一个TCP连接，但是实际在gRPC里是会有多个TCP连接，使用时需要注意



gRPC主要有4种请求和响应模式，分别是简单模式(Simple RPC)、服务端流式（Server-side streaming RPC）、客户端流式（Client-side streaming RPC）、和双向流式（Bidirectional streaming RPC）。

- 简单模式(Simple RPC)：客户端发起请求并等待服务端响应。
- 服务端流式（Server-side streaming RPC）：客户端发送请求到服务器，拿到一个流去读取返回的消息序列。 客户端读取返回的流，直到里面没有任何消息。
- 客户端流式（Client-side streaming RPC）：与服务端数据流模式相反，这次是客户端源源不断的向服务端发送数据流，而在发送结束后，由服务端返回一个响应。
- 双向流式（Bidirectional streaming RPC）：双方使用读写流去发送一个消息序列，两个流独立操作，双方可以同时发送和同时接收。

## 二、前置准备

### 1、安装`protoc`

> 下面示例是在`mac环境`中安装。

```go
# 安装
➜ brew install protobuf
# 查看安装后版本
➜ protoc --version
libprotoc 3.17.3
```

### 2、安装插件

> **安装插件的目的是为了将`protobuf`文件，生成`Go`代码**

```go
$ go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.26
$ go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.1
```

### 3、设置插件环境变量

```go
$ export PATH="$PATH:$(go env GOPATH)/bin"
```

### 4、验证插件是否成功

```go
Bash
# 查看protoc-gen-go版本
$ protoc-gen-go --version                                      
protoc-gen-go v1.26.0

# 查看protoc-gen-go-grpc版本
$ protoc-gen-go-grpc --version
protoc-gen-go-grpc 1.1.0
```

## 三、简单模式

本demo项目结构如下:

```go
helloworld/
├── client.go - 客户端代码
├── go.mod  - go模块配置文件
├── proto     - 协议目录
│   ├── helloworld.pb.go - rpc协议go版本代码
│   └── helloworld.proto - rpc协议文件
└── server.go  - rpc服务端代码
```

初始化命令如下：

```go
# 创建项目目录
mkdir helloworld
# 切换到项目目录
cd helloworld
# 创建RPC协议目录
mkdir proto
# 初始化go模块配置，用来管理第三方依赖
go mod init 
```

### 1、定义服务

其实就是通过 `protobuf` 语法定义语言平台无关的接口。 文件: `helloworld/proto/helloworld.proto`

```go
syntax = "proto3";

//option go_package = "path;name";
//path 表示生成的go文件的存放地址，会自动生成目录的。
//name 表示生成的go文件所属的包名
option go_package="./;proto";
// 定义包名
package proto;

// 定义Greeter服务
service Greeter {
  // 定义SayHello方法，接受HelloRequest消息， 并返回HelloReply消息
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// 定义HelloRequest消息
message HelloRequest {
  // name字段
  string name = 1;
}

// 定义HelloReply消息
message HelloReply {
  // message字段
  string message = 1;
}
```

### 2、编译命令

```go
$ protoc --proto_path=IMPORT_PATH  --go_out=OUT_DIR  --go_opt=paths=source_relative path/to/file.proto
```

这里简单介绍一下 golang 的编译姿势:

- `proto_path` 或者 `-I` ：指定 `import` 路径，可以指定多个参数，编译时按顺序查找，不指定时默认查找当前目录。

- - `proto` 文件中也可以引入其他 `.proto` 文件，这里主要用于指定被引入文件的位置。

- `go_out`：`golang` 编译支持，指定输出文件路径

- `go_opt`：指定参数，比如 `--go_opt=paths=source_relative` 就是表明生成文件输出使用相对路径。

- `path/to/file.proto` ：被编译的 `.proto` 文件放在最后面

上面通过 `proto` 定义的接口，没法直接在代码中使用，因此需要通过 `protoc` 编译器，将 `proto` 协议文件，编译成go语言代码。 在我们的demo中,按如下命令进行编译:

```go
# 切换到helloworld项目根目录，执行命令
// 老版本的命令
$ protoc -I proto/ --go_out=plugins=grpc:proto proto/helloworld.proto
/* 如果输入上述编译命令，出现如下报错，就使用新版本的命令
--go_out: protoc-gen-go: plugins are not supported; use 'protoc --go-grpc_out=...' to generate gRPC
See https://grpc.io/docs/languages/go/quickstart/#regenerate-grpc-code for more information.
*/

// 新版本的命令
$ protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative proto/helloworld.proto 

// 太长也可以用反斜杠分割
$ protoc --go_out=. --go_opt=paths=source_relative \
    --go-grpc_out=. --go-grpc_opt=paths=source_relative \
    proto/helloworld.proto

// 甚至可以简单一点
$ protoc --go-grpc_out=. --go_out=. proto/helloworld.proto
```

`protoc` 命令参数说明:

- `-I` 指定代码输出目录，忽略服务定义的包名，否则会根据包名创建目录
- `--go_out` 指定代码输出目录，格式：`--go_out=plugins=grpc:` 目录名
- 命令最后面的参数是 `proto` 协议文件 编译成功后在 `proto`目录生成了`helloworld.pb.go`文件，里面包含了，我们的服务和接口定义。

### 3、**实现服务端代码**

文件:`helloworld/server.go`

```go
/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// Package main implements a server for Greeter service.
package main

import (
	"context"
	"flag"
	"fmt"
	"google.golang.org/grpc/reflection"
	"log"
	"net"

	"google.golang.org/grpc"
	pb "grpc_demo/proto"
)

var (
	port = flag.Int("port", 50051, "The server port")
)

// 定义server，用来实现proto文件，里面实现的Greeter服务里面的接口
type server struct {
	pb.UnimplementedGreeterServer
}

// SayHello 实现SayHello接口
// 第一个参数是上下文参数，所有接口默认都要必填
// 第二个参数是我们定义的HelloRequest消息
// 返回值是我们定义的HelloReply消息，error返回值也是必须的。
func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	log.Printf("Received: %v", in.GetName())
	// 创建一个HelloReply消息，设置Message字段，然后直接返回。
	return &pb.HelloReply{Message: "Hello " + in.GetName()}, nil
}

func main() {
	flag.Parse()
	// 监听127.0.0.1:50051地址
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	// 1.实例化grpc服务端
	s := grpc.NewServer()
	// 2.注册Greeter服务
	pb.RegisterGreeterServer(s, &server{})
	log.Printf("server listening at %v", lis.Addr())

	// 3.往grpc服务端注册反射服务
	reflection.Register(s)

	// 4.启动grpc服务
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
```

运行:

```go
# 切换到项目根目录，运行命令
go run server.go
```

### 4、**客户端代码**

文件：helloworld/client.go

```go
/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// Package main implements a client for Greeter service.
package main

import (
	"context"
	"flag"
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	pb "grpc_demo/proto"
)

const (
	defaultName = "world"
)

var (
	addr = flag.String("addr", "localhost:50051", "the address to connect to")
	name = flag.String("name", defaultName, "Name to greet")
)

func main() {
	flag.Parse()
	// 1.连接grpc服务器
	conn, err := grpc.Dial(*addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}

	// 延迟关闭连接
	defer conn.Close()
	// 2.初始化Greeter服务客户端
	c := pb.NewGreeterClient(conn)

	// 3.初始化上下文，设置请求超时时间为1秒
	ctx, cancel := context.WithTimeout(context.Background(), time.Second)
	// 延迟关闭请求会话
	defer cancel()

	// 4.调用SayHello接口，发送一条消息
	r, err := c.SayHello(ctx, &pb.HelloRequest{Name: *name})
	if err != nil {
		log.Fatalf("could not greet: %v", err)
	}

	// 打印服务的返回的消息
	log.Printf("Greeting: %s", r.GetMessage())
}
```

运行:

```go
# 切换到项目根目录，运行命令
go run client.go

// 就会在控制台输出：
Greeting: Hello world
```

## 四、**服务端流式RPC**

上面的DEMO介绍了简单模式RPC，当数据量大或者需要不断传输数据时候，我们应该使用流式RPC，它允许我们边处理边传输数据。本节先介绍服务端流式RPC。

**服务端流式RPC**：客户端发送请求到服务器，拿到一个流去读取返回的消息序列。 客户端读取返回的流，直到里面没有任何消息。

**情景模拟：实时获取股票走势。**

- 客户端要获取某原油股的实时走势，客户端发送一个请求
- 服务端实时返回该股票的走势

### 1、**新建proto文件**

新建server_stream.proto文件

```go
// 定义发送请求信息
message SimpleRequest{
    // 定义发送的参数，采用驼峰命名方式，小写加下划线，如：student_name
    // 请求参数
    string data = 1;
}

// 定义流式响应信息
message StreamResponse{
    // 流式响应数据
    string stream_value = 1;
}

//服务端流式rpc，只要在响应数据前添加stream即可
// 定义我们的服务（可定义多个服务,每个服务可定义多个接口）
service StreamServer{
    // 服务端流式rpc，在响应数据前添加stream
    rpc ListValue(SimpleRequest)returns(stream StreamResponse){};
}
```

编译参考demo部分的编译命令

### 2、**创建server端**

#### 2.1 定义我们的服务，并实现ListValue方法

```go
// SimpleService 定义我们的服务
type StreamService struct{}
// ListValue 实现ListValue方法
func (s *StreamService) ListValue(req *pb.SimpleRequest, srv pb.StreamServer_ListValueServer) error {
 for n := 0; n < 5; n++ {
  // 向流中发送消息， 默认每次send送消息最大长度为`math.MaxInt32`bytes
  err := srv.Send(&pb.StreamResponse{
   StreamValue: req.Data + strconv.Itoa(n),
  })
  if err != nil {
   return err
  }
 }
 return nil
}
```

#### 2.2 启动gRPC服务器

```go
const (
 // Address 监听地址
 Address string = ":8000"
 // Network 网络通信协议
 Network string = "tcp"
)

func main() {
 // 监听本地端口
 listener, err := net.Listen(Network, Address)
 if err != nil {
  log.Fatalf("net.Listen err: %v", err)
 }
 log.Println(Address + " net.Listing...")
 // 新建gRPC服务器实例
 // 默认单次接收最大消息长度为`1024*1024*4`bytes(4M)，单次发送消息最大长度为`math.MaxInt32`bytes
 // grpcServer := grpc.NewServer(grpc.MaxRecvMsgSize(1024*1024*4), grpc.MaxSendMsgSize(math.MaxInt32))
 grpcServer := grpc.NewServer()
 // 在gRPC服务器注册我们的服务
 pb.RegisterStreamServerServer(grpcServer, &StreamService{})

 //用服务器 Serve() 方法以及我们的端口信息区实现阻塞等待，直到进程被杀死或者 Stop() 被调用
 err = grpcServer.Serve(listener)
 if err != nil {
  log.Fatalf("grpcServer.Serve err: %v", err)
 }
}
```

#### 2.3 运行

```go
go run server.go
:8000 net.Listing...
```

### 3、**创建client端**

#### 3.1 创建调用服务端ListValue方法

```go
// listValue 调用服务端的ListValue方法
func listValue() {
 // 创建发送结构体
 req := pb.SimpleRequest{
  Data: "stream server grpc ",
 }
 // 调用我们的服务(ListValue方法)
 stream, err := grpcClient.ListValue(context.Background(), &req)
 if err != nil {
  log.Fatalf("Call ListStr err: %v", err)
 }
 for {
  //Recv() 方法接收服务端消息，默认每次Recv()最大消息长度为`1024*1024*4`bytes(4M)
  res, err := stream.Recv()
  // 判断消息流是否已经结束
  if err == io.EOF {
   break
  }
  if err != nil {
   log.Fatalf("ListStr get stream err: %v", err)
  }
  // 打印返回值
  log.Println(res.StreamValue)
 }
}
```

#### 3.2 启动gRPC客户端

```go
// Address 连接地址
const Address string = ":8000"

var grpcClient pb.StreamServerClient

func main() {
 // 连接服务器
 conn, err := grpc.Dial(Address, grpc.WithInsecure())
 if err != nil {
  log.Fatalf("net.Connect err: %v", err)
 }
 defer conn.Close()

 // 建立gRPC连接
 grpcClient = pb.NewStreamServerClient(conn)
 route()
 listValue()
}
```

#### 3.3 运行客户端

```go
go run client.go
stream server grpc 0
stream server grpc 1
stream server grpc 2
stream server grpc 3
stream server grpc 4
```

> ❝ 客户端不断从服务端获取数据

## 五、**客户端流式RPC**

上一节介绍了服务端流式RPC，客户端发送请求到服务器，拿到一个流去读取返回的消息序列。 客户端读取返回的流的数据。本节将介绍客户端流式RPC。

**客户端流式RPC**：与服务端流式RPC相反，客户端不断的向服务端发送数据流，而在发送结束后，由服务端返回一个响应。

**情景模拟**：客户端大量数据上传到服务端。

### 1、**新建proto文件**

新建client_stream.proto文件

```go
// 定义流式请求信息
message StreamRequest{
    //流式请求参数
    string stream_data = 1;
}

// 定义响应信息
message SimpleResponse{
    //响应码
    int32 code = 1;
    //响应值
    string value = 2;
}


//客户端流式rpc，只要在请求的参数前添加stream即可
service StreamClient{
    // 客户端流式rpc，在请求的参数前添加stream
    rpc RouteList (stream StreamRequest) returns (SimpleResponse){};
}
```

参照demo进行编译。

### 2、**创建Server端**

#### 2.1 定义我们的服务，并实现RouteList方法

```go
// SimpleService 定义我们的服务
type SimpleService struct{}
// RouteList 实现RouteList方法
func (s *SimpleService) RouteList(srv pb.StreamClient_RouteListServer) error {
 for {
  //从流中获取消息
  res, err := srv.Recv()
  if err == io.EOF {
   //发送结果，并关闭
   return srv.SendAndClose(&pb.SimpleResponse{Value: "ok"})
  }
  if err != nil {
   return err
  }
  log.Println(res.StreamData)
 }
}
```

#### 2.2 启动gRPC服务器

```go
const (
 // Address 监听地址
 Address string = ":8000"
 // Network 网络通信协议
 Network string = "tcp"
)

func main() {
 // 监听本地端口
 listener, err := net.Listen(Network, Address)
 if err != nil {
  log.Fatalf("net.Listen err: %v", err)
 }
 log.Println(Address + " net.Listing...")
 // 新建gRPC服务器实例
 grpcServer := grpc.NewServer()
 // 在gRPC服务器注册我们的服务
 pb.RegisterStreamClientServer(grpcServer, &SimpleService{})

 //用服务器 Serve() 方法以及我们的端口信息区实现阻塞等待，直到进程被杀死或者 Stop() 被调用
 err = grpcServer.Serve(listener)
 if err != nil {
  log.Fatalf("grpcServer.Serve err: %v", err)
 }
}
```

#### 2.3 运行服务端

```go
go run server.go
:8000 net.Listing...
```

### 3、**创建客户端**

#### 3.1 创建调用服务端RouteList方法

```go
// routeList 调用服务端RouteList方法
func routeList() {
 //调用服务端RouteList方法，获流
 stream, err := streamClient.RouteList(context.Background())
 if err != nil {
  log.Fatalf("Upload list err: %v", err)
 }
 for n := 0; n < 5; n++ {
  //向流中发送消息
  err := stream.Send(&pb.StreamRequest{StreamData: "stream client rpc " + strconv.Itoa(n)})
  if err != nil {
   log.Fatalf("stream request err: %v", err)
  }
 }
 //关闭流并获取返回的消息
 res, err := stream.CloseAndRecv()
 if err != nil {
  log.Fatalf("RouteList get response err: %v", err)
 }
 log.Println(res)
}
```

#### 3.2 启动gRPC客户端

```go
// Address 连接地址
const Address string = ":8000"

var streamClient pb.StreamClientClient

func main() {
 // 连接服务器
 conn, err := grpc.Dial(Address, grpc.WithInsecure())
 if err != nil {
  log.Fatalf("net.Connect err: %v", err)
 }
 defer conn.Close()

 // 建立gRPC连接
 streamClient = pb.NewStreamClientClient(conn)
 routeList()
}
```

#### 3.3 运行客户端

```go
go run client.go
code:200 value:"hello grpc"
value:"ok"
```

服务端不断从客户端获取到数据

```go
stream client rpc 0
stream client rpc 1
stream client rpc 2
stream client rpc 3
stream client rpc 4
```

## 六、**双向流式RPC**

上一节介绍了客户端流式RPC，客户端不断的向服务端发送数据流，在发送结束或流关闭后，由服务端返回一个响应。本节将介绍双向流式RPC。

**双向流式RPC**：客户端和服务端双方使用读写流去发送一个消息序列，两个流独立操作，双方可以同时发送和同时接收。

**情景模拟**：双方对话（可以一问一答、一问多答、多问一答，形式灵活）。

### 1、**新建proto文件**

新建both_stream.proto文件

```go
// 定义流式请求信息
message StreamRequest{
    //流请求参数
    string question = 1;
}

// 定义流式响应信息
message StreamResponse{
    //流响应数据
    string answer = 1;
}


//双向流式rpc，只要在请求的参数前和响应参数前都添加stream即可
service Stream{
    // 双向流式rpc，同时在请求参数前和响应参数前加上stream
    rpc Conversations(stream StreamRequest) returns(stream StreamResponse){};
}
```

编译参照demo部分编译即可。

### 2、**创建Server端**

#### 2.1 定义我们的服务

并实现RouteList方法 这里简单实现对话中一问一答的形式

```go
// StreamService 定义我们的服务
type StreamService struct{}
// Conversations 实现Conversations方法
func (s *StreamService) Conversations(srv pb.Stream_ConversationsServer) error {
 n := 1
 for {
  req, err := srv.Recv()
  if err == io.EOF {
   return nil
  }
  if err != nil {
   return err
  }
  err = srv.Send(&pb.StreamResponse{
   Answer: "from stream server answer: the " + strconv.Itoa(n) + " question is " + req.Question,
  })
  if err != nil {
   return err
  }
  n++
  log.Printf("from stream client question: %s", req.Question)
 }
}
```

#### 2.2 启动gRPC服务器

```go
const (
 // Address 监听地址
 Address string = ":8000"
 // Network 网络通信协议
 Network string = "tcp"
)

func main() {
 // 监听本地端口
 listener, err := net.Listen(Network, Address)
 if err != nil {
  log.Fatalf("net.Listen err: %v", err)
 }
 log.Println(Address + " net.Listing...")
 // 新建gRPC服务器实例
 grpcServer := grpc.NewServer()
 // 在gRPC服务器注册我们的服务
 pb.RegisterStreamServer(grpcServer, &StreamService{})

 //用服务器 Serve() 方法以及我们的端口信息区实现阻塞等待，直到进程被杀死或者 Stop() 被调用
 err = grpcServer.Serve(listener)
 if err != nil {
  log.Fatalf("grpcServer.Serve err: %v", err)
 }
}
```

#### 2.3 运行服务端

```go
go run server.go
:8000 net.Listing...
```

### 3、**创建Client端**

#### 3.1 创建调用服务端Conversations方法

```go
// conversations 调用服务端的Conversations方法
func conversations() {
 //调用服务端的Conversations方法，获取流
 stream, err := streamClient.Conversations(context.Background())
 if err != nil {
  log.Fatalf("get conversations stream err: %v", err)
 }
 for n := 0; n < 5; n++ {
  err := stream.Send(&pb.StreamRequest{Question: "stream client rpc " + strconv.Itoa(n)})
  if err != nil {
   log.Fatalf("stream request err: %v", err)
  }
  res, err := stream.Recv()
  if err == io.EOF {
   break
  }
  if err != nil {
   log.Fatalf("Conversations get stream err: %v", err)
  }
  // 打印返回值
  log.Println(res.Answer)
 }
 //最后关闭流
 err = stream.CloseSend()
 if err != nil {
  log.Fatalf("Conversations close stream err: %v", err)
 }
}
```

#### 3.2 启动gRPC客户端

```go
// Address 连接地址
const Address string = ":8000"

var streamClient pb.StreamClient

func main() {
 // 连接服务器
 conn, err := grpc.Dial(Address, grpc.WithInsecure())
 if err != nil {
  log.Fatalf("net.Connect err: %v", err)
 }
 defer conn.Close()

 // 建立gRPC连接
 streamClient = pb.NewStreamClient(conn)
 conversations()
}
```

#### 3.3 运行客户端，获取到服务端的应答

```go
go run client.go
from stream server answer: the 1 question is stream client rpc 0
from stream server answer: the 2 question is stream client rpc 1
from stream server answer: the 3 question is stream client rpc 2
from stream server answer: the 4 question is stream client rpc 3
from stream server answer: the 5 question is stream client rpc 4
```

服务端获取到来自客户端的提问

```go
from stream client question: stream client rpc 0
from stream client question: stream client rpc 1
from stream client question: stream client rpc 2
from stream client question: stream client rpc 3
from stream client question: stream client rpc 4
```





## 参考

- [go gRPC的使用](https://zhuanlan.zhihu.com/p/411317961)
- [gRPC 官方文档中文版 v1.0](https://doc.oschina.net/grpc?t=60133)
