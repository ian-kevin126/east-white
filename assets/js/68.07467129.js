(window.webpackJsonp=window.webpackJsonp||[]).push([[68],{672:function(t,s,a){"use strict";a.r(s);var n=a(6),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h1",{attrs:{id:"开篇"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#开篇"}},[t._v("#")]),t._v(" 开篇")]),t._v(" "),a("p",[a("code",[t._v("Gin")]),t._v("作为"),a("code",[t._v("Go")]),t._v("语言中最为流行的web框架，是每一个"),a("code",[t._v("Go")]),t._v("语言入门者很有必要去学习的一个框架。"),a("code",[t._v("Gin")]),t._v("和"),a("code",[t._v("Koa")]),t._v("一样，都是小而美的框架，优点是自由度很高，缺点就是不能拿来就用，需要我们自己去做一些“二次封装”，完成从项目的规范、目录、配置管理、日志、数据库等后端项目生态的设计，然后才能运用到真是的业务场景里去。")]),t._v(" "),a("p",[t._v("这里学习了掘金社区里非常好的一个系列文章 "),a("a",{attrs:{href:"https://juejin.cn/post/6970678168860491784",target:"_blank",rel:"noopener noreferrer"}},[t._v("【10篇带你手摸手封装Gin框架】"),a("OutboundLink")],1),t._v("，作者是"),a("a",{attrs:{href:"https://juejin.cn/post/6970678168860491784",target:"_blank",rel:"noopener noreferrer"}},[t._v("作曲家种太阳"),a("OutboundLink")],1),t._v("。")]),t._v(" "),a("p",[t._v("当然，学习是永无止境的，永远也没有绝对的最好，只有更好，学习模仿只是第一步，我会在此基础上不断完善项目。")]),t._v(" "),a("h2",{attrs:{id:"一、基础"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#一、基础"}},[t._v("#")]),t._v(" 一、基础")]),t._v(" "),a("h3",{attrs:{id:"_1、技术选型"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1、技术选型"}},[t._v("#")]),t._v(" 1、技术选型")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("技术点")]),t._v(" "),a("th",[t._v("概要")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[a("code",[t._v("gin")])]),t._v(" "),a("td",[t._v("go中最流行的web框架")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("zap")])]),t._v(" "),a("td",[t._v("日志管理器")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("viper")])]),t._v(" "),a("td",[t._v("配置管理器")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("gorm")])]),t._v(" "),a("td",[t._v("go中最流行的"),a("code",[t._v("orm")]),t._v("框架")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("mysql")])]),t._v(" "),a("td",[t._v("数据库")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("jwt")])]),t._v(" "),a("td",[t._v("身份认证")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("minio")])]),t._v(" "),a("td",[t._v("静态资源服务器")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("redis")])]),t._v(" "),a("td",[t._v("数据库")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("validator")])]),t._v(" "),a("td",[t._v("字段校验器")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("color")])]),t._v(" "),a("td",[t._v("终端彩色显示")])])])]),t._v(" "),a("h3",{attrs:{id:"_2、目录结构"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2、目录结构"}},[t._v("#")]),t._v(" 2、目录结构")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427110349663.png",alt:"image-20220427110349663"}})]),t._v(" "),a("p",[t._v("从上到下目录结构为:")]),t._v(" "),a("table",[a("thead",[a("tr",[a("th",[t._v("文件")]),t._v(" "),a("th",[t._v("概要")])])]),t._v(" "),a("tbody",[a("tr",[a("td",[a("code",[t._v("config")])]),t._v(" "),a("td",[t._v("配置文件对应的结构体定义")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("controller")])]),t._v(" "),a("td",[t._v("业务层")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("dao")])]),t._v(" "),a("td",[t._v("操作数据库,给业务"),a("code",[t._v("controller")]),t._v("提供数据")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("forms")])]),t._v(" "),a("td",[t._v("字段验证的"),a("code",[t._v("struct")])])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("global")])]),t._v(" "),a("td",[t._v("定义全局变量")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("initialize")])]),t._v(" "),a("td",[t._v("服务初始化")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("logs")])]),t._v(" "),a("td",[t._v("日志存储")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("middlewares")])]),t._v(" "),a("td",[t._v("中间件")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("models")])]),t._v(" "),a("td",[t._v("数据库字段定义")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("Response")])]),t._v(" "),a("td",[t._v("统一封装"),a("code",[t._v("response")])])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("static")])]),t._v(" "),a("td",[t._v("资源文件夹")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("router")])]),t._v(" "),a("td",[t._v("路由")])]),t._v(" "),a("tr",[a("td",[a("code",[t._v("setting-dev.yaml")])]),t._v(" "),a("td",[t._v("配置文件")])]),t._v(" "),a("tr",[a("td",[t._v("main.go")]),t._v(" "),a("td",[t._v("服务启动文件")])])])]),t._v(" "),a("h3",{attrs:{id:"_3、初始化项目"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3、初始化项目"}},[t._v("#")]),t._v(" 3、初始化项目")]),t._v(" "),a("p",[t._v("先初始化模块管理文件：")]),t._v(" "),a("div",{staticClass:"language-go extra-class"},[a("pre",{pre:!0,attrs:{class:"language-go"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("go")]),t._v(" mod init gin_practice\n")])])]),a("p",[t._v("就会在根目录下生成一个"),a("code",[t._v("go.mod")]),t._v("文件，用来管理我们本项目使用的各种包。")]),t._v(" "),a("p",[t._v("然后再拉取我们本项目使用到的核心包：gin")]),t._v(" "),a("div",{staticClass:"language-go extra-class"},[a("pre",{pre:!0,attrs:{class:"language-go"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("go")]),t._v(" get "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("u github"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("com"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("gin"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("gonic"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("gin\n")])])]),a("p",[t._v("最后，在根目录下新建项目的唯一入口文件 "),a("code",[t._v("main.go")]),t._v("，编写第一个能运行的简单接口程序：")]),t._v(" "),a("div",{staticClass:"language-go extra-class"},[a("pre",{pre:!0,attrs:{class:"language-go"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("package")]),t._v(" main\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("import")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"github.com/gin-gonic/gin"')]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"net/http"')]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("func")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("main")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\tengin "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":=")]),t._v(" gin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("Default")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n\tengin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("GET")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/test"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("func")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("ctx "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),t._v("gin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Context"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\tctx"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("JSON")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("http"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("StatusOK"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" gin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("H"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t\t\t"),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"code"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("200")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t\t\t"),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"msg"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(":")]),t._v("  "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"success"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n\t\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n\tengin"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("Run")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[t._v("// 默认监听8080端口")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("p",[t._v("启动项目，如果在控制台打印如下日志，说明项目启动成功：")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427112008100.png",alt:"image-20220427112008100"}})]),t._v(" "),a("p",[t._v("打开浏览器，输入：http://localhost:8080/test，如果出现如下的结果，说明接口编写成功。")]),t._v(" "),a("p",[a("img",{attrs:{src:"https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220427112115378.png",alt:"image-20220427112115378"}})]),t._v(" "),a("h2",{attrs:{id:"参考"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参考"}},[t._v("#")]),t._v(" 参考")]),t._v(" "),a("ul",[a("li",[a("a",{attrs:{href:"https://link.juejin.cn/?target=url",target:"_blank",rel:"noopener noreferrer"}},[t._v("10篇带你手摸手封装gin框架(1)-开篇与架构设计"),a("OutboundLink")],1)])])])}),[],!1,null,null,null);s.default=e.exports}}]);