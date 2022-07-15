// 生成虚拟带有{{}}的DOM, 相当于AST
import Watcher from "../watcher.js";
import compileTextNode from "./compileTextNode.js";
import compileAttribute from "./compileAttribute.js";

export default function compileNode(nodes, vm) {
  for (const node of nodes) {
    if (node.nodeType === 1) {
      // 元素节点
      // 编译属性,如 v-bind, v-model, v-on

      compileAttribute(node, vm);
      compileNode(Array.from(node.childNodes), vm);
    } else if (node.nodeType === 3 && node.textContent.match(/{{(.*)}}/)) {
      // 当前的节点为文本节点, 比如 <span>{{ key }}</span>
      compileTextNode(node, vm);
    }
  }
}
