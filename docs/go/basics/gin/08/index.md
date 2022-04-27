---
title: 8.JWT验证与登录接口完善
date: 2022-04-27

---

# JWT验证与登录接口完善

## 1. 中间件介绍

之前在 `Zap`日志管理章节了解过了中间件，并编写了记录`http`异常的日志中间件
这里有几篇文章讲的非常好:

- [Go Web轻量级框架Gin学习系列：中间件使用详解](https://juejin.cn/post/6844904119249944583)
- [Gin框架系列03：换个姿势理解中间件](https://juejin.cn/post/6844903833164857358)

![image-20220427141717383](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427141717383.png)

对中间件的理解: 

- 类似于`koa`的洋葱模型，`Django`的钩子函数,前端的生命周期 
- 在请求接口前或者后做一些逻辑出来 

中间件几个关键字: 

1. `c.Next()` 进入下一个中间件 
2. `c.Abort()` 中断中间件(`return` 不能中断中间件的调用)

## 2、JWT简介

[jwt官网](https://link.juejin.cn/?target=https%3A%2F%2Fjwt.io%2F%23debugger-io)

安装`jwt`库：

```go
go get github.com/dgrijalva/jwt-go
```

#### 1）Token

`JSON Web Token`由三部分组成，它们之间用圆点(.)连接。这三部分分别是：

- `Header`
- `Payload`
- `Signature`

#### 2）Token的好处 

- 无状态和可扩展性：Tokens存储在客户端。完全无状态，可扩展。我们的负载均衡器可以将用户传递到任意服务器，因为在任何地方都没有状态或会话信息。 
- 安全性:每次请求的时候Token都会被发送。而且，由于没有`Cookie`被发送，还有助于防止`CSRF`攻击。即使在你的实现中将token存储到客户端的`Cookie`中，这个`Cookie`也只是一种存储机制，而非身份认证机制。没有基于会话的信息可以操作，因为我们没有会话!

#### 3）与前端约定

- 登录请求的时候，后端把`token`传递给前端，前端保存`token`

- 前端在`http`请求的`header`上加入`key`为`x-token`的请求头，值为`token`

### 3、JWT中间件开发

#### 1）添加token配置

`settings-dev.yaml`

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

jwt:
  key: "EYsnfKMf5XWk87LASEs28Dj5ZqGkSerH"
```

然后在 `config/config.go` 中加入配置的stuct：

```go
package config

type ServerConfig struct {
	Name        string      `mapstructure:"name"`
	Port        int         `mapstructure:"port"`
	LogsAddress string      `mapstructure:"logsAddress"`
	MysqlInfo   MysqlConfig `mapstructure:"mysql"`
	RedisInfo   RedisConfig `mapstructure:"redis"`
	JWTKey      JWTConfig   `mapstructure:"jwt"`
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

type JWTConfig struct {
	SigningKey string `mapstructure:"key" json:"key"`
}
```

#### 2）jwt中间件实现

`middlewares/jwt.go`

```go
package middlewares

import (
	"din_practice/Response"
	"din_practice/global"
	"errors"
	"github.com/dgrijalva/jwt-go"
	"github.com/fatih/color"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

type CustomClaims struct {
	ID          uint
	NickName    string
	AuthorityId uint
	jwt.StandardClaims
}

func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 我们这里jwt鉴权取头部信息 x-token 登录时回返回token信息 这里前端需要把token存储到cookie或者本地localStorage中
		// 不过需要跟后端协商过期时间 可以约定刷新令牌或者重新登录
		token := c.Request.Header.Get("x-token")
		color.Yellow(token)
		if token == "" {
			Response.Err(c, http.StatusUnauthorized, 401, "请登录", "")
			c.Abort()
			return
		}

		j := NewJWT()
		// parseToken 解析token包含的信息
		claims, err := j.ParseToken(token)
		if err != nil {
			if err == TokenExpired {
				if err == TokenExpired {
					Response.Err(c, http.StatusUnauthorized, 401, "授权已过期", "")
					c.Abort()
					return
				}
			}
			Response.Err(c, http.StatusUnauthorized, 401, "未登陆", "")
			c.Abort()
			return
		}

		// gin的上下文记录claims和userId的值
		c.Set("claims", claims)
		c.Set("userId", claims.ID)
		c.Next()
	}
}

type JWT struct {
	SigningKey []byte
}

var (
	TokenExpired     = errors.New("Token is expired")
	TokenNotValidYet = errors.New("Token not active yet")
	TokenMalformed   = errors.New("That's not even a token")
	TokenInvalid     = errors.New("Couldn't handle this token:")
)

func NewJWT() *JWT {
	return &JWT{
		[]byte(global.Settings.JWTKey.SigningKey),
	}
}

// CreateToken 创建一个token
func (j *JWT) CreateToken(claims CustomClaims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(j.SigningKey)
}

// ParseToken 解析 token
func (j *JWT) ParseToken(tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (i interface{}, e error) {
		return j.SigningKey, nil
	})
	
	if err != nil {
		if ve, ok := err.(*jwt.ValidationError); ok {
			if ve.Errors&jwt.ValidationErrorMalformed != 0 {
				return nil, TokenMalformed
			} else if ve.Errors&jwt.ValidationErrorExpired != 0 {
				// Token is expired
				return nil, TokenExpired
			} else if ve.Errors&jwt.ValidationErrorNotValidYet != 0 {
				return nil, TokenNotValidYet
			} else {
				return nil, TokenInvalid
			}
		}
	}

	if token != nil {
		if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
			return claims, nil
		}
		return nil, TokenInvalid

	} else {
		return nil, TokenInvalid

	}

}

// RefreshToken 更新token
func (j *JWT) RefreshToken(tokenString string) (string, error) {
	jwt.TimeFunc = func() time.Time {
		return time.Unix(0, 0)
	}

	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return j.SigningKey, nil
	})

	if err != nil {
		return "", err
	}
	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		jwt.TimeFunc = time.Now
		claims.StandardClaims.ExpiresAt = time.Now().Add(1 * time.Hour).Unix()
		return j.CreateToken(*claims)
	}

	return "", TokenInvalid
}
```

在 `utils/createToken.go` 中添加 `CreateToken` 方法

```go
package utils

import (
	"din_practice/Response"
	"din_practice/middlewares"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"time"
)

func CreateToken(ctx *gin.Context, Id int, NickName string, Role int) string {
	// 生成token信息
	j := middlewares.NewJWT()

	claims := middlewares.CustomClaims{
		ID:          uint(Id),
		NickName:    NickName,
		AuthorityId: uint(Role),
		StandardClaims: jwt.StandardClaims{
			NotBefore: time.Now().Unix(),
			ExpiresAt: time.Now().Unix() + 60*60*24*30, // token --> 30天过期
			Issuer:    "test",
		},
	}

	// 生成token
	token, err := j.CreateToken(claims)
	if err != nil {
		Response.Success(ctx, 401, "token生成失败,重新再试", "test")
		return ""
	}

	return token
}
```

### 4、完善登录接口

在 `dao/userDao.go` 中添加 `UserNameFindUserInfo` 方法：

```go
// ...
var user models.User

// FindUserInfo 通过username找到用户信息
func FindUserInfo(username string, password string) (*models.User, bool) {
	// 查询用户
	rows := global.DB.Where(&models.User{NickName: username, Password: password}).Find(&user)

	fmt.Println(&user)

	if rows.RowsAffected < 1 {
		return &user, false
	}

	return &user, true
}
```

在 `controller/user.go` 中改写 `PasswordLogin` 逻辑

```go
// ...

// PasswordLogin 登录
func PasswordLogin(ctx *gin.Context) {
	PasswordLoginForm := forms.PasswordLoginForm{}

	if err := ctx.ShouldBind(&PasswordLoginForm); err != nil {
		// 统一处理异常
		utils.HandleValidatorError(ctx, err)
		return
	}

	// 数字验证码验证失败   store.Verify(验证码id，验证码，验证后是否关闭)
	//if !store.Verify(PasswordLoginForm.CaptchaId, PasswordLoginForm.Captcha, true) {
	//	Response.Err(ctx, 400, 400, "验证码错误", "")
	//	return
	//}

	// 先屏蔽图形验证逻辑
	user, ok := dao.FindUserInfo(PasswordLoginForm.Username, PasswordLoginForm.PassWord)
	if !ok {
		Response.Err(ctx, 401, 401, "未注册该用户", "")
		return
	}

	token := utils.CreateToken(ctx, user.ID, user.NickName, user.Role)
	userInfoMap := HandleUserModelToMap(user)
	userInfoMap["token"] = token

	//ctx.JSON(http.StatusOK, gin.H{
	//	"code": 200,
	//	"msg":  "success",
	//})

	// 替换为封装好的Success方法
	Response.Success(ctx, 200, "success", userInfoMap)
}

func HandleUserModelToMap(user *models.User) map[string]interface{} {
	birthday := ""

	if user.Birthday == nil {
		birthday = ""
	} else {
		birthday = user.Birthday.Format("2022-04-27")
	}

	userItemMap := map[string]interface{}{
		"id":        user.ID,
		"nick_name": user.NickName,
		"head_url":  user.HeadUrl,
		"birthday":  birthday,
		"address":   user.Address,
		"desc":      user.Desc,
		"gender":    user.Gender,
		"role":      user.Role,
		"mobile":    user.Mobile,
	}

	return userItemMap
}
```

### 5、使用中间件

在 `router/user.go` 中添加jwt中间件：

```go
package router

import (
	"din_practice/controller"
	"din_practice/middlewares"
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
		UserRouter.POST("users", middlewares.JWTAuth(), controller.GetUserList)
	}
}
```





## 参考

- [10篇带你手摸手封装gin框架(8)- jwt验证与登录接口完善](https://juejin.cn/post/6973087456123944997)





































