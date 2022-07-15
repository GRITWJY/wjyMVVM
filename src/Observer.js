import { def } from "./def.js";
import Dep from "./Dep.js";
import { arrayMethods } from "./array.js";

export class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      // 对每一个元素处理
      value.__proto__ = arrayMethods;
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let prop = keys[i];
      defineReactive(obj, keys[i], obj[prop]);
    }
  }

  // 处理数组
  observeArray(items) {
    for (let i = 0; i < items.length; i++) {
      observe(items[i]); // 对每个成员进行响应式处理
    }
  }
}

export function observe(value) {
  let ob;

  if (typeof value === "object" && value != null) {
    ob = new Observer(value);
  }
  return ob;
}

/**响应式核心**/
export function defineReactive(data, key, value) {
  // 过滤非对象

  const dep = new Dep();

  let childOb = observe(value);

  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      dep.depend();
      if (childOb) {
        childOb.dep.depend();
        if (Array.isArray(value)) {
          // 嵌套为数组的情况
          dependArray(value);
        }
      }
      return value;
    },
    set(newVal) {
      if (newVal === value) {
        return;
      }
      // 数据变成响应式
      if (typeof newVal === "object" && newVal != null) {
        observe(newVal);
      }
      value = newVal;

      childOb = observe(newVal);

      // 派发更新, 找到全局的 watcher, 调用 update
      dep.notify();
    },
  });
}

function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}
