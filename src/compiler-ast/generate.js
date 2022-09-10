/**
 * 从 ast 对象生成渲染函数
 * @param ast
 */
export default function generate(el) {
  const renderStr = genElement(el);
  // 转换成可执行函数， 并用 with 为渲染函数扩展作用域链
  return new Function(`with(this) { return ${renderStr}}`);
}

/**
 * _c(tag, attr, children)
 * @param el
 */
function genElement(el) {
  const { tag, rawAttr, attr } = el;
  const attrs = { ...rawAttr, ...attr };
  const children = genChildren(el);
  return `_c('${tag}',${JSON.stringify(attrs)}, [${children}])`;
}

/**
 * 处理 ast 节点的子节点， 将子节点变成渲染函数
 * @param el
 */
function genChildren(el) {
  const ret = [],
    { children } = el;
  for (let i = 0, len = children.length; i < len; i++) {
    const child = children[i];
    if (child.type === 3) {
      // 文本节点
      ret.push(`_v(${JSON.stringify(child)})`);
    } else if (child.type === 1) {
      ret.push(genElement(child));
    }
  }
  return ret;
}
