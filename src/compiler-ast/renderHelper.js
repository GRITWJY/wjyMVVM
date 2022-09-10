import VNode from "./vnode";
/**
 * 负责运行时生成VNode的工具方法
 * @param target vue实例
 */
export default function renderHelper(target) {
  target._c = createElement;
  target._v = createTextNode;
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
