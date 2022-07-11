// 挂载方法
WJYVue.prototype.mount = function () {
  // render: 生成虚拟DOM, 即上面说的 保存
  // 调用它时,利用抽象语法树和数据结合生成虚拟DOM
  this.render = this.createRenderFn();

  // 挂载组件,
  this.moutComponent();
};

// 执行 mountComponent 函数
WJYVue.prototype.moutComponent = function () {
  let mount = () => {
    // 这里是一个函数，函数的this默认是全局对象
    this.update(this.render());
  };
  mount.call(this); // 交给watcher调用的,先留着的
};

/**
 * 真正的vue中使用了二次提交的 设计结构
 * 1. 在页面中的 DOM  和 虚拟DOM 是 一一对应的关系
 * 2. AST + 数据  ->  VNode  [只要数据有变化, 就会生成 新的VNode]
 * 3. 再将 新的VNode  和  旧的VNode 进行比较, 不同的更新, 相同的忽略
 *
 * 即 createRenderFn 返回一个生成虚拟DOM的render函数, 缓存AST, 作用:减少解析模板的次数
 * 这个render 函数利用 AST 和 数据结合, 生成虚拟DOM
 * 然后update就是进行比较新旧的VNode, 去执行渲染
 */

// 返回一个生成虚拟DOM的函数, 缓存抽象语法树AST(使用虚拟DOM模拟), 即用来减少解析模板的次数
//
WJYVue.prototype.createRenderFn = function () {
  let ast = generateVNode(this._template);
  return function render() {
    let _tmp = combine(ast, this._data);
    return _tmp;
  };
};
// 虚拟DOM渲染到页面上
WJYVue.prototype.update = function (vnode) {
  // 简化，直接生成HTML DOM ，replaceChild 到页面中
  // 父元素replaceChild
  let realDOM = parseVNode(vnode);
  this._parent.replaceChild(realDOM, document.querySelector(this._el));
};
