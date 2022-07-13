import { observe } from "./Observer.js";
import proxy from "./proxy.js";
import "./initrender.js";

export default function WJYVue(options) {
  this._data = options.data();
  this._el = options.el;
  let elm = document.querySelector(options.el); // vue是字符串，这里是DOM
  this._template = elm;
  this._parent = elm.parentNode;

  this.initData(); // 将data进行响应式转换, 进行代理

  this.mount(); // 挂载
}

// initData 方法, 响应式
WJYVue.prototype.initData = function () {
  // 遍历 this._data的成员，将 属性转换为响应式的，将 直接属性，代理到实例上
  let keys = Object.keys(this._data);
  // 响应式化
  observe(this._data);
  // 代理到app.xxx
  for (const element of keys) {
    proxy(this, "_data", element);
  }
};
