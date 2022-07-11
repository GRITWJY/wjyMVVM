// 生成虚拟带有{{}}的DOM, 相当于AST
function generateVNode(node) {
  let nodeType = node.nodeType;
  let _vnode = null;
  if (nodeType === 1) {
    // 元素
    // debugger;
    let nodeName = node.nodeName;
    let attrs = node.attributes;
    let _attrObj = {}; // 转成对象
    for (let i = 0; i < attrs.length; i++) {
      // 这里面是一个 nodeType = 2 的属性节点
      _attrObj[attrs[i].nodeName] = attrs[i].nodeValue;
    }
    _vnode = new VNode(nodeName, _attrObj, undefined, nodeType);
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
function combine(vnode, data) {
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
function getValueByPath(obj, path) {
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
function parseVNode(vnode) {
  // 创建真实DOM
  let type = vnode.type;
  let _node = null;
  if (type === 3) {
    return document.createTextNode(vnode.value); // 创文本节点
  } else if (type === 1) {
    _node = document.createElement(vnode.tag);

    // 属性
    let data = vnode.data; // 现在这个data是键值对
    Object.keys(data).forEach((key) => {
      let attrName = key;
      let attrValue = data[key];
      _node.setAttribute(attrName, attrValue);
    });
    // 子元素
    let children = vnode.children;
    children.forEach((subvnode) => {
      _node.appendChild(parseVNode(subvnode));
    });
    return _node;
  }
}
