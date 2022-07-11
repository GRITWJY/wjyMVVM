// 该对象提供 依赖收集(depend)  和 派发更新 (notify)
// 在 notify 中 去调用 watcher 的 update  方法
// vue 项目中包含很多组件

class Dep {
  constructor() {
    this.subs = []; // 存储的事与当前Dep 关联的 watcher
  }

  addSub() {}

  removeSub() {}

  depend() {}

  /**
   * 触发与之关联的 watcher 的 update 方法, 起到更新作用
   */
  notify() {
    // 在真实的 Vue 中是依次触发 this.subs 中的 watcher 的 update 方法
    if (Dep.target) {
      Dep.target.update();
    }
  }
}

// 全局的容器存储渲染 watcher
Dep.target = null; // 这就是全局的 watcher
