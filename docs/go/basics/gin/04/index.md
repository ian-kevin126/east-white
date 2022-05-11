---
title: 4.Validator字段校验
date: 2022-04-27
---

# Validator字段校验

## 一、介绍

字段校验是后端比较重要的环节,虽然前端的form表单做了校验，但是后端为了安全性和避免数据库的脏数据，**我们必须要做字段校验**。

字段校验我们虽然可以编写函数,自己封装校验逻辑,但是**结构体的tag**已近有一些基础校验功能，再加上可以自定义校验器，代码优雅效率十分高！下面是数据流向图：

![image-20220427153106382](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427153106382.png)

## 二、实现基础的字段校验

### 1、定义校验结构体

`forms/user.go`

```go
package forms

type PasswordLoginForm struct {
	// 密码 binding:"required" 为必填字段，长度大于3小于20
	Password string `form:"password" json:"password" binding:"required,min=3,max=20"`
	// 用户名
	Username string `form:"name" json:"name" binding:"required"`
}
```

**结构体中的tag**是自带一些校验的参数的,但是都是比较基础的,如果做一些严格的校验,需要做**自定义校验器**,后面我们会讲到.

`controller/user.go`

```go
package controller

import (
	"gin_practice/forms"
	"github.com/fatih/color"
	"github.com/gin-gonic/gin"
	"net/http"
)

// PasswordLogin 登录
func PasswordLogin(ctx *gin.Context) {
	PasswordLoginForm := forms.PasswordLoginForm{}

	if err := ctx.ShouldBind(&PasswordLoginForm); err != nil {
		color.Blue(err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"code": 500,
			"msg":  "internal server error",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "success",
	})
}
```

### 2、验证校验有效性

先添加路由，`在router/user.go`中添加一段路由：

```go
package router

import (
	"gin_practice/controller"
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
    // 登录：验证校验有效性的路由
		UserRouter.POST("login", controller.PasswordLogin)
	}
}
```

通姑婆postman来验证校验的有效性：

![image-20220427161204844](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427161204844.png)

正确返回了我们想要的结果，现在将password的长度改为2，再次请求：

![image-20220427161330814](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427161330814.png)

说明校验是有效的。



但是错误返回的字段是英文的，我们可以给验证器加上中文翻译转换器。

### 3、添加字段校验的中文转换器

#### 1）安装validator，翻译器，中文

```go
// validator校验器
go get github.com/go-playground/validator/v10
// 翻译器
go get github.com/go-playground/universal-translator
// 中文包
go get github.com/go-playground/locales/zh 
// 英文包
go get github.com/go-playground/locales/en
```

#### 2）定义全局翻译器实例变量

`global/globalVar.go`

```go
package global

import (
	"gin_practice/config"
	ut "github.com/go-playground/universal-translator"
	"go.uber.org/zap"
)

var (
	Settings config.ServerConfig
	Lg       *zap.Logger
  // 定义全局翻译器实例变量
	Trans    ut.Translator
)
```

#### 3）翻译器实现

`initialize/validator.go`

```go
package initialize

import (
	"gin_practice/global"
	"fmt"
	"github.com/fatih/color"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/locales/en"
	"github.com/go-playground/locales/zh"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	en_translations "github.com/go-playground/validator/v10/translations/en"
	zh_translations "github.com/go-playground/validator/v10/translations/zh"
	"reflect"
	"strings"
)

// InitTrans validator信息翻译
func InitTrans(locale string) (err error) {
	color.Red("translator")

	//修改gin框架中的validator引擎属性, 实现定制
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		//注册一个获取json的tag的自定义方法
		v.RegisterTagNameFunc(func(fld reflect.StructField) string {
			name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
			if name == "-" {
				return ""
			}
			return name
		})

		zhT := zh.New() //中文翻译器
		enT := en.New() //英文翻译器

		//第一个参数是备用的语言环境，后面的参数是应该支持的语言环境
		uni := ut.New(enT, zhT, enT)
		global.Trans, ok = uni.GetTranslator(locale)

		if !ok {
			return fmt.Errorf("uni.GetTranslator(%s)", locale)
		}

		switch locale {
		case "en":
			_ = en_translations.RegisterDefaultTranslations(v, global.Trans)
		case "zh":
			_ = zh_translations.RegisterDefaultTranslations(v, global.Trans)
		default:
			_ = en_translations.RegisterDefaultTranslations(v, global.Trans)
		}

		return
	}
	
	return
}
```

大致流程是给InitTrans传递一个参数,判断加载什么语言包,然后获取到语言包赋值给全局翻译器

#### 4）字段校验异常函数实现

`utils/validator.go`

```go
package utils

import (
	"gin_practice/global"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"net/http"
	"strings"
)

// HandleValidatorError 处理字段校验异常
func HandleValidatorError(c *gin.Context, err error) {
	//如何返回错误信息
	errs, ok := err.(validator.ValidationErrors)
	if !ok {
		c.JSON(http.StatusOK, gin.H{
			"code": 200,
			"msg":  err.Error(),
		})
	}

	c.JSON(http.StatusBadRequest, gin.H{
		"code":  400,
		"error": removeTopStruct(errs.Translate(global.Trans)),
	})

	return
}

// removeTopStruct 定义一个去掉结构体名称前缀的自定义方法：
// removeTopStruct 主要用作字符串的切分,应为用翻译成中文,返回的key里面前半段还是有英文,做切分处理
func removeTopStruct(fields map[string]string) map[string]string {
	rsp := map[string]string{}

	for field, err := range fields {
		// 从文本的逗号开始切分   处理后"mobile": "mobile为必填字段"  处理前: "PasswordLoginForm.mobile": "mobile为必填字段"
		rsp[field[strings.Index(field, ".")+1:]] = err
	}

	return rsp
}
```

removeTopStruct主要用作字符串的切分,应为用翻译成中文,返回的key里面前半段还是有英文,做切分处理。

在controller中使用HandleValidatorError函数：

```go
package controller

import (
	"gin_practice/forms"
	"gin_practice/utils"
	"github.com/gin-gonic/gin"
	"net/http"
)

// PasswordLogin 登录
func PasswordLogin(ctx *gin.Context) {
	PasswordLoginForm := forms.PasswordLoginForm{}

	if err := ctx.ShouldBind(&PasswordLoginForm); err != nil {
		// 统一处理异常
		utils.HandleValidatorError(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 200,
		"msg":  "success",
	})
}
```

#### 5）在`main.go`中使用初始化字段校验器

```go
package main

import (
	"gin_practice/global"
	"gin_practice/initialize"
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

	color.Cyan("go-gin服务开始了")

	// 启动gin，并配置端口，global.Settings.Port是yaml配置的端口
	err := Router.Run(fmt.Sprintf(":%d", global.Settings.Port))

	if err != nil {
		zap.L().Info("This is hello fun: ", zap.String("error", "启动错误！"))
	}
}
```

#### 6）测试

重启项目，测试：

![image-20220427181058333](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427181058333.png)





## 参考

- [10篇带你手摸手封装gin框架(4)-Validator字段校验](https://juejin.cn/post/6971586609745494029)





