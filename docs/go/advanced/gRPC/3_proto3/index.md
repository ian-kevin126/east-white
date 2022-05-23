---
title: 3、proto3
---

# 语言指南 (proto3)

- [定义消息类型](https://developers.google.com/protocol-buffers/docs/proto3#simple)
- [标量值类型](https://developers.google.com/protocol-buffers/docs/proto3#scalar)
- [默认值](https://developers.google.com/protocol-buffers/docs/proto3#default)
- [枚举](https://developers.google.com/protocol-buffers/docs/proto3#enum)
- [使用其他消息类型](https://developers.google.com/protocol-buffers/docs/proto3#other)
- [嵌套类型](https://developers.google.com/protocol-buffers/docs/proto3#nested)
- [更新消息类型](https://developers.google.com/protocol-buffers/docs/proto3#updating)
- [未知字段](https://developers.google.com/protocol-buffers/docs/proto3#unknowns)
- [任何](https://developers.google.com/protocol-buffers/docs/proto3#any)
- [一个](https://developers.google.com/protocol-buffers/docs/proto3#oneof)
- [地图](https://developers.google.com/protocol-buffers/docs/proto3#maps)
- [套餐](https://developers.google.com/protocol-buffers/docs/proto3#packages)
- [定义服务](https://developers.google.com/protocol-buffers/docs/proto3#services)
- [JSON 映射](https://developers.google.com/protocol-buffers/docs/proto3#json)
- [选项](https://developers.google.com/protocol-buffers/docs/proto3#options)
- [生成你的类](https://developers.google.com/protocol-buffers/docs/proto3#generating)

本指南介绍如何使用协议缓冲区语言来构建协议缓冲区数据，包括`.proto`文件语法以及如何从`.proto`文件生成数据访问类。它涵盖了协议缓冲区语言的**proto3**版本：有关**proto2**语法的信息，请参阅[Proto2 语言指南](https://developers.google.com/protocol-buffers/docs/proto)。

这是一个参考指南——有关使用本文档中描述的许多功能的分步示例，请参阅您选择的语言的[教程](https://developers.google.com/protocol-buffers/docs/tutorials)（目前仅 proto2；更多 proto3 文档即将推出）。

## 一、定义消息类型

首先让我们看一个非常简单的例子。假设您要定义一个搜索请求消息格式，其中每个搜索请求都有一个查询字符串、您感兴趣的特定结果页面以及每页的多个结果。这是`.proto`您用来定义消息类型的文件。

```proto
syntax = "proto3";

message SearchRequest {
  string query = 1;
  int32 page_number = 2;
  int32 result_per_page = 3;
}
```

- 该文件的第一行指定您使用的是`proto3`语法：如果您不这样做，协议缓冲区编译器将假定您使用的是[proto2](https://developers.google.com/protocol-buffers/docs/proto)。这必须是文件的第一个非空、非注释行。
- `SearchRequest`消息定义指定了三个字段（名称/值对），每个字段用于您希望包含在此类消息中的每条数据。每个字段都有一个名称和一个类型。

### 1、指定字段类型

在上面的示例中，所有字段都是[标量类型](https://developers.google.com/protocol-buffers/docs/proto3#scalar)：两个整数（`page_number`和`result_per_page`）和一个字符串（`query`）。但是，您也可以为字段指定复合类型，包括[枚举](https://developers.google.com/protocol-buffers/docs/proto3#enum)和其他消息类型。

### 2、分配字段编号

如您所见，消息定义中的每个字段都有一个**唯一的编号**。这些字段编号用于在[消息二进制格式](https://developers.google.com/protocol-buffers/docs/encoding)中标识您的字段，并且在使用您的消息类型后不应更改。[请注意，1 到 15 范围内的字段编号需要一个字节进行编码，包括字段编号和字段类型（您可以在Protocol Buffer Encoding](https://developers.google.com/protocol-buffers/docs/encoding#structure)中找到更多相关信息）。16 到 2047 范围内的字段编号占用两个字节。因此，您应该为非常频繁出现的消息元素保留数字 1 到 15。请记住为将来可能添加的频繁出现的元素留出一些空间。

您可以指定的最小字段编号是 1，最大的是 2 29 - 1，即 536,870,911。您也不能使用数字 19000 到 19999 ( `FieldDescriptor::kFirstReservedNumber`through `FieldDescriptor::kLastReservedNumber`)，因为它们是为 Protocol Buffers 实现保留的——如果您在`.proto`. 同样，您不能使用任何以前[保留](https://developers.google.com/protocol-buffers/docs/proto3#reserved)的字段编号。

### 3、指定字段规则

消息字段可以是以下之一：

- 单数：格式良好的消息可以有零个或一个此字段（但不能超过一个）。这是 proto3 语法的默认字段规则。
- `repeated`：该字段可以在格式良好的消息中重复任意次数（包括零次）。重复值的顺序将被保留。

在 proto3 中，`repeated`标量数值类型的字段`packed`默认使用编码。

[您可以在Protocol Buffer Encoding](https://developers.google.com/protocol-buffers/docs/encoding#packed)中找到有关`packed`编码的更多信息。

### 4、添加更多消息类型

可以在单个`.proto`文件中定义多种消息类型。如果您要定义多个相关消息，这很有用——例如，如果您想定义与您的`SearchResponse`消息类型相对应的回复消息格式，您可以将其添加到相同的`.proto`:

```proto
message SearchRequest {
  string query = 1;
  int32 page_number = 2;
  int32 result_per_page = 3;
}

message SearchResponse {
 ...
}
```

### 5、添加评论

要向`.proto`文件添加注释，请使用 C/C++ 样式`//`和`/* ... */`语法。

```proto
/* SearchRequest represents a search query, with pagination options to
 * indicate which results to include in the response. */

message SearchRequest {
  string query = 1;
  int32 page_number = 2;  // Which page number do we want?
  int32 result_per_page = 3;  // Number of results to return per page.
}
```

### 6、保留字段

如果您通过完全删除字段或将其注释掉来[更新消息类型，未来的用户可以在对类型进行自己的更新时重用字段编号。](https://developers.google.com/protocol-buffers/docs/proto3#updating)如果他们稍后加载相同的旧版本，这可能会导致严重问题`.proto`，包括数据损坏、隐私错误等。确保不会发生这种情况的一种方法是指定已删除字段的字段编号（和/或名称，这也可能导致 JSON 序列化问题）为`reserved`. 如果将来有任何用户尝试使用这些字段标识符，protocol buffer 编译器会抱怨。

```proto
message Foo {
  reserved 2, 15, 9 to 11;
  reserved "foo", "bar";
}
```

请注意，您不能在同一`reserved`语句中混合字段名称和字段编号。

### 7、什么是从你的？`.proto`

当您在 a 上运行[协议缓冲区编译器](https://developers.google.com/protocol-buffers/docs/proto3#generating)`.proto`时，编译器会以您选择的语言生成代码，您需要使用文件中描述的消息类型，包括获取和设置字段值，将消息序列化到输出流，并从输入流中解析您的消息。

- 对于**C++**，编译器从 each 生成一个`.h`and`.cc`文件`.proto`，并为文件中描述的每种消息类型提供一个类。
- 对于**Java**，编译器会`.java`为每种消息类型生成一个包含类的文件，以及`Builder`用于创建消息类实例的特殊类。
- 对于**Kotlin**，除了 Java 生成的代码之外，编译器还会`.kt`为每种消息类型生成一个文件，其中包含可用于简化创建消息实例的 DSL。
- **Python**有点不同——Python 编译器会生成一个模块*，*`.proto`其中包含您的 .
- 对于**Go**，编译器会为`.pb.go`文件中的每种消息类型生成一个文件类型。
- 对于**Ruby**，编译器会生成一个`.rb`带有 Ruby 模块的文件，其中包含您的消息类型。
- 对于**Objective-C**，编译器从 each 生成一个`pbobjc.h`and`pbobjc.m`文件`.proto`，并为文件中描述的每种消息类型提供一个类。
- 对于**C#**，编译器会`.cs`从 each 生成一个文件`.proto`，其中包含文件中描述的每种消息类型的类。
- 对于**Dart**，编译器会为`.pb.dart`文件中的每种消息类型生成一个包含类的文件。

您可以按照所选语言的教程（即将推出 proto3 版本）了解有关使用每种语言的 API 的更多信息。有关更多 API 详细信息，请参阅相关[API 参考](https://developers.google.com/protocol-buffers/docs/reference/overview)（proto3 版本也即将推出）。

## 二、标量值类型

标量消息字段可以具有以下类型之一 - 该表显示`.proto`文件中指定的类型，以及自动生成的类中的相应类型：

| 。原型 | 笔记                                                                              | C++ 类型 | Java/Kotlin 类型[1] | 蟒蛇类型[3]                    | 走类型 | 红宝石类型                   | C# 类型 | PHP 类型       | 飞镖类型 |
| :----- | :-------------------------------------------------------------------------------- | :------- | :------------------ | :----------------------------- | :----- | :--------------------------- | :------ | :------------- | :------- |
| 双倍的 |                                                                                   | 双倍的   | 双倍的              | 漂浮                           | 浮动64 | 漂浮                         | 双倍的  | 漂浮           | 双倍的   |
| 漂浮   |                                                                                   | 漂浮     | 漂浮                | 漂浮                           | 浮动32 | 漂浮                         | 漂浮    | 漂浮           | 双倍的   |
| 整数32 | 使用可变长度编码。对负数进行编码效率低下——如果您的字段可能有负值，请改用 sint32。 | 整数32   | 整数                | 整数                           | 整数32 | Fixnum 或 Bignum（根据需要） | 整数    | 整数           | 整数     |
| 整数64 | 使用可变长度编码。对负数进行编码效率低下——如果您的字段可能有负值，请改用 sint64。 | 整数64   | 长                  | 整数/长[4]                     | 整数64 | 比格南                       | 长      | 整数/字符串[6] | 整数64   |
| uint32 | 使用可变长度编码。                                                                | uint32   | 整数[2]             | 整数/长[4]                     | uint32 | Fixnum 或 Bignum（根据需要） | 单位    | 整数           | 整数     |
| uint64 | 使用可变长度编码。                                                                | uint64   | 长[2]               | 整数/长[4]                     | uint64 | 比格南                       | 乌龙    | 整数/字符串[6] | 整数64   |
| sint32 | 使用可变长度编码。带符号的 int 值。这些比常规 int32 更有效地编码负数。            | 整数32   | 整数                | 整数                           | 整数32 | Fixnum 或 Bignum（根据需要） | 整数    | 整数           | 整数     |
| sint64 | 使用可变长度编码。带符号的 int 值。这些比常规 int64 更有效地编码负数。            | 整数64   | 长                  | 整数/长[4]                     | 整数64 | 比格南                       | 长      | 整数/字符串[6] | 整数64   |
| 固定32 | 总是四个字节。如果值通常大于 2 28 ，则比 uint32 更有效。                          | uint32   | 整数[2]             | 整数/长[4]                     | uint32 | Fixnum 或 Bignum（根据需要） | 单位    | 整数           | 整数     |
| 固定64 | 总是八个字节。如果值通常大于 2 56 ，则比 uint64 更有效。                          | uint64   | 长[2]               | 整数/长[4]                     | uint64 | 比格南                       | 乌龙    | 整数/字符串[6] | 整数64   |
| 固定32 | 总是四个字节。                                                                    | 整数32   | 整数                | 整数                           | 整数32 | Fixnum 或 Bignum（根据需要） | 整数    | 整数           | 整数     |
| 固定64 | 总是八个字节。                                                                    | 整数64   | 长                  | 整数/长[4]                     | 整数64 | 比格南                       | 长      | 整数/字符串[6] | 整数64   |
| 布尔   |                                                                                   | 布尔     | 布尔值              | 布尔                           | 布尔   | TrueClass/FalseClass         | 布尔    | 布尔值         | 布尔     |
| 细绳   | 字符串必须始终包含 UTF-8 编码或 7 位 ASCII 文本，并且不能超过 2 32。              | 细绳     | 细绳                | 字符串/unicode [5]             | 细绳   | 字符串 (UTF-8)               | 细绳    | 细绳           | 细绳     |
| 字节   | 可能包含不超过 2 32的任意字节序列。                                               | 细绳     | 字节串              | str (Python 2) 字节 (Python 3) | []字节 | 字符串 (ASCII-8BIT)          | 字节串  | 细绳           | 列表     |

[当您在Protocol Buffer Encoding](https://developers.google.com/protocol-buffers/docs/encoding)中序列化您的消息时，您可以了解有关这些类型如何编码的更多信息。

[1] Kotlin 使用 Java 中的相应类型，甚至是无符号类型，以确保在混合 Java/Kotlin 代码库中的兼容性。

[2]在 Java 中，无符号 32 位和 64 位整数使用它们的有符号对应物表示，最高位简单地存储在符号位中。

[3]在所有情况下，为字段设置值将执行类型检查以确保其有效。

[4] 64 位或无符号 32 位整数在解码时始终表示为 long，但如果在设置字段时给出 int，则可以是 int。在所有情况下，该值必须适合设置时表示的类型。见[2]。

[5] Python 字符串在解码时表示为 unicode，但如果给出 ASCII 字符串，则可以是 str（这可能会发生变化）。

[6]整数用于 64 位机器，字符串用于 32 位机器。

## 三、默认值

解析消息时，如果编码的消息不包含特定的奇异元素，则解析对象中的相应字段将设置为该字段的默认值。这些默认值是特定于类型的：

- 对于字符串，默认值为空字符串。
- 对于字节，默认值为空字节。
- 对于布尔值，默认值为 false。
- 对于数字类型，默认值为零。
- 对于[enums](https://developers.google.com/protocol-buffers/docs/proto3#enum)，默认值是第**一个定义的 enum value**，它必须是 0。
- 对于消息字段，未设置该字段。它的确切值取决于语言。有关详细信息，请参阅[生成的代码指南](https://developers.google.com/protocol-buffers/docs/reference/overview)。

重复字段的默认值为空（通常是相应语言的空列表）。

请注意，对于标量消息字段，一旦解析了消息，就无法判断该字段是显式设置为默认值（例如布尔值是否设置为`false`）还是根本没有设置：您应该牢记这一点定义消息类型时。例如，`false`如果您不希望在默认情况下也发生该行为，则不要在设置为时打开某些行为的布尔值。另请注意，如果标量消息字段**设置**为其默认值，则该值将不会在线上序列化。

有关默认值如何在生成的代码中工作的更多详细信息，请参阅您选择的语言的[生成代码指南](https://developers.google.com/protocol-buffers/docs/reference/overview)。

## 四、枚举

在定义消息类型时，您可能希望其字段之一仅具有预定义的值列表之一。例如，假设您要`corpus`为每个 添加一个字段，`SearchRequest`其中语料库可以是`UNIVERSAL`、`WEB`、`IMAGES`、`LOCAL`、`NEWS`或。您可以通过在消息定义中添加一个非常简单的方法来做到这一点，并为每个可能的值添加一个常量。`PRODUCTS``VIDEO``enum`

在下面的示例中，我们添加了一个包含所有可能值的`enum`调用`Corpus`，以及一个 type 字段`Corpus`：

```proto
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

如您所见，`Corpus`枚举的第一个常量映射到零：每个枚举定义都**必须**包含一个映射到零的常量作为其第一个元素。这是因为：

- 必须有一个零值，以便我们可以使用 0 作为数字[默认值](https://developers.google.com/protocol-buffers/docs/proto3#default)。
- 零值必须是第一个元素，以便与第一个枚举值始终为默认值的[proto2](https://developers.google.com/protocol-buffers/docs/proto)语义兼容。

您可以通过将相同的值分配给不同的枚举常量来定义别名。为此，您需要将`allow_alias`选项设置为`true`，否则协议编译器将在找到别名时生成错误消息。

```proto
message MyMessage1 {
  enum EnumAllowingAlias {
    option allow_alias = true;
    UNKNOWN = 0;
    STARTED = 1;
    RUNNING = 1;
  }
}
message MyMessage2 {
  enum EnumNotAllowingAlias {
    UNKNOWN = 0;
    STARTED = 1;
    // RUNNING = 1;  // Uncommenting this line will cause a compile error inside Google and a warning message outside.
  }
}
```

枚举器常量必须在 32 位整数范围内。由于`enum`值在线路上使用[varint 编码](https://developers.google.com/protocol-buffers/docs/encoding)，因此负值效率低下，因此不推荐使用。您可以`enum`在消息定义中定义 s，如上例所示，也可以在外部定义 - 这些`enum`s 可以在`.proto`文件中的任何消息定义中重用。您还可以使用`enum`在一条消息中声明的类型作为另一条消息中字段的类型，使用语法`_MessageType_._EnumType_`.

当您在`.proto`使用 的a 上运行协议缓冲区编译器时`enum`，生成的代码将有一个对应`enum`于 Java、Kotlin 或 C++ 的代码，或者一个`EnumDescriptor`用于 Python 的特殊类，用于在运行时创建一组具有整数值的符号常量——生成的类。

**警告：** 生成的代码可能会受到特定于语言的枚举数限制（一种语言的低千）。请查看您计划使用的语言的限制。

在反序列化期间，无法识别的枚举值将保留在消息中，尽管在反序列化消息时如何表示这取决于语言。在支持具有超出指定符号范围的值的开放枚举类型的语言中，例如 C++ 和 Go，未知的枚举值简单地存储为其底层整数表示。在 Java 等具有封闭枚举类型的语言中，枚举中的 case 用于表示无法识别的值，并且可以使用特殊的访问器访问底层整数。在任何一种情况下，如果消息被序列化，则无法识别的值仍将与消息一起序列化。

有关如何`enum`在应用程序中使用 message 的更多信息，请参阅所选语言的[生成代码指南](https://developers.google.com/protocol-buffers/docs/reference/overview)。

### 保留值

如果您通过完全删除枚举条目或将其注释掉来[更新](https://developers.google.com/protocol-buffers/docs/proto3#updating)枚举类型，将来的用户可以在对类型进行自己的更新时重用该数值。如果他们稍后加载相同的旧版本，这可能会导致严重问题`.proto`，包括数据损坏、隐私错误等。确保不会发生这种情况的一种方法是指定已删除条目的数值（和/或名称，这也可能导致 JSON 序列化问题）为`reserved`. 如果将来有任何用户尝试使用这些标识符，protocol buffer 编译器会抱怨。`max`您可以使用关键字指定保留的数值范围达到最大可能值。

```proto
enum Foo {
  reserved 2, 15, 9 to 11, 40 to max;
  reserved "FOO", "BAR";
}
```

`reserved`请注意，您不能在同一语句中混合字段名称和数值。

## 五、使用其他消息类型

您可以使用其他消息类型作为字段类型。例如，假设您想`Result`在每条`SearchResponse`消息中包含消息——为此，您可以`Result`在同一条消息中定义一个消息类型，`.proto`然后指定一个类型为`Result`in的字段`SearchResponse`：

```proto
message SearchResponse {
  repeated Result results = 1;
}

message Result {
  string url = 1;
  string title = 2;
  repeated string snippets = 3;
}
```

### 1、导入定义

在上面的例子中，`Result`消息类型定义在同一个文件中`SearchResponse`——如果你想用作字段类型的消息类型已经在另一个`.proto`文件中定义了怎么办？

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

`-I`协议编译器使用/`--proto_path`标志在协议编译器命令行上指定的一组目录中搜索导入的文件。如果没有给出标志，它会在调用编译器的目录中查找。通常，您应该将`--proto_path`标志设置为项目的根目录，并为所有导入使用完全限定名称。

### 2、使用 proto2 消息类型

可以导入[proto2](https://developers.google.com/protocol-buffers/docs/proto)消息类型并在您的 proto3 消息中使用它们，反之亦然。但是，proto2 枚举不能直接在 proto3 语法中使用（如果导入的 proto2 消息使用它们也没关系）。

## 六、嵌套类型

您可以在其他消息类型中定义和使用消息类型，如下例所示 - 这里`Result`消息是在消息内部定义的`SearchResponse`：

```proto
message SearchResponse {
  message Result {
    string url = 1;
    string title = 2;
    repeated string snippets = 3;
  }
  repeated Result results = 1;
}
```

如果您想在其父消息类型之外重用此消息类型，请将其称为`_Parent_._Type_`：

```proto
message SomeOtherMessage {
  SearchResponse.Result result = 1;
}
```

您可以随意嵌套消息：

```proto
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

## 七、更新消息类型

如果现有的消息类型不再满足您的所有需求 - 例如，您希望消息格式有一个额外的字段 - 但您仍然希望使用使用旧格式创建的代码，请不要担心！在不破坏任何现有代码的情况下更新消息类型非常简单。只需记住以下规则：

- 不要更改任何现有字段的字段编号。
- 如果您添加新字段，则使用“旧”消息格式的代码序列化的任何消息仍然可以由新生成的代码解析。您应该记住这些元素的[默认值](https://developers.google.com/protocol-buffers/docs/proto3#default)，以便新代码可以正确地与旧代码生成的消息交互。类似地，新代码创建的消息可以由旧代码解析：旧二进制文件在解析时会忽略新字段。有关详细信息，请参阅[未知字段](https://developers.google.com/protocol-buffers/docs/proto3#unknowns)部分。
- 只要在更新的消息类型中不再使用字段编号，就可以删除字段。您可能想要重命名该字段，可能添加前缀“OBSOLETE_”，或将字段编号设为[保留](https://developers.google.com/protocol-buffers/docs/proto3#reserved)，以便您的未来用户`.proto`不会意外重用该编号。
- `int32`、`uint32`、`int64`、`uint64`和`bool`都是兼容的——这意味着您可以将字段从其中一种类型更改为另一种类型，而不会破坏向前或向后兼容性。如果从不适合相应类型的线路中解析出一个数字，您将获得与在 C++ 中将该数字强制转换为该类型相同的效果（例如，如果一个 64 位数字被读取为int32，它将被截断为 32 位）。
- `sint32`并且`sint64`彼此兼容，但与其他整数类型*不*兼容。
- `string`并且`bytes`只要字节是有效的 UTF-8 就兼容。
- `bytes`如果字节包含消息的编码版本，则嵌入消息是兼容的。
- `fixed32`与`sfixed32`和`fixed64`兼容`sfixed64`。
- 对于`string`、`bytes`和 消息字段，`optional`与 兼容`repeated`。给定重复字段的序列化数据作为输入，`optional`如果它是原始类型字段，则期望此字段的客户端将采用最后一个输入值，如果它是消息类型字段，则合并所有输入元素。请注意，这对于数字类型（包括布尔值和枚举）通常不安全**。**数字类型的重复字段可以以[打包](https://developers.google.com/protocol-buffers/docs/encoding#packed)`optional`格式序列化，当需要字段时将无法正确解析。
- `enum`与`int32`, `uint32`, `int64`, 和`uint64`有线格式兼容（请注意，如果不合适，值将被截断）。但是请注意，当消息被反序列化时，客户端代码可能会以不同的方式对待它们：例如，无法识别的 proto3`enum`类型将保留在消息中，但是当消息被反序列化时如何表示则取决于语言。Int 字段总是只保留它们的值。
- 将单个值更改为**new** `oneof`的成员是安全且二进制兼容的。`oneof`如果您确定没有代码一次设置多个字段，则将多个字段移动到一个新字段中可能是安全的。将任何字段移动到现有字段`oneof`中是不安全的。

## 八、未知字段

未知字段是格式良好的协议缓冲区序列化数据，表示解析器无法识别的字段。例如，当旧二进制文件用新字段解析新二进制文件发送的数据时，这些新字段将成为旧二进制文件中的未知字段。

最初，proto3 消息在解析过程中总是丢弃未知字段，但在 3.5 版本中，我们重新引入了保留未知字段以匹配 proto2 行为。在 3.5 及更高版本中，未知字段在解析期间保留并包含在序列化输出中。

## 九、Any

消息类型允许您将`Any`消息用作嵌入类型，而无需它们的 .proto 定义。An`Any`包含任意序列化消息 as `bytes`，以及充当全局唯一标识符并解析为该消息类型的 URL。要使用该`Any`类型，您需要[导入](https://developers.google.com/protocol-buffers/docs/proto3#other) `google/protobuf/any.proto`.

```proto
import "google/protobuf/any.proto";

message ErrorStatus {
  string message = 1;
  repeated google.protobuf.Any details = 2;
}
```

给定消息类型的默认类型 URL 是`type.googleapis.com/_packagename_._messagename_`。

不同的语言实现将支持运行时库助手以`Any`类型安全的方式打包和解包值——例如，在 Java 中，`Any`类型将具有特殊的`pack()`和`unpack()`访问器，而在 C++ 中则有`PackFrom()`和`UnpackTo()`方法：

```c++
// Storing an arbitrary message type in Any.
NetworkErrorDetails details = ...;
ErrorStatus status;
status.add_details()->PackFrom(details);

// Reading an arbitrary message from Any.
ErrorStatus status = ...;
for (const Any& detail : status.details()) {
  if (detail.Is<NetworkErrorDetails>()) {
    NetworkErrorDetails network_error;
    detail.UnpackTo(&network_error);
    ... processing network_error ...
  }
}
```

**目前，用于处理`Any`类型的运行时库正在开发**中。

如果您已经熟悉[proto2 语法](https://developers.google.com/protocol-buffers/docs/proto)，则`Any`可以保存任意 proto3 消息，类似于可以允许[扩展](https://developers.google.com/protocol-buffers/docs/proto#extensions)的 proto2 消息。

## 十、oneof

如果您有一条包含多个字段的消息，并且最多同时设置一个字段，您可以强制执行此行为并使用 oneof 功能节省内存。

oneof 字段与常规字段一样，除了一个 oneof 共享内存中的所有字段外，最多可以同时设置一个字段。设置 oneof 的任何成员会自动清除所有其他成员。`case()`您可以使用特殊或方法检查 oneof 中设置的值（如果有）`WhichOneof()`，具体取决于您选择的语言。

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

然后，您将 oneof 字段添加到 oneof 定义中。您可以添加任何类型的字段，但`map`字段和`repeated`字段除外。

在您生成的代码中，oneof 字段具有与常规字段相同的 getter 和 setter。您还可以获得一种特殊的方法来检查 oneof 中设置了哪个值（如果有）。[您可以在相关API 参考](https://developers.google.com/protocol-buffers/docs/reference/overview)中找到有关所选语言的 oneof API 的更多信息。

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

- 再次在 C++ 中，如果您`Swap()`使用 oneofs 发送两条消息，则每条消息都将以另一个的 oneof 情况结束：在下面的示例中，`msg1`将具有 a`sub_message`和`msg2`将具有`name`.

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

- **将字段移入或移出 oneof**：在消息被序列化和解析后，您可能会丢失一些信息（某些字段将被清除）。但是，您可以安全地将单个字段移动到**新**的oneof 中，并且如果知道只设置了一个字段，则可以移动多个字段。
- **删除 oneof 字段并重新添加**：这可能会在消息被序列化和解析后清除您当前设置的 oneof 字段。
- **拆分或合并 oneof**：这与移动常规字段有类似的问题。

## 十一、map

如果您想创建关联映射作为数据定义的一部分，protocol buffers 提供了一种方便的快捷语法：

```proto
map<key_type, value_type> map_field = N;
```

...其中`key_type`可以是任何整数或字符串类型（因此，除浮点类型和之外的任何[标量](https://developers.google.com/protocol-buffers/docs/proto3#scalar)`bytes`类型）。请注意， enum 不是有效的`key_type`. `value_type`可以是任何类型，除了另一个地图。

因此，例如，如果您想创建一个项目映射，其中每条`Project`消息都与一个字符串键相关联，您可以这样定义它：

```proto
map<string, Project> projects = 3;
```

- 地图字段不能是`repeated`。
- 地图值的线格式排序和地图迭代排序是未定义的，因此您不能依赖地图项处于特定顺序。
- 为 a 生成文本格式时`.proto`，地图按键排序。数字键按数字排序。
- 从连线解析或合并时，如果有重复的映射键，则使用最后看到的键。从文本格式解析地图时，如果有重复的键，则解析可能会失败。
- 如果您为映射字段提供键但没有值，则该字段被序列化时的行为取决于语言。在 C++、Java、Kotlin 和 Python 中，类型的默认值是序列化的，而在其他语言中则没有序列化。

生成的地图 API 目前可用于所有 proto3 支持的语言。[您可以在相关API 参考](https://developers.google.com/protocol-buffers/docs/reference/overview)中找到有关所选语言的地图 API 的更多信息。

### 向后兼容性

map 语法在网络上等同于以下内容，因此不支持 map 的协议缓冲区实现仍然可以处理您的数据：

```proto
message MapFieldEntry {
  key_type key = 1;
  value_type value = 2;
}

repeated MapFieldEntry map_field = N;
```

任何支持映射的协议缓冲区实现都必须生成和接受上述定义可以接受的数据。

## 十二、packages

您可以将可选`package`说明符添加到`.proto`文件中，以防止协议消息类型之间的名称冲突。

```proto
package foo.bar;
message Open { ... }
```

然后，您可以在定义消息类型的字段时使用包说明符：

```proto
message Foo {
  ...
  foo.bar.Open open = 1;
  ...
}
```

包说明符影响生成代码的方式取决于您选择的语言：

- 在**C++**中，生成的类被包装在 C++ 命名空间中。例如，`Open`将在命名空间中`foo::bar`。
- 在**Java**和**Kotlin**中，该包用作 Java 包，除非您`option java_package`在`.proto`文件中明确提供一个。
- 在**Python**中， package 指令被忽略，因为 Python 模块是根据它们在文件系统中的位置进行组织的。
- 在**Go**中，包用作 Go 包名称，除非您`option go_package`在`.proto`文件中明确提供。
- 在**Ruby**中，生成的类封装在嵌套的 Ruby 命名空间中，转换为所需的 Ruby 大写样式（第一个字母大写；如果第一个字符不是字母，`PB_`则在前面）。例如，`Open`将在命名空间中`Foo::Bar`。
- 在**C#**中，包在转换为 PascalCase 后用作命名空间，除非您`option csharp_namespace`在`.proto`文件中明确提供 an。例如，`Open`将在命名空间中`Foo.Bar`。

### 包和名称解析

协议缓冲区语言中的类型名称解析与 C++ 类似：首先搜索最内部的范围，然后搜索下一个最内部的范围，依此类推，每个包都被认为是其父包的“内部”。一个领先的'.' （例如，`.foo.bar.Baz`）表示从最外面的范围开始。

协议缓冲区编译器通过解析导入的`.proto`文件来解析所有类型名称。每种语言的代码生成器都知道如何引用该语言中的每种类型，即使它有不同的范围规则。

## 十三、定义服务

如果您想在 RPC（远程过程调用）系统中使用您的消息类型，您可以在一个`.proto`文件中定义一个 RPC 服务接口，并且协议缓冲区编译器将以您选择的语言生成服务接口代码和存根。因此，例如，如果你想定义一个 RPC 服务，它的方法接受你的`SearchRequest`并返回 a `SearchResponse`，你可以在你的`.proto`文件中定义它，如下所示：

```proto
service SearchService {
  rpc Search(SearchRequest) returns (SearchResponse);
}
```

与协议缓冲区一起使用的最直接的 RPC 系统是[gRPC](https://grpc.io/)：由 Google 开发的一种语言和平台中立的开源 RPC 系统。gRPC 特别适用于协议缓冲区，并允许您`.proto`使用特殊的协议缓冲区编译器插件直接从文件中生成相关的 RPC 代码。

如果您不想使用 gRPC，也可以将协议缓冲区与您自己的 RPC 实现一起使用。[您可以在Proto2 语言指南](https://developers.google.com/protocol-buffers/docs/proto#services)中找到更多相关信息。

还有一些正在进行的第三方项目为 Protocol Buffers 开发 RPC 实现。有关我们了解的项目的链接列表，请参阅[第三方附加组件 wiki 页面](https://github.com/protocolbuffers/protobuf/blob/master/docs/third_party.md)。

## 十四、JSON 映射

Proto3 支持 JSON 中的规范编码，从而更容易在系统之间共享数据。下表中按类型描述了编码。

如果 JSON 编码的数据中缺少某个值，或者它的值为，则在解析到协议缓冲区时`null`，它将被解释为适当的[默认值。](https://developers.google.com/protocol-buffers/docs/proto3#default)如果某个字段在协议缓冲区中具有默认值，则在 JSON 编码的数据中默认将其省略以节省空间。实现可以提供选项以在 JSON 编码的输出中发出具有默认值的字段。

| 原型3                  | JSON          | JSON 示例                                 | 笔记                                                                                                                                                                                                                                                                          |
| :--------------------- | :------------ | :---------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 信息                   | 目的          | `{"fooBar": v, "g": null, …}`             | 生成 JSON 对象。消息字段名称映射到 lowerCamelCase 并成为 JSON 对象键。如果指定了field 选项，则指定的值将用作键。解析器接受 lowerCamelCase 名称（或选项指定的名称）和原始 proto 字段名称。是所有字段类型的可接受值，并被视为相应字段类型的默认值。`json_name``json_name``null` |
| 枚举                   | 细绳          | `"FOO_BAR"`                               | 使用 proto 中指定的枚举值的名称。解析器接受枚举名称和整数值。                                                                                                                                                                                                                 |
| 地图<K,V>              | 目的          | `{"k": v, …}`                             | 所有键都转换为字符串。                                                                                                                                                                                                                                                        |
| 重复V                  | 大批          | `[v, …]`                                  | `null`被接受为空列表`[]`。                                                                                                                                                                                                                                                    |
| 布尔                   | 真假          | `true, false`                             |                                                                                                                                                                                                                                                                               |
| 细绳                   | 细绳          | `"Hello World!"`                          |                                                                                                                                                                                                                                                                               |
| 字节                   | base64 字符串 | `"YWJjMTIzIT8kKiYoKSctPUB+"`              | JSON 值将是使用带有填充的标准 base64 编码编码为字符串的数据。接受带有/不带有填充的标准或 URL 安全的 base64 编码。                                                                                                                                                             |
| int32，固定32，uint32  | 数字          | `1, -10, 0`                               | JSON 值将是一个十进制数。接受数字或字符串。                                                                                                                                                                                                                                   |
| int64、fixed64、uint64 | 细绳          | `"1", "-10"`                              | JSON 值将是一个十进制字符串。接受数字或字符串。                                                                                                                                                                                                                               |
| 浮动，双               | 数字          | `1.1, -10.0, 0, "NaN", "Infinity"`        | JSON 值将是一个数字或特殊字符串值“NaN”、“Infinity”和“-Infinity”之一。接受数字或字符串。也接受指数符号。-0 被认为等同于 0。                                                                                                                                                    |
| 任何                   | `object`      | `{"@type": "url", "f": v, … }`            | 如果`Any`包含具有特殊 JSON 映射的值，则将按如下方式转换：. 否则，会将值转换为 JSON 对象，并插入字段以指示实际数据类型。`{"@type": xxx, "value": yyy}``"@type"`                                                                                                                |
| 时间戳                 | 细绳          | `"1972-01-01T10:00:20.021Z"`              | 使用 RFC 3339，其中生成的输出将始终进行 Z 归一化，并使用 0、3、6 或 9 位小数。也接受除“Z”之外的偏移量。                                                                                                                                                                       |
| 期间                   | 细绳          | `"1.000340012s", "1s"`                    | 生成的输出始终包含 0、3、6 或 9 个小数位，具体取决于所需的精度，后跟后缀“s”。接受任何小数位（也没有），只要它们符合纳秒精度并且需要后缀“s”。                                                                                                                                  |
| 结构                   | `object`      | `{ … }`                                   | 任何 JSON 对象。见。`struct.proto`                                                                                                                                                                                                                                            |
| 包装器类型             | 各种类型      | `2, "2", "foo", true, "true", null, 0, …` | 包装器在 JSON 中使用与包装的原始类型相同的表示，除了`null`在数据转换和传输期间允许和保留。                                                                                                                                                                                    |
| 现场掩码               | 细绳          | `"f.fooBar,h"`                            | 见。`field_mask.proto`                                                                                                                                                                                                                                                        |
| 列表值                 | 大批          | `[foo, bar, …]`                           |                                                                                                                                                                                                                                                                               |
| 价值                   | 价值          |                                           | 任何 JSON 值。检查[google.protobuf.Value](https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Value)了解详情。                                                                                                                      |
| 空值                   | 空值          |                                           | JSON 空                                                                                                                                                                                                                                                                       |
| 空的                   | 目的          | `{}`                                      | 一个空的 JSON 对象                                                                                                                                                                                                                                                            |

### JSON 选项

proto3 JSON 实现可以提供以下选项：

- **Emit fields with default values**：默认情况下，proto3 JSON 输出中会省略具有默认值的字段。实现可以提供一个选项来覆盖此行为并使用其默认值输出字段。
- **忽略未知字段**：Proto3 JSON 解析器默认应该拒绝未知字段，但可能会提供一个选项来忽略解析中的未知字段。
- **使用 proto 字段名称而不是 lowerCamelCase 名称**：默认情况下，proto3 JSON 打印机应将字段名称转换为 lowerCamelCase 并将其用作 JSON 名称。实现可能会提供一个选项来使用 proto 字段名称作为 JSON 名称。Proto3 JSON 解析器需要接受转换后的 lowerCamelCase 名称和 proto 字段名称。
- **将枚举值作为整数而不是字符串发出**：默认情况下，在 JSON 输出中使用枚举值的名称。可以提供一个选项来代替使用枚举值的数值。

## 十五、option

文件中的各个声明`.proto`可以用许多*选项*进行注释。选项不会改变声明的整体含义，但可能会影响它在特定上下文中的处理方式。可用选项的完整列表在 中定义`google/protobuf/descriptor.proto`。

一些选项是文件级选项，这意味着它们应该在顶级范围内编写，而不是在任何消息、枚举或服务定义中。一些选项是消息级别的选项，这意味着它们应该写在消息定义中。一些选项是字段级选项，这意味着它们应该写在字段定义中。选项也可以写在枚举类型、枚举值、oneof字段、服务类型、服务方法上；但是，目前不存在任何有用的选项。

以下是一些最常用的选项：

- `java_package`（文件选项）：要用于生成的 Java/Kotlin 类的包。如果文件中没有给出明确`java_package`的选项`.proto`，那么默认情况下将使用 proto 包（使用文件中的“package”关键字指定`.proto`）。但是，proto 包通常不能制作好的 Java 包，因为不期望 proto 包以反向域名开头。如果不生成 Java 或 Kotlin 代码，则此选项无效。

  ```proto
  option java_package = "com.example.foo";
  ```

- `java_outer_classname`（文件选项）：您要生成的包装 Java 类的类名（以及文件名）。如果文件中没有明确`java_outer_classname`指定，`.proto`则将通过将`.proto`文件名转换为驼峰式来构造类名（因此`foo_bar.proto`变为`FooBar.java`）。如果该`java_multiple_files`选项被禁用，那么所有其他类/枚举/等。为文件生成的`.proto`文件将*在*这个外部包装 Java 类中生成为嵌套类/枚举/等。如果不生成 Java 代码，则此选项无效。

  ```proto
  option java_outer_classname = "Ponycopter";
  ```

- `java_multiple_files`（文件选项）：如果为 false，则只会`.java`为此文件生成一个`.proto`文件，以及所有 Java 类/枚举/等。为顶级消息、服务和枚举生成的将嵌套在外部类中（请参阅 参考资料`java_outer_classname`）。如果为 true，`.java`将为每个 Java 类/枚举/等生成单独的文件。为顶级消息、服务和枚举生成，并且为此`.proto`文件生成的包装 Java 类将不包含任何嵌套类/枚举/等。这是一个布尔选项，默认为`false`. 如果不生成 Java 代码，则此选项无效。

  ```proto
  option java_multiple_files = true;
  ```

- `optimize_for`（文件选项）：可以设置为`SPEED`、`CODE_SIZE`或`LITE_RUNTIME`。这会通过以下方式影响 C++ 和 Java 代码生成器（可能还有第三方生成器）：

  - `SPEED`（默认）：protocol buffer 编译器将生成用于对消息类型进行序列化、解析和执行其他常见操作的代码。这段代码是高度优化的。
  - `CODE_SIZE`：protocol buffer 编译器将生成最少的类，并将依赖共享的、基于反射的代码来实现序列化、解析和各种其他操作。因此生成的代码将比 with 小得多`SPEED`，但操作会更慢。类仍将实现与模式中完全相同的公共 API `SPEED`。这种模式在包含大量`.proto`文件并且不需要所有文件都非常快的应用程序中最有用。
  - `LITE_RUNTIME`：协议缓冲区编译器将生成仅依赖于“lite”运行时库（`libprotobuf-lite`而不是`libprotobuf`）的类。lite 运行时比完整库小得多（大约小一个数量级），但省略了描述符和反射等某些功能。这对于在手机等受限平台上运行的应用程序特别有用。编译器仍将生成所有方法的快速实现，就像它在`SPEED`模式中所做的那样。生成的类只会实现`MessageLite`每种语言的接口，它只提供完整`Message`接口方法的子集。

  ```proto
  option optimize_for = CODE_SIZE;
  ```

- `cc_enable_arenas`（文件选项）：为 C++ 生成的代码启用[竞技场分配。](https://developers.google.com/protocol-buffers/docs/reference/arenas)

- `objc_class_prefix`（文件选项）：设置 Objective-C 类前缀，该前缀添加到所有来自此 .proto 的 Objective-C 生成的类和枚举中。没有默认值。[您应该使用Apple 推荐的](https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/ProgrammingWithObjectiveC/Conventions/Conventions.html#//apple_ref/doc/uid/TP40011210-CH10-SW4)介于 3-5 个大写字符之间的前缀。请注意，所有 2 个字母前缀均由 Apple 保留。

- `deprecated`（字段选项）：如果设置为`true`，则表示该字段已弃用，不应被新代码使用。在大多数语言中，这没有实际效果。在 Java 中，这成为`@Deprecated`注解。将来，其他特定于语言的代码生成器可能会在字段的访问器上生成弃用注释，这反过来会导致在编译尝试使用该字段的代码时发出警告。如果该字段未被任何人使用并且您希望阻止新用户使用它，请考虑将字段声明替换为[保留](https://developers.google.com/protocol-buffers/docs/proto3#reserved)语句。

  ```proto
  int32 old_field = 6 [deprecated = true];
  ```

### 自定义选项

Protocol Buffers 还允许您定义和使用自己的选项。这是大多数人不需要的**高级功能。**如果您确实认为需要创建自己的选项，请参阅[Proto2 语言指南](https://developers.google.com/protocol-buffers/docs/proto#customoptions)了解详细信息。请注意，创建自定义选项使用[extensions](https://developers.google.com/protocol-buffers/docs/proto#extensions)，这仅允许用于 proto3 中的自定义选项。

## 十六、生成你的类

要生成需要使用`.proto`文件中定义的消息类型的 Java、Kotlin、Python、C++、Go、Ruby、Objective-C 或 C# 代码，您需要`protoc`在`.proto`. 如果您尚未安装编译器，请[下载软件包](https://developers.google.com/protocol-buffers/docs/downloads)并按照 README 中的说明进行操作。对于 Go，您还需要为编译器安装一个特殊的代码生成器插件：您可以在 GitHub 上的[golang/protobuf存储库中找到此插件和安装说明。](https://github.com/golang/protobuf/)

协议编译器调用如下：

```sh
protoc --proto_path=IMPORT_PATH --cpp_out=DST_DIR --java_out=DST_DIR --python_out=DST_DIR --go_out=DST_DIR --ruby_out=DST_DIR --objc_out=DST_DIR --csharp_out=DST_DIR path/to/file.proto
```

- `IMPORT_PATH`指定`.proto`解析`import`指令时在其中查找文件的目录。如果省略，则使用当前目录。`--proto_path`多次传递该选项可以指定多个导入目录；他们将被按顺序搜索。`-I=_IMPORT_PATH_`可以用作 的简写形式`--proto_path`。

- 您可以提供一个或多个*输出指令*：

  - `--cpp_out`生成 C++ 代码`DST_DIR`。有关更多信息，请参阅[C++ 生成的代码参考](https://developers.google.com/protocol-buffers/docs/reference/cpp-generated)。
  - `--java_out`生成 Java 代码`DST_DIR`。有关更多信息，请参阅[Java 生成的代码参考](https://developers.google.com/protocol-buffers/docs/reference/java-generated)。
  - `--kotlin_out`在`DST_DIR`. 有关更多信息，请参阅[Kotlin 生成的代码参考](https://developers.google.com/protocol-buffers/docs/reference/kotlin-generated)。
  - `--python_out`生成 Python 代码`DST_DIR`。有关更多信息，请参阅[Python 生成的代码参考](https://developers.google.com/protocol-buffers/docs/reference/python-generated)。
  - `--go_out`生成 Go 代码`DST_DIR`。有关更多信息，请参阅[Go 生成的代码参考](https://developers.google.com/protocol-buffers/docs/reference/go-generated)。
  - `--ruby_out`生成 Ruby 代码`DST_DIR`。有关更多信息，请参阅[Ruby 生成的代码参考](https://developers.google.com/protocol-buffers/docs/reference/ruby-generated)。
  - `--objc_out`在`DST_DIR`. 有关更多信息，请参阅[Objective-C 生成的代码参考](https://developers.google.com/protocol-buffers/docs/reference/objective-c-generated)。
  - `--csharp_out`生成 C# 代码`DST_DIR`。有关更多信息，请参阅[C# 生成的代码参考](https://developers.google.com/protocol-buffers/docs/reference/csharp-generated)。
  - `--php_out`生成 PHP 代码`DST_DIR`。有关更多信息，请参阅[PHP 生成的代码参考](https://developers.google.com/protocol-buffers/docs/reference/php-generated)。

  作为额外的便利，如果以or`DST_DIR`结尾，编译器会将输出写入具有给定名称的单个 ZIP 格式存档文件。输出也将按照 Java JAR 规范的要求提供一个清单文件。请注意，如果输出存档已经存在，它将被覆盖；编译器不够聪明，无法将文件添加到现有存档中。`.zip``.jar``.jar`

- 您必须提供一个或多个`.proto`文件作为输入。`.proto`可以一次指定多个文件。尽管文件是相对于当前目录命名的，但每个文件都必须位于其中一个`IMPORT_PATH`s 中，以便编译器可以确定其规范名称。





## 参考

- https://developers.google.com/protocol-buffers/docs/proto3