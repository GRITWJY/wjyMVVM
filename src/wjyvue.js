import "./initrender.js";
import "./initData.js";

export default function WJYVue(options) {
  this._data = options.data();
  this._el = options.el;
  let elm = document.querySelector(options.el); // vue是字符串，这里是DOM
  this._template = elm;
  this._parent = elm.parentNode;
  this.$options = options;

  this.initData(); // 将data进行响应式转换, 进行代理

  this.$mount(); // 挂载
}
