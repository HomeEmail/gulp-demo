# 使用gulp构建前端开发环境demo

此构建环境包括如下功能：

* 解析less，组合压缩css
* 组合压缩js
* js检查
* css里图片md5方式的版本管理
* html里图片、css和js文件引用的md5方式管理



### 安装
首先要装好nodejs，npm，gulp
打开终端输入

```
npm install
```

安装package.json里的依赖包


### 安装后目录如下
> --dest  //放构建后的文件，文件目录结构与项目代码原文件一样

> --res   //放js，css，less，images代码原文件

>> --images //图片

>> --less  //css或less

>> --js //js代码原文件

>> --temp  //存放构建过程中生成的临时文件

>  --node_modules //构建环境依赖的包

>  --cmd.bat //win下在当前目录路径打开终端

>  --*.html //html代码原文件

>  --README.md  //项目说明文件

>  --gulpfile.js  //构建程序







