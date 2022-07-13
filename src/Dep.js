// 该对象提供 依赖收集(depend)  和 派发更新 (notify)
// 在 notify 中 去调用 watcher 的 update  方法
/** vue 项目中包含很多组件, 各个组件是自治的
 *    那么 watcher 可能会有多个
 *    每一个 watcher 用于描述一个渲染行为 或 计算行为
 *      子组件发生数据的更新, 页面需要重新渲染(vue 中 是局部)
 *      例如 vue 中推荐是使用 计算属性 代替复杂的 插值表达式.
           计算属性是会伴随其使用的属性的变化而变化的
           `name: () => this.firstName + this.lastName`
           计算属性 依赖于 属性 firstName 和 属性 lastName
           只要被依赖的属性发生变化, 那么就会促使计算属性 **重新计算** ( Watcher
 */

/**
 * 依赖收集与派发更新是怎么运行起来的?
 *    我们在访问的时候 就会进行收集, 在修改的时候就会更新, 那么收集什么就更新什么
 *    所谓的依赖收集 **实际上就是告诉当前的 watcher 什么属性被访问了**,
 *    那么在这个 watcher 计算的时候 或 渲染页面的时候 就会 将这些收集到的属性进行更新.
 */

/**
 *  如何将 属性 与 当前 watcher 关联起来?
 *    在全局 准备一个 targetStack ( watcher 栈, 简单的理解为 watcher "数组", 把一个操作中需要使用的 watcher 都存储起来 )
 *    在 Watcher 调用 get 方法的时候, 将当前 Watcher 放到全局, 在 get 之前结束的时候(之后), 将这个 全局的 watcher 移除. 提供: pushTarget, popTarget
 *    在每一个属性中 都有 一个 Dep 对象
 *
 *   我们在访问对象属性的时候 ( get ), 我们的渲染 watcher 就在全局中.
 *   将 属性与 watcher 关联, 其实就是将当前渲染的 watcher 存储到属性相关的 dep 中.
 *   同时, 将 dep 也存储到 当前全局的 watcher 中. ( 互相引用的关系 )
 *
 *   属性引用了当前的渲染 watcher, **属性知道谁渲染它**
 *   当前渲染 watcher 引用了 访问的属性 ( Dep ), **当前的 Watcher 知道渲染了什么属性**
 */

let depid = 0;
export default class Dep {
  constructor() {
    this.id = depid++;
    this.subs = []; // 存储的事与当前Dep 关联的 watcher
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  removeSub(sub) {
    for (let i = this.subs.length - 1; i >= 0; i--) {
      if (sub === this.subs[i]) {
        this.subs.splice(i, 1);
      }
    }
  }

  /**就是将当前的Dep与当前的watcher 互相关联*/
  depend() {
    if (Dep.target) {
      this.addSub(Dep.target); // 将当前的 watcher 存入到当前的 Dep 上
      Dep.target.addDep(this); // 将当前的 dep 与 当前的渲染watcher关联
    }
  }

  /**
   * 触发与之关联的 watcher 的 update 方法, 起到更新作用
   */
  notify() {
    // 在真实的 Vue 中是依次触发 this.subs 中的 watcher 的 update 方法
    // 此时, deps 中已经关联到需要使用的 watcher 了
    let deps = this.subs.slice();
    deps.forEach((watcher) => {
      watcher.update();
    });
  }
}

// 全局的容器存储渲染 watcher
Dep.target = null;

let targetStack = [];

/** 将当前操作的 watcher 存储到全局 watcher 中, 参数 target 就是当前的 watcher */
export function pushTarget(target) {
  targetStack.unshift(Dep.target); // vue 源码中是 push
  Dep.target = target;
}

/**将当前 watcher 踢出*/
export function popTarget() {
  Dep.target = targetStack.shift(); // 踢到最后,就是Undefined
}

/**
 * 在 watcher 调用 get 方法的时候, 调用 pushTarget(this)
 * 调用结束, 调用 popTarget()
 * */
