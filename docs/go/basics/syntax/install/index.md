---
title: 安装
author: ian_kevin
date: 2022-04-19
---

# 安装

## 一、Go安装

- [Windows用户配置环境](https://www.cnblogs.com/GreenForestQuan/p/14411115.html)
- [Mac用户配置Go环境](https://juejin.cn/post/6950558763539496991)

## 二、GOPATH

### 1、个人开发者

源代码一般放在 GOPATH 的src目录下，可以按照下图来组织我们的代码：

![](https://www.topgoer.com/static/2/5.png)

(图片来自：www.topgoer.com)

### 2、目前流行的项目结构

Go语言中也是通过包来组织代码文件，我们可以引用别人的包也可以发布自己的包，但是为了防止不同包的项目名冲突，我们通常使用顶级域名来作为包名的前缀，这样就不担心项目名冲突的问题了。

因为不是每个个人开发者都拥有自己的顶级域名，所以目前流行的方式是使用个人的github用户名来区分不同的包。

![GO目录结构](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/6.png)

举个例子：张三和李四都有一个名叫studygo的项目，那么这两个包的路径就会是：

```go
import "github.com/zhangsan/studygo"
```

和

```go
import "github.com/lisi/studygo"
```

以后我们从`github`上下载别人包的时候，如：

```go
go get github.com/jmoiron/sqlx
```

那么，这个包会下载到我们本地`GOPATH`目录下的`src/github.com/jmoiron/sqlx`。

### 3、适合企业开发者

![GO目录结构](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/7.png)

## 三、Git安装

- [git安装](https://www.topgoer.com/%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83/Git%E5%AE%89%E8%A3%85.html)