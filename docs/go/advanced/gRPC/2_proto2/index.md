---
title: 2、proto2
---

# proto2语言指南

- [定义消息类型](https://developers.google.com/protocol-buffers/docs/proto#simple)
- [标量值类型](https://developers.google.com/protocol-buffers/docs/proto#scalar)
- [可选字段和默认值](https://developers.google.com/protocol-buffers/docs/proto#optional)
- [枚举](https://developers.google.com/protocol-buffers/docs/proto#enum)
- [使用其他消息类型](https://developers.google.com/protocol-buffers/docs/proto#other)
- [嵌套类型](https://developers.google.com/protocol-buffers/docs/proto#nested)
- [更新消息类型](https://developers.google.com/protocol-buffers/docs/proto#updating)
- [扩展](https://developers.google.com/protocol-buffers/docs/proto#extensions)
- [一个](https://developers.google.com/protocol-buffers/docs/proto#oneof)
- [地图](https://developers.google.com/protocol-buffers/docs/proto#maps)
- [套餐](https://developers.google.com/protocol-buffers/docs/proto#packages)
- [定义服务](https://developers.google.com/protocol-buffers/docs/proto#services)
- [选项](https://developers.google.com/protocol-buffers/docs/proto#options)
- [生成你的类](https://developers.google.com/protocol-buffers/docs/proto#generating)

对应英文：

- [Defining A Message Type](https://developers.google.com/protocol-buffers/docs/proto#simple)
- [Scalar Value Types](https://developers.google.com/protocol-buffers/docs/proto#scalar)
- [Optional Fields And Default Values](https://developers.google.com/protocol-buffers/docs/proto#optional)
- [Enumerations](https://developers.google.com/protocol-buffers/docs/proto#enum)
- [Using Other Message Types](https://developers.google.com/protocol-buffers/docs/proto#other)
- [Nested Types](https://developers.google.com/protocol-buffers/docs/proto#nested)
- [Updating A Message Type](https://developers.google.com/protocol-buffers/docs/proto#updating)
- [Extensions](https://developers.google.com/protocol-buffers/docs/proto#extensions)
- [Oneof](https://developers.google.com/protocol-buffers/docs/proto#oneof)
- [Maps](https://developers.google.com/protocol-buffers/docs/proto#maps)
- [Packages](https://developers.google.com/protocol-buffers/docs/proto#packages)
- [Defining A Message Type](https://developers.google.com/protocol-buffers/docs/proto#simple)
- [Scalar Value Types](https://developers.google.com/protocol-buffers/docs/proto#scalar)
- [Optional Fields And Default Values](https://developers.google.com/protocol-buffers/docs/proto#optional)
- [Enumerations](https://developers.google.com/protocol-buffers/docs/proto#enum)
- [Using Other Message Types](https://developers.google.com/protocol-buffers/docs/proto#other)
- [Nested Types](https://developers.google.com/protocol-buffers/docs/proto#nested)
- [Updating A Message Type](https://developers.google.com/protocol-buffers/docs/proto#updating)
- [Extensions](https://developers.google.com/protocol-buffers/docs/proto#extensions)
- [Oneof](https://developers.google.com/protocol-buffers/docs/proto#oneof)
- [Maps](https://developers.google.com/protocol-buffers/docs/proto#maps)
- [Packages](https://developers.google.com/protocol-buffers/docs/proto#packages)
- [Defining Services](https://developers.google.com/protocol-buffers/docs/proto#services)
- [Options](https://developers.google.com/protocol-buffers/docs/proto#options)
- [Generating Your Classes](https://developers.google.com/protocol-buffers/docs/proto#generating)
- [Defining Services](https://developers.google.com/protocol-buffers/docs/proto#services)
- [Options](https://developers.google.com/protocol-buffers/docs/proto#options)
- [Generating Your Classes](https://developers.google.com/protocol-buffers/docs/proto#generating)

本指南介绍如何使用协议缓冲区语言来构建协议缓冲区数据，包括`.proto`文件语法以及如何从`.proto`文件生成数据访问类。它涵盖了协议缓冲区语言的**proto2**版本：有关**proto3**语法的信息，请参阅 [Proto3 语言指南](https://developers.google.com/protocol-buffers/docs/proto3)。

这是一个参考指南——有关使用本文档中描述的许多功能的分步示例，请参阅您选择的语言的 [教程](https://developers.google.com/protocol-buffers/docs/tutorials)。

## 一、定义消息类型

首先让我们看一个非常简单的例子。假设您要定义一个搜索请求消息格式，其中每个搜索请求都有一个查询字符串、您感兴趣的特定结果页面以及每页的多个结果。这是`.proto`您用来定义消息类型的文件。

```proto
message SearchRequest {
  required string query = 1;
  optional int32 page_number = 2;
  optional int32 result_per_page = 3;
}
```

`SearchRequest`消息定义指定了三个字段（名称/值对），每个字段用于您希望包含在此类消息中的每条数据。每个字段都有一个名称和一个类型。

### 1、指定字段类型

在上面的示例中，所有字段都是[标量类型](https://developers.google.com/protocol-buffers/docs/proto#scalar)：两个整数（`page_number`和`result_per_page`）和一个字符串（`query`）。但是，您也可以为字段指定复合类型，包括[枚举](https://developers.google.com/protocol-buffers/docs/proto#enum) 和其他消息类型。

### 2、分配字段编号

如您所见，消息定义中的每个字段都有一个**唯一的编号**。这些数字用于在 [消息二进制格式](https://developers.google.com/protocol-buffers/docs/encoding)中标识您的字段，并且一旦您的消息类型在使用中就不应更改。[1 到 15 范围内的字段编号需要一个字节进行编码，包括字段编号和字段类型（您可以在Protocol Buffer Encoding](https://developers.google.com/protocol-buffers/docs/encoding#structure)中找到更多相关信息 ）。16 到 2047 范围内的字段编号占用两个字节。因此，您应该为非常频繁出现的消息元素保留字段编号 1 到 15。请记住为将来可能添加的频繁出现的元素留出一些空间。

您可以指定的最小字段编号是 1，最大的是 2 29 - 1，即 536,870,911。您也不能使用数字 19000 到 19999（`FieldDescriptor::kFirstReservedNumber`到 `FieldDescriptor::kLastReservedNumber`），因为它们是为 Protocol Buffers 实现保留的 - 如果您在`.proto`. 同样，您不能使用任何以前[保留](https://developers.google.com/protocol-buffers/docs/proto#reserved)的字段编号。

### 3、指定字段规则

您指定消息字段是以下之一：

- `required`: 格式良好的消息必须恰好具有该字段之一。
- `optional`：一个格式良好的消息可以有零个或一个这个字段（但不能超过一个）。
- `repeated`：该字段可以在格式良好的消息中重复任意次数（包括零次）。重复值的顺序将被保留。

由于历史原因，`repeated`标量数字类型的字段（例如 , , `int32`）没有尽可能高效地编码。新代码应该使用特殊选项来获得更有效的编码。例如：`int64``enum``[packed = true]`

```proto
repeated int32 samples = 4 [packed = true];
repeated ProtoEnum results = 5 [packed = true];
```

[您可以在Protocol Buffer Encoding](https://developers.google.com/protocol-buffers/docs/encoding#packed)中找到有关`packed`编码的 更多信息。

**必需是永远**的 您应该非常小心将字段标记为 `required`。如果在某些时候您希望停止写入或发送必填字段，则将该字段更改为可选字段会出现问题——老读者会认为没有此字段的消息不完整，可能会无意中拒绝或丢弃它们。您应该考虑为您的缓冲区编写特定于应用程序的自定义验证例程。

当有人向枚举添加值时，会出现第二个必填字段问题。在这种情况下，无法识别的枚举值会被视为丢失，这也会导致所需的值检查失败。

### 4、添加更多消息类型

可以在单个`.proto`文件中定义多种消息类型。如果您要定义多个相关消息，这很有用——例如，如果您想定义与您的`SearchResponse` 消息类型相对应的回复消息格式，您可以将其添加到相同的`.proto`:

```proto
message SearchRequest {
  required string query = 1;
  optional int32 page_number = 2;
  optional int32 result_per_page = 3;
}

message SearchResponse {
 ...
}
```

**组合消息会导致膨胀**虽然可以在单个文件中定义多种消息类型（例如消息、枚举和服务）`.proto`，但当在单个文件中定义大量具有不同依赖关系的消息时，也会导致依赖关系膨胀。建议在每个`.proto`文件中包含尽可能少的消息类型。

### 5、添加评论

要向`.proto`文件添加注释，请使用 C/C++ 样式`//`和`/* ... */` 语法。

```proto
/* SearchRequest represents a search query, with pagination options to
 * indicate which results to include in the response. */

message SearchRequest {
  required string query = 1;
  optional int32 page_number = 2;  // Which page number do we want?
  optional int32 result_per_page = 3;  // Number of results to return per page.
}
```

### 6、保留字段

如果您通过完全删除字段或将其注释掉来[更新消息类型，未来的用户可以在对类型进行自己的更新时重用字段编号。](https://developers.google.com/protocol-buffers/docs/proto#updating)如果他们稍后加载相同的旧版本，这可能会导致严重问题`.proto`，包括数据损坏、隐私错误等。确保不会发生这种情况的一种方法是指定已删除字段的字段编号（和/或名称，这也可能导致 JSON 序列化问题）为`reserved`. 如果将来有任何用户尝试使用这些字段标识符，protocol buffer 编译器会抱怨。

```proto
message Foo {
  reserved 2, 15, 9 to 11;
  reserved "foo", "bar";
}
```

保留字段编号范围包括在内（`9 to 11`与 相同`9, 10, 11`）。请注意，您不能在同一 `reserved`语句中混合字段名称和字段编号。

### 7、什么是从你的？`.proto`

当您在 a 上运行[协议缓冲区编译器](https://developers.google.com/protocol-buffers/docs/proto#generating)`.proto`时，编译器会以您选择的语言生成代码，您需要使用文件中描述的消息类型，包括获取和设置字段值，将消息序列化到输出流，并从输入流中解析您的消息。

- 对于**C++**，编译器从 each 生成一个`.h`and`.cc`文件 `.proto`，并为文件中描述的每种消息类型提供一个类。
- 对于**Java**，编译器会生成一个`.java`文件，其中包含每个消息类型的类，以及`Builder`用于创建消息类实例的特殊类。
- **Python**有点不同——Python 编译器会生成一个模块*，*`.proto`其中包含您的 .
- 对于**Go**，编译器会为`.pb.go`文件中的每种消息类型生成一个文件类型。

您可以按照所选语言的教程了解有关使用每种语言的 API 的更多信息。有关更多 API 详细信息，请参阅相关 [API 参考](https://developers.google.com/protocol-buffers/docs/reference/overview)。

## 二、标量值类型

标量消息字段可以具有以下类型之一 - 该表显示`.proto`文件中指定的类型，以及自动生成的类中的相应类型：

| 。原型 | 笔记                                                                              | C++ 类型 | Java 类型 | 蟒蛇类型[2]                          | 走类型  |
| :----- | :-------------------------------------------------------------------------------- | :------- | :-------- | :----------------------------------- | :------ |
| 双倍的 |                                                                                   | 双倍的   | 双倍的    | 漂浮                                 | *浮动64 |
| 漂浮   |                                                                                   | 漂浮     | 漂浮      | 漂浮                                 | *浮动32 |
| 整数32 | 使用可变长度编码。对负数进行编码效率低下——如果您的字段可能有负值，请改用 sint32。 | 整数32   | 整数      | 整数                                 | *int32  |
| 整数64 | 使用可变长度编码。对负数进行编码效率低下——如果您的字段可能有负值，请改用 sint64。 | 整数64   | 长        | 整数/长[3]                           | *int64  |
| uint32 | 使用可变长度编码。                                                                | uint32   | 整数[1]   | 整数/长[3]                           | *uint32 |
| uint64 | 使用可变长度编码。                                                                | uint64   | 长[1]     | 整数/长[3]                           | *uint64 |
| sint32 | 使用可变长度编码。带符号的 int 值。这些比常规 int32 更有效地编码负数。            | 整数32   | 整数      | 整数                                 | *int32  |
| sint64 | 使用可变长度编码。带符号的 int 值。这些比常规 int64 更有效地编码负数。            | 整数64   | 长        | 整数/长[3]                           | *int64  |
| 固定32 | 总是四个字节。如果值通常大于 2 28 ，则比 uint32 更有效。                          | uint32   | 整数[1]   | 整数/长[3]                           | *uint32 |
| 固定64 | 总是八个字节。如果值通常大于 2 56 ，则比 uint64 更有效。                          | uint64   | 长[1]     | 整数/长[3]                           | *uint64 |
| 固定32 | 总是四个字节。                                                                    | 整数32   | 整数      | 整数                                 | *int32  |
| 固定64 | 总是八个字节。                                                                    | 整数64   | 长        | 整数/长[3]                           | *int64  |
| 布尔   |                                                                                   | 布尔     | 布尔值    | 布尔                                 | *布尔   |
| 细绳   | 字符串必须始终包含 UTF-8 编码的文本。                                             | 细绳     | 细绳      | unicode (Python 2) 或 str (Python 3) | *细绳   |
| 字节   | 可能包含任意字节序列。                                                            | 细绳     | 字节串    | 字节                                 | []字节  |

[当您在Protocol Buffer Encoding](https://developers.google.com/protocol-buffers/docs/encoding)中序列化您的消息时，您可以了解有关这些类型如何编码的更多信息。

[1]在 Java 中，无符号的 32 位和 64 位整数使用它们的有符号对应物表示，最高位简单地存储在符号位中。

[2]在所有情况下，为字段设置值将执行类型检查以确保其有效。

[3] 64 位或无符号 32 位整数在解码时始终表示为 long，但如果在设置字段时给出 int，则可以是 int。在所有情况下，该值必须适合设置时表示的类型。见[2]。

## 三、可选字段和默认值

如上所述，消息描述中的元素可以被标记`optional`。格式良好的消息可能包含也可能不包含可选元素。解析消息时，如果它不包含可选元素，则将解析对象中的相应字段设置为该字段的默认值。可以将默认值指定为消息描述的一部分。例如，假设您想为 a 的值提供默认值`SearchRequest`10 `result_per_page`。

```proto
optional int32 result_per_page = 3 [default = 10];
```

如果未为可选元素指定默认值，则使用特定于类型的默认值：对于字符串，默认值为空字符串。对于字节，默认值为空字节字符串。对于布尔值，默认值为 false。对于数字类型，默认值为零。对于枚举，默认值是枚举类型定义中列出的第一个值。这意味着在枚举值列表的开头添加值时必须小心。有关如何安全更改定义的指南，请参阅[更新消息类型部分。](https://developers.google.com/protocol-buffers/docs/proto#updating)

## 四、枚举

在定义消息类型时，您可能希望其字段之一仅具有预定义的值列表之一。例如，假设您要`corpus`为每个 添加一个字段，`SearchRequest`其中语料库可以是`UNIVERSAL`、 `WEB`、`IMAGES`、`LOCAL`、`NEWS`或。您可以通过在消息定义中添加一个非常简单地做到这一点- 具有 类型的字段只能将指定的一组常量中的一个作为其值（如果您尝试提供不同的值，解析器会将其视为未知数场地）。在下面的示例中，我们添加了一个包含所有可能值的调用，以及一个 type 字段：`PRODUCTS``VIDEO``enum``enum``enum``Corpus``Corpus`

```proto
message SearchRequest {
  required string query = 1;
  optional int32 page_number = 2;
  optional int32 result_per_page = 3 [default = 10];
  enum Corpus {
    UNIVERSAL = 0;
    WEB = 1;
    IMAGES = 2;
    LOCAL = 3;
    NEWS = 4;
    PRODUCTS = 5;
    VIDEO = 6;
  }
  optional Corpus corpus = 4 [default = UNIVERSAL];
}
```

您可以通过将相同的值分配给不同的枚举常量来定义别名。为此，您需要将`allow_alias`选项设置为`true`. 否则，协议缓冲区编译器会在找到别名时生成错误消息。

```proto
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

枚举器常量必须在 32 位整数范围内。由于`enum` 值在线路上使用[varint 编码](https://developers.google.com/protocol-buffers/docs/encoding)，因此负值效率低下，因此不推荐使用。您可以`enum`在消息定义中定义 s，如上例所示，也可以在外部定义 - 这些`enum`s 可以在`.proto`文件中的任何消息定义中重用。您还可以使用`enum`在一条消息中声明的类型作为另一条消息中字段的类型，使用语法`_MessageType_._EnumType_`.

当您在`.proto`使用 的a 上运行协议缓冲区编译器时`enum`，生成的代码将有一个对应`enum`于 Java 或 C++ 的代码，或者一个 `EnumDescriptor`用于 Python 的特殊类，用于在运行时生成的类中创建一组具有整数值的符号常量。

**注意：**生成的代码可能会受到特定于语言的枚举数限制（一种语言的低至数千）。查看您计划使用的语言的限制。

有关如何`enum`在应用程序中使用 message 的更多信息，请参阅所选语言的 [生成代码指南](https://developers.google.com/protocol-buffers/docs/reference/overview)。

### 保留值

如果您通过完全删除枚举条目或将其注释掉来[更新](https://developers.google.com/protocol-buffers/docs/proto#updating)枚举类型，将来的用户可以在对类型进行自己的更新时重用该数值。如果他们稍后加载相同的旧版本，这可能会导致严重问题`.proto`，包括数据损坏、隐私错误等。确保不会发生这种情况的一种方法是指定已删除条目的数值（和/或名称，这也可能导致 JSON 序列化问题）为`reserved`. 如果将来有任何用户尝试使用这些标识符，protocol buffer 编译器会抱怨。`max`您可以使用关键字指定保留的数值范围达到最大可能值 。

```proto
enum Foo {
  reserved 2, 15, 9 to 11, 40 to max;
  reserved "FOO", "BAR";
}
```

`reserved` 请注意，您不能在同一语句中混合字段名称和数值。

## 五、使用其他消息类型

您可以使用其他消息类型作为字段类型。例如，假设您想`Result`在每条`SearchResponse`消息中包含消息——为此，您可以`Result`在同一条消息中定义一个消息类型，`.proto`然后指定一个类型为`Result`in的字段`SearchResponse`：

```proto
message SearchResponse {
  repeated Result result = 1;
}

message Result {
  required string url = 1;
  optional string title = 2;
  repeated string snippets = 3;
}
```

### 1、导入定义

在上面的例子中，`Result`消息类型定义在同一个文件中 `SearchResponse`——如果你想用作字段类型的消息类型已经在另一个`.proto`文件中定义了怎么办？

*您可以通过导入*`.proto`来自其他文件的定义来使用它们。要导入另一个的定义，请在文件顶部添加一个 import 语句：`.proto`

```proto
import "myproject/other_protos.proto";
```

默认情况下，您只能使用直接导入`.proto`文件中的定义。但是，有时您可能需要将`.proto`文件移动到新位置。您可以在旧位置放置一个占位符文件，以使用该概念将所有导入转发到新位置，而不是直接移动`.proto`文件并在一次更改中更新所有调用站点。`.proto``import public`

**请注意，公共导入功能在 Java 中不可用。**

`import public``import public`任何导入包含该语句的原型的代码都可以传递依赖依赖项。例如：

```proto
// new.proto
// All definitions are moved here
// old.proto
// This is the proto that all clients are importing.
import public "new.proto";
import "other.proto";
// client.proto
import "old.proto";
// You use definitions from old.proto and new.proto, but not other.proto
```

`-I`协议编译器使用/`--proto_path` 标志在协议编译器命令行上指定的一组目录中搜索导入的文件。如果没有给出标志，它会在调用编译器的目录中查找。通常，您应该将`--proto_path`标志设置为项目的根目录，并为所有导入使用完全限定名称。

### 2、使用 proto3 消息类型

可以导入[proto3](https://developers.google.com/protocol-buffers/docs/proto3)消息类型并在您的 proto2 消息中使用它们，反之亦然。但是，proto2 枚举不能在 proto3 语法中使用。

## 六、嵌套类型

您可以在其他消息类型中定义和使用消息类型，如下例所示 - 这里`Result`消息是在消息内部定义的 `SearchResponse`：

```proto
message SearchResponse {
  message Result {
    required string url = 1;
    optional string title = 2;
    repeated string snippets = 3;
  }
  repeated Result result = 1;
}
```

如果您想在其父消息类型之外重用此消息类型，请将其称为`_Parent_._Type_`：

```proto
message SomeOtherMessage {
  optional SearchResponse.Result result = 1;
}
```

您可以随意嵌套消息。在下面的示例中，请注意命名的两个嵌套类型`Inner`是完全独立的，因为它们是在不同的消息中定义的：

```proto
message Outer {       // Level 0
  message MiddleAA {  // Level 1
    message Inner {   // Level 2
      optional int64 ival = 1;
      optional bool  booly = 2;
    }
  }
  message MiddleBB {  // Level 1
    message Inner {   // Level 2
      optional string name = 1;
      optional bool   flag = 2;
    }
  }
}
```

### 团体

**请注意，组功能已弃用，不应在创建新消息类型时使用。请改用嵌套消息类型。**

组是在消息定义中嵌套信息的另一种方式。例如，另一种指定 a`SearchResponse`包含多个 `Result`s 的方法如下：

```proto
message SearchResponse {
  repeated group Result = 1 {
    required string url = 2;
    optional string title = 3;
    repeated string snippets = 4;
  }
}
```

组只是将嵌套的消息类型和字段组合到单个声明中。在您的代码中，您可以将此消息视为具有 `Result`称为类型字段的类型`result`（后者名称被转换为小写，因此它不会与前者冲突）。因此，此示例与上述示例完全相同`SearchResponse`，只是消息具有不同的[有线格式](https://developers.google.com/protocol-buffers/docs/encoding)。

## 七、更新消息类型

如果现有的消息类型不再满足您的所有需求 - 例如，您希望消息格式有一个额外的字段 - 但您仍然希望使用使用旧格式创建的代码，请不要担心！在不破坏任何现有代码的情况下更新消息类型非常简单。只需记住以下规则：

- 不要更改任何现有字段的字段编号。
- 您添加的任何新字段都应该是`optional`或`repeated`。这意味着使用“旧”消息格式的代码序列化的任何消息都可以由新生成的代码解析，因为它们不会丢失任何`required` 元素。您应该为这些元素设置合理的[默认值](https://developers.google.com/protocol-buffers/docs/proto#optional)，以便新代码可以与旧代码生成的消息正确交互。类似地，新代码创建的消息可以由旧代码解析：旧二进制文件在解析时会忽略新字段。但是，未知字段不会被丢弃，如果消息稍后被序列化，未知字段也会随之序列化——因此，如果将消息传递给新代码，新字段仍然可用。
- 只要在更新的消息类型中不再使用字段编号，就可以删除非必填字段。您可能想要重命名该字段，可能添加前缀“OBSOLETE_”，或将字段编号设为 [保留](https://developers.google.com/protocol-buffers/docs/proto#reserved)，以便您的未来用户`.proto`不会意外重用该编号。
- 只要类型和编号保持不变，非必填字段可以转换为[扩展名，反之亦然。](https://developers.google.com/protocol-buffers/docs/proto#extensions)
- `int32`、`uint32`、`int64`、`uint64`和`bool`都是兼容的——这意味着您可以将字段从其中一种类型更改为另一种类型，而不会破坏向前或向后兼容性。如果从不适合相应类型的线路中解析出一个数字，您将获得与在 C++ 中将该数字强制转换为该类型相同的效果（例如，如果将 64 位数字读取为int32，它将被截断为 32 位）。
- `sint32`并且`sint64`彼此兼容，但与其他整数类型*不* 兼容。
- `string`并且`bytes`只要字节是有效的 UTF-8 就兼容。
- `bytes`如果字节包含消息的编码版本，则嵌入消息是兼容的。
- `fixed32`与`sfixed32`和`fixed64`兼容`sfixed64`。
- 对于`string`、`bytes`和 消息字段，`optional`与 兼容 `repeated`。给定重复字段的序列化数据作为输入，`optional`如果它是原始类型字段，则期望此字段的客户端将采用最后一个输入值，如果它是消息类型字段，则合并所有输入元素。请注意，这对于数字类型（包括布尔值和枚举）通常不安全**。**数字类型的重复字段可以以 [打包](https://developers.google.com/protocol-buffers/docs/encoding#packed)`optional`格式序列化，当需要字段时将无法正确解析。
- 更改默认值通常是可以的，只要您记住默认值永远不会通过网络发送。因此，如果程序接收到未设置特定字段的消息，则程序将看到在该程序的协议版本中定义的默认值。它不会看到发件人代码中定义的默认值。
- `enum`与`int32`, `uint32`, `int64`, 和`uint64`有线格式兼容（请注意，如果值不合适，将被截断），但请注意，当消息被反序列化时，客户端代码可能会以不同方式处理它们。值得注意的是，`enum`当消息被反序列化时，无法识别的值将被丢弃，这使得该字段的`has..`访问器返回 false 并且其 getter 返回定义中列出的第一个值`enum`，或者如果指定了默认值，则返回默认值。在重复枚举字段的情况下，任何无法识别的值都会从列表中删除。但是，整数字段将始终保留其值。因此，在将整数升级到 an 时，您需要非常小心，因为`enum`在线路上接收超出范围的枚举值。
- 在当前的 Java 和 C++ 实现中，当`enum`去除无法识别的值时，它们会与其他未知字段一起存储。请注意，如果此数据被序列化然后由识别这些值的客户端重新解析，这可能会导致奇怪的行为。在可选字段的情况下，即使在原始消息反序列化后写入了新值，旧值仍会被识别它的客户端读取。在重复字段的情况下，旧值将出现在任何已识别和新添加的值之后，这意味着将不会保留顺序。
- 将单个`optional`值更改为**new** `oneof`的成员是安全且二进制兼容的。如果您确定没有代码一次设置多个字段，则将多个`optional`字段移动到一个新字段 中可能是安全的。`oneof`将任何字段移动到现有字段`oneof`中是不安全的。
- 在 a`map<K, V>`和相应的`repeated` 消息字段之间更改字段是二进制兼容的（请参阅下面的[地图](https://developers.google.com/protocol-buffers/docs/proto#maps)，了解消息布局和其他限制）。但是，更改的安全性取决于应用程序：在反序列化和重新序列化消息时，使用`repeated`字段定义的客户端将产生语义相同的结果；但是，使用`map`字段定义的客户端可能会重新排序条目并删除具有重复键的条目。

## 八、扩展

扩展允许您声明消息中的一系列字段编号可用于第三方扩展。`.proto`扩展是原始文件未定义类型的字段的占位符。这允许其他 `.proto`文件通过使用这些字段编号定义部分或所有字段的类型来添加到您的消息定义中。让我们看一个例子：

```proto
message Foo {
  // ...
  extensions 100 to 199;
}
```

这表示字段编号 [100, 199] 的范围`Foo`是为扩展保留的。其他用户现在可以使用指定范围内的字段编号`Foo`在他们自己的`.proto` 导入您的文件中添加新字段`.proto`- 例如：

```proto
extend Foo {
  optional int32 bar = 126;
}
```

这会将一个以`bar`字段编号 126 命名的字段添加到 的原始定义中`Foo`。

当您的用户的`Foo`消息被编码时，有线格式与用户在`Foo`. 但是，您在应用程序代码中访问扩展字段的方式与访问常规字段的方式略有不同——您生成的数据访问代码具有用于处理扩展的特殊访问器。因此，例如，以下是`bar` 在 C++ 中设置 的值的方法：

```c++
Foo foo;
foo.SetExtension(bar, 15);
```

类似地，`Foo`该类定义了模板化访问器`HasExtension()`、 `ClearExtension()`、`GetExtension()`、`MutableExtension()`和 `AddExtension()`。所有这些都具有与正常字段的相应生成访问器匹配的语义。有关使用扩展的更多信息，请参阅为您选择的语言生成的代码参考。

请注意，扩展可以是任何字段类型，包括消息类型，但不能是 oneofs 或映射。

### 1、嵌套扩展

您可以在另一种类型的范围内声明扩展：

```proto
message Baz {
  extend Foo {
    optional int32 bar = 126;
  }
  ...
}
```

在这种情况下，访问此扩展的 C++ 代码是：

```
Foo foo;
foo.SetExtension(Baz::bar, 15);
```

换句话说，唯一的效果就是`bar`定义在 `Baz`.

这是一个常见的混淆来源：声明`extend`嵌套在消息类型中的块*并不*意味着外部类型和扩展类型之间有任何关系。特别是，上面的例子*并不*意味着它`Baz`是任何类型的子类`Foo`。这意味着该符号`bar`是在 ; 的范围内声明的`Baz`。它只是一个静态成员。

一种常见的模式是在扩展的字段类型范围内定义扩展——例如，这里是`Foo`type`Baz`的扩展，其中扩展被定义为 的一部分`Baz`：

```proto
message Baz {
  extend Foo {
    optional Baz foo_ext = 127;
  }
  ...
}
```

但是，不要求在该类型内定义具有消息类型的扩展。你也可以这样做：

```proto
message Baz {
  ...
}

// This can even be in a different file.
extend Foo {
  optional Baz foo_baz_ext = 127;
}
```

事实上，为了避免混淆，最好使用这种语法。如上所述，嵌套语法经常被不熟悉扩展的用户误认为是子类化。

### 2、选择分机号码

确保两个用户不会使用相同的字段编号将扩展名添加到相同的消息类型非常重要——如果扩展名被意外解释为错误的类型，可能会导致数据损坏。您可能需要考虑为您的项目定义扩展编号约定以防止这种情况发生。

`max`如果您的编号约定可能涉及具有非常大的字段编号的扩展，您可以使用关键字指定您的扩展范围达到最大可能的字段编号：

```proto
message Foo {
  extensions 1000 to max;
}
```

`max`是 2 29 - 1，或 536,870,911。

通常在选择字段编号时，您的编号约定也需要避免字段编号 19000 到 19999（`FieldDescriptor::kFirstReservedNumber`到 `FieldDescriptor::kLastReservedNumber`），因为它们是为协议缓冲区实现保留的。您可以定义一个包含此范围的扩展范围，但协议编译器不允许您使用这些数字定义实际的扩展。

## 九、oneof

如果您的消息包含许多可选字段，并且最多同时设置一个字段，则可以强制执行此行为并使用 oneof 功能节省内存。

oneof 字段类似于可选字段，除了一个 oneof 共享内存中的所有字段，最多可以同时设置一个字段。设置 oneof 的任何成员会自动清除所有其他成员。`case()`您可以使用特殊或方法检查 oneof 中设置的值（如果有）`WhichOneof()`，具体取决于您选择的语言。

### 1、使用 Oneof

要在您的中定义 oneof，请`.proto`使用`oneof`关键字后跟 oneof 名称，在这种情况下`test_oneof`：

```proto
message SampleMessage {
  oneof test_oneof {
     string name = 4;
     SubMessage sub_message = 9;
  }
}
```

然后，您将 oneof 字段添加到 oneof 定义中。您可以添加任何类型的字段，但不能使用`required`、`optional`或`repeated`关键字。如果需要向 oneof 添加重复字段，可以使用包含重复字段的消息。

`optional`在您生成的代码中，oneof 字段具有与常规方法相同的 getter 和 setter 。您还可以获得一种特殊的方法来检查 oneof 中设置了哪个值（如果有）。[您可以在相关API 参考](https://developers.google.com/protocol-buffers/docs/reference/overview)中找到有关所选语言的 oneof API 的更多信息 。

### 2、oneof的特点

- 设置 oneof 字段将自动清除 oneof 的所有其他成员。因此，如果您设置了多个 oneof 字段，则只有您设置的*最后一个*字段仍有值。

  ```c++
  SampleMessage message;
  message.set_name("name");
  CHECK(message.has_name());
  message.mutable_sub_message();   // Will clear name field.
  CHECK(!message.has_name());
  ```

- 如果解析器在线路上遇到同一个成员的多个成员，则在解析的消息中只使用最后一个看到的成员。

- oneof 不支持扩展。

- oneof 不能是`repeated`。

- 反射 API 适用于 oneof 字段。

- 如果将 oneof 字段设置为默认值（例如将 int32 oneof 字段设置为 0），则会设置该 oneof 字段的“大小写”，并且该值将在线上序列化。

- 如果您使用 C++，请确保您的代码不会导致内存崩溃。以下示例代码将崩溃，因为`sub_message`已通过调用该`set_name()`方法删除。

  ```c++
  SampleMessage message;
  SubMessage* sub_message = message.mutable_sub_message();
  message.set_name("name");      // Will delete sub_message
  sub_message->set_...            // Crashes here
  ```

- 再次在 C++ 中，如果您`Swap()`使用 oneofs 发送两条消息，则每条消息都将以另一个的 oneof 情况结束：在下面的示例中，`msg1`将具有 a `sub_message`和`msg2`将具有`name`.

  ```c++
  SampleMessage msg1;
  msg1.set_name("name");
  SampleMessage msg2;
  msg2.mutable_sub_message();
  msg1.swap(&msg2);
  CHECK(msg1.has_sub_message());
  CHECK(msg2.has_name());
  ```

### 3、向后兼容性问题

添加或删除其中一个字段时要小心。如果检查 oneof 的值返回`None`/ `NOT_SET`，则可能意味着 oneof 尚未设置或已设置为 oneof 不同版本中的字段。没有办法区分，因为无法知道线路上的未知字段是否是 oneof 的成员。

#### 标签重用问题

- **将可选字段移入或移出 oneof**：在消息被序列化和解析后，您可能会丢失一些信息（某些字段将被清除）。但是，您可以安全地将单个字段移动到**新**的oneof 中，并且如果知道只设置了一个字段，则可以移动多个字段。
- **删除 oneof 字段并重新添加**：这可能会在消息被序列化和解析后清除您当前设置的 oneof 字段。
- **拆分或合并 oneof**`optional` ：这与移动常规字段有类似的问题 。

## 十、map

如果您想创建关联映射作为数据定义的一部分，protocol buffers 提供了一种方便的快捷语法：

```proto
map<key_type, value_type> map_field = N;
```

...其中`key_type`可以是任何整数或字符串类型（因此， 除浮点类型和之外的任何[标量](https://developers.google.com/protocol-buffers/docs/proto#scalar)`bytes`类型）。请注意， enum 不是有效的`key_type`. `value_type`可以是任何类型，除了另一个地图。

因此，例如，如果您想创建一个项目映射，其中每条`Project` 消息都与一个字符串键相关联，您可以这样定义它：

```proto
map<string, Project> projects = 3;
```

生成的地图 API 目前可用于所有 proto2 支持的语言。[您可以在相关API 参考](https://developers.google.com/protocol-buffers/docs/reference/overview)中找到有关所选语言的地图 API 的更多信息 。

### 1、map功能

- 地图不支持扩展。
- 地图不能是`repeated`、`optional`或`required`。
- 地图值的线格式排序和地图迭代排序是未定义的，因此您不能依赖地图项处于特定顺序。
- 为 a 生成文本格式时`.proto`，地图按键排序。数字键按数字排序。
- 从连线解析或合并时，如果有重复的映射键，则使用最后看到的键。从文本格式解析地图时，如果有重复的键，则解析可能会失败。

### 2、向后兼容性

map 语法在网络上等同于以下内容，因此不支持 map 的协议缓冲区实现仍然可以处理您的数据：

```
message MapFieldEntry {
  optional key_type key = 1;
  optional value_type value = 2;
}

repeated MapFieldEntry map_field = N;
```

任何支持映射的协议缓冲区实现都必须生成和接受上述定义可以接受的数据。

## 十一、packages

您可以将可选`package`说明符添加到`.proto`文件中，以防止协议消息类型之间的名称冲突。

```proto
package foo.bar;
message Open { ... }
```

然后，您可以在定义消息类型的字段时使用包说明符：

```proto
message Foo {
  ...
  required foo.bar.Open open = 1;
  ...
}
```

包说明符影响生成代码的方式取决于您选择的语言：

- 在**C++**中，生成的类被包装在 C++ 命名空间中。例如，`Open`将在命名空间中`foo::bar`。
- 在**Java**中，包用作 Java 包，除非您`option java_package`在`.proto`文件中明确提供 a。
- 在**Python**中，该`package`指令被忽略，因为 Python 模块是根据它们在文件系统中的位置进行组织的。
- 在**Go**中，该`package`指令被忽略，生成的文件位于以相应 规则`.pb.go` 命名的包中。`go_proto_library`

请注意，即使该`package`指令不直接影响生成的代码，例如在 Python 中，仍然强烈建议为`.proto`文件指定包，否则可能导致描述符中的命名冲突，并使 proto 不能移植到其他语言。

### 包和名称解析

协议缓冲区语言中的类型名称解析与 C++ 类似：首先搜索最内部的范围，然后搜索下一个最内部的范围，依此类推，每个包都被认为是其父包的“内部”。一个领先的'.' （例如，`.foo.bar.Baz`）表示从最外面的范围开始。

协议缓冲区编译器通过解析导入的 `.proto`文件来解析所有类型名称。每种语言的代码生成器都知道如何引用该语言中的每种类型，即使它有不同的范围规则。

## 十二、定义服务

如果您想在 RPC（远程过程调用）系统中使用您的消息类型，您可以在一个`.proto`文件中定义一个 RPC 服务接口，并且协议缓冲区编译器将以您选择的语言生成服务接口代码和存根。因此，例如，如果你想定义一个 RPC 服务，它的方法接受你的`SearchRequest`并返回 a `SearchResponse`，你可以在你的`.proto`文件中定义它，如下所示：

```proto
service SearchService {
  rpc Search(SearchRequest) returns (SearchResponse);
}
```

默认情况下，协议编译器会生成一个被调用的抽象接口`SearchService`和一个相应的“存根”实现。存根将所有调用转发到`RpcChannel`，而后者又是一个抽象接口，您必须根据自己的 RPC 系统定义自己。例如，您可以实现一个`RpcChannel`序列化消息并通过 HTTP 将其发送到服务器的方法。换句话说，生成的存根提供了一个类型安全的接口，用于进行基于协议缓冲区的 RPC 调用，而不会将您锁定在任何特定的 RPC 实现中。因此，在 C++ 中，您最终可能会得到如下代码：

```c++
using google::protobuf;

protobuf::RpcChannel* channel;
protobuf::RpcController* controller;
SearchService* service;
SearchRequest request;
SearchResponse response;

void DoSearch() {
  // You provide classes MyRpcChannel and MyRpcController, which implement
  // the abstract interfaces protobuf::RpcChannel and protobuf::RpcController.
  channel = new MyRpcChannel("somehost.example.com:1234");
  controller = new MyRpcController;

  // The protocol compiler generates the SearchService class based on the
  // definition given above.
  service = new SearchService::Stub(channel);

  // Set up the request.
  request.set_query("protocol buffers");

  // Execute the RPC.
  service->Search(controller, request, response, protobuf::NewCallback(&Done));
}

void Done() {
  delete service;
  delete channel;
  delete controller;
}
```

所有服务类也实现了该`Service`接口，该接口提供了一种在编译时无需知道方法名称或其输入和输出类型即可调用特定方法的方法。在服务器端，这可用于实现一个 RPC 服务器，您可以使用它注册服务。

```c++
using google::protobuf;

class ExampleSearchService : public SearchService {
 public:
  void Search(protobuf::RpcController* controller,
              const SearchRequest* request,
              SearchResponse* response,
              protobuf::Closure* done) {
    if (request->query() == "google") {
      response->add_result()->set_url("http://www.google.com");
    } else if (request->query() == "protocol buffers") {
      response->add_result()->set_url("http://protobuf.googlecode.com");
    }
    done->Run();
  }
};

int main() {
  // You provide class MyRpcServer.  It does not have to implement any
  // particular interface; this is just an example.
  MyRpcServer server;

  protobuf::Service* service = new ExampleSearchService;
  server.ExportOnPort(1234, service);
  server.Run();

  delete service;
  return 0;
}
```

如果您不想插入您自己现有的 RPC 系统，您现在可以使用 [gRPC](https://github.com/grpc/grpc-common)：由 Google 开发的一种语言和平台中立的开源 RPC 系统。gRPC 特别适用于协议缓冲区，并允许您 `.proto`使用特殊的协议缓冲区编译器插件直接从文件中生成相关的 RPC 代码。但是，由于使用 proto2 和 proto3 生成的客户端和服务器之间存在潜在的兼容性问题，我们建议您使用 proto3 来定义 gRPC 服务。[您可以在Proto3 语言指南](https://developers.google.com/protocol-buffers/docs/proto3)中找到有关 proto3 语法的更多信息 。如果您确实想将 proto2 与 gRPC 一起使用，则需要使用 3.0.0 或更高版本的协议缓冲区编译器和库。

除了 gRPC，还有一些正在进行的第三方项目为 Protocol Buffers 开发 RPC 实现。有关我们了解的项目的链接列表，请参阅 [第三方附加组件 wiki 页面](https://github.com/protocolbuffers/protobuf/blob/master/docs/third_party.md)。

## 十三、option

文件中的各个声明`.proto`可以用许多 *选项*进行注释。选项不会改变声明的整体含义，但可能会影响它在特定上下文中的处理方式。可用选项的完整列表在 中定义`google/protobuf/descriptor.proto`。

一些选项是文件级选项，这意味着它们应该在顶级范围内编写，而不是在任何消息、枚举或服务定义中。一些选项是消息级别的选项，这意味着它们应该写在消息定义中。一些选项是字段级选项，这意味着它们应该写在字段定义中。选项也可以写在枚举类型、枚举值、oneof字段、服务类型、服务方法上；但是，目前不存在任何有用的选项。

以下是一些最常用的选项：

- `java_package`（文件选项）：要用于生成的 Java 类的包。如果文件中没有给出明确`java_package`的选项`.proto` ，那么默认情况下将使用 proto 包（使用文件中的“package”关键字指定`.proto`）。但是，proto 包通常不能制作好的 Java 包，因为不期望 proto 包以反向域名开头。如果不生成 Java 代码，则此选项无效。

  ```proto
  option java_package = "com.example.foo";
  ```

- `java_outer_classname`（文件选项）：您要生成的包装 Java 类的类名（以及文件名）。如果文件中没有明确 `java_outer_classname`指定，`.proto`则将通过将`.proto`文件名转换为驼峰式来构造类名（因此 `foo_bar.proto`变为`FooBar.java`）。如果该`java_multiple_files`选项被禁用，那么所有其他类/枚举/等。为文件生成的`.proto` 文件将*在*这个外部包装 Java 类中生成为嵌套类/枚举/等。如果不生成 Java 代码，则此选项无效。

  ```proto
  option java_outer_classname = "Ponycopter";
  ```

- `java_multiple_files`（文件选项）：如果为 false，则只会`.java`为此文件生成一个`.proto`文件，以及所有 Java 类/枚举/等。为顶级消息、服务和枚举生成的将嵌套在外部类中（请参阅 参考资料 `java_outer_classname`）。如果为 true，`.java`将为每个 Java 类/枚举/等生成单独的文件。为顶级消息、服务和枚举生成，并且为此`.proto`文件生成的包装 Java 类将不包含任何嵌套类/枚举/等。这是一个布尔选项，默认为`false`. 如果不生成 Java 代码，则此选项无效。

  ```proto
  option java_multiple_files = true;
  ```

- `optimize_for`（文件选项）：可以设置为`SPEED`、`CODE_SIZE`或 `LITE_RUNTIME`。这会通过以下方式影响 C++ 和 Java 代码生成器（可能还有第三方生成器）：

  - `SPEED`（默认）：protocol buffer 编译器将生成用于对消息类型进行序列化、解析和执行其他常见操作的代码。这段代码是高度优化的。
  - `CODE_SIZE`：protocol buffer 编译器将生成最少的类，并将依赖共享的、基于反射的代码来实现序列化、解析和各种其他操作。因此生成的代码将比 with 小得多`SPEED`，但操作会更慢。类仍将实现与模式中完全相同的公共 API `SPEED`。这种模式在包含大量`.proto`文件并且不需要所有文件都非常快的应用程序中最有用。
  - `LITE_RUNTIME`：protocol buffer 编译器将生成仅依赖于“lite”运行时库的类（`libprotobuf-lite`而不是 `libprotobuf`）。lite 运行时比完整库小得多（大约小一个数量级），但省略了描述符和反射等某些功能。这对于在手机等受限平台上运行的应用程序特别有用。编译器仍将生成所有方法的快速实现，就像它在`SPEED`模式中所做的那样。生成的类只会实现`MessageLite`每种语言的接口，它只提供完整 `Message`接口方法的子集。

  ```proto
  option optimize_for = CODE_SIZE;
  ```

- `cc_generic_services`, `java_generic_services`, `py_generic_services`（文件选项）：protocol buffer 编译器是否应该分别根据 C++、Java 和 Python 中的[服务定义生成抽象服务代码。](https://developers.google.com/protocol-buffers/docs/proto#services)由于遗留原因，这些默认为`true`. 但是，从 2.3.0 版（2010 年 1 月）开始，RPC 实现被认为最好提供 [代码生成器插件](https://developers.google.com/protocol-buffers/docs/reference/cpp/google.protobuf.compiler.plugin.pb) 来生成更特定于每个系统的代码，而不是依赖于“抽象”服务。

  ```proto
  // This file relies on plugins to generate service code.
  option cc_generic_services = false;
  option java_generic_services = false;
  option py_generic_services = false;
  ```

- `cc_enable_arenas`（文件选项）：为 C++ 生成的代码启用 [竞技场分配。](https://developers.google.com/protocol-buffers/docs/reference/arenas)

- `message_set_wire_format`（消息选项）：如果设置为`true`，则消息使用不同的二进制格式，旨在与 Google 内部使用的旧格式兼容，称为`MessageSet`. Google 以外的用户可能永远不需要使用此选项。消息必须完全声明如下：

  ```proto
  message Foo {
    option message_set_wire_format = true;
    extensions 4 to max;
  }
  ```

- `packed`（字段选项）：如果设置为`true`基本数字类型的重复字段，则使用更紧凑的 [编码](https://developers.google.com/protocol-buffers/docs/encoding#packed)。使用此选项没有缺点。但是，请注意，在 2.3.0 版本之前，在未预料到的情况下接收到打包数据的解析器会忽略它。因此，在不破坏线路兼容性的情况下，不可能将现有字段更改为打包格式。在 2.3.0 及更高版本中，此更改是安全的，因为可打包字段的解析器将始终接受这两种格式，但如果您必须使用旧 protobuf 版本处理旧程序，请小心。

  ```proto
  repeated int32 samples = 4 [packed = true];
  ```

- `deprecated`（字段选项）：如果设置为`true`，则表示该字段已弃用，不应被新代码使用。在大多数语言中，这没有实际效果。在 Java 中，这成为`@Deprecated`注解。将来，其他特定于语言的代码生成器可能会在字段的访问器上生成弃用注释，这反过来会导致在编译尝试使用该字段的代码时发出警告。如果该字段未被任何人使用并且您希望阻止新用户使用它，请考虑将字段声明替换为[保留](https://developers.google.com/protocol-buffers/docs/proto#reserved) 语句。

  ```proto
  optional int32 old_field = 6 [deprecated=true];
  ```

### 自定义选项

协议缓冲区甚至允许您定义和使用自己的选项。请注意，这是大多数人不需要的**高级功能。**由于选项是由`google/protobuf/descriptor.proto`(like `FileOptions`or `FieldOptions`) 中定义的消息定义的，因此定义您自己的选项只是[扩展](https://developers.google.com/protocol-buffers/docs/proto#extensions)这些消息的问题。例如：

```proto
import "google/protobuf/descriptor.proto";

extend google.protobuf.MessageOptions {
  optional string my_option = 51234;
}

message MyMessage {
  option (my_option) = "Hello world!";
}
```

在这里，我们通过扩展定义了一个新的消息级选项`MessageOptions`。然后当我们使用该选项时，选项名称必须用括号括起来，以表明它是一个扩展。我们现在可以`my_option`像这样在 C++ 中读取 的值：

```proto
string value = MyMessage::descriptor()->options().GetExtension(my_option);
```

在这里，`MyMessage::descriptor()->options()`返回 的`MessageOptions`协议消息`MyMessage`。从中读取自定义选项就像读取任何其他[扩展](https://developers.google.com/protocol-buffers/docs/proto#extensions)一样。

类似地，在 Java 中我们会这样写：

```java
String value = MyProtoFile.MyMessage.getDescriptor().getOptions()
  .getExtension(MyProtoFile.myOption);
```

在 Python 中，它将是：

```python
value = my_proto_file_pb2.MyMessage.DESCRIPTOR.GetOptions()
  .Extensions[my_proto_file_pb2.my_option]
```

可以为 Protocol Buffers 语言中的每种构造定义自定义选项。这是一个使用各种选项的示例：

```proto
import "google/protobuf/descriptor.proto";

extend google.protobuf.FileOptions {
  optional string my_file_option = 50000;
}
extend google.protobuf.MessageOptions {
  optional int32 my_message_option = 50001;
}
extend google.protobuf.FieldOptions {
  optional float my_field_option = 50002;
}
extend google.protobuf.OneofOptions {
  optional int64 my_oneof_option = 50003;
}
extend google.protobuf.EnumOptions {
  optional bool my_enum_option = 50004;
}
extend google.protobuf.EnumValueOptions {
  optional uint32 my_enum_value_option = 50005;
}
extend google.protobuf.ServiceOptions {
  optional MyEnum my_service_option = 50006;
}
extend google.protobuf.MethodOptions {
  optional MyMessage my_method_option = 50007;
}

option (my_file_option) = "Hello world!";

message MyMessage {
  option (my_message_option) = 1234;

  optional int32 foo = 1 [(my_field_option) = 4.5];
  optional string bar = 2;
  oneof qux {
    option (my_oneof_option) = 42;

    string quux = 3;
  }
}

enum MyEnum {
  option (my_enum_option) = true;

  FOO = 1 [(my_enum_value_option) = 321];
  BAR = 2;
}

message RequestType {}
message ResponseType {}

service MyService {
  option (my_service_option) = FOO;

  rpc MyMethod(RequestType) returns(ResponseType) {
    // Note:  my_method_option has type MyMessage.  We can set each field
    //   within it using a separate "option" line.
    option (my_method_option).foo = 567;
    option (my_method_option).bar = "Some string";
  }
}
```

请注意，如果您想在包中使用自定义选项而不是定义它的包，您必须在选项名称前面加上包名称，就像您为类型名称所做的那样。例如：

```proto
// foo.proto
import "google/protobuf/descriptor.proto";
package foo;
extend google.protobuf.MessageOptions {
  optional string my_option = 51234;
}
// bar.proto
import "foo.proto";
package bar;
message MyMessage {
  option (foo.my_option) = "Hello world!";
}
```

最后一件事：由于自定义选项是扩展，因此必须像任何其他字段或扩展一样为它们分配字段编号。在上面的示例中，我们使用了 50000-99999 范围内的字段编号。此范围保留供各个组织内部使用，因此您可以自由地使用此范围内的数字进行内部应用。但是，如果您打算在公共应用程序中使用自定义选项，那么确保您的字段编号在全球范围内是唯一的，这一点很重要。要获取全局唯一的字段编号，请发送请求以向 [protobuf 全局扩展注册表](https://github.com/protocolbuffers/protobuf/blob/master/docs/options.md)添加条目。通常您只需要一个分机号码。您可以通过将它们放在子消息中来声明仅具有一个分机号码的多个选项：

```proto
message FooOptions {
  optional int32 opt1 = 1;
  optional string opt2 = 2;
}

extend google.protobuf.FieldOptions {
  optional FooOptions foo_options = 1234;
}

// usage:
message Bar {
  optional int32 a = 1 [(foo_options).opt1 = 123, (foo_options).opt2 = "baz"];
  // alternative aggregate syntax (uses TextFormat):
  optional int32 b = 2 [(foo_options) = { opt1: 123 opt2: "baz" }];
}
```

另外，请注意每个选项类型（文件级、消息级、字段级等）都有自己的数字空间，因此，例如，您可以使用相同的数字声明 FieldOptions 和 MessageOptions 的扩展。

## 十四、生成你的类

`.proto`要生成需要使用文件中 定义的消息类型的 Java、Python 或 C++ 代码，您需要`protoc`在`.proto`. 如果您尚未安装编译器，请 [下载软件包](https://developers.google.com/protocol-buffers/docs/downloads)并按照 README 中的说明进行操作。

协议编译器调用如下：

```sh
protoc --proto_path=IMPORT_PATH --cpp_out=DST_DIR --java_out=DST_DIR --python_out=DST_DIR path/to/file.proto
```

- `IMPORT_PATH`指定`.proto`解析`import`指令时在其中查找文件的目录。如果省略，则使用当前目录。`--proto_path` 多次传递该选项可以指定多个导入目录；他们将被按顺序搜索。`-I=_IMPORT_PATH_` 可以用作 的简写形式`--proto_path`。

- 您可以提供一个或多个*输出指令*：

  - `--cpp_out`生成 C++ 代码`DST_DIR`。有关更多信息，请参阅 [C++ 生成的代码参考](https://developers.google.com/protocol-buffers/docs/reference/cpp-generated) 。
  - `--java_out`生成 Java 代码`DST_DIR`。有关更多信息，请参阅 [Java 生成的代码参考](https://developers.google.com/protocol-buffers/docs/reference/java-generated) 。
  - `--python_out`生成 Python 代码`DST_DIR`。有关更多信息，请参阅 [Python 生成的代码参考](https://developers.google.com/protocol-buffers/docs/reference/python-generated) 。

  作为额外的方便，如果以or`DST_DIR`结尾，编译器会将输出写入具有给定名称的单个 ZIP 格式存档文件。按照 Java JAR 规范的要求，输出也将获得一个清单文件。请注意，如果输出存档已经存在，它将被覆盖；编译器不够聪明，无法将文件添加到现有存档中。`.zip``.jar``.jar`

- 您必须提供一个或多个`.proto`文件作为输入。`.proto` 可以一次指定多个文件。尽管文件是相对于当前目录命名的，但每个文件必须位于其中一个`IMPORT_PATH`s 中，以便编译器可以确定其规范名称。





## 参考

- https://developers.google.com/protocol-buffers/docs/proto