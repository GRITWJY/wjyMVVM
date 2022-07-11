/*
    get() 用来计算或执行处理函数
    update() 公共的外部方法, 该方法会触发内部的run方法
    run() 运行, 用来判断内部是异步运行还是同步运行等,这个方法最终会调用内部的get方法
    cleanupDep(), 清除队列

    页面渲染由 get 方法来执行


    我们的 watcher 实例有一个属性vm, 表示的就是 当前的 vm 的实例

*/

class Watcher {
  /**
   * @param vm {Object} WJYVue 实例
   * @param expOrFn {String | Function} 如果是渲染 watcher, 传入的就是函数,
   *  数据变化就执行这个函数, 相当于之前数据变化执行moutComponent
   */
  constructor(vm, expOrfn) {
    this.vm = vm;
    this.getter = expOrfn;

    this.deps = []; // 依赖项
    this.depIds = {}; // 是一个 Set 类型, 用于保证 依赖项的唯一性 ( 简化的代码暂时不实现这一块 )

    // 一开始需要渲染: 真实 vue 中: this.lazy ? undefined : this.get()
    this.get();
  }

  /** 计算, 触发 getter */
  get() {
    this.getter.call(this.vm, this.vm); // 上下文的问题就解决了
  }
  /**
   * 执行, 并判断是懒加载, 还是同步执行, 还是异步执行:
   * 我们现在只考虑 异步执行 ( 简化的是 同步执行 )
   */
  run() {
    this.get();
    // 在真正的 vue 中是调用 queueWatcher, 来触发 nextTick 进行异步的执行
  }

  /** 对外公开的函数, 用于在 属性发生变化时触发的接口 */
  update() {
    this.run();
  }

  /** 清空依赖队列 */
  cleanupDep() {}
}
