// 备份 数组 原型对象
const arrayProto = Array.prototype;
// 通过继承的方式 创建新的 arrayMethdos
// 原理
// let arr = []
// arr -> Array.prototype -> Object.prototype
// arr -> 改写的方法  -> Array.prototype -> Object.prototype
const arrayMethods = Object.create(arrayProto);

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
  arrayMethods[method] = function (...args) {
    // 执行原生方法
    const result = original.apply(this, args);
    console.log(`调用了${method}的拦截方法`);
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
    // 对参数每个原型进行响应式
    for (const element of inserted) {
      observe(element); // todo: 差个this
    }
    // 调用原来的方法
    return result;
  };
});

function defineReactive(data, key, val) {
  if (typeof val === "object" && val != null) {
    observe(val);
  }

  let dep = new Dep();
  dep.__$propName__ = key;

  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      //
      dep.depend();
      return val;
    },
    set(newVal) {
      if (newVal === val) {
        return;
      }
      // 数据变成响应式
      if (typeof newVal === "object" && newVal != null) {
        observe(newVal);
      }
      val = newVal;

      // 派发更新, 找到全局的 watcher, 调用 update
      dep.notify();
    },
  });
}

/*将某一个对象的属性 访问 映射到某一个属性成员上*/
function proxy(target, prop, key) {
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      return target[prop][key];
    },
    set(nv) {
      target[prop][key] = nv;
    },
  });
}

/**将对象 o 变成响应式的, vm 就是vue实例,为了在调用时处理上下文**/
function observe(obj) {
  // 之前没有对o本身进行操作，这一次就直接对Obj进行判断
  if (Array.isArray(obj)) {
    // 对每一个元素处理
    obj.__proto__ = arrayMethods;
    for (let i = 0; i < obj.length; i++) {
      observe(obj[i]); // 对每个成员进行响应式处理
    }
  } else {
    // 对每个对象成员进行处理
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let prop = keys[i];
      defineReactive(obj, prop, obj[prop]);
    }
  }
}

WJYVue.prototype.initData = function () {
  // 遍历 this._data的成员，将 属性转换为响应式的，将 直接属性，代理到实例上
  let keys = Object.keys(this._data);
  // 响应式化
  observe(this._data);
  // 代理
  for (const element of keys) {
    proxy(this, "_data", element);
  }
};
