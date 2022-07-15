import VNode from "./vnode.js";
import Watcher from "./watcher.js";

// 生成虚拟带有{{}}的DOM, 相当于AST
export function generateVNode(node) {
  let nodeType = node.nodeType;
  let _vnode = null;
  if (nodeType === 1) {
    // 元素节点
    let nodeName = node.nodeName;

    // 属性
    let attrs = Array.from(node.attributes);

    // compileVOnClick(node, vm);
    let _attrObj = {}; // 转成对象

    for (const attr of attrs) {
      _attrObj[attr.nodeName] = attr.nodeValue;
    }

    // 生成一个 vnode 节点, 把{{}} 当成值放在vnode里, 先不填充数据
    _vnode = new VNode(nodeName, _attrObj, undefined, nodeType);

    // 子节点
    let childNodes = node.childNodes;
    childNodes.forEach((child) => {
      _vnode.appendChild(generateVNode(child));
    });
  } else if (nodeType === 3) {
    _vnode = new VNode(undefined, undefined, node.nodeValue, nodeType);
  }
  return _vnode;
}

/*将带有坑的vnode与数据data结合，得到填充数据的vnode*/
export function combine(vnode, data) {
  let _type = vnode.type;
  let _data = vnode.data;
  let _value = vnode.value;
  let _tag = vnode.tag;
  let _children = vnode.children;
  let reg = /\{\{(.+?)\}\}/g;

  let _vnode = null;

  if (_type === 3) {
    // 文本节点
    _value = _value.replace(reg, function (_, g) {
      return getValueByPath(data, g.trim());
    });
    _vnode = new VNode(_tag, _data, _value, _type);
  } else if (_type === 1) {
    _vnode = new VNode(_tag, _data, _value, _type);
    _children.forEach((_subvnode) =>
      _vnode.appendChild(combine(_subvnode, data))
    );
  }
  return _vnode;
}

/*根据路径访问对象成员*/
export function getValueByPath(obj, path) {
  let paths = path.split("."); //[xxx,yyy]
  let res = obj;

  for (let i = 0; i < paths.length; i++) {
    let prop, arr;
    if ((arr = /(.+?)\[(.+?)\]/g.exec(paths[i]))) {
      res = res[arr[1]][arr[2]];
      // console.log(res);
    } else {
      prop = paths[i];
      res = res[prop];
    }
  }
  return res;
}

/* 根据有数据的虚拟DOM, 转成真实DOM */
export function parseVNode(vnode, vm) {
  // 创建真实DOM
  let type = vnode.type;
  let _node = null;
  if (type === 3) {
    return document.createTextNode(vnode.value); // 创文本节点
  } else if (type === 1) {
    // 元素节点
    _node = document.createElement(vnode.tag);

    // 属性
    let data = vnode.data; // 现在这个data是键值对

    Object.keys(data).forEach((key) => {
      let attrName = key;
      let attrValue = data[key];

      if (attrName.match(/v-on:click/)) {
        compileVOn(_node, attrValue, vm);
      } else if (attrName.match(/v-bind:/)) {
        compileVBind(_node, attrName, attrValue, vm);
      } else if (attrName.match(/v-model/)) {
        compileVModel(_node, attrValue, vm);
      } else {
        _node.setAttribute(attrName, attrValue);
      }
    });

    // // 属性
    // let attrs = Array.from(node.attributes);
    //
    // // compileVOnClick(node, vm);
    // let _attrObj = {}; // 转成对象
    // // debugger;
    // for (let attr of attrs) {
    //   const { name, value } = attr;
    //   if (name.match(/v-on:click/)) {
    //     compileVOn(node, value, vm);
    //   } else if (name.match(/v-bind:/)) {
    //     compileVBind(node, name, value, vm);
    //   } else if (name.match(/v-model/)) {
    //     // <input v-model="xxx"/>
    //     compileVModel(node, value, vm);
    //   } else {
    //     _attrObj[name] = value;
    //   }
    // }

    // 子元素
    let children = vnode.children;
    children.forEach((subvnode) => {
      _node.appendChild(parseVNode(subvnode, vm));
    });
    return _node;
  }
}

/**
 * v-on:click , 添加一个click事件
 * @param node
 * @param method
 * @param vm
 */
function compileVOn(node, method, vm) {
  node.addEventListener("click", function (...args) {
    console.log("点击了");
    vm.$options.methods[method].apply(vm, args);
  });
}

function compileVBind(node, attrName, attrValue, vm) {
  // 移除节点上已有的v-bind:xxx属性
  node.removeAttribute(attrName);
  attrName = attrName.replace(/v-bind:/, "");
  function cb() {
    node.setAttribute(attrName, vm[attrValue]);
  }

  new Watcher(vm, cb);
}

function compileVModel(node, key, vm) {
  let { tagName, type } = node;
  tagName = tagName.toLowerCase();
  if (tagName === "input" && type === "text") {
    // <input type="text" v-model="key" />
    // 输入框的初始值
    node.value = vm[key];
    // 响应式
    node.addEventListener("input", function () {
      vm[key] = node.value;
    });
  } else if (tagName === "input" && type === "checkbox") {
    // <input type="checkbox" v-model="key" />
    node.checked = vm[key];
    node.addEventListener("change", function () {
      vm[key] = node.checked;
    });
  } else if (tagName === "select") {
    // <select v-model="selectValue" />
    node.value = vm[key];
    node.addEventListener("change", function () {
      vm[key] = node.value;
    });
  }
}
