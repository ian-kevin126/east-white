---
title: 1、ProtoBuf
---

# ProtoBuf概述

协议缓冲区提供了一种语言中立、平台中立、可扩展的机制，用于以向前兼容和向后兼容的方式序列化结构化数据。它类似于 JSON，只是它更小更快，并且生成本地语言绑定。

协议缓冲区是定义语言（在 `.proto`文件中创建）、proto 编译器生成的与数据接口的代码、特定于语言的运行时库以及写入文件（或通过网络连接）。

`Protobuf`是`Protocol Buffers`的简称，它是谷歌公司开发的一种数据描述语言，并于2008年开源。`Protobuf`刚开源时的定位类似于`XML、JSON`等数据描述语言，通过附带工具生成代码并实现将结构化数据序列化的功能。

在序列化结构化数据的机制中，`ProtoBuf`是灵活、高效、自动化的，相对常见的`XML、JSON`，描述同样的信息，`ProtoBuf`序列化后数据量更小、序列化/反序列化速度更快、更简单。

## 一、协议缓冲区解决了哪些问题？

协议缓冲区为大小高达几兆字节的类型化结构化数据包提供了一种序列化格式。该格式适用于临时网络流量和长期数据存储。可以使用新信息扩展协议缓冲区，而无需使现有数据无效或需要更新代码。

协议缓冲区是 Google 最常用的数据格式。它们广泛用于服务器间通信以及磁盘上数据的归档存储。协议缓冲区*消息*和*服务*由工程师编写的`.proto`文件描述。下面显示了一个示例`message`：

```proto
message Person {
  optional string name = 1;
  optional int32 id = 2;
  optional string email = 3;
}
```

proto 编译器在`.proto`文件构建时被调用，以生成各种编程语言的代码（ 在本主题后面的[跨语言兼容性](https://developers.google.com/protocol-buffers/docs/overview#cross-lang)中介绍）来操作相应的协议缓冲区。每个生成的类都包含每个字段的简单访问器和方法，用于序列化和解析整个结构与原始字节之间的关系。下面向您展示了一个使用这些生成方法的示例：

```java
Person john = Person.newBuilder()
    .setId(1234)
    .setName("John Doe")
    .setEmail("jdoe@example.com")
    .build();
output = new FileOutputStream(args[0]);
john.writeTo(output);
```

由于协议缓冲区在 Google 的各种服务中广泛使用，并且其中的数据可能会保留一段时间，因此保持向后兼容性至关重要。协议缓冲区允许无缝支持对任何协议缓冲区的更改，包括添加新字段和删除现有字段，而不会破坏现有服务。有关此主题的更多信息，请参阅本主题后面的在[不更新代码的情况下更新原型定义。](https://developers.google.com/protocol-buffers/docs/overview#updating-defs)

## 二、使用协议缓冲区有什么好处？

协议缓冲区非常适合任何需要以语言中立、平台中立、可扩展的方式序列化结构化、类似记录、类型化数据的情况。它们最常用于定义通信协议（与 gRPC 一起）和数据存储。

使用协议缓冲区的一些优点包括：

- 紧凑的数据存储
- 快速解析
- 许多编程语言的可用性
- 通过自动生成的类优化功能

### 1、跨语言兼容性

以任何受支持的编程语言编写的代码都可以读取相同的消息。您可以让一个平台上的 Java 程序从一个软件系统捕获数据，根据`.proto`定义对其进行序列化，然后在另一个平台上运行的单独 Python 应用程序中从序列化数据中提取特定值。

协议缓冲区编译器 protoc 直接支持以下语言：

- [C++](https://developers.google.com/protocol-buffers/docs/reference/cpp-generated#invocation)
- [C＃](https://developers.google.com/protocol-buffers/docs/reference/csharp-generated#invocation)
- [Java](https://developers.google.com/protocol-buffers/docs/reference/java-generated#invocation)
- [Kotlin](https://developers.google.com/protocol-buffers/docs/reference/kotlin-generated#invocation)
- [Objective-C](https://developers.google.com/protocol-buffers/docs/reference/objective-c-generated#invocation)
- [PHP](https://developers.google.com/protocol-buffers/docs/reference/php-generated#invocation)
- [Python](https://developers.google.com/protocol-buffers/docs/reference/python-generated#invocation)
- [Ruby](https://developers.google.com/protocol-buffers/docs/reference/ruby-generated#invocation)

Google 支持以下语言，但项目的源代码位于 GitHub 存储库中。protoc 编译器使用这些语言的插件：

- [Dart](https://github.com/google/protobuf.dart)
- [Go](https://github.com/protocolbuffers/protobuf-go)

其他语言不直接由 Google 支持，而是由其他 GitHub 项目支持。这些语言包含在[Protocol Buffers 的第三方插件中](https://github.com/protocolbuffers/protobuf/blob/master/docs/third_party.md)。

### 2、跨项目支持

您可以通过在驻留在特定项目代码库之外的文件中定义`message`类型来 跨项目使用协议缓冲区。`.proto`如果您正在定义`message`您预计将在您的直接团队之外广泛使用的类型或枚举，您可以将它们放在自己的文件中而没有依赖关系。

在 Google 中广泛使用的几个原型定义示例是 [`timestamp.proto`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/timestamp.proto) 和 [`status.proto`](https://github.com/googleapis/googleapis/blob/master/google/rpc/status.proto).

### 3、在不更新代码的情况下更新原型定义

软件产品向后兼容是标准，但向前兼容却不太常见。只要您 在更新定义时遵循一些[简单的做法](https://developers.google.com/protocol-buffers/docs/proto#updating)`.proto` ，旧代码将毫无问题地读取新消息，而忽略任何新添加的字段。对于旧代码，删除的字段将具有默认值，删除的重复字段将为空。有关什么是“重复”字段的信息，请参阅本主题后面的[协议缓冲区定义语法。](https://developers.google.com/protocol-buffers/docs/overview#syntax)

新代码也将透明地读取旧消息。旧消息中不会出现新字段；在这些情况下，协议缓冲区提供了一个合理的默认值。

### 4、什么时候协议缓冲区不适合？

协议缓冲区并不适合所有数据。尤其：

- 协议缓冲区倾向于假设整个消息可以一次加载到内存中并且不大于对象图。对于超过几兆字节的数据，考虑不同的解决方案；在处理较大的数据时，由于序列化副本，您可能会有效地获得多个数据副本，这可能会导致内存使用量出现惊人的峰值。
- 当协议缓冲区被序列化时，相同的数据可以有许多不同的二进制序列化。如果不完全解析它们，就无法比较两条消息的相等性。
- 消息未压缩。虽然消息可以像任何其他文件一样被压缩或 gzip 压缩，但专用压缩算法（如 JPEG 和 PNG 使用的压缩算法）将为适当类型的数据生成小得多的文件。
- 对于涉及大型多维浮点数数组的许多科学和工程用途，协议缓冲区消息在大小和速度方面都没有达到最大效率。对于这些应用程序， [FITS](https://en.wikipedia.org/wiki/FITS)和类似格式的开销较小。
- 协议缓冲区在科学计算中流行的非面向对象语言（例如 Fortran 和 IDL）中没有得到很好的支持。
- 协议缓冲区消息本身并不自我描述其数据，但它们具有完全反射的模式，您可以使用它来实现自我描述。也就是说，如果不访问其相应的`.proto`文件，您将无法完全解释它。
- 协议缓冲区不是任何组织的正式标准。这使得它们不适合在具有法律或其他要求以建立在标准之上的环境中使用。

###  5、XML、JSON、Protobuf对比

- `json`: 一般的`web`项目中，最流行的主要还是`json`。因为浏览器对于`json`数据支持非常好，有很多内建的函数支持。
- `xml`: 在`webservice`中应用最为广泛，但是相比于`json`，它的数据更加冗余，因为需要成对的闭合标签。`json`使用了键值对的方式，不仅压缩了一定的数据空间，同时也具有可读性。
- `protobuf`:是后起之秀，是谷歌开源的一种数据格式，适合高性能，对响应速度有要求的数据传输场景。因为`profobuf`是二进制数据格式，需要编码和解码。数据本身不具有可读性。因此只能反序列化之后得到真正可读的数据。

|              | XML                | JSON               | Protocol Buffers   |
| ------------ | ------------------ | ------------------ | ------------------ |
| 数据保存方式 | 文本               | 文本               | 二进制             |
| 可读性       | 较好               | 较好               | 不可读             |
| 解析速度     | 慢                 | 一般               | 快                 |
| 语言支持     | 所有语言           | 所有语言           | 所有语言           |
| 使用范围     | 文件存储、数据交互 | 文件存储、数据交互 | 文件存储、数据交互 |

## 三、谁使用协议缓冲区？

许多外部可用的项目使用协议缓冲区，包括以下内容：

- [gRPC](https://grpc.io/)
- [谷歌云](https://cloud.google.com/)
- [特使代理](https://www.envoyproxy.io/)

## 四、协议缓冲区如何工作？

下图显示了如何使用协议缓冲区来处理数据。



![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/protocol-buffers-concepts.png)

**图 1. 协议缓冲区工作流程**



协议缓冲区生成的代码提供了从文件和流中检索数据、从数据中提取单个值、检查数据是否存在、将数据序列化回文件或流以及其他有用功能的实用方法。

以下代码示例向您展示了 Java 中此流程的示例。如前所述，这是一个`.proto`定义：

```go
message Person {
  optional string name = 1;
  optional int32 id = 2;
  optional string email = 3;
}
```

编译此`.proto`文件会创建一个`Builder`类，您可以使用它来创建新实例，如以下 Java 代码所示：

```java
Person john = Person.newBuilder()
    .setId(1234)
    .setName("John Doe")
    .setEmail("jdoe@example.com")
    .build();
output = new FileOutputStream(args[0]);
john.writeTo(output);
```

然后，您可以使用 protocol buffers 在其他语言（如 C++）中创建的方法反序列化数据：

```cpp
Person john;
fstream input(argv[1], ios::in | ios::binary);
john.ParseFromIstream(&input);
int id = john.id();
std::string name = john.name();
std::string email = john.email();
```

## 五、协议缓冲区定义语法

定义`.proto`文件时，您可以指定字段为`optional` or `repeated`(proto2 and proto3) or `singular`(proto3)。（将字段设置为的选项`required`在 proto3 中不存在，并且在 proto2 中强烈建议不要使用。有关此内容的更多信息，请参阅“[指定字段规则](https://developers.google.com/protocol-buffers/docs/proto#specifying-rules)”中的“必填项” 。）

```go
// 指明当前使用proto3语法，如果不指定，编译器会使用proto2
syntax = "proto3";
// package声明符，用来防止消息类型有命名冲突
package msg;
// 选项信息，对应go的包路径
option go_package = "server/msg";
// message关键字，像go中的结构体
message FirstMsg {
  // 类型 字段名 标识号
  int32 id = 1;
  string name=2;
  string age=3;
}
```

- `syntax`: 用来标记当前使用`proto`的哪个版本。
- `package`: 包名，用来防止消息类型命名冲突。
- `option go_package`: 选项信息，代表生成后的`go`代码包路径。
- `message`: 声明消息的关键字，类似`Go`语言中的`struct`。
- 定义字段语法: `类型 字段名 标识号`

> **标识号说明**
>
> - 每个字段都有唯一的一个数字标识符，一旦开始使用就不能够再改变。
> - **[1, 15]之内的标识号在编码的时候会占用一个字节。[16, 2047]之内的标识号则占用2个字节。**
> - **最小的标识号可以从1开始，最大到2^29 - 1, or 536,870,911。不可以使用其中的[19000－19999],因为是预留信息，如果使用，编译时会报警。**



设置字段的可选性/可重复性后，指定数据类型。协议缓冲区支持通常的原始数据类型，例如整数、布尔值和浮点数。有关完整列表，请参阅 [标量值类型](https://developers.google.com/protocol-buffers/docs/proto#scalar)。

一个字段也可以是：

- 一种`message`类型，以便您可以嵌套部分定义，例如用于重复数据集。
- 一种`enum`类型，因此您可以指定一组值以供选择。
- 一种`oneof`类型，当消息有许多可选字段并且最多同时设置一个字段时可以使用该类型。
- 一种`map`类型，用于将键值对添加到您的定义中。

在 proto2 中，消息可以允许**扩展**定义消息本身之外的字段。例如，protobuf 库的内部消息模式允许扩展自定义的、特定于使用的选项。

有关可用选项的更多信息，请参阅 [proto2](https://developers.google.com/protocol-buffers/docs/proto)或 [proto3](https://developers.google.com/protocol-buffers/docs/proto3)的语言指南。

在设置可选性和字段类型后，您分配一个字段编号。字段编号不能改变用途或重复使用。如果您删除一个字段，您应该保留其字段编号，以防止有人意外重复使用该编号。

### 1、简单类型与Go对应

| .proto  | Go      | Notes                                                        |
| ------- | ------- | ------------------------------------------------------------ |
| double  | float64 |                                                              |
| float   | float32 |                                                              |
| int32   | int32   | 对于负值的效率很低，如果有负值,使用sint64                    |
| uint32  | uint32  | 使用变长编码                                                 |
| uint64  | uint64  | 使用变长编码                                                 |
| sint32  | int32   | 负值时比int32高效的多                                        |
| sint64  | int64   | 使用变长编码，有符号的整型值。编码时比通常的int64高效。      |
| fixed32 | uint32  | 总是4个字节，如果数值总是比总是比228大的话，这个类型会比uint32高效。 |
| fixed64 | uint64  | 是8个字节，如果数值总是比总是比256大的话，这个类型会比uint64高效。 |

#### 默认值

- 对于strings, 默认值是空字符串(注, 是"", 而不是null)
- 对于bytes, 默认值是空字节(注, 应该是byte[0], 注意这里也不是null)
- 对于boolean, 默认值是false.
- 对于数字类型, 默认值是0.
- 对于枚举, 默认值是第一个定义的枚举值, 而这个值必须是0.
- 对于消息字段, 默认值是null.

对于重复字段, 默认值是空(通常都是空列表)

> 注意: 对于简单字段, 当消息被解析后, 如果值恰巧和默认值相同(例如一个boolean设置为false)是没有办法知道这个字段到底是有设置值还是取了默认值。这样就要求，不要根据默认值来采取某些切换行为，例如当某个 boolean 值为false时，切换状态。同样的，如果一个字段被设置了默认值，这个值不会被序列化。

### 2、保留标识符(`reserved`)

> 什么是保留标示符？**reserved 标记的标识号、字段名，都不能在当前消息中使用。**

```go
message Foo {
  reserved 2, 15, 9 to 11;
  reserved "foo", "bar";
}
```

在更新message type时，假设需要彻底删除一个field，或者注释掉，这样未来其他人就可以继续使用之前分配给这个字段的编号。如果他们以后加载了相同 `.proto` 文件的旧版本，这可能会导致严重问题，包括数据损坏，隐私错误等。有一个办法就是将要删除的字段设置为保留字段，未来任何用户试图使用这个字段的时候，protocol buffer 的编译器就会告警提示。

但是要注意不能在同一个保留字段声明中混合使用数字和 Field name.

```go
syntax = "proto3";
package demo;

// 在这个消息中标记
message DemoMsg {
  // 标示号：1，2，10，11，12，13 都不能用
  reserved 1,2, 10 to 13;
  // 字段名 test、name 不能用
  reserved "test","name";
  // 不能使用字段名，提示:Field name 'name' is reserved
  string name = 3;
  // 不能使用标示号,提示:Field 'id' uses reserved number 11
  int32 id = 11;
}

// 另外一个消息还是可以正常使用
message Demo2Msg {
  // 标示号可以正常使用
  int32 id = 1;
  // 字段名可以正常使用
  string name = 2;
}
```

### 3、枚举类型

当定义消息类型时, 我们希望某个字段只能有预先定义的多个值中的一个. 例如, 为每个SearchRequest添加一个corpus字段, 而corpus可以是UNIVERSAL, WEB, IMAGES, LOCAL, NEWS, PRODUCTS 或 VIDEO . 这样就可以简单的添加一个枚举到消息定义, 为每个可能的值定义常量。

```go
message SearchRequest {
  string query = 1;
  int32 page_number = 2;
  int32 result_per_page = 3;
  enum Corpus {
    UNIVERSAL = 0;
    WEB = 1;
    IMAGES = 2;
    LOCAL = 3;
    NEWS = 4;
    PRODUCTS = 5;
    VIDEO = 6;
  }
  Corpus corpus = 4;
}
```

举的第一个常量设置到0: 每个枚举定义必须包含一个映射到0的常量作为它的第一个元素. 这是因为:

- 必须有一个0值, 这样我们才能用0来作为数值默认值
- 0值必须是第一个元素, 兼容proto2语法,在proto2中默认值总是第一个枚举值

可以通过将相同值赋值给不同的枚举常量来定义别名. 为此需要设置allow_alias选项为true,否则protocol编译器会报错。

```go
enum EnumAllowingAlias {
  option allow_alias = true;
  UNKNOWN = 0;
  STARTED = 1;
  RUNNING = 1;
}
enum EnumNotAllowingAlias {
  UNKNOWN = 0;
  STARTED = 1;
  // RUNNING = 1;  // Uncommenting this line will cause a compile error inside Google and a warning message outside.
}
```

枚举常量必须在32位整形的范围内. 由于枚举值使用 `varint encoding`, 负值是效率低下的因此不推荐使用。

```go
syntax = "proto3";
package demo;
// 声明生成Go代码，包路径
option go_package ="server/demo";
// 枚举消息
message DemoEnumMsg {
  enum Gender{
    // 枚举字段标识符,必须从0开始
    UnKnown = 0;
    Body = 1;
    Girl = 2;
  }
  // 使用自定义的枚举类型
  Gender sex = 2;
}
// 在枚举信息中，重复使用标识符
message DemoTwoMsg{
  enum Animal {
    // 开启允许重复使用 标示符
    option allow_alias = true;
    Other = 0;
    Cat = 1;
    Dog = 2;
    // 白猫也是毛，标示符也用1
    // 不开启allow_alias，会报错： Enum value number 1 has already been used by value 'Cat'
    WhiteCat = 1;
  }
}
```

> **每个枚举类型必须将其第一个类型映射为0, 原因有两个：1.必须有个默认值为0； 2.为了兼容proto2语法，枚举类的第一个值总是默认值.**

### 4、嵌套消息

与其他编程语言一样，Protocol Buffer 支持内嵌类型，并且可以内嵌多层。

```go
message SearchResponse {
  message Result {
    string url = 1;
    string title = 2;
    repeated string snippets = 3;
  }
  repeated Result result = 1;
}
```

如果想在父消息类型之外重用消息类型, 可以使用 Parent.Type 来引用:

```go
message SomeOtherMessage {
  SearchResponse.Result result = 1;
}
```

下面是一个完整的实例：

```go
syntax = "proto3";
option go_package = "server/nested";
// 学员信息
message UserInfo {
  int32 userId = 1;
  string userName = 2;
}
message Common {
  // 班级信息
  message CLassInfo{
    int32 classId = 1;
    string className = 2;
  }
}
// 嵌套信息
message NestedDemoMsg {
  // 学员信息 (直接使用消息类型)
  UserInfo userInfo = 1;
  // 班级信息 (通过Parent.Type，调某个消息类型的子类型)
  Common.CLassInfo classInfo =2;
}
```

还可以嵌套更深：

```go
message Outer {                  // Level 0
  message MiddleAA {  // Level 1
    message Inner {   // Level 2
      int64 ival = 1;
      bool  booly = 2;
    }
  }
  message MiddleBB {  // Level 1
    message Inner {   // Level 2
      int32 ival = 1;
      bool  booly = 2;
    }
  }
}
```

#### 更新消息类型

如果现有的消息类型不再满足所有需求 (例如，添加额外的字段 )，但仍然希望使用使用旧格式创建的代码，不用担心，在不破坏任何现有代码的情况下更新消息类型非常简单。请记住以下规则：

- **不要**更改任何现有字段的字段编号；
- 如果添加新的字段时, 使用"老"消息格式序列化后的任何消息都可以被新生成的代码解析. 但是需要留意这些元素的默认值以便新的代码可以正确和老代码生成的消息交互(也就是说，新添加的字段此时会采用默认值，因为lao的消息传递过来的时候不会包含这些字段). 类似的, 新代码创建的消息可以被老代码解析: 解析时新的字段被简单的忽略. 当消息反序列化时未知字段会失效, 因此如果消息被传递给新代码, 新的字段将不再存在.
- 字段可以被删除, 但是要求在更新后的消息类型中原来的标签数字不再使用.可以考虑重命名这个字段, 或者添加前缀`OBSOLETE_`, 或者`reserved`, 以便其他用户在修改.proto文件不会不小心重用这个数字.
- `int32`, `uint32`, `int64`, `uint64`, 和 `bool` 是完全兼容的 ,也就是说可以将一个字段的类型从这些类型中的一个修改为另外一个，而不会打破向前或者向后兼容. 也就是说，类型解析时会做一下相应的类型转换。
- sint32 和 sint64 是彼此兼容的,但是和其他整型类型不兼容.
- string 和 bytes 是兼容的, 如果bytes是有效的UTF-8编码的.
- 如果bytes包含这个消息编码后的内容，内嵌的message type 和bytes兼容,.
- fixed32 兼容 sfixed32, 而 fixed64 兼容 sfixed64.

### 5、map类型消息

如果想创建一个map作为数据定义的一部分, 可以使用下面的语法:

> map map_field = N;

key_type可以是任意整型或者字符类型( 除了floating point和bytes外任何简单类型). value_type可以是任意类型.

这与大多数编程语言类似,例如下面的代码，projects 是另一个 message type。

```go
map<string, Project> projects = 3;
```

**map语法和下面的代码等同**

```go
message MapFieldEntry {
  key_type key = 1;
  value_type value = 2;
}

repeated MapFieldEntry map_field = N;
```

#### 5.1 `protobuf`源码

```go
syntax = "proto3";
option go_package = "server/demo";

// map消息
message DemoMapMsg {
  int32 userId = 1;
  map<string,string> like =2;
}
```

#### 5.2 生成`Go`代码

```go
// map消息
type DemoMapMsg struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	UserId int32             `protobuf:"varint,1,opt,name=userId,proto3" json:"userId,omitempty"`
	Like   map[string]string `protobuf:"bytes,2,rep,name=like,proto3" json:"like,omitempty" protobuf_key:"bytes,1,opt,name=key,proto3" protobuf_val:"bytes,2,opt,name=value,proto3"`
}
```

### 6、切片(数组)类型消息

#### 6.1 `protobuf`源码

```go
syntax = "proto3";
option go_package = "server/demo";

// repeated允许字段重复，对于Go语言来说，它会编译成数组(slice of type)类型的格式
message DemoSliceMsg {
  // 会生成 []int32
  repeated int32 id = 1;
  // 会生成 []string
  repeated string name = 2;
  // 会生成 []float32
  repeated float price = 3;
  // 会生成 []float64
  repeated double money = 4;
}
```

#### 6.2 生成`Go`代码

```go
// ...
// repeated允许字段重复，对于Go语言来说，它会编译成数组(slice of type)类型的格式
type DemoSliceMsg struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	// 会生成 []int32
	Id []int32 `protobuf:"varint,1,rep,packed,name=id,proto3" json:"id,omitempty"`
	// 会生成 []string
	Name []string `protobuf:"bytes,2,rep,name=name,proto3" json:"name,omitempty"`
	// 会生成 []float32
	Price []float32 `protobuf:"fixed32,3,rep,packed,name=price,proto3" json:"price,omitempty"`
	Money []float64 `protobuf:"fixed64,4,rep,packed,name=money,proto3" json:"money,omitempty"`
}
...
```

### 7、引入其他`proto`文件

#### 7.1 被引入文件`class.proto`

**文件位置:`proto/class.proto`**

```go
syntax="proto3";
// 包名
package dto;
// 生成go后的文件路径
option go_package = "grpc/server/dto";

message ClassMsg {
  int32  classId = 1;
  string className = 2;
}
```

#### 7.2 使用引入文件`user.proto`

**文件位置:`proto/user.proto`**

```go
syntax = "proto3";

// 导入其他proto文件
import "proto/class.proto";

option go_package="grpc/server/dto";

package dto;

// 用户信息
message UserDetail{
  int32 id = 1;
  string name = 2;
  string address = 3;
  repeated string likes = 4;
  // 所属班级
  ClassMsg classInfo = 5;
}
```

### 8、import proto

像编写代码一样,proto文件也支持从其他的proto文件中导入message 定义。

> import "myproject/other_protos.proto";

**但是这里要注意**

假设 `a.proto`引入了`b.proto`，但是`b.proto`更换了位置，路径变成了`test/b.proto`,那有下面的办法可以解决:

- 修改`a.proto`中的import语句，直接`import "test/b.proto"`
- 在`b.proto`文件原来的位置，创建一个`b.proto`文件，文件内容为`import public "test/b.proto"`，就可以了

假设 `a.proto`引入了`b.proto`，`b.proto` 中引用 `c.proto`,如果 `a.proto`想要引用`c.proto`，是不能直接用的，同样有下面两种办法：

- 在`a.proto`中新增`c.proto`的引用
- 在`b.proto`中将引用修改为 `import public "c.proto"``

## 六、定义服务(`Service`)

> 上面学习的都是怎么定义一个消息类型，如果想要将消息类型用在RPC(远程方法调用)系统中，需要使用关键字(`service`)定义一个RPC服务接口，使用`rpc`定义具体方法，而消息类型则充当方法的参数和返回值。

### 1、编写`service`

**文件位置:`proto/hello_service.proto`**

```go
syntax = "proto3";

option go_package = "grpc/server";

// 定义入参消息
message HelloParam{
  string name = 1;
  string context = 2;
}

// 定义出参消息
message HelloResult {
  string result = 1;
}

// 定义service
service HelloService{
  // 定义方法 
  rpc SayHello(HelloParam) returns (HelloResult);
}
```

### 2、生成`Go`代码

> 使用命令:**`protoc --go_out=. --go-grpc_out=. proto/hello_service.proto`**生成代码。

上述命令会生成很多代码,我们的工作主要是要实现`SayHello`方法,下面是生成的部分代码。

#### 2.1 客户端部分代码

```go
// 客户端接口
type HelloServiceClient interface {
	SayHello(ctx context.Context, in *HelloParam, opts ...grpc.CallOption) (*HelloResult, error)
}
// 客户端实现调用SayHello方法
func (c *helloServiceClient) SayHello(ctx context.Context, in *HelloParam, opts ...grpc.CallOption) (*HelloResult, error) {
	out := new(HelloResult)
	err := c.cc.Invoke(ctx, "/HelloService/SayHello", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}
```

#### 2.2 服务端部分代码

```go
// 生成的接口
type HelloServiceServer interface {
	SayHello(context.Context, *HelloParam) (*HelloResult, error)
	mustEmbedUnimplementedHelloServiceServer()
}
// 需要实现SayHello方法
func (UnimplementedHelloServiceServer) SayHello(context.Context, *HelloParam) (*HelloResult, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SayHello not implemented")
}
```

#### 2.3 实现服务端(`SayHello`)方法

```go
func (UnimplementedHelloServiceServer) SayHello(ctx context.Context, p *HelloParam) (*HelloResult, error) {
	//return nil, status.Errorf(codes.Unimplemented, "method SayHello not implemented")
	return &HelloResult{Result: fmt.Sprintf("%s say %s",p.GetName(),p.GetContext())},nil
}
```

### 3、运行服务

#### 3.1 编写服务端

```go
package main

import (
	"52lu/go-rpc/grpc/server"
	"fmt"
	"google.golang.org/grpc"
	"net"
)
// 服务端代码
func main() {
	// 创建grpc服务
	rpcServer := grpc.NewServer()
	// 注册服务
	server.RegisterHelloServiceServer(rpcServer, new(server.UnimplementedHelloServiceServer))
	// 监听端口
	listen, err := net.Listen("tcp", ":1234")
	if err != nil {
		fmt.Println("服务启动失败", err)
		return
	}
	fmt.Println("服务启动成功!")
	rpcServer.Serve(listen)
}
```

#### 3.2 编写客户端

```go
package main

import (
	"52lu/go-rpc/grpc/server"
	"context"
	"fmt"
	"google.golang.org/grpc"
)

// 客户端代码
func main() {
	// 建立链接
	dial, err := grpc.Dial("127.0.0.1:1234", grpc.WithInsecure())
	if err != nil {
		fmt.Println("Dial Error ", err)
		return
	}
	// 延迟关闭链接
	defer dial.Close()
	// 实例化客户端
	client := server.NewHelloServiceClient(dial)
	// 发起请求
	result, err := client.SayHello(context.TODO(), &server.HelloParam{
		Name:    "张三",
		Context: "hello word!",
	})
	if err != nil {
		fmt.Println("请求失败:", err)
		return
	}
	// 打印返回信息
	fmt.Printf("%+v\n", result)
}
```

#### 3.3 启动运行

```go
Bash
# 启动服务端
➜ go run server.go
服务启动成功!

# 启动客户端
➜  go run client.go
result:"张三 say hello word!"
```

### 4、oneof(只能选择一个)

如果你有一个有很多字段的消息, 而同一时间最多只有一个字段会被设值, 你可以通过使用`oneof`特性来强化这个行为并节约内存.

Oneof 字段和常见字段类似, 除了所有字段共用内存, 并且同一时间最多有一个字段可以设值. 设值`oneof`的任何成员都将自动清除所有其他成员. 可以通过使用特殊的case()或者WhichOneof()方法来检查oneof中的哪个值被设值了(如果有), 取决于不同语言.

使用oneof关键字来在.proto中定义oneof, 后面跟oneof名字, 在这个例子中是test_oneof:

```go
message SampleMessage {
  oneof test_oneof {
    string name = 4;
    SubMessage sub_message = 9;
  }
}
```

然后再将oneof字段添加到oneof定义. 可以添加任意类型的字段, 但是不能使用重复(repeated)字段.

在生成的代码中, oneof字段和普通字段一样有同样的getter和setter方法. 也会有一个特别的方法用来检查哪个值(如果有)被设置了,可以点击 [API Reference](https://developers.google.com/protocol-buffers/docs/reference/overview) 查看更多。

#### 4.1 oneof特性

- 设置一个oneof字段会自动清除所有其他oneof成员. 所以如果设置多次oneof字段, 只有最后设置的字段依然有值.

```go
SampleMessage message;
message.set_name("name");
CHECK(message.has_name());
message.mutable_sub_message();   // Will clear name field.
CHECK(!message.has_name());
```

- 如果解析器遇到同一个oneof的多个成员, 只有看到的最后一个成员在被解析的消息中被使用.
- oneof不能是重复字段
- Reflection APIs work for oneof fields. (oneof字段用反射api来实现?)
- 如果使用c++, 需要兼顾确认确认代码不会导致内存奔溃. 下面的示例代码会导致crash因为sub_message已经在调用set_name()方法时被删除.

```go
SampleMessage message;
SubMessage* sub_message = message.mutable_sub_message();
message.set_name("name");      // Will delete sub_message
sub_message->set_...            // Crashes here
```

- 同样在c++中, 如果通过调用Swap()来交换两个带有oneof的消息, 每个消息将会有另外一个消息的oneof: 在下面这个示例中, msg1将会有sub_message和msg2会有name.

```go
SampleMessage msg1;
msg1.set_name("name");
SampleMessage msg2;
msg2.mutable_sub_message();
msg1.swap(&msg2);
CHECK(msg1.has_sub_message());
CHECK(msg2.has_name());
```

标签重用问题

- 将字段移入或者移出oneof: 消息被序列化和解析后, 可能丢失部分信息(某些字段可能被清除). 但是，可以安全地将单个字段移动到新的AAA中，并且如果已知只有一个字段被设置，还可以移动多个字段。
- 删除oneof的一个字段又回来: 消息被序列化和解析后, 可能清除你当前设置的oneof字段
- 拆分或者合并oneof: 和移动普通字段一样有类似问题

#### 4.2 编写`proto`

修改上面的服务中的请求参数:`HelloParam`,

```go
// 定义入参消息
message HelloParam{
  string name = 1;
  string context = 2;
  // oneof 最多只能设置其中一个字段
  oneof option {
    int32 age= 3;
    string gender= 4;
  }
}
```

#### 4.3 使用

##### 4.3.1 客户端传参

生成`Go`代码后，入参只能设置其中一个值，如下

```go
// ...省略
// 实例化客户端
client := server.NewHelloServiceClient(dial)
// 定义参数
reqParam := &server.HelloParam{
  Name:    "张三",
  Context: "hello word!",
}
// 只能设置其中一个
reqParam.Option = &server.HelloParam_Age{Age: 19}
// 这个会替代上一个值
//reqParam.Option = &server.HelloParam_Gender{Gender: "男"}
// 发起请求
result, err := client.SayHello(context.TODO(), reqParam)
...
```

##### 4.3.2 服务端接收参数

```go
func (UnimplementedHelloServiceServer) SayHello(ctx context.Context, p *HelloParam) (*HelloResult, error) {
	//return nil, status.Errorf(codes.Unimplemented, "method SayHello not implemented")
	res := fmt.Sprintf("name:%s| gender:%s| age:%s | context:%s",p.GetName(),p.GetGender(),p.GetAge(),p.GetContext())
	return &HelloResult{Result:res,},nil
}
```

### 5、Any

Any 消息类型可以让你使用消息作为嵌入类型而不必持有他们的.proto定义. Any把任意序列化后的消息作为bytes包含, 带有一个URL, 工作起来类似一个全局唯一的标识符. 为了使用Any类型, 需要导入google/protobuf/any.proto.

```go
import "google/protobuf/any.proto";

message ErrorStatus {
  string message = 1;
  repeated Any details = 2;
}
```

给定消息类型的 default type URL 是 `type.googleapis.com/packagename.messagename`.

不同语言实现将提供运行时类库来帮助以类型安全的方式封包和解包Any的内容,例如, 在java中, Any类型将有特别的pack()和unpark()访问器, 而在c++中有PackFrom() 和 PackTo()方法:

```go
// 在Any中存储任务消息类型
NetworkErrorDetails details = ...;
ErrorStatus status;
status.add_details()->PackFrom(details);

// 从Any中读取任意消息
ErrorStatus status = ...;
for (const Any& detail : status.details()) {
  if (detail.IsType<NetworkErrorDetails>()) {
    NetworkErrorDetails network_error;
    detail.UnpackTo(&network_error);
    ... processing network_error ...
  }
}
```

#### 5.1 编写`proto`

```go
syntax = "proto3";

option go_package = "grpc/server";

// 使用any类型，需要导入这个
import "google/protobuf/any.proto";

// 定义准备传的消息
message Context {
  int32 id = 1;
  string title = 2;
}
// 定义入参消息
message HelloParam{
  // any，代表可以是任何类型
  google.protobuf.Any data = 1;
}

// 定义出参消息
message HelloResult {
  string result = 1;
}
```

#### 5.2 使用

##### 5.2.1 客户端传参

```go
//...省略...
	// 使用Any参数
	content := &server.Context{
		Id:    100,
		Title: "Hello Word",
	}
	// 序列化Any类型参数
	any, err := anypb.New(content)
	if err != nil {
		fmt.Println("any 类型参数序列化失败")
		return
	}
  // 注意这里，一开始在proto文件中，没有定义使用消息类型Context，
  // 现在通过any类型，同样可以使用
	reqParam := &server.HelloParam{Data: any}
	// 发起请求
	result, err := client.SayHello(context.TODO(), reqParam)
	if err != nil {
		fmt.Println("请求失败:", err)
		return
	}
// ....省略...
```

##### 5.2.2 服务端接收参数

```go
func (UnimplementedHelloServiceServer) SayHello(ctx context.Context, p *HelloParam) (*HelloResult, error) {
	var context Context
  // 反序列化参数
	p.Data.UnmarshalTo(&context)
	res := fmt.Sprintf("%v|%v",context.GetId(),context.GetTitle())
	return &HelloResult{Result: res},nil
	//return nil, status.Errorf(codes.Unimplemented, "method SayHello not implemented")
}
```

## 六、额外的数据类型支持

协议缓冲区支持许多标量值类型，包括使用可变长度编码和固定大小的整数。您还可以通过定义消息来创建自己的复合数据类型，这些消息本身就是可以分配给字段的数据类型。除了简单和复合值类型之外，还发布了几种常见类型。

### 1、常见类型

- [`Duration`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/duration.proto) 是有符号的、固定长度的时间跨度，例如 42 秒。
- [`Timestamp`](https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/timestamp.proto) 是独立于任何时区或日历的时间点，例如 2017-01-15T01:30:15.01Z。
- [`Interval`](https://github.com/googleapis/googleapis/blob/master/google/type/interval.proto) 是独立于时区或日历的时间间隔，例如 2017-01-15T01:30:15.01Z - 2017-01-16T02:30:15.01Z。
- [`Date`](https://github.com/googleapis/googleapis/blob/master/google/type/date.proto) 是一个完整的日历日期，例如 2025-09-19。
- [`DayOfWeek`](https://github.com/googleapis/googleapis/blob/master/google/type/dayofweek.proto) 是一周中的某一天，例如星期一。
- [`TimeOfDay`](https://github.com/googleapis/googleapis/blob/master/google/type/timeofday.proto) 是一天中的某个时间，例如 10:42:23。
- [`LatLng`](https://github.com/googleapis/googleapis/blob/master/google/type/latlng.proto) 是一个纬度/经度对，例如 37.386051 纬度和 -122.083855 经度。
- [`Money`](https://github.com/googleapis/googleapis/blob/master/google/type/money.proto) 是具有货币类型的金额，例如 42 美元。
- [`PostalAddress`](https://github.com/googleapis/googleapis/blob/master/google/type/postal_address.proto) 是邮政地址，例如 1600 Amphitheatre Parkway Mountain View, CA 94043 USA。
- [`Color`](https://github.com/googleapis/googleapis/blob/master/google/type/color.proto) 是 RGBA 颜色空间中的一种颜色。
- [`Month`](https://github.com/googleapis/googleapis/blob/master/google/type/month.proto) 是一年中的一个月，例如四月。

### 2、协议缓冲区开源哲学

协议缓冲区于 2008 年开源，旨在为 Google 以外的开发人员提供与我们在内部从中获得的相同好处的一种方式。我们通过定期更新语言来支持开源社区，因为我们进行这些更改以支持我们的内部需求。虽然我们接受来自外部开发人员的精选拉取请求，但我们不能始终优先考虑不符合 Google 特定需求的功能请求和错误修复。





## 参考

- https://developers.google.com/protocol-buffers/docs/overview
- [RPC编程(四):protobuf语法学习](http://liuqh.icu/2022/02/08/go/rpc/04-protobuf/)