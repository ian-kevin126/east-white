---
title: 6、技术
---

# 技术

- [流式传输多条消息](https://developers.google.com/protocol-buffers/docs/techniques#streaming)
- [大型数据集](https://developers.google.com/protocol-buffers/docs/techniques#large-data)
- [自描述消息](https://developers.google.com/protocol-buffers/docs/techniques#self-description)

本页描述了一些常用的处理协议缓冲区的设计模式。您还可以将设计和使用问题发送到[Protocol Buffers 讨论组](http://groups.google.com/group/protobuf)。

## 一、流式传输多条消息

如果您想将多条消息写入单个文件或流，则由您来跟踪一条消息的结束位置和下一条消息的开始位置。协议缓冲区有线格式不是自定界的，因此协议缓冲区解析器无法自行确定消息的结束位置。解决此问题的最简单方法是在编写消息本身之前写入每条消息的大小。当您读回消息时，您读取大小，然后将字节读入单独的缓冲区，然后从该缓冲区解析。（如果您想避免将字节复制到单独的缓冲区，请查看`CodedInputStream`可以被告知将读取限制为特定字节数的类（在 C++ 和 Java 中）。）

## 二、大型数据集

协议缓冲区不是为处理大消息而设计的。作为一般经验法则，如果您要处理的消息均大于 1 兆字节，则可能是时候考虑另一种策略了。

也就是说，Protocol Buffers 非常适合处理大型数据集中的*单个消息。*通常，大型数据集是小块的集合，其中每个小块都是结构化数据。尽管 Protocol Buffers 不能一次处理整个集合，但使用 Protocol Buffers 对每个部分进行编码可以大大简化您的问题：现在您所需要的只是处理一组字节字符串而不是一组结构。

Protocol Buffers 不包括对大型数据集的任何内置支持，因为不同的情况需要不同的解决方案。有时一个简单的记录列表就可以了，而其他时候你想要一个更像数据库的东西。每个解决方案都应该作为一个单独的库来开发，这样只有需要它的人才需要付费。

## 三、自描述消息

协议缓冲区不包含对其自身类型的描述。因此，仅给定原始消息而没有定义其类型的相应`.proto`文件，很难提取任何有用的数据。

但是，.proto 文件的内容本身可以使用协议缓冲区来表示。源代码包中的文件`src/google/protobuf/descriptor.proto`定义了所涉及的消息类型。`protoc`可以输出一个`FileDescriptorSet`- 代表一组 .proto 文件 - 使用该`--descriptor_set_out`选项。有了这个，你可以像这样定义一个自描述协议消息：

```proto
syntax = "proto3";

import "google/protobuf/any.proto";
import "google/protobuf/descriptor.proto";

message SelfDescribingMessage {
  // Set of FileDescriptorProtos which describe the type and its dependencies.
  google.protobuf.FileDescriptorSet descriptor_set = 1;

  // The message and its type, encoded as an Any message.
  google.protobuf.Any message = 2;
}
```

通过使用类`DynamicMessage`（在 C++ 和 Java 中可用），您可以编写可以操作`SelfDescribingMessage`s 的工具。

综上所述，Protocol Buffer 库中未包含此功能的原因是我们从未在 Google 内部使用过它。

该技术需要支持使用描述符的动态消息。在使用自描述消息之前，请检查您的平台是否支持此功能。



## 参考

- https://developers.google.com/protocol-buffers/docs/techniques