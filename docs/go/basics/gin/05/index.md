---
title: 5.Response统一封装
date: 2022-04-27
---

# Response统一封装

## 一、概述

封装response的目的是为了返回统一格式的json结构：

```json
{
    "code": 400,
    "data": {
        "name": "name为必填字段",
        "password": "password为必填字段"
    },
    "msg": "字段校验错误"
}
```

这样做的**优点**就是**规范返回数据**，前端使用**解构赋值**就可以取出想要的数据。

| 字段 | 类型        | 概述                             |
| ---- | ----------- | -------------------------------- |
| code | int         | 自定义状态码(需要和前端商量)     |
| msg  | interface{} | 信息字段,返回前端需要的toast提示 |
| data | interface{} | 数据字段,返回前端所需要的数据    |

> 之前我们写过 **context.json()** 这个函数,是给前端返回数据的函数,这里我们主要针对这个函数做二次封装。

## 二、封装

`Response/response.go`

```go
package Response

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

// Success 成功就统一返回200,所以在这里就没有加http状态码的位置参数,只有code自定义参数
func Success(ctx *gin.Context, code int, msg interface{}, data interface{}) {
	ctx.JSON(http.StatusOK, map[string]interface{}{
		"code": code, // 自定义code
		"msg":  msg,  // 自定义code
		"data": data, // 自定义code
	})

	return
}

// Err 返回失败
func Err(ctx *gin.Context, httpCode int, code int, msg string, jsonStr interface{}) {
	ctx.JSON(httpCode, map[string]interface{}{
		"code": code,
		"msg":  msg,
		"data": jsonStr,
	})

	return
}
```

## 三、使用

`controller/user.go`

```go
package controller

import (
	"gin_practice/Response"
	"gin_practice/forms"
	"gin_practice/utils"
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

	//ctx.JSON(http.StatusOK, gin.H{
	//	"code": 200,
	//	"msg":  "success",
	//})

	// 替换为封装好的Success方法
	Response.Success(ctx, 200, "success", "test")
}
```

`utils/validator.go`

```go
package utils

import (
	"gin_practice/Response"
	"gin_practice/global"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"net/http"
	"strings"
)

// HandleValidatorError 处理字段校验异常
func HandleValidatorError(ctx *gin.Context, err error) {
	//如何返回错误信息
	errs, ok := err.(validator.ValidationErrors)
	if !ok {
		//ctx.JSON(http.StatusOK, gin.H{
		//	"code": 200,
		//	"msg":  err.Error(),
		//})
		Response.Err(ctx, http.StatusInternalServerError, 500, "字段校验错误", err.Error())
	}

	//ctx.JSON(http.StatusBadRequest, gin.H{
	//	"code":  400,
	//	"error": removeTopStruct(errs.Translate(global.Trans)),
	//})

	msg := removeTopStruct(errs.Translate(global.Trans))
	Response.Err(ctx, http.StatusBadRequest, 400, "字段校验错误", msg)

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

> http状态码和code自定义状态码的区别
>
> 1. http状态码是200,204,400,404,500 这样http规范定义的状态码
> 2. code只是个int类型数字,是和前端一起商量的状态码,比如 100010代表字段校验错误等等,是对http状态码一种详细的补充





## 参考

- [10篇带你手摸手封装gin框架(5)-responese统一封装](https://juejin.cn/post/6971959213211942926)





























