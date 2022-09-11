/**
 * 负责初始渲染和后续更新
 * @param oldVnode
 * @param vnode
 */
import { isReserveTag } from "../utils";
import WJYVue from "../wjyvue";

export default function patch(oldVnode, vnode) {
  if (!oldVnode) {
    //  说明是子组件首次渲染
    createElm(vnode);
  } else if (oldVnode.nodeType) {
    // 说明是真实节点， 首次渲染根组件
    const parent = oldVnode.parentNode;
    // 参考标签 第一个script标签
    const referNode = oldVnode.nextSibling;
    // 创建元素， 将 vnode 变成真实节点， 并添加到父节点内
    createElm(vnode, parent, referNode);
    // 移除老的 vnode, 其实就是模板节点
    parent.removeChild(oldVnode);
  } else {
    // 后续更新
  }
}

/**
 * 创建元素
 *
 * 调用Update， 如果 prevNode 不存在， 首次渲染
 * 首次渲染流程
 *  1. 拿到当前节点的父节点、参考节点（插入到哪个子元素之前）
 *  2. 在当前vnode上记录父节点
 *  3.
 *
 *
 * @param vnode
 * @param parent 父节点
 * @param referNode 参考节点
 */
function createElm(vnode, parent, referNode) {
  // 在 vnode 上记录自己的父节点是谁
  vnode.parent = parent;
  // 创建自定义组件， 如果是非组件， 就继续后面的流程
  if (createComponent(vnode)) return;

  // 走到这里说明当前节点是一个原生标签， 走DOM API 创建这些标签， 然后添加到父节点内
  const { tag, attr, children, text } = vnode;

  if (text) {
    // 说明是文本节点
    // 创建文本节点， 并插入到父节点内
    vnode.elm = createTextNode(vnode);
  } else {
    // 首选的元素节点
    // 创建元素
    vnode.elm = document.createElement(tag);
    // 个元素设置属性
    setAttributes(attr, vnode);
    // 循环递归创建当前节点的所有子节点
    for (let i = 0, len = children.length; i < len; i++) {
      createElm(children[i], vnode.elm);
    }
  }

  // 节点创建完毕， 将创建的节点插入到父节点内
  if (parent) {
    const elm = vnode.elm;
    if (referNode) {
      parent.insertBefore(elm, referNode);
    } else {
      parent.appendChild(elm);
    }
  }
}

/**
 * 创建一个自定义组件
 * @param vnode
 */
function createComponent(vnode) {
  if (vnode.tag && !isReserveTag(vnode.tag)) {
    // 获取组件的基本信息
    const {
      tag,
      context: {
        $options: { components },
      },
    } = vnode;
    const compOptions = components[tag];
    // 直接通过 new Vue ， 源码中是 extend方法
    const compIns = new WJYVue(compOptions);
    // 把父组件的 vnode 放到子组件的实例上
    compIns._parentVnode = vnode;
    compIns.$mount();
    // 记录字组件 vnode 的父节点信息
    // compIns._vnode.parent = vnode.parent;
    // 将子组件添加到父节点内
    vnode.parent.appendChild(compIns._vnode.elm);
  }
}

/**
 * 创建文本节点
 * @param vnode
 */
function createTextNode(textVnode) {
  let { text } = textVnode,
    textNode = null;
  if (text.expression) {
    // 说明当前文本节点含有表达式
    // 这个表达式时一个响应式数据
    const value = textVnode.context[text.expression];
    textNode = document.createTextNode(
      typeof value === "object" ? JSON.stringify(value) : value
    );
  } else {
    // 纯文本节点
    textNode = document.createTextNode(text.text);
  }
  return textNode;
}

/**
 * 给节点设置属性
 */
function setAttributes(attr, vnode) {
  // 遍历属性对象， 普通属性， 直接设置， 如果是指令， 特殊处理
  for (const name in attr) {
    if (name === "vModel") {
      setVModel(attr[name].tag, attr[name].value, vnode);
    } else if (name === "vBind") {
      setVBind(vnode);
    } else if (name === "vOn") {
      setVOn(vnode);
    } else {
      // 普通指令
      vnode.elm.setAttribute(name, attr[name]);
    }
  }
}

/**
 * v-model 原理
 * @param tag
 * @param value
 * @param vnode
 */
function setVModel(tag, value, vnode) {
  const { context: vm, elm } = vnode;
  if (tag === "select") {
    // 下拉框
    // 异步， 设置时间延后
    Promise.resolve().then(() => {
      elm.value = vm[value];
    });
    elm.addEventListener("change", function () {
      vm[value] = elm.value;
    });
  } else if (tag === "input" && vnode.elm.type === "text") {
    // 文本输入框
    elm.value = vm[value]; // 设置初始值， 数据变化触发监听事件，改变
    elm.addEventListener("input", function () {
      vm[value] = elm.value;
    });
  } else if (tag === "input" && vnode.elm.type === "checkbox") {
    elm.checked = vm[value];
    elm.addEventListener("change", function () {
      vm[value] = elm.value;
    });
  }
}
function setVBind(vnode) {
  const {
    attr: { vBind },
    elm,
    context: vm,
  } = vnode;
  for (const attrName in vBind) {
    elm.setAttribute(attrName, vm[vBind[attrName]]);
    elm.removeAttribute(`v-bind:${attrName}`);
  }
}

function setVOn(vnode) {
  const {
    attr: { vOn },
    elm,
    context: vm,
  } = vnode;
  for (const eventName in vOn) {
    elm.addEventListener(eventName, function (...args) {
      vm.$options.methods[vOn[eventName]].apply(vm, args);
    });
  }
}
