import { def } from "./def.js";

// 备份 数组 原型对象
const arrayProto = Array.prototype;
// 通过继承的方式 创建新的 arrayMethdos
// 原理
// let arr = []
// arr -> Array.prototype -> Object.prototype
// arr -> 改写的方法  -> Array.prototype -> Object.prototype
export const arrayMethods = Object.create(arrayProto);

// 操作数组的七个方法，这七个方法可以改变数组自身
const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];

// 改写原型方法
methodsToPatch.forEach(function (method) {
  // 缓存原生方法,比如Push
  const original = arrayProto[method];

  // debugger;
  def(arrayMethods, method, function mutator(...args) {
    // 执行原生方法
    const result = original.apply(this, args);
    const ob = this.__ob__;
    console.log("method", ob);
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
    }
    // 对新插入的元素做响应式处理
    if (inserted) ob.observeArray(inserted);
    // 通知更新
    ob.dep.notify();
    return result;
  });
});
//-------------------数组响应式-ends
