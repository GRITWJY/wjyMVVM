export function def(obj, key, val, enumerable) {
  // debugger;
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  });
}
