import "./initData.js";
import mount from "./compiler/compiler.js";

export default function WJYVue(options) {
  this._data =
    typeof options.data === "function" ? options.data() : options.data; // data属性
  this.$options = options;
  this._el = options.el;

  this.initData(); // 将data进行响应式转换, 进行代理

  if (this.$options.el) {
    this.$mount(); // 挂载
  }
}

// 挂载方法
WJYVue.prototype.$mount = function () {
  mount(this);
};
