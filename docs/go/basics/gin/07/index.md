---
title: 7.Redis接入与图形验证码
date: 2022-04-27
---

# Redis接入与图形验证码

## 一、介绍

### 1、redis

> redis是nosql数据库,常用作数据缓存。

安装:

```shell
docker run -p 6379:6379 -d redis:latest redis-server
docker container update --restart=always 容器名字
```

安装go的redis库

```shell
go get github.com/go-redis/redis
```

#### 1）初始化redis

在`global/globalVar.go`中添加：

```go
package global

import (
	"din_practice/config"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-redis/redis"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

var (
	Settings config.ServerConfig
	Lg       *zap.Logger
	Trans    ut.Translator
	DB       *gorm.DB
	Redis    *redis.Client
)
```

#### 2）初始化redis连接

`initialize/redis.go`

```go
package initialize

import (
	"din_practice/global"
	"fmt"
	"github.com/fatih/color"
	"github.com/go-redis/redis"
)

func InitRedis() {
	addr := fmt.Sprintf("%s:%d", global.Settings.RedisInfo.Host, global.Settings.RedisInfo.Port)

	// 生成redis客户端
	global.Redis = redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: "", // 默认无密码
		DB:       0,  // 使用默认的DB
	})

	// 连接redis
	_, err := global.Redis.Ping().Result()

	if err != nil {
		color.Red("[InitRedis] 连接redis异常")
		color.Yellow(err.Error())
	}
}
```

#### 3）在`main.go`中初始化

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

	// 4，初始化翻译
	if err := initialize.InitTrans("zh"); err != nil {
		panic(err)
	}

	// 5，初始化mysql
	initialize.InitMysqlDB()

	// 6，初始化redis
	initialize.InitRedis()

	color.Cyan("go-gin服务开始了")

	// 启动gin，并配置端口，global.Settings.Port是yaml配置的端口
	err := Router.Run(fmt.Sprintf(":%d", global.Settings.Port))

	if err != nil {
		zap.L().Info("This is hello fun: ", zap.String("error", "启动错误！"))
	}
}
```

重启项目，没有报错，说明连接成功。

### 2、图形验证码 

图形验证码是为了防爬虫节流的一个手段，生成一个`base64`码返回给前端。图形验证码一般是在登录的时候加入 所以我们重新定义一下 `PasswordLoginForm` 结构体,加上`captcha`（验证码），`captcha_id`（验证码id），在 `forms/user.go` 中 `PasswordLoginForm` 结构体修改成:

```go
package forms

type PasswordLoginForm struct {
	// 密码 binding:"required" 为必填字段，长度大于3小于20
	// Password string `form:"password" json:"password" binding:"required,min=3,max=20"`
	// 用户名
	Username  string `form:"name" json:"name" binding:"required"`
	PassWord  string `form:"password" json:"password" binding:"required,min=3,max=20"`
	Mobile    string `form:"mobile" json:"mobile" binding:"required,mobile"`        // 手机号码格式有规范可寻， 自定义validator
	Captcha   string `form:"captcha" json:"captcha" binding:"required,min=5,max=5"` // 验证码
	CaptchaId string `form:"captcha_id" json:"captcha_id" binding:"required"`       // 验证码id
}

type UserListForm struct {
	// 页数
	Page int `form:"page" json:"page"`
	// 每页个数
	PageSize int `form:"page_size" json:"page_size"`
}
```

> 注意两个点: 
>
> 1. `Captcha `的最大值和最小值都为5，应为后续设置获取验证码的位数是5 
> 2. `PasswordLoginForm` 修改后，login的接口就必须传入验证码和验证id,否则报错

#### 1）安装 `base64Captcha` 库

```go
go get github.com/mojocn/base64Captcha
```

#### 2）`controller` 层实现

`controller/captcha.go`

```go
package controller

import (
	"din_practice/Response"
	"github.com/gin-gonic/gin"
	"github.com/mojocn/base64Captcha"
	"go.uber.org/zap"
	"net/http"
)

// base64Captcha 缓存对象
var store = base64Captcha.DefaultMemStore

// GetCaptcha 获取验证码
func GetCaptcha(ctx *gin.Context) {
	// base64Captcha.NewDriverDigit可以根据参数调节验证码参数
	driver := base64Captcha.NewDriverDigit(80, 240, 5, 0.7, 80)
	cp := base64Captcha.NewCaptcha(driver, store)

	// b64s是图片的base64编码
	id, b64s, err := cp.Generate()

	if err != nil {
		zap.S().Errorf("生成验证码错误：%s", err.Error())
		Response.Err(ctx, http.StatusInternalServerError, 500, "生成验证码错误", "")
		return
	}

	Response.Success(ctx, 200, "生成验证码错误", gin.H{
		"captchaId": id,
		"picPath":   b64s,
	})
}
```

#### 3）校验图形验证码

在 `controller/user.go` 中加入校验逻辑：

```go
package controller

import (
	"din_practice/Response"
	"din_practice/dao"
	"din_practice/forms"
	"din_practice/utils"
	"github.com/gin-gonic/gin"
)

// PasswordLogin 登录
func PasswordLogin(ctx *gin.Context) {
	PasswordLoginForm := forms.PasswordLoginForm{}

	if err := ctx.ShouldBind(&PasswordLoginForm); err != nil {
		// 统一处理异常
		utils.HandleValidatorError(ctx, err)
		return
	}

	// 数字验证码验证失败   store.Verify(验证码id，验证码，验证后是否关闭)
	if !store.Verify(PasswordLoginForm.CaptchaId, PasswordLoginForm.Captcha, true) {
		Response.Err(ctx, 400, 400, "验证码错误", "")
		return
	}

	//ctx.JSON(http.StatusOK, gin.H{
	//	"code": 200,
	//	"msg":  "success",
	//})

	// 替换为封装好的Success方法
	Response.Success(ctx, 200, "success", "test")
}

func GetUserList(ctx *gin.Context) {
	// 获取参数
	UserListForm := forms.UserListForm{}

	if err := ctx.ShouldBind(&UserListForm); err != nil {
		utils.HandleValidatorError(ctx, err)
		return
	}

	// 获取数据
	total, userList := dao.GetUserListDao(UserListForm.Page, UserListForm.PageSize)
	// 判断
	if (total + len(userList)) == 0 {
		Response.Err(ctx, 400, 400, "未获取到数据", map[string]interface{}{
			"total":    total,
			"userList": userList,
		})

		return
	}

	Response.Success(ctx, 200, "获取用户列表成功", map[string]interface{}{
		"total":    total,
		"userList": userList,
	})
}
```



#### 4）添加验证路由

`router/base.go`

```go
package router

import (
	"din_practice/controller"
	"github.com/gin-gonic/gin"
)

// InitBaseRouter 图形验证码的路由
func InitBaseRouter(Router *gin.RouterGroup) {
	BaseRouter := Router.Group("base")
	{
		BaseRouter.GET("captcha", controller.GetCaptcha)
	}
}
```

在 `initialize/router.go` 中添加base路由：

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

	// base路由
	router.InitBaseRouter(ApiGroup)

	return Router
}
```

#### 5）验证

![image-20220427233359726](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427233359726.png)

当返回id和base64验证码就成功了~ 还可使用[base64码转图片网址](https://link.juejin.cn/?target=http%3A%2F%2Ftool.chinaz.com%2Ftools%2Fimgtobase%2F)将base64转成图片。

![image-20220427233529036](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427233529036.png)







## 参考

- [10篇带你手摸手封装gin框架(7)- redis接入与图形验证码](https://juejin.cn/post/6972830783136497671)







