---
title: 9.常用中间件开发
date: 2022-04-27
---

# 常用中间件开发

## 一、 中间件介绍

之前在 `Zap`日志管理章节了解过了中间件，并编写了记录`http`异常的日志中间件
这里有几篇文章讲的非常好:

- [Go Web轻量级框架Gin学习系列：中间件使用详解](https://juejin.cn/post/6844904119249944583)
- [Gin框架系列03：换个姿势理解中间件](https://juejin.cn/post/6844903833164857358)

![image-20220427141717383](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427141717383-20220428103431126.png)

对中间件的理解: 

- 类似于`koa`的洋葱模型，`Django`的钩子函数,前端的生命周期 
- 在请求接口前或者后做一些逻辑出来 

中间件几个关键字: 

1. `c.Next()` 进入下一个中间件 
2. `c.Abort()` 中断中间件(`return` 不能中断中间件的调用)

## 二、中间件开发

- 跨域中间件 : 后端开启跨域功能 
- 权限认证中间件: 判断用户的角色以及是否有权限

### 1、跨域介绍

跨域指的是浏览器不能执行其他网站的脚本。它是由浏览器的同源策略造成的，是浏览器对`javascript`施加的安全限制。 

> 浏览器在什么情况下会发起options预检请求？ 
> 在非简单请求且跨域的情况下，浏览器会发起options预检请求。 `Preflighted Requests` 是`CORS`中一种透明服务器验证机制。预检请求首先需要向另外一个域名的资源发送一个 `HTTP` `OPTIONS` 请求头，其目的就是为了判断实际发送的请求是否是安全的。

#### 1）跨域中间开发

在 `middlewares/cors.go` 中编写

```go

package middlewares

import (
  "github.com/gin-gonic/gin"
  "net/http"
)

func Cors() gin.HandlerFunc {
  return func(c *gin.Context) {
    method := c.Request.Method

    c.Header("Access-Control-Allow-Origin", "*")
    c.Header("Access-Control-Allow-Headers", "Content-Type,AccessToken,X-CSRF-Token, Authorization, Token, x-token")
    c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PATCH, PUT")
    c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Content-Type")
    c.Header("Access-Control-Allow-Credentials", "true")

    if method == "OPTIONS" {
      c.AbortWithStatus(http.StatusNoContent)
    }
  }
}
```

- 主要是返回的`Response`添加了约定的请求头
- 请求方式如果是`OPTIONS`直接返回204

#### 2）使用跨域中间件

在 `initialize/router.go` 的 `Router` 函数加入

```go
package initialize

import (
	"gin_practice/middlewares"
	"gin_practice/router"
	"github.com/gin-gonic/gin"
)

func Routers() *gin.Engine {
	Router := gin.Default()

	// 添加日志中间件
	Router.Use(middlewares.GinLogger(), middlewares.GinRecovery(true))

	// 路由分组：可以固定请求的前缀
	ApiGroup := Router.Group("/v1/")

	// 设置跨域中间件
	Router.Use(middlewares.Cors())

	router.UserRouter(ApiGroup)

	// base路由
	router.InitBaseRouter(ApiGroup)

	return Router
}
```

### 2、权限认证中间件

`middlewares/admin.go`

```go
package middlewares

import (
	"github.com/gin-gonic/gin"
	
	"net/http"
)

// IsAdminAuth 判断权限
func IsAdminAuth() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// 获取token信息
		claims, _ := ctx.Get("claims")
		// 获取现在用户信息
		currentUser := claims.(*CustomClaims)

		// 判断role权限
		if currentUser.AuthorityId != 1 {
			ctx.JSON(http.StatusForbidden, gin.H{
				"msg": "用户没有权限",
			})
			//中断下面中间件
			ctx.Abort()
			return
		}
		//继续执行下面中间件
		ctx.Next()
	}
}
```

在 `router/user.go` 中添加

```go
package router

import (
	"gin_practice/controller"
	"gin_practice/middlewares"
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
		UserRouter.POST("login", controller.PasswordLogin)
		// 获取用户列表
		UserRouter.POST("users", middlewares.JWTAuth(), middlewares.IsAdminAuth(), controller.GetUserList)
	}
}
```





## 参考

- [10篇带你手摸手封装gin框架(9)-常用中间件开发](https://juejin.cn/post/6973522761314467871)



















