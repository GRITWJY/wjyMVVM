import Vue from "../wjyvue";
import Watcher from "../watcher";
export default function mountComponent(vm) {
  // 负责初始渲染和后续更新组件的一个方法
  const updateComponent = () => {
    vm._update(vm._render());
  };

  // 实例化一个渲染 watcher
  new Watcher(Vue, updateComponent);
}

Vue.prototype._render = function () {
  return this.$options.render.apply(this);
};

/**
 * 由 render 函数生成的 VNode 虚拟DOM
 * @param vnode
 * @private
 */
Vue.prototype._update = function (vnode) {
  // 获取旧的 vnode 节点
  const prevVNode = this._vnode;

  // 设置新的 vnode
  this._vnode = vnode;

  if (!prevVNode) {
    // 老的 VNode 不存在， 说明是首次渲染
    this.$el = this.__patch__(this.$el, vnode);
  } else {
    this.$el = this.__patch__(prevVNode, vnode);
  }
};
