---
title: 2.Docker概念介绍
---

# Docker概念介绍

## 1. Docker架构

![image-20220517014903174](https://ian-kevin.oss-cn-beijing.aliyuncs.com/img/image-20220517014903174.png)

从上图得知，Docker分为三部分，`客户端`，`Docker服务端`，`仓库`。

### 1.1 客户端

平常我们使用的就是客户端，通过客户端`命令`和Docker引擎进行交互

Docker 是一个客户端-服务器（C/S）架构程序。

Docker 客户端只需要向 Docker 服务端发起请求，服务端将完成所有的工作并返回相应结果。

Docker 提供了一个命令行工具 `docker` 以及一整套 RESTful API。

比如：

~~~shell
docker pull 
docker run 
~~~

**客户端可以和服务端在一台宿主机上，也可以不在**

### 1.2 Docker服务端

Docker服务端 又称为Docker主机，Docker引擎，Docker守护进程。

依托于`宿主机`，守护进程，用于管理镜像，容器，执行客户端命令等。

### 1.3 仓库Registry 

Docker有两个重要的概念`镜像`和`容器`。

镜像可以理解为就是软件安装包，容器就是软件安装完成后可运行的状态。

既然镜像是软件安装包，那么这个安装包从哪下载呢？

Docker推出了`Registry`这个概念，一般有人也称为是 注册中心，当我们需要发布Docker镜像（Docker专用软件安装包）的时候，就需要将镜像发布到注册中心上，这样其他人就可以下载使用。

Registry 分为`公共`和`私有`两种。Docker 公司运营公共的 Registry 叫做 `Docker Hub`，地址为：[https://hub.docker.com](https://hub.docker.com/)

* 一个 Docker Registry 中可以包含多个仓库（Repository）

* 每个仓库可以包含多个标签（Tag）

* 每个标签对应一个镜像

通常，一个仓库会包含同一个软件不同版本的镜像，而标签对应该软件的各个版本。我们可以通过 **「<仓库名>:<标签>」** 的格式来指定具体是这个软件哪个版本的镜像。如果不给出标签，将以 **「latest」** 作为默认标签。

## 2. 镜像

上面我们提到，`镜像可以理解为就是软件安装包`，但是这个软件安装包和我们理解意义上是不一样的，一个Docker镜像是`一个完整的操作系统的描述`。

什么意思呢？

就是一个Docker镜像描述了，`需要运行的程序以及运行程序所处的操作系统`

那不同的镜像区别在哪里呢？镜像中的操作系统中安装的软件不同，运行的程序不同。

当然镜像只是一个可执行的包，其中包括运行应用程序所需要的所有内容：包含代码，运行时间，库，环境变量和配置文件等。

真正运行，我们需要`通过镜像启动容器`。

容器才是真正的可运行的操作系统。

Docker 把 App 文件打包成为一个镜像，并且采用类似多次快照的存储技术，可以实现：

- 多个 App 可以共用相同的底层镜像（初始的操作系统镜像）；
- App 运行时的 IO 操作和镜像文件隔离；
- 通过挂载包含不同配置/数据文件的目录或者卷（Volume），单个 App 镜像可以用来运行无数个不同业务的容器。

## 3. 容器

镜像（Image）和容器（Container）的关系，就像是面向对象程序设计中的类和实例一样，镜像是静态的定义，容器是镜像运行时的实体。

容器可以被创建、启动、停止、删除、暂停等。

**注意：容器运行需要指定镜像，当容器运行后，一个容器就相当于一个虚拟的完整的操作系统，比如你通过mysql的镜像来安装mysql，当mysql的容器启动后，就相当于开启了一个操作系统，mysql只是安装在此容器内部的操作系统中，我们可以进入容器内部操作mysql（和正常操作系统一致），也可以通过docker命令来操作**

## 4. 安装docker

官方文档教程：https://docs.docker.com/engine/install/centos/



1. 卸载原有的版本

   ~~~shell
    sudo yum remove docker \
                     docker-client \
                     docker-client-latest \
                     docker-common \
                     docker-latest \
                     docker-latest-logrotate \
                     docker-logrotate \
                     docker-engine
   ~~~

   

2. 安装 `yum-utils` 

   ~~~shell
   sudo yum install -y yum-utils
   ~~~

3. 添加阿里云镜像

   ~~~shell
   yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
   ~~~

4. 安装

   ~~~shell
   sudo yum install docker-ce docker-ce-cli containerd.io
   ~~~

5. 启动并加入开机启动

   ~~~shell
   sudo systemctl start docker
   
   sudo systemctl enable docker
   ~~~



