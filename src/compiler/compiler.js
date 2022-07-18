import compileNode from "./compilerNode.js";
export default function mount(vm) {
  let { el } = vm.$options;
  el = document.querySelector(el);
  compileNode(Array.from(el.childNodes), vm);
}
