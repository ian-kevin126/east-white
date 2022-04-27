---
title: 3.日志管理
date: 2022-04-27
---

# 日志管理

## 一、`Zap`

### 1、`Zap`简介

一个非常快的功能强大日志管理模块：[Zap官网](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fuber-go%2Fzap)

日志:

1. 把日志按照每天和日志等级输出到指定位置
2. 在控制台可以看到
3. 获取到 `http` 请响应的存放在日志( `GinLogger` 中间件)
4. 服务器宕机时可以把记录异常信息( `GinRecovery ` 中间件)

### 2、安装

```go
go get -u go.uber.org/zap
```

### 3、使用Zap

#### 1）初始化路由

`router/user.go`

```go
package router

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func UserRouter(Router *gin.RouterGroup) {
	UserRouter := Router.Group("user")
	{
		UserRouter.GET("list", func(ctx *gin.Context) {
			ctx.JSON(http.StatusOK, gin.H{
				"code": 200,
				"msg":  "success",
			})
		})
	}
}
```

`initialize/router.go`

```go
package initialize

import (
	"din_practice/router"
	"github.com/gin-gonic/gin"
)

func Routers() *gin.Engine {
	Router := gin.Default()

	// 路由分组：可以固定请求的前缀
	ApiGroup := Router.Group("/v1/")
	router.UserRouter(ApiGroup)

	return Router
}
```

在 `main.go` 中添加：

```go
package main

import (
	"din_practice/global"
	"din_practice/initialize"
	"fmt"
	"github.com/fatih/color"
	"go.uber.org/zap"
)

func main() {
	// 1，初始化yaml配置
	initialize.InitConfig()

	// 2，初始化路由配置
	Router := initialize.Routers()

	color.Cyan("go-gin服务开始了")

	// 启动gin，并配置端口，global.Settings.Port是yaml配置的端口
	err := Router.Run(fmt.Sprintf(":%d", global.Settings.Port))

	if err != nil {
		zap.L().Info("This is hello fun: ", zap.String("error", "启动错误！"))
	}
}
```

#### 2）初始化logger

编写获取年月日的方法函数：`utils/utils.go`

```go
package utils

import (
	"fmt"
	"time"
)

// GetNowFormatTodayTime 获取当天年月日
func GetNowFormatTodayTime() string {
	now := time.Now()

	dateStr := fmt.Sprintf("%02d-%02d-%02d", now.Year(), int(now.Month()),
		now.Day())

	return dateStr
}
```

在全局变量中添加Lg变量：`global/globalVar.go`

```go
package global

import (
	"din_practice/config"
	"go.uber.org/zap"
)

var (
	Settings config.ServerConfig
	Lg       *zap.Logger
)
```

初始化logger：`initialize/logger.go`

```go
package initialize

import (
	"din_practice/global"
	"din_practice/utils"
	"fmt"
	"go.uber.org/zap"
)

// InitLogger 初始化logger
func InitLogger() {
	// 实例化Zap配置
	conf := zap.NewDevelopmentConfig()
	// 注意global.Settings.LogsAddress是在settings-dev.yaml配置过的
	// 配置日志的输出地址
	conf.OutputPaths = []string{
		fmt.Sprintf("%slog_%s.log", global.Settings.LogsAddress, utils.GetNowFormatTodayTime()), //
		"stdout",
	}

	// 创建logger实例
	logg, _ := conf.Build()

	// 替换zap包中全局的logger实例，后续在其他包中只需要使用zap.L()调用即可
	zap.ReplaceGlobals(logg)
	// 注册到全局变量中
	global.Lg = logg
}
```

### 4、日志中间件

#### 1）了解中间件

![image-20220427141717383](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427141717383.png)

我们在中间件做一层拦截,吧resonse异常的记录下来，我还发现了一个好文章，感兴趣的可以顺着学下大概怎么使用。[juejin.cn/post/684490…](https://juejin.cn/post/6844904061469196301)

#### 2）使用中间件logger记录http异常状态

`middlewares/logger.go`

```go
package middlewares

import (
	"din_practice/global"
	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
	"net"
	"net/http"
	"net/http/httputil"
	"os"
	"runtime/debug"
	"strings"
	"time"
)

// GinLogger 接收gin框架默认的日志
func GinLogger() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		start := time.Now()
		// 请求路径
		path := ctx.Request.URL.Path
		// 请求参数
		query := ctx.Request.URL.RawQuery

		ctx.Next()

		cost := time.Since(start)

		// 若response的状态码不是200，则为异常
		if ctx.Writer.Status() != 200 {
			// 记录异常信息
			zap.L().Info(
				path,
				zap.Int("status: ", ctx.Writer.Status()),
				zap.String("method: ", ctx.Request.Method),
				zap.String("path: ", path),
				zap.String("query: ", query),
				zap.String("ip: ", ctx.ClientIP()),
				zap.String("user-agent: ", ctx.Request.UserAgent()),
				zap.String("errors: ", ctx.Errors.ByType(gin.ErrorTypePrivate).String()),
				zap.Duration("cost: ", cost),
			)
		}
	}
}

// GinRecovery 中间件，记录宕机异常信息
// GinRecovery recover掉项目可能出现的panic，并使用zap记录相关日志
func GinRecovery(stack bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				// Check for a broken connection, as it is not really a
				// condition that warrants a panic stack trace.
				var brokenPipe bool
				if ne, ok := err.(*net.OpError); ok {
					if se, ok := ne.Err.(*os.SyscallError); ok {
						if strings.Contains(strings.ToLower(se.Error()), "broken pipe") || strings.Contains(strings.ToLower(se.Error()), "connection reset by peer") {
							brokenPipe = true
						}
					}
				}

				httpRequest, _ := httputil.DumpRequest(c.Request, false)
				if brokenPipe {
					global.Lg.Error(c.Request.URL.Path,
						zap.Any("error", err),
						zap.String("request", string(httpRequest)),
					)
					// If the connection is dead, we can't write a status to it.
					c.Error(err.(error)) // nolint: errcheck
					c.Abort()
					return
				}

				if stack {
					zap.L().Error("[Recovery from panic]",
						zap.Any("error", err),
						zap.String("request", string(httpRequest)),
						zap.String("stack", string(debug.Stack())),
					)
				} else {
					zap.L().Error("[Recovery from panic]",
						zap.Any("error", err),
						zap.String("request", string(httpRequest)),
					)
				}
				c.AbortWithStatus(http.StatusInternalServerError)
			}
		}()
		c.Next()
	}
}
```

#### 3）使用中间件

在`main.go`中初始化Zap并添加中间件。

##### ① 在`main.go`中初始化中间件

```go
package main

import (
	"din_practice/global"
	"din_practice/initialize"
	"fmt"
	"github.com/fatih/color"
	"go.uber.org/zap"
)

func main() {
	// 1，初始化yaml配置
	initialize.InitConfig()

	// 2，初始化路由配置
	Router := initialize.Routers()

	// 3，初始化日志信息
	initialize.InitLogger()

	color.Cyan("go-gin服务开始了")

	// 启动gin，并配置端口，global.Settings.Port是yaml配置的端口
	err := Router.Run(fmt.Sprintf(":%d", global.Settings.Port))

	if err != nil {
		zap.L().Info("This is hello fun: ", zap.String("error", "启动错误！"))
	}
}
```

##### ② 在`initialize/router.go`中加入中间件

```go
package initialize

import (
	"din_practice/middlewares"
	"din_practice/router"
	"github.com/gin-gonic/gin"
)

func Routers() *gin.Engine {
	Router := gin.Default()

	// 添加日志中间件
	Router.Use(middlewares.GinLogger(), middlewares.GinRecovery(true))

	// 路由分组：可以固定请求的前缀
	ApiGroup := Router.Group("/v1/")
	router.UserRouter(ApiGroup)

	return Router
}
```







## 参考

- [10篇带你手摸手封装gin框架(3)-Zap日志管理](https://juejin.cn/post/6971217119379718175/)
