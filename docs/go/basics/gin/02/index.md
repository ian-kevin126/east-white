---
title: 2.配置管理
date: 2022-04-27
---

# 配置管理

## 一、`Viper`

### 1、`Viper`介绍

**`Viper`**[（Viper官方地址）](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fspf13%2Fviper)是适用于`Go`应用程序的**完整配置解决方案**。它被设计用于在应用程序中工作，并且可以处理所有类型的配置需求和格式。它支持以下特性：

1. • 设置默认值
2. • 从`JSON、TOML、YAML、HCL、envfile`和`Java properties`格式的配置文件读取配置信息
3. • 实时监控和重新读取配置文件（可选）
4. • 从环境变量中读取
5. • 从远程配置系统（`etcd`或`Consul`）读取并监控配置变化
6. • 从命令行参数读取配置
7. • 从`buffer`读取配置
8. • 显式配置值

### 2、安装

```go
go get github.com/spf13/viper
// 日志美化
go get github.com/fatih/color
```

### 3、需求分析

服务需要的配置：

1. 存放日志目录路径(`logAddress`)
2. 服务名称(`name`)
3. 服务端口号(`port`)
4. `mysql`的端口号(`port`)和地址(`host`)

### 4、解析原理

在写代码之前，我们得搞懂`settings-dev.yaml`到`viper`识别，然后到各个文件中，是怎么样的一个过程：

![image-20220427112957755](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427112957755.png)

### 5、编写`settings-dev.yaml`文件

```yaml
name: "gin-practice"
port: 8022
logsAddress: "./logs/"

mysql:
  name: "root"
  host: "localhost"
  port: 3306
  password: "123456"
  dbName: "gin_demo"

redis:
  host: "localhost"
  port: 6379
```

### 6、定义配置对应的struct

`viper`会把`yaml`中的配置解析到对应的结构体：

文件位置：`config/config.go`

```go
package config

type ServerConfig struct {
	Name        string      `mapstructure:"name"`
	Port        int         `mapstructure:"port"`
	LogsAddress string      `mapstructure:"logsAddress"`
	MysqlInfo   MysqlConfig `mapstructure:"mysql"`
	RedisInfo   RedisConfig `mapstructure:"redis"`
}

type MysqlConfig struct {
	Host     string `mapstructure:"host"`
	Port     int    `mapstructure:"port"`
	Name     string `mapstructure:"name"`
	Password string `mapstructure:"password"`
	DBName   string `mapstructure:"dbName"`
}

type RedisConfig struct {
	Host string `mapstructure:"host"`
	Port int    `mapstructure:"port"`
}
```

> 需要注意的是：`settings-dev.yaml`每个字段名和结构体的tag一一对应。

### 7、使用`Viper`处理`yaml`配置

在`initialize/config.go`中：

```go
package initialize

import (
	"din_practice/config"
	"din_practice/global"
	"github.com/fatih/color"
	"github.com/spf13/viper"
)

func InitConfig() {
	// 实例化viper
	v := viper.New()

	// 设置文件的路径
	v.SetConfigFile("./settings-dev.yaml")

	if err := v.ReadInConfig(); err != nil {
		panic(err)
	}

	serverConfig := config.ServerConfig{}

	// 给serverConfig初始值
	if err := v.Unmarshal(&serverConfig); err != nil {
		panic(err)
	}

	// 传递给全局变量
	global.Settings = serverConfig
	color.Blue("settings-dev: ", global.Settings.LogsAddress)
}
```

### 8、将`settings`放在全局实例

`global`模块的作用是存储各功能模块解析出来的数据，这样每个项目中的go文件都可以非常便捷地引用`global`中的配置数据。

文件位置：`global/globalVar.go`

```go
package global

import "din_practice/config"

var (
	Settings config.ServerConfig
)
```

然后在`main.go`中使用：

```go
package main

import (
	"din_practice/global"
	"din_practice/initialize"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	// 1，初始化yaml配置
	initialize.InitConfig()

	engin := gin.Default()

	engin.GET("/test", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"code": 200,
			"msg":  "success",
		})
	})

	// 将监听端口改为settings-dev.yaml中的8022
	engin.Run(fmt.Sprintf(":%d", global.Settings.Port))
}
```





## 参考

- [10篇带你手摸手封装gin框架(2)-Viper配置管理](https://juejin.cn/post/6970851434531291172)



















