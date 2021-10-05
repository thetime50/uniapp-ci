# uniapp-ci

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# 迁移说明

## 功能

- [ ] ci 编译项目 上传代码
- [ ] 版本号自增加 版本号确认
- [ ] git对比检查
- [ ] sourceMap 保存
- [ ] 依赖更新检查

## 相关资料
[npm miniprogram-ci](https://www.npmjs.com/package/miniprogram-ci)  
[微信小程序 开发辅助 /CI](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)  

[如何在nodejs里调用执行系统命令](https://www.webhek.com/post/execute-a-command-line-binary-with-node-js.html)  
[Node child_process](https://nodejs.org/api/child_process.html)  
[difference between childprocess close exit events](https://stackoverflow.com/questions/37522010/difference-between-childprocess-close-exit-events)  
   'exit' emits when the child exits but the stdio are not yet closed. 'close' emits when the child has exited and its stdios are closed.  
[nodejs在spawn中执行npm报错 [Error: spawn ENOENT]” errors](https://www.cnblogs.com/xiziyin/p/3578905.html)  
[ANSI转义序列](https://zh.wikipedia.org/wiki/ANSI%E8%BD%AC%E4%B9%89%E5%BA%8F%E5%88%97)  
[依赖更新检查参考 check-outdated](https://github.com/jens-duttke/check-outdated/blob/main/helper/dependencies.js)

### git

git-repo
git-clone

github 搜索前2

**@semantic-release/git**

https://www.npmjs.com/package/@semantic-release/git  
是个包装过git用于项目发布的命令行工具  
不符合ci项目

**nodegit**

https://github.com/nodegit/nodegit

**js-git**

https://github.com/creationix/js-git  
使用纯JavaScript实现Git客户端和服务器端的开源项目
使用起来太复杂了


**git**  

https://github.com/christkv/node-git  
没什么文档  
参考ruby的grit rugged
https://github.com/nodegit/nodegit/issues/1840#issuecomment-830441394

**simple-git**

https://github.com/steveukx/git-js



//////

[Git 合并时 --no-ff 的作用](https://blog.csdn.net/zombres/article/details/82179122)  
git merge --no-ff feature


// todo 
- gitlab-ci
## 问题笔记

### 1 文件路径不同
hbuild 项目根目录的代码部分应该在 cli项目的src文件夹里

### 2 bable 不支持条件编译报错 
bable 不支持条件编译报错

```
in ./node_modules/_@dcloudio_uni-ui@1.4.4@@dcloudio/uni-ui/lib/uni-swipe-action-item/mpother.js

Module parse failed: Duplicate export 'default' (257:7)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
| 
| // #ifdef APP-PLUS|| MP-WEIXIN  ||  H5
> export default { }
| // #endif

 @ ./node_modules/_babel-loader@8.2.2@babel-loader
```

https://ext.dcloud.net.cn/plugin?id=55  
注意 cli 项目默认是不编译 node_modules 下的组件的，导致条件编译等功能失效 ，导致组件异常 需要在根目录创建 vue.config.js 文件 ，增加 @dcloudio/uni-ui 包的编译即可正常

https://www.jianshu.com/p/49372ed954bd  
transpileDependencies无效怎么办  
要使用npm，不能使用cnpm

### 3 git relog

git rtelog命令查看操作历史还原reset命令删除的提交

### 4 导入manifest.json 报错
require('./src/manifest.json')报错  
需要使用json5解析  
[require-json5](https://www.npmjs.com/package/require-json5)

### 5 如何在Github上删除Release或Tag
[如何在Github上删除Release或Tag](https://www.maixj.net/ict/release-tag-22821)

### 6 使用nodegit 报错
使用nodegit 报错
```cmd
npm ERR! code 1
npm ERR! path D:\1024\web\test\node_modules\nodegit
npm ERR! command failed
npm ERR! command C:\Windows\system32\cmd.exe /d /s /c node-gyp rebuild
npm ERR! gyp info it worked if it ends with ok
npm ERR! gyp info using node-gyp@4.0.0
npm ERR! gyp info using node@16.5.0 | win32 | x64
npm ERR! (node:19808) [DEP0150] DeprecationWarning: Setting process.config is deprecated. In the future the property will be read-only.
npm ERR! (Use `node --trace-deprecation ...` to show where the warning was created)
npm ERR! gyp info spawn E:\Python27\python2.EXE
```
https://github.com/nodejs/node-gyp#on-windows  
https://github.com/nodegit/nodegit/issues/1840#issuecomment-830441394  
我们将在 0.28.0 中解决这个问题。

### 7 npm 安装本地/github依赖包 
[npm安装github包的方式](https://www.cnblogs.com/mybilibili/p/10482192.html)
直接利用用户名和仓库名进行安装  
npm install easterCat/kiana-js

也可以在前面加上 github 前缀  
npm install github:easterCat/kiana-js

直接通过 git 上项目的地址进行安装  
npm install git+https://github.com/easterCat/kiana-js.git

或者以 ssh 的方式  
npm install git+ssh://github.com/easterCat/kiana-js.git


npm install &lt;folder&gt;

### 8 npx wxci-public 报语法错误
https://stackoverflow.com/questions/39585342/node-when-i-run-package-json-bin-command-give-me-syntax-error-near-unexp

文件第一行指定运行环境 #!/usr/bin/env node

### 9 npx执行包错 必须使用import加载ES模块
```cmd
Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: D:\1024\web\uniapp-weixin-ci\node_modules\ora\index.js
require() of ES modules is not supported.
require() of D:\1024\web\uniapp-weixin-ci\node_modules\ora\index.js from D:\1024\web\uniapp-weixin-ci\src\index.js is an ES module file as it is a .js file whose nearest parent package.json contains "type": "module" which defines all .js files in that package scope as ES modules.
```

ora 使用 ^3.4.0 版本  
log-symbols 使用 ^2.2.0

### 重复的git tag 处理
```cmd

/ set tag and push remoteGitError: To github.com:thetime50/uniapp-ci.git
=       refs/tags/0.0.3:refs/tags/0.0.3 [up to date]
*       refs/tags/0.0.4:refs/tags/0.0.4 [new tag]
!       refs/tags/0.0.1:refs/tags/0.0.1 [rejected] (already exists)
!       refs/tags/0.0.2:refs/tags/0.0.2 [rejected] (already exists)
Done
Pushing to github.com:thetime50/uniapp-ci.git
error: failed to push some refs to 'github.com:thetime50/uniapp-ci.git'
hint: Updates were rejected because the tag already exists in the remote.
```
要把 git pull 移到版本检查前面
