import VNode from "./vnode";
/**
 * 负责运行时生成VNode的工具方法
 * @param target vue实例
 */
export default function renderHelper(target) {
  target._c = createElement;
  target._v = createTextNode;
  target._t = renderSlot;
}

/**
 * 为指定标签创建虚拟 DOM
 * @param tag
 * @param attr
 * @param children
 * @returns {*}
 */
function createElement(tag, attr, children) {
  return VNode(tag, attr, children, this);
}

/**
 * 创建文本节点的虚拟 DOM
 * @param textAst
 * @returns {*}
 */
function createTextNode(textAst) {
  return VNode(null, null, null, this, textAst);
}

/**
 * 插槽的原理简单， 难点在于实现
 * 本质： 生成 VNode, 难点在于生成 VNode 之前的各种解析， 也就是准备数据阶段
 * 生成插槽的 vnode
 * @param {*} attr
 * @param children
 */
function renderSlot(attr, children) {
  const parentAttr = this._parentVnode.attr;
  let vnode;
  if (parentAttr.scopedSlots) {
    // 说明当前组件的插槽传递了内容
    // 获取插槽信息
    const slotName = attr.name;
    const slotInfo = parentAttr.scopedSlots[slotName];
    this[slotInfo.scopeSlot] = this[Object.keys(attr.vBind)[0]];
    vnode = getVnode(slotInfo.children, this);
  } else {
    // 插槽默认内容
    // 将 children 变成 vnode 数组
    vnode = getVnode(children, this);
  }

  if (children.length === 1) return vnode[0];
  return createElement.call(this, "div", {}, vnode);
}

/**
 * 将一批 ast 节点 转成 vnode 数组
 * @param childs
 * @param vm
 */
function getVnode(childs, vm) {
  const vnode = [];
  for (let i = 0, len = childs.length; i < len; i++) {
    const { tag, attr, children, text } = childs[i];
    if (text) {
      // 文本节点
      if (typeof text === "string") {
        // text  为字符串
        // 构造文本节点的 AST 对象
        const textAst = {
          type: 3,
          text,
        };

        if (text.match(/{{(.*)}}/)) {
          // 说明是表达式
          textAst.expression = RegExp.$1.trim();
        }
        vnode.push(createTextNode.call(vm, textAst));
      } else {
        // text 为文本节点的 AST 对象
        vnode.push(createTextNode.call(vm, text));
      }
    } else {
      // 元素节点
      vnode.push(createElement.call(vm, tag, attr, getVnode(children, vm)));
    }
  }
  return vnode;
}
