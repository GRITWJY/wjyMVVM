import compileToFuntion from "./compileToFunction.js";
export default function mount(vm) {
  if (!vm.$options.render) {
    // 配置项上没有 render 函数, 则进行编译
    let template = "";
    const { el, template } = vm.$options;
    if (template) {
      // 存在 template 选项
      template = template;
    } else if (el) {
      // 存在挂载点
      template = document.querySelector(el).outerHTML;
    }

    // 生成渲染函数
    const render = compileToFunction(template);

    // 将渲染函数挂载到 $options 上
    vm.$options.render = render;
  }
}
