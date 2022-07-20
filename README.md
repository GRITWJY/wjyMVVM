# wjyvue -- MVVM框架


## 使用方法
```
克隆下来后, 执行 npm install 安装依赖

npm run build 打包


npm run dev 运行后, 浏览器中打开 http://localhost:8092, 有基本示例

```

## 同步博客

[vue源码解析笔记](https://www.wjygrit.cn/source/vue/)

其中手写部分是同步于此仓库的代码, 总共经历了4个版本
- 模板编译
- 数据响应式
- 事件,双向绑定,双向绑定
- 解决问题+工程化

vue 源码解读部分, 是对 vue 源码的解析

## 实现功能
- 数据劫持
- 发布订阅模式
- 单向数据绑定
- 双向数据绑定


## 目录结构
```
|-- src
  |-- Dep.js
  |-- Observer.js
  |-- array.js
  |-- def.js
  |-- initData.js
  |-- proxy.js
  |-- vnode.js
  |-- watcher.js
  |-- wjyvue.js
  |-- compiler
      |-- compileAttribute.js
      |-- compileTextNode.js
      |-- compiler.js
      |-- compilerNode.js
```

