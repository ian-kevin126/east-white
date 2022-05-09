---
title: Map
author: ian_kevin
date: 2022-04-19
---

# Map

## 一、Go 语言中的 Map

map 是一种无序的基于 `key-value` 的数据结构，Go 语言中的 map 是引用类型，必须初始化才能使用。

### 1、map 定义

Go 语言中 map 的定义语法如下

```go
map[KeyType]ValueType
```

其中，

- `KeyType`：表示键的类型。
- `ValueType`：表示键对应的值的类型。

map 类型的变量默认初始值为 nil，需要使用 `make()` 函数来分配内存。语法为：

```go
make(map[KeyType]ValueType, [cap])
```

其中 cap 表示 map 的容量，该参数虽然不是必须的，但是我们应该在初始化 map 的时候就为其指定一个合适的容量。

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

## 参考

- [Map](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/Map.html)
- [Map 实现原理](https://www.topgoer.com/go%E5%9F%BA%E7%A1%80/Map%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86.html)
- [深入 Go 的 Map 使用和实现原理](https://cloud.tencent.com/developer/article/1468799)
- [Go语言基础之map](https://www.liwenzhou.com/posts/Go/08_map/)
