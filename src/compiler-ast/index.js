import compileToFunction from "./compileToFunction.js";
import mountComponent from "./mountComponent";
export default function mount(vm) {
  if (!vm.$options.render) {
    // 配置项上没有 render 函数, 则进行编译
    let { el, template } = vm.$options;

    // 获取模板字符串
    if (template) {
      // 存在 template 选项
      template = template;
    } else if (el) {
      // 存在挂载点
      vm.$el = document.querySelector(el);
      template = vm.$el.outerHTML;
    }

    // 生成渲染函数
    const render = compileToFunction(template);

    // 将渲染函数挂载到 $options 上
    vm.$options.render = render;
  }

  mountComponent(vm);
}
