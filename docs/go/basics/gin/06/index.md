---
title: 6.Gorm使用和用户列表接口开发
date: 2022-04-27
---

# Gorm使用和用户列表接口开发

## 一、Gorm介绍

gorm是go中最流行的orm框架：[gorm中文文档](https://link.juejin.cn/?target=https%3A%2F%2Fgorm.io%2Fzh_CN%2F)

> orm框架帮助开发者提升了效率，封装了sql，开发者不用直接写sql，还有很多语法糖可我们注意的是，**sql很重要**，我们只有越来越懂sql，才能做到使用orm游刃有余~

我们来分析下GetUserList接口,它的功能:

1. 返回用户列表
2. 有分页功能

设计返回的数据格式：

```json
{
    "code": 200,
    "data": {
        "total": 2,
        "userlist": [
            {
                "address": "",
                "birthday": "2021-06-02",
                "desc": "",
                "gender": "",
                "head_url": "",
                "id": 3,
                "mobile": "13999189292",
                "nick_name": "peiyahui2",
                "role": 1
            },
            {
                "address": "",
                "birthday": "2021-06-02",
                "desc": "",
                "gender": "",
                "head_url": "",
                "id": 4,
                "mobile": "13999189293",
                "nick_name": "peiyahui3",
                "role": 1
            }
        ]
    },
    "msg": "成功获取用户列表"
}
```

### 1、安装gorm

```go
go get gorm.io/driver/mysql  // 安装mysql驱动
go get gorm.io/gorm  
```

### 2、定义表结构

`models/user.go`

```go
package models

import "time"

type User struct {
	ID       uint       `json:"id" gorm:"primaryKey"`
	Password string     `json:"password"`
	NickName string     `json:"nick_name"`
	HeadUrl  string     `json:"head_url"`
	Birthday *time.Time `json:"birthday" gorm:"type:date"`
	Address  string     `json:"address"`
	Desc     string     `json:"desc"`
	Gender   string     `json:"gender"`
	Role     string     `json:"role"`
	Mobile   string     `json:"mobile"`
}

// TableName 设置User的表名为 "profiles"
func (User) TableName() string {
	return "user"
}
```

### 3、初始化mysql驱动

`global/globalVar.go`

```go
package global

import (
	"gin_practice/config"
	ut "github.com/go-playground/universal-translator"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

var (
	Settings config.ServerConfig
	Lg       *zap.Logger
	Trans    ut.Translator
	DB       *gorm.DB
)
```

`initialize/mysql.go`

```go
package initialize

import (
	"gin_practice/global"
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func InitMysqlDB() {
	mysqlInfo := global.Settings.MysqlInfo
	
	// 参考 https://github.com/go-sql-driver/mysql#dsn-data-source-name 获取详情
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		mysqlInfo.Name, mysqlInfo.Password, mysqlInfo.Host,
		mysqlInfo.Port, mysqlInfo.DBName)

	db, _ := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	global.DB = db
}
```

**几个注意的点:** 

1. `global.Settings.Mysqlinfo`里面的信息在讲`Viper`处理`yaml`配置信的时候讲过 
2. 一定要确保`mysql`地址,密码,用户名,端口号别写错了,用`navicat`试着链接下 
3. 在`yaml`的`value`值里面不要空格!!(一定注意) 
4. 这里的 *`global.DB`* 是在`globalVar.go`中加入

### 4、在`main.go`中使用

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

	// 5，初始化mysql
	initialize.InitMysqlDB()

	color.Cyan("go-gin服务开始了")

	// 启动gin，并配置端口，global.Settings.Port是yaml配置的端口
	err := Router.Run(fmt.Sprintf(":%d", global.Settings.Port))

	if err != nil {
		zap.L().Info("This is hello fun: ", zap.String("error", "启动错误！"))
	}
}
```

### 5、创建user表

(1).navicat链接mysql

(2).[下载sql文件在数据库中导入](https://link.juejin.cn/?target=https%3A%2F%2Fwww.yuque.com%2Fzuoqujiazhongtaiyang%2Fserzi7%2Fchrh36)

创建user表之后，再导入一些数据。

### 6、dao实现

接下来就可以操作数据库了，在`dao/user.go`中实现`GetUserListDao`函数：

```go
package dao

import (
	"gin_practice/global"
	"gin_practice/models"
)

var users []models.User

// GetUserListDao 获取用户列表（page：第几页，page_size：每页数据条数）
func GetUserListDao(page int, page_size int) (int, []interface{}) {
	// 分页用户列表数据
	userList := make([]interface{}, 0, len(users))

	// 计算偏移量
	offset := (page - 1) * page_size

	// 查询所有的user
	result := global.DB.Offset(offset).Limit(page_size).Find(&users)

	// 查询不到数据时的处理
	if result.RowsAffected == 0 {
		return 0, userList
	}

	// 获取user总量
	total := len(users)

	// 查询数据
	result.Offset(offset).Limit(page_size).Find(&users)

	for _, user := range users {
		birthday := ""

		if user.Birthday == nil {
			birthday = ""
		} else {
			// 给未设置生日的初始化
			birthday = user.Birthday.Format("2022-04-27")
		}

		userItem := map[string]interface{}{
			"id":        user.ID,
			"password":  user.Password,
			"nick_name": user.NickName,
			"head_url":  user.HeadUrl,
			"birthday":  birthday,
			"address":   user.Address,
			"desc":      user.Desc,
			"gender":    user.Gender,
			"role":      user.Role,
			"mobile":    user.Mobile,
		}

		userList = append(userList, userItem)
	}

	return total, userList
}
```

### 7、controller层的实现

`forms/user.go`

```go
package forms

type PasswordLoginForm struct {
	// 密码 binding:"required" 为必填字段，长度大于3小于20
	Password string `form:"password" json:"password" binding:"required,min=3,max=20"`
	// 用户名
	Username string `form:"name" json:"name" binding:"required"`
}

type UserListForm struct {
	// 页数
	Page int `form:"page" json:"page" binding:"required"`
	// 每页个数
	PageSize int `form:"page_size" json:"page_size" binding:"required"`
}
```

`controller/user.go`

```go
package controller

import (
	"gin_practice/Response"
	"gin_practice/dao"
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

### 8、测试

在 `router/user.go` 中添加路由：

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
		UserRouter.POST("login", controller.PasswordLogin)
		// 获取用户列表
		UserRouter.GET("users", controller.GetUserList)
	}
}
```

重启项目，在postman中测试：

![image-20220427230338306](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427230338306.png)







## 参考

- [10篇带你手摸手封装gin框架(6)-gorm使用和用户列表接口开发](https://juejin.cn/post/6972367074425307150)

















































