/**
 * 生成指定节点的虚拟DOM
 * @param tag 标签名
 * @param attr 属性对象
 * @param children 子节点数组
 * @param context
 * @param text
 * @constructor
 */
export default function VNode(
  tag,
  attr,
  children,
  context = null,
  text = null
) {
  return {
    tag,
    attr,
    children,
    context,
    text,
    parent: null,
    // 当前节点的真实节点
    elm: null,
  };
}
