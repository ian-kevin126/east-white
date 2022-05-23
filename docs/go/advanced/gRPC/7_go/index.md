---
title: 7、Go使用ProtoBuf
---

# 协议缓冲区基础：Go

本教程提供了一个基本的 Go 程序员介绍使用协议缓冲区，使用协议缓冲区语言的[proto3](https://developers.google.com/protocol-buffers/docs/proto3)版本。通过创建一个简单的示例应用程序，它向您展示了如何

- 在文件中定义消息格式`.proto`。
- 使用协议缓冲区编译器。
- 使用 Go 协议缓冲区 API 来写入和读取消息。

这不是在 Go 中使用协议缓冲区的综合指南。有关更详细的参考信息，请参阅[协议缓冲区语言指南](https://developers.google.com/protocol-buffers/docs/proto3)、[Go API 参考](https://pkg.go.dev/google.golang.org/protobuf/proto)、[Go 生成代码指南](https://developers.google.com/protocol-buffers/docs/reference/go-generated)和[编码参考](https://developers.google.com/protocol-buffers/docs/encoding)。

## 一、为什么使用协议缓冲区？

我们将要使用的示例是一个非常简单的“地址簿”应用程序，它可以在文件中读取和写入人们的联系方式。地址簿中的每个人都有一个姓名、一个 ID、一个电子邮件地址和一个联系电话号码。

你如何序列化和检索这样的结构化数据？有几种方法可以解决这个问题：

- 使用[gobs](https://golang.org/pkg/encoding/gob/)序列化 Go 数据结构。这在特定于 Go 的环境中是一个很好的解决方案，但是如果您需要与为其他平台编写的应用程序共享数据，它就不能很好地工作。
- 您可以发明一种特殊方式将数据项编码为单个字符串——例如将 4 个整数编码为“12:3:-23:67”。这是一种简单而灵活的方法，尽管它确实需要编写一次性的编码和解析代码，并且解析会产生很小的运行时成本。这最适合编码非常简单的数据。
- 将数据序列化为 XML。这种方法可能非常有吸引力，因为 XML（某种程度）是人类可读的，并且有许多语言的绑定库。如果您想与其他应用程序/项目共享数据，这可能是一个不错的选择。然而，众所周知，XML 是空间密集型的，对它进行编码/解码会对应用程序造成巨大的性能损失。此外，导航 XML DOM 树比导航类中的简单字段通常要复杂得多。

协议缓冲区是解决这个问题的灵活、高效、自动化的解决方案。使用协议缓冲区，您可以编写`.proto`要存储的数据结构的描述。由此，protocol buffer 编译器创建了一个类，该类以高效的二进制格式实现 protocol buffer 数据的自动编码和解析。生成的类为组成协议缓冲区的字段提供 getter 和 setter，并将读取和写入协议缓冲区的细节作为一个单元处理。重要的是，协议缓冲区格式支持随着时间的推移扩展格式的想法，这样代码仍然可以读取用旧格式编码的数据。

## 二、在哪里可以找到示例代码

我们的示例是一组用于管理地址簿数据文件的命令行应用程序，使用协议缓冲区进行编码。该命令`add_person_go`将新条目添加到数据文件中。该命令`list_people_go`解析数据文件并将数据打印到控制台。

您可以在 GitHub 存储库 的[示例目录中找到完整的示例。](https://github.com/protocolbuffers/protobuf/tree/master/examples)

## 三、定义您的协议格式

要创建地址簿应用程序，您需要从 `.proto`文件开始。文件中的定义`.proto`很简单：为要序列化的每个数据结构添加一条*消息，然后为消息中的每个字段指定名称和类型。*在我们的示例中，`.proto`定义消息的文件是 [`addressbook.proto`](https://github.com/protocolbuffers/protobuf/blob/master/examples/addressbook.proto).

该`.proto`文件以包声明开头，这有助于防止不同项目之间的命名冲突。

```
syntax = "proto3";
package tutorial;

import "google/protobuf/timestamp.proto";
```

该`go_package`选项定义了包的导入路径，该路径将包含此文件的所有生成代码。Go 包名称将是导入路径的最后一个路径组件。例如，我们的示例将使用包名“tutorialpb”。

```
option go_package = "github.com/protocolbuffers/protobuf/examples/go/tutorialpb";
```

接下来，您有您的消息定义。消息只是包含一组类型字段的聚合。许多标准的简单数据类型可用作字段类型，包括`bool`、`int32`、 `float`、`double`和`string`。您还可以通过使用其他消息类型作为字段类型来为您的消息添加更多结构。

```go
message Person {
  string name = 1;
  int32 id = 2;  // Unique ID number for this person.
  string email = 3;

  enum PhoneType {
    MOBILE = 0;
    HOME = 1;
    WORK = 2;
  }

  message PhoneNumber {
    string number = 1;
    PhoneType type = 2;
  }

  repeated PhoneNumber phones = 4;

  google.protobuf.Timestamp last_updated = 5;
}

// Our address book file is just one of these.
message AddressBook {
  repeated Person people = 1;
}
```

在上面的示例中，`Person`消息包含 `PhoneNumber`消息，而`AddressBook`消息包含`Person`消息。您甚至可以定义嵌套在其他消息中的消息类型——如您所见， `PhoneNumber`类型是在内部定义的`Person`。如果您希望其中一个字段具有预定义的值列表之一，您还可以定义`enum`类型 - 在这里您要指定电话号码可以是`MOBILE`、`HOME`或 之一`WORK`。

每个元素上的“= 1”、“= 2”标记标识该字段在二进制编码中使用的唯一“标签”。标签编号 1-15 比更高的编号需要少一个字节来编码，因此作为一种优化，您可以决定将这些标签用于常用或重复的元素，而将标签 16 和更高的标签用于不太常用的可选元素。重复字段中的每个元素都需要重新编码标签号，因此重复字段特别适合这种优化。

如果未设置字段值， 则使用[默认值](https://developers.google.com/protocol-buffers/docs/proto3#default)：数字类型为零，字符串为空字符串，布尔值为 false。对于嵌入式消息，默认值始终是消息的“默认实例”或“原型”，没有设置任何字段。调用访问器以获取尚未显式设置的字段的值始终返回该字段的默认值。

如果字段是`repeated`，则该字段可以重复任意次数（包括零次）。重复值的顺序将保存在协议缓冲区中。将重复字段视为动态大小的数组。

您可以在[Protocol Buffer Language Guide](https://developers.google.com/protocol-buffers/docs/proto3)`.proto`中找到编写文件的完整指南——包括所有可能的字段类型。不过，不要去寻找类似于类继承的工具——协议缓冲区不会那样做。

## 四、编译你的协议缓冲区

现在您有了`.proto`，接下来需要做的是生成您需要读取和写入`AddressBook`（以及因此`Person`和`PhoneNumber`）消息的类。为此，您需要`protoc`在您的: 上运行协议缓冲区编译器`.proto`：

1. 如果您尚未安装编译器，请[下载软件包](https://developers.google.com/protocol-buffers/docs/downloads)并按照 README 中的说明进行操作。

2. 运行以下命令来安装 Go 协议缓冲区插件：

   ```shell
   go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
   ```

   编译器插件

   ```
   protoc-gen-go
   ```

   将安装在 中 

   ```
   $GOBIN
   ```

   ，默认为

   ```
   $GOPATH/bin
   ```

   . 它必须在您

   ```
   $PATH
   ```

   的协议编译器

   ```
   protoc
   ```

   中才能找到它。

3. 现在运行编译器，指定源目录（您的应用程序的源代码所在的位置——如果您不提供值，则使用当前目录）、目标目录（您希望生成的代码所在的位置；通常与 相同

   ```
   $SRC_DIR
   ```

   ） ，以及您的

   ```
   .proto
   ```

   . 在这种情况下，您将调用：

   ```
   protoc -I=$SRC_DIR --go_out=$DST_DIR $SRC_DIR/addressbook.proto
   ```

   因为您想要 Go 代码，所以您使用该

   ```
   --go_out
   ```

   选项 - 为其他支持的语言提供了类似的选项。

这`github.com/protocolbuffers/protobuf/examples/go/tutorialpb/addressbook.pb.go`会在您指定的目标目录中生成。

## 五、协议缓冲区 API

生`addressbook.pb.go`成为您提供以下有用的类型：

- `AddressBook`具有`People`字段的结构。
- 具有、和的`Person`字段的结构。`Name``Id``Email``Phones`
- 一个结构，具有和`Person_PhoneNumber`的字段。`Number``Type`
- 为枚举`Person_PhoneType`中的每个值定义的类型和值。`Person.PhoneType`

[您可以在Go Generated Code guide](https://developers.google.com/protocol-buffers/docs/reference/go-generated)中阅读有关生成内容的详细信息，但在大多数情况下，您可以将它们视为完全普通的 Go 类型。

下面是一个来自[`list_people`命令单元测试](https://github.com/protocolbuffers/protobuf/blob/master/examples/go/cmd/list_people/list_people_test.go)的示例，说明如何创建 Person 的实例：

```golang
p := pb.Person{
        Id:    1234,
        Name:  "John Doe",
        Email: "jdoe@example.com",
        Phones: []*pb.Person_PhoneNumber{
                {Number: "555-4321", Type: pb.Person_HOME},
        },
}
```

## 六、写信息

使用协议缓冲区的全部目的是序列化您的数据，以便可以在其他地方对其进行解析。在 Go 中，您使用`proto`库的[Marshal](https://pkg.go.dev/google.golang.org/protobuf/proto?tab=doc#Marshal)函数来序列化您的协议缓冲区数据。指向协议缓冲区消息的指针`struct`实现了`proto.Message`接口。调用`proto.Marshal`返回协议缓冲区，以有线格式编码。例如，我们在[`add_person`命令](https://github.com/protocolbuffers/protobuf/blob/master/examples/go/cmd/add_person/add_person.go)中使用这个函数：

```golang
book := &pb.AddressBook{}
// ...

// Write the new address book back to disk.
out, err := proto.Marshal(book)
if err != nil {
        log.Fatalln("Failed to encode address book:", err)
}
if err := ioutil.WriteFile(fname, out, 0644); err != nil {
        log.Fatalln("Failed to write address book:", err)
}
```

## 七、阅读信息

要解析编码消息，请使用`proto`库的[Unmarshal](https://pkg.go.dev/google.golang.org/protobuf/proto?tab=doc#Unmarshal)函数。调用它会将数据解析`in`为协议缓冲区并将结果放入`book`. [`list_people`因此，要在命令](https://github.com/protocolbuffers/protobuf/blob/master/examples/go/cmd/list_people/list_people.go)中解析文件，我们使用：

```golang
// Read the existing address book.
in, err := ioutil.ReadFile(fname)
if err != nil {
        log.Fatalln("Error reading file:", err)
}
book := &pb.AddressBook{}
if err := proto.Unmarshal(in, book); err != nil {
        log.Fatalln("Failed to parse address book:", err)
}
```

## 八、扩展协议缓冲区

在你发布使用你的协议缓冲区的代码之后，迟早你肯定会想要“改进”协议缓冲区的定义。如果您希望您的新缓冲区向后兼容，并且您的旧缓冲区向前兼容——您几乎肯定希望这样做——那么您需要遵循一些规则。在新版本的协议缓冲区中：

- 您*不得*更改任何现有字段的标签号。
- 您*可以*删除字段。
- 您*可以*添加新字段，但您必须使用新的标记号（即从未在此协议缓冲区中使用过的标记号，即使已删除的字段也不使用）。

（这些规则有 [一些例外](https://developers.google.com/protocol-buffers/docs/proto3#updating)，但很少使用。）

如果您遵循这些规则，旧代码将愉快地阅读新消息并忽略任何新字段。对于旧代码，已删除的单个字段将仅具有其默认值，而删除的重复字段将为空。新代码也将透明地读取旧消息。

但是，请记住，旧消息中不会出现新字段，因此您需要对默认值做一些合理的事情。使用特定类型的 [默认值](https://developers.google.com/protocol-buffers/docs/proto3#default) ：对于字符串，默认值为空字符串。对于布尔值，默认值为 false。对于数字类型，默认值为零。



## 参考

- https://developers.google.com/protocol-buffers/docs/gotutorial