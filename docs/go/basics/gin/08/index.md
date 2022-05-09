---
title: 8.JWT验证与登录
date: 2022-04-27

---

# JWT验证与登录

## 一、JWT简介

### 1、JWT简介

`JSON Web Token（JWT）`是一个开放标准（[RFC 7519](https://link.segmentfault.com/?enc=un7ksZ0aF5IefaDCNa1tEQ%3D%3D.XprVPayX3Y5AR%2BAVpaSCda%2FopnNj1duO%2B55%2Bkq33XZUo66VKFRn%2BYdPaZqgHHu8s)），它定义了一种紧凑且自包含的方式，用于在各方之间以JSON方式安全地传输信息。由于此信息是经过数字签名的，因此可以被验证和信任。可以使用秘密（使用**HMAC**算法）或使用**RSA**或**ECDSA**的公钥/私钥对对JWT进行**签名**。

简单来说，`JWT` 就是一种用户认证（区别于session、cookie）的解决方案。[jwt官网](https://link.juejin.cn/?target=https%3A%2F%2Fjwt.io%2F%23debugger-io)

众所周知，在 `JWT` 之前，我们已经有了 session、cookie 来解决登录等认证问题，为什么还要有 `JWT` 呢？下面我们来比较一下这三个：

#### 1）session

熟悉session运行机制的同学都知道，用户的session数据以file或缓存（redis、memcached）等方式存储在服务器端，客户端浏览器cookie中只保存sessionid。服务器端session属于集中存储，数量不大的情况下，没什么问题，当用户数据逐渐增多到一程度，就会给服务端管理和维护带来大的负担。

session有两个弊端：

1、无法实现跨域。

2、由于session数据属于集中管理里，量大的时候服务器性能是个问题。

优点：

1、session存在服务端，数据相对比较安全。

2、session集中管理也有好处，就是用户登录、注销服务端可控。

#### 2）cookie

`cookie`也是一种解决网站用户认证的实现方式，用户登录时，服务器会发送包含登录凭据的Cookie到用户浏览器客户端，浏览器会将`Cookie`的`key/value`保存用户本地（内存或硬盘），用户再访问网站，浏览器会发送`cookie`信息到服务器端，服务器端接收cookie并解析来维护用户的登录状态。

`cookie`避免`session`集中管理的问题，但也存在弊端：

1、跨域问题。

2、数据存储在浏览器端，数据容易被窃取及被`csrf`攻击，安全性差。

优点：

1、相对于`session`简单，不用服务端维护用户认证信息。

2、数据持久性。

#### 3）jwt

jwt通过json传输，php、java、golang等很多语言支持，通用性比较好，不存在跨域问题。传输数据通过数据签名相对比较安全。客户端与服务端通过jwt交互，服务端通过解密token信息，来实现用户认证。不需要服务端集中维护token信息，便于扩展。当然jwt也有其缺点。

缺点：

1、用户无法主动登出，只要token在有效期内就有效。这里可以考虑redis设置同token有效期一致的黑名单解决此问题。

2、token过了有效期，无法续签问题。可以考虑通过判断旧的token什么时候到期，过期的时候刷新token续签接口产生新token代替旧token。

### 2、jwt设置有效期

可以设置有效期，加入有效期是为了增加安全性，即token被黑客截获，也只能攻击较短时间。设置有效期就会面临token续签问题，解决方案如下：

通常服务端设置两个token

- Access Token：添加到 HTTP 请求的 header 中，进行用户认证，请求接口资源。
- refresh token：用于当 Access Token过期后，客户端传递refresh token刷新 Access Token续期接口，获取新的Access Token和refresh token。其有效期比 Access Token有效期长。

### 3、JWT 组成

假设我们有一个名为的用户 user1，他们尝试登录到应用程序或网站。一旦成功，他们将收到一个看起来像这样的令牌：

```go
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIxIiwiZXhwIjoxNTQ3OTc0MDgyfQ.2Ye5_w1z3zpD4dSGdRp3s98ZipCNQqmsHRB9vioOx54
```

#### 1）Token

`JSON Web Token`由三部分组成，它们之间用圆点(.)连接。这三部分分别是：

- `Header`：（`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`）。标头指定信息，例如用于生成签名的算法（第三部分）。这部分是标准的，并且对于使用相同算法的任何 JWT 都是相同的。
- `Payload`：（`eyJ1c2VybmFtZSI6InVzZXIxIiwiZXhwIjoxNTQ3OTc0MDgyfQ`），载荷又称为Claim，携带的信息，比如用户名、过期时间等，一般叫做 Claim。其中包含特定于应用程序的信息（在我们的示例中，这是用户名），以及有关令牌的到期和有效性的信息。
- `Signature`：（`2Ye5_w1z3zpD4dSGdRp3s98ZipCNQqmsHRB9vioOx54`），签名，是由header、payload 和你自己维护的一个 secret 经过加密得来的。它是通过组合和散列前两个部分以及一个秘密密钥来生成的。

现在有趣的是，标题 header 和有效负载 payload 未加密。它们只是 base64 编码的。这意味着任何人都可以通过解码来查看其内容。例如，我们可以使用一些在线解码工具 对标题或有效负载进行解码。

它将显示为以下内容：

```go
{ "alg": "HS256", "typ": "JWT" }
```

如果您使用的是 Linux 或 Mac OS，也可以在终端上执行以下语句：

```go
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 | base64 -D
```

同样，有效负载的内容为：

```go
{ "username": "user1", "exp": 1547974082 }
```

##### JWT 签名如何工作

因此，如果任何人都可以读写 JWT 的标头和签名，那么实际上如何保证 JWT 是安全的？答案在于如何生成最后一部分（签名）。

假设你的应用程序想要向成功登录的用户 user1 签发 JWT。

使标头和有效负载非常简单：标头或多或少是固定的，有效负载 JSON 对象是通过设置用户 ID 和有效时间（以 Unix 毫秒为单位）来形成的。

发行令牌的应用程序还拥有一个密钥，该密钥是一个私有值，并且仅对应用程序本身是已知的。然后将标头和有效负载的 base64 表示形式与密钥组合，然后通过哈希算法计算签名值（在本例中为 HS256，如标头中所述）

![jwt algorithm](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/xBqvamzTiw.svg)

##### 验证 JWT

为了验证传入的 JWT，将使用传入的 JWT 的标头和有效负载以及密钥再次生成签名。如果签名与 JWT 上的签名匹配，则认为 JWT 有效。

现在，让我们假设你是一个试图发行假令牌的黑客。你可以轻松地生成标头和有效负载，但是在不知道密钥的情况下，无法生成有效的签名。如果你尝试篡改有效 JWT 的有效负载 payload，则签名将不再匹配。

![jwt verification](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/3q0kVjYRVh.svg)

这样，JWT 可以以一种安全的方式授权用户，而无需在应用程序服务器上实际存储任何信息（除了密钥）。





#### 2）Token的好处 

- 无状态和可扩展性：Tokens存储在客户端。完全无状态，可扩展。我们的负载均衡器可以将用户传递到任意服务器，因为在任何地方都没有状态或会话信息。 
- 安全性:每次请求的时候Token都会被发送。而且，由于没有`Cookie`被发送，还有助于防止`CSRF`攻击。即使在你的实现中将token存储到客户端的`Cookie`中，这个`Cookie`也只是一种存储机制，而非身份认证机制。没有基于会话的信息可以操作，因为我们没有会话!

#### 3）与前端约定

- 登录请求的时候，后端把`token`传递给前端，前端保存`token`

- 前端在`http`请求的`header`上加入`key`为`x-token`的请求头，值为`token`

### 4、JWT的使用

这里推荐个使用比较多的开源项目[github.com/dgrijalva/jwt-go]()，[更多文档](https://link.segmentfault.com/?enc=Mu1OhZiQR7GN%2B26ncqVdaQ%3D%3D.2OfMCU40ny4D7Q7g4a3oXQBoMLQEu%2BBN6ipGuehRGZu7uuu8I3sqsMnG3adv%2BMRM)。

示例：

```go
package main

import (
  "fmt"
  "github.com/dgrijalva/jwt-go"
  "time"
)

const (
  SECRETKEY = "243223ffslsfsldfl412fdsfsdf"//私钥
)

//自定义Claims
type CustomClaims struct {
  UserId int64
  jwt.StandardClaims
}

func main() {
  //生成token
  maxAge:=60*60*24
  customClaims :=&CustomClaims{
    UserId: 11,//用户id
    StandardClaims: jwt.StandardClaims{
      ExpiresAt: time.Now().Add(time.Duration(maxAge)*time.Second).Unix(), // 过期时间，必须设置
      Issuer:"jerry",   // 非必须，也可以填充用户名，
    },
  }
  
  //采用HMAC SHA256加密算法
  token:=jwt.NewWithClaims(jwt.SigningMethodHS256, customClaims)
  tokenString,err:= token.SignedString([]byte(SECRETKEY))
  
  if err!=nil {
    fmt.Println(err)
  }
  fmt.Printf("token: %v\n", tokenString)

  //解析token
  ret,err :=ParseToken(tokenString)
  if err!=nil {
    fmt.Println(err)
  }
  fmt.Printf("userinfo: %v\n", ret)
}

//解析token
func ParseToken(tokenString string)(*CustomClaims,error)  {
  token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
    if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
      return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
    }
    return []byte(SECRETKEY), nil
  })
  if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
    return claims,nil
  } else {
    return nil,err
  }
}
```

运行结果：

```go
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjExLCJleHAiOjE1OTA5MTk1NDAsImlzcyI6ImplcnJ5In0.FppmbbHRrS4wd5wen73vYPOvtzycOrn2JZlK6JRjEGk
userinfo: &{11 { 1590919540 0 jerry 0 }}
```

#### Claims

```go
Audience string `json:"aud,omitempty"`  
ExpiresAt int64 `json:"exp,omitempty"`  
Id string `json:"jti,omitempty"` 
IssuedAt int64 `json:"iat,omitempty"`  
Issuer string `json:"iss,omitempty"`  
NotBefore int64 `json:"nbf,omitempty"`  
Subject string `json:"sub,omitempty"`
```

- aud: 接收jwt的一方
- exp: jwt的过期时间，这个过期时间必须要大于签发时间
- jti: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。
- iat: jwt的签发时间
- iss: jwt签发者
- nbf: 定义在什么时间之前，该jwt都是不可用的.就是这条token信息生效时间.这个值可以不设置,但是设定后,一定要大于当前Unix UTC,否则token将会延迟生效.
- sub: jwt所面向的用户



以上用到了CustomClaims，也可以用简单的方法

示例

```go
package main

import (
    "fmt"
    "github.com/dgrijalva/jwt-go"
    "time"
)
const (
    SECRETKEY = "243223ffslsfsldfl412fdsfsdf"//私钥
)
//自定义Claims
type CustomClaims struct {
    UserId int64
    jwt.StandardClaims
}
func main() {
    //生成token
    maxAge:=60*60*24
    // Create the Claims
    //claims := &jwt.StandardClaims{
    //    //    ExpiresAt: time.Now().Add(time.Duration(maxAge)*time.Second).Unix(), // 过期时间，必须设置,
    //    //    Issuer:    "jerry",// 非必须，也可以填充用户名，
    //    //}

    //或者用下面自定义claim
    claims := jwt.MapClaims{
        "id":       11,
        "name":       "jerry",
        "exp": time.Now().Add(time.Duration(maxAge)*time.Second).Unix(), // 过期时间，必须设置,
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString([]byte(SECRETKEY))
    if err!=nil {
        fmt.Println(err)
    }
    fmt.Printf("token: %v\n", tokenString)

    //解析token
    ret,err :=ParseToken(tokenString)
    if err!=nil {
        fmt.Println(err)
    }
    fmt.Printf("userinfo: %v\n", ret)
}

//解析token
func ParseToken(tokenString string)(jwt.MapClaims,error)  {
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        // Don't forget to validate the alg is what you expect:
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
        }

        // hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
        return []byte(SECRETKEY), nil
    })
    if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
        return claims,nil
    } else {
        return nil,err
    }
}
```

运行结果类似

```go
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTA5MzUzMDUsImlkIjoxMSwibmFtZSI6ImplcnJ5In0.fapE0IiOEe_TqoMCThbNTHUvgWiHPEk0rm-9uPIcvPU
userinfo: map[exp:1.590935305e+09 id:11 name:jerry]
```



## 二、JWT中间件开发

### 1、安装

安装`jwt`库：

```go
go get github.com/dgrijalva/jwt-go
```

### 2、添加token配置

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

### 3、jwt中间件实现

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
- [Go 教程：从零实现JWT 认证| Go优质外文翻译 - LearnKu](https://learnku.com/go/t/52399)





































