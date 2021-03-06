# Bricks 构建说明
项目代码采用ES6模块方式编写,具体方式可以参见[harmony:modules](http://wiki.ecmascript.org/doku.php?id=harmony:modules)
构建工具依赖如下:(有可能会改动,采用其他构建工具和方法,但是构建任务保持不变)

1. Broccoli
4. es6-module-transpiler--ES6模块编译器
5. yuidocjs--Docs文档生成

## 项目依赖js库说明
1. jquery
2. handlebars
3. ember
4. ember-data
5. qunit

## 文件及目录结构说明
```javascript
* bin
* dist  //文件打包输出目录   移除,不宜上传在项目中,应在在本地
* docs  //API文档输出目录   TODO 移除,不宜上传在项目中,应在在本地  
* packages
    * bricks-metal  //模块目录
        * lib   //模块代码目录,可以有子目录
            * main.js   // 当前模块的所有子模块导出汇合文件
        * tests  //模块单元测试代码存放目录   
  tests     //单元测试配置文件存放目录
  tmp       //构建产生临时目录 移除,不宜上传在项目中,应在在本地
  vendor    //本项目所以来的JS库,通过bower管理
  .bowerrc  //bower个性化配置文件
  .jshintrc //代码校验配置文件
  bower.json    //bower管理配置文件
  BUILD.md      //本项目构建说明文档
  CHANGELOG.md  //本项目变更历史说明
  features.json //TODO
  FEATURES.md //TODO
  LICENSE
  package.json
  README.md
  VERSION   //项目版本管理配置文件
```
## 构建任务列表
1. 单元测试
2. 编译,打包,合并
3. 清除缓存
4. Docs文档生成
5. 发布构建好的项目到服务器(TODO)
  
## 构建步骤如下
```javascript
//执行构建前需执行如下操作
1. npm install
2. bower install

//可执行任务列表如下
1.broccoli serve
2.broccoli build dist
```

## 备注
1. VERSION 文件只包含版本号的文字,其他文字不能输入,并且该文件不能随意修改
2. 版本号管理按照(TODO)进行严格版本变更
3. 目前项目文件中还有些不需要的文件和目录,以及不需要上传到项目下的文件和目录,后期将进行整改
4. 目前的项目构建方式有可能会进行替换,但是项目结构 构建任务 目标不会发生改变