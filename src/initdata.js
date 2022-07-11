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
    for (let i = 0; i < inserted.length; i++) {
      reactify(inserted[i]);
    }
    // 调用原来的方法
    return result;
  };
});

function defineReactive(data, key, val) {
  if (typeof val === "object" && val != null && !Array.isArray(val)) {
    reactify(val);
  }
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      console.log(`读取${key}属性的`);
      return val;
    },
    set(newVal) {
      if (newVal === val) {
        return;
      }
      console.log(`设置${key}的属性值为${newVal}`);
      if (typeof newVal === "object" && newVal != null) {
        val = reactify(newVal);
      } else {
        val = newVal;
      }
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

function reactify(obj, vm) {
  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let val = obj[key];
    // 如果是数组
    if (Array.isArray(val)) {
      val.__proto__ = arrayMethods;
      for (let j = 0; j < val.length; j++) {
        reactify(val[j], vm);
      }
    } else {
      defineReactive.call(vm, obj, key, val);
    }
  }
  // 只需要在这里添加代理即可(问题：在这里写的代码是会递归的)
  // 如果在这里将属性映射到Vue实例上，那么久表示Vue实例可以使用属性
  //{ 后面的name会把前面的name覆盖掉
  //  data: { name: ..., children: {name: 'jim'}}
  //}

  // todo: 提供一个Observer 方法, 在方法中, 对属性进行处理
  // 将方法封装到initData中
}

WJYVue.prototype.initData = function () {
  // 遍历 this._data的成员，将 属性转换为响应式的，将 直接属性，代理到实例上
  let keys = Object.keys(this._data);
  // 响应式化
  for (let i = 0; i < keys.length; i++) {
    // 这里将对象 this._data[keys[i]] 编程响应式的
    reactify(this._data, this);
  }
  // 代理
  for (let i = 0; i < keys.length; i++) {
    // 将this._data[keys[i]] 映射到this[keys[i]]
    // Object.defineProperty(this, keys[i], {
    //   enumerable: true,
    //   configurable: true,
    //   get() {
    //     return this._data[keys[i]];
    //   },
    //   set(nv) {
    //     this._data[key[i]] = nv;
    //   },
    // });
    proxy(this, "_data", keys[i]);
  }
};
