---
title: Map
author: ian_kevin
date: 2022-04-19
---

# Map

## 一、Go 语言中的 Map

map 是一种无序的基于 `key-value` 的数据结构，Go 语言中的 map 是引用类型，必须初始化才能使用。

### 1、map 定义

map 是一种无序的`键值对`的集合。

map 最重要的一点是通过 key 来快速检索数据，key 类似于索引，指向数据的值。

map 是一种集合，所以我们可以像迭代数组和切片那样迭代它。不过，map 是无序的，我们无法决定它的返回顺序，这是因为 map 是使用 hash 表来实现的。

map 是引用类型，可以使用如下方式声明：

~~~go
//[keytype] 和 valuetype 之间允许有空格。
var mapname map[keytype]valuetype
~~~

其中：

- mapname 为 map 的变量名。
- keytype 为键类型。
- valuetype 是键对应的值类型。

> 在声明的时候不需要知道 map 的长度，因为 map 是可以动态增长的，未初始化的 map 的值是 nil，使用函数 len() 可以获取 map 中 键值对的数目。

~~~go
package main
import "fmt"
func main() {
    var mapLit map[string]int
    var mapAssigned map[string]int
    mapLit = map[string]int{"one": 1, "two": 2}
    mapAssigned = mapLit
    //mapAssigned 是 mapList 的引用，对 mapAssigned 的修改也会影响到 mapList 的值。
    mapAssigned["two"] = 3
    fmt.Printf("Map literal at \"one\" is: %d\n", mapLit["one"])
    fmt.Printf("Map assigned at \"two\" is: %d\n", mapLit["two"])
    fmt.Printf("Map literal at \"ten\" is: %d\n", mapLit["ten"])
}
~~~

**map的另外一种创建方式：**

~~~go
make(map[keytype]valuetype)
~~~

**切记不要使用new创建map，否则会得到一个空引用的指针**

map 可以根据新增的 key-value 动态的伸缩，因此它不存在固定长度或者最大限制，但是也可以选择标明 map 的初始容量 capacity，格式如下：

~~~go
make(map[keytype]valuetype, cap)
~~~

例如：

~~~go
map2 := make(map[string]int, 100)
~~~

`当 map 增长到容量上限的时候，如果再增加新的 key-value，map 的大小会自动加 1，所以出于性能的考虑，对于大的 map 或者会快速扩张的 map，即使只是大概知道容量，也最好先标明。`

**既然一个 key 只能对应一个 value，而 value 又是一个原始类型，那么如果一个 key 要对应多个值怎么办？**

答案是：使用`切片`

例如，当我们要处理 unix 机器上的所有进程，以父进程（pid 为整形）作为 key，所有的子进程（以所有子进程的 pid 组成的切片）作为 value。

通过将 value 定义为 []int 类型或者其他类型的切片，就可以优雅的解决这个问题，示例代码如下所示：

~~~go
mp1 := make(map[int][]int)
mp2 := make(map[int]*[]int)
~~~

### 2、map 基本使用

map 中的数据都是成对出现的，map 的基本使用示例代码如下：

```go
func main() {
  scoreMap := make(map[string]int, 8)
  scoreMap["张三"] = 90
  scoreMap["小明"] = 100
  fmt.Println(scoreMap)
  fmt.Println(scoreMap["小明"])
  fmt.Printf("type of a:%T\n", scoreMap)
}
```

输出：

```go
map[小明:100 张三:90]
100
type of a:map[string]int
```

map 也支持在声明的时候填充元素，例如：

```go
func main() {
  userInfo := map[string]string{
    "username": "pprof.cn",
    "password": "123456",
  }
  fmt.Println(userInfo) //
}
```

### 3、判断某个键是否存在

Go 语言中有个判断 map 中键是否存在的特殊写法，格式如下:

```go
value, ok := map[key]
```

举个例子：

```go
func main() {
  scoreMap := make(map[string]int)
  scoreMap["张三"] = 90
  scoreMap["小明"] = 100
  // 如果key存在ok为true,v为对应的值；不存在ok为false,v为值类型的零值
  v, ok := scoreMap["张三"]
  if ok {
    fmt.Println(v)
  } else {
    fmt.Println("查无此人")
  }
}
```

### 4、map 的遍历

Go 语言中使用 for range 遍历 map。

```go
func main() {
  scoreMap := make(map[string]int)
  scoreMap["张三"] = 90
  scoreMap["小明"] = 100
  scoreMap["王五"] = 60
  for k, v := range scoreMap {
    fmt.Println(k, v)
  }
}
```

但我们只想遍历 key 的时候，可以按下面的写法：

```go
func main() {
  scoreMap := make(map[string]int)
  scoreMap["张三"] = 90
  scoreMap["小明"] = 100
  scoreMap["王五"] = 60
  for k := range scoreMap {
    fmt.Println(k)
  }
}
```

只想遍历value的时候，可以按照下面的写法：

```go
func main() {
  scoreMap := make(map[string]int)
  scoreMap["张三"] = 90
  scoreMap["小明"] = 100
  scoreMap["王五"] = 60
  for _, v := range scoreMap {
    fmt.Println(v)
  }
}
```

> 注意： 遍历 map 时的元素顺序与添加键值对的顺序无关。

#### 4.1 按照指定顺序遍历 map

```go
func main() {
  rand.Seed(time.Now().UnixNano()) //初始化随机数种子

  var scoreMap = make(map[string]int, 200)

  for i := 0; i < 100; i++ {
    key := fmt.Sprintf("stu%02d", i) //生成stu开头的字符串
    value := rand.Intn(100)          //生成0~99的随机整数
    scoreMap[key] = value
  }
  
  //取出map中的所有key存入切片keys
  var keys = make([]string, 0, 200)
  for key := range scoreMap {
    keys = append(keys, key)
  }
  
  //对切片进行排序
  sort.Strings(keys)
  
  //按照排序后的key遍历map
  for _, key := range keys {
    fmt.Println(key, scoreMap[key])
  }
}
```

### 5、使用 delete()函数删除键值对

使用 delete()内建函数从 map 中删除一组键值对，delete()函数的格式如下：

```go
delete(map, key)
```

其中，

```go
map:表示要删除键值对的map

key:表示要删除的键值对的键
```

示例代码如下：

```go
func main(){
  scoreMap := make(map[string]int)
  scoreMap["张三"] = 90
  scoreMap["小明"] = 100
  scoreMap["王五"] = 60
  delete(scoreMap, "小明")//将小明:100从map中删除
  for k,v := range scoreMap{
    fmt.Println(k, v)
  }
}
```

**Go语言中并没有为 map 提供任何清空所有元素的函数、方法，清空 map 的唯一办法就是重新 make 一个新的 map，不用担心垃圾回收的效率，Go语言中的并行垃圾回收效率比写一个清空函数要高效的多。**

**注意map 在并发情况下，只读是线程安全的，同时读写是线程不安全的。**

### 6、元素为 map 类型的切片

下面的代码演示了切片中的元素为 map 类型时的操作：

```go
func main() {
  var mapSlice = make([]map[string]string, 3)
  for index, value := range mapSlice {
    fmt.Printf("index:%d value:%v\n", index, value)
  }
  
  fmt.Println("after init")
  
  // 对切片中的map元素进行初始化
  mapSlice[0] = make(map[string]string, 10)
  mapSlice[0]["name"] = "王五"
  mapSlice[0]["password"] = "123456"
  mapSlice[0]["address"] = "红旗大街"
  
  for index, value := range mapSlice {
    fmt.Printf("index:%d value:%v\n", index, value)
  }
}
```

### 7、值为切片类型的 map

下面的代码演示了 map 中值为切片类型的操作：

```go
func main() {
  var sliceMap = make(map[string][]string, 3)
  fmt.Println(sliceMap)
  fmt.Println("after init")
  
  key := "中国"
  value, ok := sliceMap[key]
  if !ok {
    value = make([]string, 0, 2)
  }
  value = append(value, "北京", "上海")
  
  sliceMap[key] = value
  fmt.Println(sliceMap)
}
```

### 8、练习题

1. 写一个程序，统计一个字符串中每个单词出现的次数。比如：”how do you do”中how=1 do=2 you=1。

```go
package main

import (
	"fmt"
	"strings"
)

func main() {
	var s = "how do you do"
	var wordCount = make(map[string]int, 10)

	words := strings.Split(s, " ")

	for _, word := range words {
		v, ok := wordCount[word]

		if ok {
			wordCount[word] = v + 1
		} else {
			wordCount[word] = 1
		}
	}

	for k, v := range wordCount {
		fmt.Println(k, v)
	}
}

/*
do 2
you 1
how 1
*/
```

2. 观察下面代码，写出最终的打印结果。

```go
func main() {
	type Map map[string][]int
	m := make(Map)
	s := []int{1, 2}
	s = append(s, 3)
	fmt.Printf("%+v\n", s)
	m["q1mi"] = s
	s = append(s[:1], s[2:]...)
	fmt.Printf("%+v\n", s)
	fmt.Printf("%+v\n", m["q1mi"])
}

/*
[1 2 3]
[1 3]
[1 3 3]
*/
```

## 二、Map 实现原理

### 1、什么是 Map

#### 1.1 key，value 存储

最通俗的话说 Map 是一种通过 key 来获取 value 的一个数据结构，其底层存储方式为数组，在存储时 key 不能重复，当 key 重复时，value 进行覆盖，我们通过 key 进行 hash 运算（可以简单理解为把 key 转化为一个整形数字）然后对数组的长度取余，得到 key 存储在数组的哪个下标位置，最后将 key 和 value 组装为一个结构体，放入数组下标处，看下图：

```go
length = len(array) = 4
hashkey1 = hash(xiaoming) = 4
index1  = hashkey1% length= 0
hashkey2 = hash(xiaoli) = 6
index2  = hashkey2% length= 2
```

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/1-20220425102146227.png)

#### 1.2 hash 冲突

如上图所示，数组一个下标处只能存储一个元素，也就是说一个数组下标只能存储一对 key，value, hashkey(xiaoming)=4 占用了下标 0 的位置，假设我们遇到另一个 key，hashkey(xiaowang)也是 4，这就是 hash 冲突（不同的 key 经过 hash 之后得到的值一样），那么 key=xiaowang 的怎么存储？ hash 冲突的常见解决方法

开放定址法：也就是说当我们存储一个 key，value 时，发现 hashkey(key)的下标已经被别 key 占用，那我们在这个数组中空间中重新找一个没被占用的存储这个冲突的 key，那么没被占用的有很多，找哪个好呢？常见的有线性探测法，线性补偿探测法，随机探测法，这里我们主要说一下线性探测法

线性探测，字面意思就是按照顺序来，从冲突的下标处开始往后探测，到达数组末尾时，从数组开始处探测，直到找到一个空位置存储这个 key，当数组都找不到的情况下回扩容（事实上当数组容量快满的时候就会扩容了）；查找某一个 key 的时候，找到 key 对应的下标，比较 key 是否相等，如果相等直接取出来，否则按照顺寻探测直到碰到一个空位置，说明 key 不存在。如下图：首先存储 key=xiaoming 在下标 0 处，当存储 key=xiaowang 时，hash 冲突了，按照线性探测，存储在下标 1 处，（红色的线是冲突或者下标已经被占用了） 再者 key=xiaozhao 存储在下标 4 处，当存储 key=xiaoliu 是，hash 冲突了，按照线性探测，从头开始，存储在下标 2 处 （黄色的是冲突或者下标已经被占用了）

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/2.png)

拉链法：何为拉链，简单理解为链表，当 key 的 hash 冲突时，我们在冲突位置的元素上形成一个链表，通过指针互连接，当查找时，发现 key 冲突，顺着链表一直往下找，直到链表的尾节点，找不到则返回空，如下图：

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/3.png)

开放定址（线性探测）和拉链的优缺点

- 由上面可以看出拉链法比线性探测处理简单
- 线性探测查找是会被拉链法会更消耗时间
- 线性探测会更加容易导致扩容，而拉链不会
- 拉链存储了指针，所以空间上会比线性探测占用多一点
- 拉链是动态申请存储空间的，所以更适合链长不确定的

### 2、Go 中 Map 的使用

直接用代码描述，直观，简单，易理解

```go
//直接创建初始化一个mao
var mapInit = map[string]string {"xiaoli":"湖南", "xiaoliu":"天津"}
//声明一个map类型变量,
//map的key的类型是string，value的类型是string
var mapTemp map[string]string
//使用make函数初始化这个变量,并指定大小(也可以不指定)
mapTemp = make(map[string]string,10)
//存储key ，value
mapTemp["xiaoming"] = "北京"
mapTemp["xiaowang"]= "河北"
//根据key获取value,
//如果key存在，则ok是true，否则是flase
//v1用来接收key对应的value,当ok是false时，v1是nil
v1,ok := mapTemp["xiaoming"]
fmt.Println(ok,v1)

//当key=xiaowang存在时打印value
if v2,ok := mapTemp["xiaowang"]; ok{
  fmt.Println(v2)
}
//遍历map,打印key和value
for k,v := range mapTemp{
  fmt.Println(k,v)
}
//删除map中的key
delete(mapTemp,"xiaoming")
//获取map的大小
l := len(mapTemp)
fmt.Println(l)
```

看了上面的 map 创建，初始化，增删改查等操作，我们发现 go 的 api 其实挺简单易学的

### 3、Go 中 Map 的实现原理

知其然，更得知其所以然，会使用 map 了，多问问为什么，go 底层 map 到底怎么存储呢?接下来我们一探究竟。map 的源码位于 src/runtime/map.go 中 笔者 go 的版本是 1.12 在 go 中，map 同样也是数组存储的的，每个数组下标处存储的是一个 bucket,这个 bucket 的类型见下面代码，每个 bucket 中可以存储 8 个 kv 键值对，当每个 bucket 存储的 kv 对到达 8 个之后，会通过 overflow 指针指向一个新的 bucket，从而形成一个链表,看 bmap 的结构，我想大家应该很纳闷，没看见 kv 的结构和 overflow 指针啊，事实上，这两个结构体并没有显示定义，是通过指针运算进行访问的。

```go
//bucket结构体定义 b就是bucket
type bmap{
  // tophash generally contains the top byte of the hash value
  // for each key  in this bucket. If tophash[0] < minTopHash,
  // tophash[0] is a bucket               evacuation state instead.
  // 翻译：top hash通常包含该bucket中每个键的hash值的高八位。
  // 如果tophash[0]小于mintophash，则tophash[0]为桶疏散状态

  // bucketCnt 的初始值是8
  tophash [bucketCnt]uint8
  // Followed by bucketCnt keys and then bucketCnt values.
  // NOTE: packing all the keys together and then all the values together makes the
  // code a bit more complicated than alternating key/value/key/value/... but it allows
  // us to eliminate padding which would be needed for, e.g., map[int64]int8.
  // Followed by an overflow pointer.

  // 翻译：接下来是bucketcnt键，然后是bucketcnt值。
  // 注意：将所有键打包在一起，然后将所有值打包在一起使得代码比交替键/值/键/值/更复杂。但它允许//我们消除可能需要的填充，例如map[int64]int8./后面跟一个溢出指针
}
```

看上面代码以及注释，我们能得到 bucket 中存储的 kv 是这样的，tophash 用来快速查找 key 值是否在该 bucket 中，而不同每次都通过真值进行比较；还有 kv 的存放，为什么不是 k1v1，k2v2..... 而是 k1k2...v1v2...，我们看上面的注释说的 map[int64]int8,key 是 int64（8 个字节），value 是 int8（一个字节），kv 的长度不同，如果按照 kv 格式存放，则考虑内存对齐 v 也会占用 int64，而按照后者存储时，8 个 v 刚好占用一个 int64,从这个就可以看出 go 的 map 设计之巧妙。

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/4.png)

最后我们分析一下 go 的整体内存结构，阅读一下 map 存储的源码，如下图所示，当往 map 中存储一个 kv 对时，通过 k 获取 hash 值，hash 值的低八位和 bucket 数组长度取余，定位到在数组中的那个下标，hash 值的高八位存储在 bucket 中的 tophash 中，用来快速判断 key 是否存在，key 和 value 的具体值则通过指针运算存储，当一个 bucket 满时，通过 overfolw 指针链接到下一个 bucket。

![img](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/5.png)

go 的 map 存储源码如下，省略了一些无关紧要的代码

```go
func mapassign(t *maptype, h *hmap, key unsafe.Pointer) unsafe.Pointer {
  //获取hash算法
  alg := t.key.alg
  //计算hash值
  hash := alg.hash(key, uintptr(h.hash0))
  //如果bucket数组一开始为空，则初始化
  if h.buckets == nil {
    h.buckets = newobject(t.bucket) // newarray(t.bucket, 1)
  }
  again:
  // 定位存储在哪一个bucket中
  bucket := hash & bucketMask(h.B)
  //得到bucket的结构体
  b := (*bmap)(unsafe.Pointer(uintptr(h.buckets) +bucket*uintptr(t.bucketsize)))
  //获取高八位hash值
  top := tophash(hash)
  var inserti *uint8
  var insertk unsafe.Pointer
  var val unsafe.Pointer
  bucketloop:
  //死循环
  for {
    //循环bucket中的tophash数组
    for i := uintptr(0); i < bucketCnt; i++ {
      //如果hash不相等
      if b.tophash[i] != top {
        //判断是否为空，为空则插入
        if isEmpty(b.tophash[i]) && inserti == nil {
          inserti = &b.tophash[i]
          insertk = add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
          val = add( unsafe.Pointer(b),
                    dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.valuesize) )
        }
        //插入成功，终止最外层循环
        if b.tophash[i] == emptyRest {
          break bucketloop
        }
        continue
      }
      //到这里说明高八位hash一样，获取已存在的key
      k := add(unsafe.Pointer(b), dataOffset+i*uintptr(t.keysize))
      if t.indirectkey() {
        k = *((*unsafe.Pointer)(k))
      }
      //判断两个key是否相等，不相等就循环下一个
      if !alg.equal(key, k) {
        continue
      }
      // 如果相等则更新
      if t.needkeyupdate() {
        typedmemmove(t.key, k, key)
      }
      //获取已存在的value
      val = add(unsafe.Pointer(b), dataOffset+bucketCnt*uintptr(t.keysize)+i*uintptr(t.valuesize))
      goto done
    }
    //如果上一个bucket没能插入，则通过overflow获取链表上的下一个bucket
    ovf := b.overflow(t)
    if ovf == nil {
      break
    }
    b = ovf
  }

  if inserti == nil {
    // all current buckets are full, allocate a new one.
    newb := h.newoverflow(t, b)
    inserti = &newb.tophash[0]
    insertk = add(unsafe.Pointer(newb), dataOffset)
    val = add(insertk, bucketCnt*uintptr(t.keysize))
  }

  // store new key/value at insert position
  if t.indirectkey() {
    kmem := newobject(t.key)
    *(*unsafe.Pointer)(insertk) = kmem
    insertk = kmem
  }
  if t.indirectvalue() {
    vmem := newobject(t.elem)
    *(*unsafe.Pointer)(val) = vmem
  }
  typedmemmove(t.key, insertk, key)
  //将高八位hash值存储
  *inserti = top
  h.count++
  return val
}
```

## 三、线程安全的map

并发情况下读写 map 时会出现问题，代码如下：

~~~go
// 创建一个int到int的映射
m := make(map[int]int)
// 开启一段并发代码
go func() {
    // 不停地对map进行写入
    for {
        m[1] = 1
    }
}()
// 开启一段并发代码
go func() {
    // 不停地对map进行读取
    for {
        _ = m[1]
    }
}()
// 无限循环, 让并发程序在后台执行
for {
}
~~~

运行代码会报错，输出如下：

`fatal error: concurrent map read and map write`

错误信息显示，并发的 map 读和 map 写，也就是说使用了两个并发函数不断地对 map 进行读和写而发生了竞态问题，map 内部会对这种并发操作进行检查并提前发现。

需要并发读写时，一般的做法是加锁，但这样性能并不高，Go语言在 1.9 版本中提供了一种效率较高的并发安全的 `sync.Map`，sync.Map 和 map 不同，不是以语言原生形态提供，而是在 sync 包下的特殊结构。

sync.Map 有以下特性：

- 无须初始化，直接声明即可。
- sync.Map 不能使用 map 的方式进行取值和设置等操作，而是使用 sync.Map 的方法进行调用，Store 表示存储，Load 表示获取，Delete 表示删除。
- 使用 Range 配合一个回调函数进行遍历操作，通过回调函数返回内部遍历出来的值，Range 参数中回调函数的返回值在需要继续迭代遍历时，返回 true，终止迭代遍历时，返回 false。

~~~go
package main
import (
      "fmt"
      "sync"
)
func main() {
    //sync.Map 不能使用 make 创建
    var scene sync.Map
    // 将键值对保存到sync.Map
    //sync.Map 将键和值以 interface{} 类型进行保存。
    scene.Store("greece", 97)
    scene.Store("london", 100)
    scene.Store("egypt", 200)
    // 从sync.Map中根据键取值
    fmt.Println(scene.Load("london"))
    // 根据键删除对应的键值对
    scene.Delete("london")
    // 遍历所有sync.Map中的键值对
    //遍历需要提供一个匿名函数，参数为 k、v，类型为 interface{}，每次 Range() 在遍历一个元素时，都会调用这个匿名函数把结果返回。
    scene.Range(func(k, v interface{}) bool {
        fmt.Println("iterate:", k, v)
        return true
    })
}
~~~

**sync.Map 为了保证并发安全有一些性能损失，因此在非并发情况下，使用 map 相比使用 sync.Map 会有更好的性能。**

## 四、nil

在Go语言中，布尔类型的零值（初始值）为 false，数值类型的零值为 0，字符串类型的零值为空字符串`""`，而指针、切片、映射、通道、函数和接口的零值则是 nil。

nil和其他语言的null是不同的。

**nil 标识符是不能比较的**

~~~go
package main
import (
    "fmt"
)
func main() {
    //invalid operation: nil == nil (operator == not defined on nil)
    fmt.Println(nil==nil)
}
~~~

**nil 不是关键字或保留字**

nil 并不是Go语言的关键字或者保留字，也就是说我们可以定义一个名称为 nil 的变量，比如下面这样：

~~~go
//但不提倡这样做
var nil = errors.New("my god")
~~~

**nil 没有默认类型**

~~~go
package main
import (
    "fmt"
)
func main() {
    //error :use of untyped nil
    fmt.Printf("%T", nil)
    print(nil)
}
~~~

**不同类型 nil 的指针是一样的**

~~~go
package main
import (
    "fmt"
)
func main() {
    var arr []int
    var num *int
    fmt.Printf("%p\n", arr)
    fmt.Printf("%p", num)
}
~~~

**nil 是 map、slice、pointer、channel、func、interface 的零值**

~~~go
package main
import (
    "fmt"
)
func main() {
    var m map[int]string
    var ptr *int
    var c chan int
    var sl []int
    var f func()
    var i interface{}
    fmt.Printf("%#v\n", m)
    fmt.Printf("%#v\n", ptr)
    fmt.Printf("%#v\n", c)
    fmt.Printf("%#v\n", sl)
    fmt.Printf("%#v\n", f)
    fmt.Printf("%#v\n", i)
}
~~~

**零值是Go语言中变量在声明之后但是未初始化被赋予的该类型的一个默认值。**

**不同类型的 nil 值占用的内存大小可能是不一样的**

~~~go
package main
import (
    "fmt"
    "unsafe"
)
func main() {
    var p *struct{}
    fmt.Println( unsafe.Sizeof( p ) ) // 8
    var s []int
    fmt.Println( unsafe.Sizeof( s ) ) // 24
    var m map[int]bool
    fmt.Println( unsafe.Sizeof( m ) ) // 8
    var c chan string
    fmt.Println( unsafe.Sizeof( c ) ) // 8
    var f func()
    fmt.Println( unsafe.Sizeof( f ) ) // 8
    var i interface{}
    fmt.Println( unsafe.Sizeof( i ) ) // 16
}
~~~

**具体的大小取决于编译器和架构**

## 五、new和make

make 关键字的主要作用是创建 slice、map 和 Channel 等内置的数据结构，而 new 的主要作用是为类型申请一片内存空间，并返回指向这片内存的指针。

1. make 分配空间后，会进行初始化，new分配的空间被清零
2. new 分配返回的是指针，即类型 *Type。make 返回引用，即 Type；
3. new 可以分配任意类型的数据；

## 参考

- [Map](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/Map.html)
- [Map 实现原理](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/Map%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86.html)
- [深入 Go 的 Map 使用和实现原理](https://cloud.tencent.com/developer/article/1468799)
- [Go语言基础之map](https://www.liwenzhou.com/posts/Go/08_map/)
