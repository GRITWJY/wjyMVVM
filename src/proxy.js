/**将某一个对象的属性 访问 映射到某一个属性成员上*/
export default function proxy(target, prop, key) {
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
