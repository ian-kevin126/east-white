---
title: 5、编码
---

# 编码

- [一个简单的消息](https://developers.google.com/protocol-buffers/docs/encoding#simple)
- [Base 128 变种](https://developers.google.com/protocol-buffers/docs/encoding#varints)
- [消息结构](https://developers.google.com/protocol-buffers/docs/encoding#structure)
- [更多值类型](https://developers.google.com/protocol-buffers/docs/encoding#types)
- [嵌入式消息](https://developers.google.com/protocol-buffers/docs/encoding#embedded)
- [可选元素和重复元素](https://developers.google.com/protocol-buffers/docs/encoding#optional)
- [现场顺序](https://developers.google.com/protocol-buffers/docs/encoding#order)
- [精简参考卡](https://developers.google.com/protocol-buffers/docs/encoding#cheat-sheet)

本文档描述了协议缓冲区消息的二进制有线格式。您无需了解这一点即可在应用程序中使用协议缓冲区，但了解不同的协议缓冲区格式如何影响编码消息的大小会非常有用。如果您已经了解这些概念但想要参考，请跳至[精简参考卡](https://developers.google.com/protocol-buffers/docs/encoding#cheat-sheet)部分。

## 一、一个简单的消息

假设您有以下非常简单的消息定义：

```proto
message Test1 {
  optional int32 a = 1;
}
```

在应用程序中，您创建一条`Test1`消息并将其设置`a`为 150。然后将消息序列化为输出流。如果您能够检查编码的消息，您会看到三个字节：

```proto
08 96 01
```

到目前为止，如此之小和数字——但这意味着什么？继续阅读...

## 二、Base 128 变种

要了解您的简单协议缓冲区编码，您首先需要了解*varints*。Varints 是一种使用一个或多个字节序列化整数的方法。较小的数字占用较少的字节数。

varint 中的每个字节，除了最后一个字节，都设置了*最高有效位*(msb)——这表明还有更多字节要到来。每个字节的低 7 位用于存储以 7 位为一组的数字的二进制补码表示，**最低有效组在前**。

因此，例如，这里是数字 1——它是一个单字节，所以 msb 没有设置：

```proto
0000 0001
```

这里是 300——这有点复杂：

```proto
1010 1100 0000 0010
```

你怎么知道这是300？首先，您从每个字节中删除 msb，因为这只是告诉我们是否已经到达数字的末尾（如您所见，它设置在第一个字节中，因为 varint 中有多个字节） ：

```proto
 1010 1100 0000 0010
→ 010 1100  000 0010
```

您颠倒了两组 7 位，因为如您所记得的，varint 首先存储具有最低有效组的数字。然后将它们连接起来以获得最终值：

```proto
000 0010  010 1100
→  000 0010 ++ 010 1100
→  100101100
→  256 + 32 + 8 + 4 = 300
```

## 三、消息结构

如您所知，协议缓冲区消息是一系列键值对。消息的二进制版本只是使用字段的编号作为键——每个字段的名称和声明的类型只能在解码端通过引用消息类型的定义（即`.proto`文件）来确定。

当消息被编码时，键和值被连接成一个字节流。当消息被解码时，解析器需要能够跳过它无法识别的字段。这样，可以将新字段添加到消息中，而不会破坏不了解它们的旧程序。为此，有线格式消息中每一对的“键”实际上是两个值——`.proto`文件中的字段编号，加上提供足够信息来查找以下值的长度的*有线类型。*在大多数语言实现中，这个键被称为标签。

可用的电线类型如下：

| 类型 | 意义     | 用于                                                     |
| :--- | :------- | :------------------------------------------------------- |
| 0    | 瓦林特   | int32，int64，uint32，uint64，sint32，sint64，布尔，枚举 |
| 1    | 64 位    | 固定64，固定64，双                                       |
| 2    | 长度分隔 | 字符串、字节、嵌入消息、打包的重复字段                   |
| 3    | 开始组   | 组（已弃用）                                             |
| 4    | 结束组   | 组（已弃用）                                             |
| 5    | 32 位    | 固定32，固定32，浮动                                     |

流式消息中的每个键都是带有值的 varint `(field_number << 3) | wire_type`- 换句话说，数字的最后三位存储线路类型。

现在让我们再次看一下我们的简单示例。您现在知道流中的第一个数字始终是 varint 键，这里是 08，或者（删除 msb）：

```proto
000 1000
```

您取最后三位来获取线路类型 (0)，然后右移三位以获取字段编号 (1)。所以你现在知道字段号是 1，下面的值是一个 varint。使用上一节中的 varint 解码知识，您可以看到接下来的两个字节存储值 150。

```proto
96 01 = 1001 0110  0000 0001
       → 000 0001  ++  001 0110 (drop the msb and reverse the groups of 7 bits)
       → 10010110
       → 128 + 16 + 4 + 2 = 150
```

## 四、更多值类型

### 1、有符号整数

正如您在上一节中看到的，与线类型 0 关联的所有协议缓冲区类型都被编码为 varint。但是，在编码负数时，带符号的 int 类型（ `sint32`and `sint64`）和“标准” int 类型（`int32`and ）之间存在重要区别。`int64`如果使用`int32`or`int64`作为负数的类型，则生成的 varint*始终为 10 个字节长*——实际上，它被视为一个非常大的无符号整数。如果您使用其中一种有符号类型，则生成的 varint 将使用 ZigZag 编码，这种编码效率更高。

ZigZag 编码将有符号整数映射到无符号整数，因此具有较小*绝对值*（例如，-1）的数字也具有较小的 varint 编码值。它以一种通过正整数和负整数来回“曲折”的方式来执行此操作，因此 -1 被编码为 1，1 被编码为 2，-2 被编码为 3，依此类推，就像你可以在下表中看到：

| 签名原件    | 编码为     |
| :---------- | :--------- |
| 0           | 0          |
| -1          | 1          |
| 1           | 2          |
| -2          | 3          |
| 2147483647  | 4294967294 |
| -2147483648 | 4294967295 |

换句话说，每个值`n`都使用编码

```
(n << 1) ^ (n >> 31)
```

对于`sint32`s，或

```
(n << 1) ^ (n >> 63)
```

对于 64 位版本。

请注意，第二个移位 -`(n >> 31)`部分 - 是算术移位。因此，换句话说，移位的结果要么是一个全为零的数字（如果`n`是正数），要么是全为一的数字（如果`n`是负数）。

当`sint32`or`sint64`被解析时，它的值被解码回原始的签名版本。

### 2、非变数

非 varint 数值类型很简单——`double`并且`fixed64`具有连线类型 1，它告诉解析器期待一个固定的 64 位数据块；类似地`float`并且`fixed32`具有线类型 5，它告诉它期望 32 位。在这两种情况下，值都以 little-endian 字节顺序存储。

### 3、字符串

线路类型 2（长度分隔）表示该值是一个 varint 编码长度，后跟指定的数据字节数。

```proto
message Test2 {
  optional string b = 2;
}
```

将 b 的值设置为“testing”可以为您提供：

```proto
12 07 [74 65 73 74 69 6e 67]
```

[括号]中的字节是“测试”的UTF8。这里的关键是 0x12。它被解析：

```proto
0x12
→ 0001 0010  (binary representation)
→ 00010 010  (regroup bits)
→ field_number = 2, wire_type = 2
```

值中的长度 varint 为 7，其后的七个字节是字符串。

## 五、嵌入式消息

这是一个包含我们示例类型 Test1 的嵌入式消息的消息定义：

```proto
message Test3 {
  optional Test1 c = 3;
}
```

这是编码版本，Test1 的`a`字段再次设置为 150：

```proto
 1a 03 08 96 01
```

如您所见，最后三个字节与我们的第一个示例 ( ) 完全相同`08 96 01`，并且它们前面是数字 3 - 嵌入消息的处理方式与字符串完全相同（wire type = 2）。

## 六、可选元素和重复元素

如果 proto2 消息定义包含`repeated`元素（没有`[packed=true]`选项），则编码消息具有零个或多个具有相同字段编号的键值对。这些重复值不必连续出现；它们可能与其他字段交错。解析时会保留元素相对于彼此的顺序，尽管相对于其他字段的顺序会丢失。在 proto3 中，重复字段使用[打包编码](https://developers.google.com/protocol-buffers/docs/encoding#packed)，您可以在下面阅读。

对于 proto3 中的任何非重复字段或`optional`proto2 中的字段，编码的消息可能具有也可能没有具有该字段编号的键值对。

通常，编码消息永远不会有多个非重复字段的实例。但是，解析器应该处理它们所做的情况。对于数字类型和字符串，如果同一个字段出现多次，解析器接受它看到的*最后一个值。*对于嵌入的消息字段，解析器合并同一字段的多个实例，就像使用`Message::MergeFrom`方法一样——即后一个实例中的所有奇异标量字段替换前者，合并单个嵌入消息，并连接重复的字段。这些规则的效果是，解析两个编码消息的连接会产生完全相同的结果，就像您分别解析两个消息并合并结果对象一样。也就是说，这个：

```proto
MyMessage message;
message.ParseFromString(str1 + str2);
```

相当于：

```proto
MyMessage message, message2;
message.ParseFromString(str1);
message2.ParseFromString(str2);
message.MergeFrom(message2);
```

此属性有时很有用，因为它允许您合并两条消息，即使您不知道它们的类型。

### 打包的重复字段

版本 2.1.0 引入了打包的重复字段，在 proto2 中被声明为重复字段，但带有特殊`[packed=true]`选项。在 proto3 中，默认情况下会打包标量数字类型的重复字段。这些功能类似于重复字段，但编码不同。包含零个元素的压缩重复字段不会出现在编码消息中。否则，该字段的所有元素都将被打包到一个键值对中，其中有线类型为 2（长度分隔）。每个元素的编码方式与正常情况相同，只是前面没有键。

例如，假设您有消息类型：

```proto
message Test4 {
  repeated int32 d = 4 [packed=true];
}
```

现在假设您构造 a `Test4`，为重复字段提供值 3、270 和 86942 `d`。然后，编码形式将是：

```proto
22        // key (field number 4, wire type 2)
06        // payload size (6 bytes)
03        // first element (varint 3)
8E 02     // second element (varint 270)
9E A7 05  // third element (varint 86942)
```

只有原始数字类型（使用 varint、32 位或 64 位连线类型的类型）的重复字段才能被声明为“打包”。

请注意，尽管通常没有理由为打包的重复字段编码多个键值对，但解析器必须准备好接受多个键值对。在这种情况下，应连接有效载荷。每对必须包含整数个元素。

协议缓冲区解析器必须能够解析被编译的重复字段，就`packed`好像它们没有被打包一样，反之亦然。这允许`[packed=true]`以向前和向后兼容的方式添加到现有字段。

## 七、Field Order

字段编号可以在`.proto`文件中以任何顺序使用。选择的顺序对消息的序列化方式没有影响。

[当消息被序列化时，其已知或未知字段](https://developers.google.com/protocol-buffers/docs/proto#updating)的写入方式没有保证的顺序。序列化顺序是一个实现细节，任何特定实现的细节都可能在未来发生变化。因此，协议缓冲区解析器必须能够以任何顺序解析字段。

### Implication

- 不要假设序列化消息的字节输出是稳定的。对于具有表示其他序列化协议缓冲区消息的传递字节字段的消息尤其如此。

- 默认情况下，在同一协议缓冲区消息实例上重复调用序列化方法可能不会产生相同的字节输出。也就是说，默认序列化不是确定性的。

  - 确定性序列化仅保证特定二进制文件的相同字节输出。字节输出可能会在不同版本的二进制文件中发生变化。

- 对于协议缓冲区消息实例，以下检查可能会失败

  ```
  foo
  ```

  ：

  - `foo.SerializeAsString() == foo.SerializeAsString()`
  - `Hash(foo.SerializeAsString()) == Hash(foo.SerializeAsString())`
  - `CRC(foo.SerializeAsString()) == CRC(foo.SerializeAsString())`
  - `FingerPrint(foo.SerializeAsString()) == FingerPrint(foo.SerializeAsString())`

- 以下是一些逻辑上等效的协议缓冲区消息的示例场景，

  ```
  foo
  ```

  并且

  ```
  bar
  ```

  可能会序列化为不同的字节输出：

  - `bar`由将某些字段视为未知的旧服务器序列化。
  - `bar`由以不同编程语言实现并以不同顺序序列化字段的服务器进行序列化。
  - `bar`具有以非确定性方式序列化的字段。
  - `bar`有一个字段存储协议缓冲区消息的序列化字节输出，该消息以不同的方式序列化。
  - `bar`由一个新服务器序列化，该服务器由于实现更改而以不同的顺序序列化字段。
  - `foo`并且`bar`是相同的单个消息以不同顺序的串联。

## 八、精简参考卡

以下以易于参考的格式提供了线路格式中最突出的部分。

```
message   := (tag value)*     You can think of this as “key value”

tag       := (field << 3) BIT_OR wire_type, encoded as varint
value     := (varint|zigzag) for wire_type==0 |
             fixed32bit      for wire_type==5 |
             fixed64bit      for wire_type==1 |
             delimited       for wire_type==2 |
             group_start     for wire_type==3 | This is like “open parenthesis”
             group_end       for wire_type==4   This is like “close parenthesis”

varint       := int32 | int64 | uint32 | uint64 | bool | enum, encoded as
                varints
zigzag       := sint32 | sint64, encoded as zig-zag varints
fixed32bit   := sfixed32 | fixed32 | float, encoded as 4-byte little-endian;
                memcpy of the equivalent C types (u?int32_t, float)
fixed64bit   := sfixed64 | fixed64 | double, encoded as 8-byte little-endian;
                memcpy of the equivalent C types (u?int64_t, double)

delimited := size (message | string | bytes | packed), size encoded as varint
message   := valid protobuf sub-message
string    := valid UTF-8 string (often simply ASCII); max 2GB of bytes
bytes     := any sequence of 8-bit bytes; max 2GB
packed    := varint* | fixed32bit* | fixed64bit*,
             consecutive values of the type described in the protocol definition

varint encoding: sets MSB of 8-bit byte to indicate “no more bytes”
zigzag encoding: sint32 and sint64 types use zigzag encoding.
```

### 钥匙

- `message := (tag value)*`

  消息被编码为零个或多个标签和值对的序列。

- `tag := (field << 3) BIT_OR wire_type, encoded as varint`

  标记是`wire_type`存储在最低有效三位中的 a 和`.proto`文件中定义的字段编号的组合。

- `value := varint for wire_type==0, fixed32 for wire_type==5, ...`

  `wire_type`根据标签中的指定，值的存储方式不同。

- `varint := int32 | int64 | uint32 | uint64 | sint32 | sint64 | bool | enum`

  您可以使用 varint 存储任何列出的数据类型。

- `fixed32 := int32 | uint32 | float`

  您可以使用 fixed32 来存储任何列出的数据类型。

- `fixed64 := int64 | uint64 | double`

  您可以使用 fixed64 存储任何列出的数据类型。

- `delimited := size (message | string | bytes | packed)`

  分隔值存储为大小，编码为 varint，然后是列出的数据类型之一。

- `message := valid protobuf sub-message`

  消息数据类型存储一条消息，然后可以将其存储在另一条消息中。

- `string := valid UTF-8 string, or sequence of 7-bit ASCII bytes; max 2GB`

  如前所述，字符串必须使用 UTF-8 字符编码。一个字符串不能超过 2GB。

- `bytes := any sequence of 8-bit bytes; max 2GB`

  如上所述，字节可以存储自定义数据类型，最大为 2GB。

- `packed := varint* | fixed32* | fixed64*`

  `packed`当您存储协议定义中描述的类型的连续值时，请使用数据类型。标记在第一个之后的值被丢弃，这提高了协议缓冲区的效率。

- `varint encoding: uses MSB of 8-bit byte to indicate “no more bytes”`

  有关如何序列化 varint 的更多信息，请参阅前面的部分[Base 128 Varints 。](https://developers.google.com/protocol-buffers/docs/encoding#varints)

- `zigzag encoding: sint32 and sint64 types use zigzag encoding`

  `sint32`和类型使用 zigzag 编码，以便用小序列`sint64`表示小的负数。`varint`有关 zigzag 编码的更多信息，请参阅前面的有[符号整数](https://developers.google.com/protocol-buffers/docs/encoding#signed-ints)部分。



## 参考

- https://developers.google.com/protocol-buffers/docs/encoding