---
title: 1.开篇
date: 2022-04-27
---

# 开篇

`Gin`作为`Go`语言中最为流行的web框架，是每一个`Go`语言入门者很有必要去学习的一个框架。`Gin`和`Koa`一样，都是小而美的框架，优点是自由度很高，缺点就是不能拿来就用，需要我们自己去做一些“二次封装”，完成从项目的规范、目录、配置管理、日志、数据库等后端项目生态的设计，然后才能运用到真是的业务场景里去。

这里学习了掘金社区里非常好的一个系列文章 [【10篇带你手摸手封装Gin框架】](https://juejin.cn/post/6970678168860491784)，作者是[作曲家种太阳](https://juejin.cn/post/6970678168860491784)。

当然，学习是永无止境的，永远也没有绝对的最好，只有更好，学习模仿只是第一步，我会在此基础上不断完善项目。



## 一、基础

### 1、技术选型

| 技术点      | 概要                  |
| ----------- | --------------------- |
| `gin`       | go中最流行的web框架   |
| `zap`       | 日志管理器            |
| `viper`     | 配置管理器            |
| `gorm`      | go中最流行的`orm`框架 |
| `mysql`     | 数据库                |
| `jwt`       | 身份认证              |
| `minio`     | 静态资源服务器        |
| `redis`     | 数据库                |
| `validator` | 字段校验器            |
| `color`     | 终端彩色显示          |

### 2、目录结构

![image-20220427110349663](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427110349663.png)

从上到下目录结构为:

| 文件               | 概要                                  |
| ------------------ | ------------------------------------- |
| `config`           | 配置文件对应的结构体定义              |
| `controller`       | 业务层                                |
| `dao`              | 操作数据库,给业务`controller`提供数据 |
| `forms`            | 字段验证的`struct`                    |
| `global`           | 定义全局变量                          |
| `initialize`       | 服务初始化                            |
| `logs`             | 日志存储                              |
| `middlewares`      | 中间件                                |
| `models`           | 数据库字段定义                        |
| `Response`         | 统一封装`response`                    |
| `static`           | 资源文件夹                            |
| `router`           | 路由                                  |
| `setting-dev.yaml` | 配置文件                              |
| main.go            | 服务启动文件                          |

### 3、初始化项目

先初始化模块管理文件：

```go
go mod init gin_practice
```

就会在根目录下生成一个`go.mod`文件，用来管理我们本项目使用的各种包。



然后再拉取我们本项目使用到的核心包：gin

```go
go get -u github.com/gin-gonic/gin
```



最后，在根目录下新建项目的唯一入口文件 `main.go`，编写第一个能运行的简单接口程序：

```go
package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	engin := gin.Default()

	engin.GET("/test", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 200,
			"msg":  "success",
		})
	})

	engin.Run() // 默认监听8080端口
}
```

启动项目，如果在控制台打印如下日志，说明项目启动成功：

![image-20220427112008100](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427112008100.png)

打开浏览器，输入：http://localhost:8080/test，如果出现如下的结果，说明接口编写成功。

![image-20220427112115378](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427112115378.png)





## 参考

- [10篇带你手摸手封装gin框架(1)-开篇与架构设计](https://link.juejin.cn/?target=url)
