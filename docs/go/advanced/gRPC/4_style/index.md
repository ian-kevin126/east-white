---
title: 4、风格指南
---

# 风格指南

本文档提供了文件的样式指南`.proto`。通过遵循这些约定，您将使您的协议缓冲区消息定义及其相应的类一致且易于阅读。

请注意，协议缓冲区样式随着时间的推移而发展，因此您很可能会看到`.proto`以不同约定或样式编写的文件。修改这些文件时请尊重现有样式。**一致性是关键**。但是，最好在创建新`.proto`文件时采用当前最佳样式。

## 一、标准文件格式

- 保持行长为 80 个字符。
- 使用 2 个空格的缩进。
- 更喜欢对字符串使用双引号。

## 二、文件结构

文件应该命名`lower_snake_case.proto`

所有文件应按以下方式排序：

1. 许可证标题（如果适用）
2. 文件概览
3. 句法
4. 包裹
5. 进口（排序）
6. 文件选项
7. 其他一切



1. License header (if applicable)
2. File overview
3. Syntax
4. Package
5. Imports (sorted)
6. File options
7. Everything else

## 三、packages

包名应该是小写的。包名称应具有基于项目名称的唯一名称，并且可能基于包含协议缓冲区类型定义的文件的路径。

## 四、message和字段名称

使用 CamelCase（首字母大写）作为消息名称 - 例如，`SongServerRequest`. 使用 underscore_separated_names 作为字段名称（包括 oneof 字段和扩展名）——例如，`song_name`.

```
message SongServerRequest {
  optional string song_name = 1;
}
```

对字段名称使用此命名约定可为您提供如下访问器：

```
C++:
  const string& song_name() { ... }
  void set_song_name(const string& x) { ... }

Java:
  public String getSongName() { ... }
  public Builder setSongName(String v) { ... }
```

如果您的字段名称包含数字，则该数字应出现在字母之后而不是下划线之后。例如，使用`song_name1`代替`song_name_1`

## 五、重复字段

对重复的字段使用复数名称。

```
  repeated string keys = 1;
  ...
  repeated MyMessage accounts = 17;
```

## 六、枚举

枚举类型名称使用 CamelCase（首字母大写），值名称使用 CAPITALS_WITH_UNDERSCORES：

```
enum FooBar {
  FOO_BAR_UNSPECIFIED = 0;
  FOO_BAR_FIRST_VALUE = 1;
  FOO_BAR_SECOND_VALUE = 2;
}
```

每个枚举值都应该以分号结尾，而不是逗号。更喜欢为枚举值添加前缀，而不是将它们包围在封闭的消息中。零值枚举应该有后缀`UNSPECIFIED`。

## 7、服务

如果您`.proto`定义了一个 RPC 服务，您应该使用 CamelCase（首字母大写）作为服务名称和任何 RPC 方法名称：

```
service FooService {
  rpc GetSomething(GetSomethingRequest) returns (GetSomethingResponse);
  rpc ListSomething(ListSomethingRequest) returns (ListSomethingResponse);
}
```

## 八、要避免的事情

- 必填字段（仅适用于 proto2）
- 组（仅适用于 proto2）



## 参考：

- https://developers.google.com/protocol-buffers/docs/style