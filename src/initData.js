// initData 方法, 响应式
import { observe } from "./Observer.js";
import proxy from "./proxy.js";
import WJYVue from "./wjyvue.js";

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
