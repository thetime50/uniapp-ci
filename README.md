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

