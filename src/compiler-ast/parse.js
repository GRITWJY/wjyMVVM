import { isUnaryTag } from "../utils.js";

export default function parse(template) {
  // 最终返回的 ast
  let root = null;

  // 备份模板
  let html = template;

  // 存放ast对象
  const stack = [];

  // 遍历 html 模板字符串
  while (html.trim()) {
    // 注释标签
    if (html.indexOf("<!--") === 0) {
      // 找到注释结点的结束位置 <!-- comment --><div></div>
      const endIdx = html.indexOf("-->");
      html = html.slice(endIdx + 3);
      continue;
    }

    const startIdx = html.indexOf("<");
    // 匹配到正常标签, 如 <div id = "app"></div>
    if (startIdx === 0) {
      // 看是否是结束标签， 否则就是开始标签
      if (html.indexOf("</") === 0) {
        // 结束标签
        parseEnd();
      } else {
        // 开始标签
        parseStart();
      }
    } else if (startIdx > 0) {
      // 在开始标签之前有一段文本:  content</div>
      // 比如这里面的 content<
      const nextStartIdx = html.indexOf("<");
      if (stack.length) {
        // stack 不为空, 说明文本是栈顶元素的文本节点
        processChars(html.slice(0, nextStartIdx));
        html = html.slice(nextStartIdx);
      }
    }
  }

  return root;

  /**
   *处理开始标签, 比如 <div id = "app"> <h3>
   */
  function parseStart() {
    // 匹配开始标签的结束位置,<div id = "app">中的 >
    const endIdx = html.indexOf(">");
    // 截取开始标签内的所有内容, 'div id = "app"'
    const content = html.slice(1, endIdx);
    // 更新 html, 将contetn从 html 上截掉
    html = html.slice(endIdx + 1);
    // 标签名和属性字符串
    let tagName = "",
      attrStr = "";
    // 找到 content 中的第一个空格
    const firstSpaceIdx = content.indexOf(" ");
    if (firstSpaceIdx === -1) {
      // 没有找到空格, 说明标签没有属性，如 <h3></h3>
      tagName = content;
    } else {
      tagName = content.slice(0, firstSpaceIdx);
      // 属性字符串,如 id="app" class="test"
      attrStr = content.slice(firstSpaceIdx + 1);
    }

    //----已经获取到标签名和属性字符串

    // 处理属性
    // ['id="app"', 'class="test"']
    const attrs = attrStr ? attrStr.split(" ") : [];

    // 进一步处理属性数组, 得到一个map对象
    const attrMap = parseAttrs(attrs);
    // 生成AST
    const elementAST = generateAST(tagName, attrMap);

    if (!root) {
      // 说明吸纳着处理的标签是最开始的第一个标签
      root = elementAST;
    }
    // 将 AST 对象 push 到栈中, 当遇到它的结束标签时, 就将栈顶的 ast 对象 pop 踹
    stack.push(elementAST);

    // 自闭和标签, 比如 <input v-model="test"/>
    if (isUnaryTag(tagName)) {
      // 说明是自闭和标签, 直接进入闭合标签处理流程
      processElement();
    }
  }

  /**
   * 得到 key, value 形式的 Map 对象,
   * 还有一些 v-for, v-bind等指令就在这里面处理
   * @param attrs
   */
  function parseAttrs(attrs) {
    const attrMap = {};
    for (const attr of attrs) {
      // id="app"
      const [attrName, attrValue] = attr.split("=");
      attrMap[attrName] = attrValue.replace(/"/g, "");
    }
    return attrMap;
  }

  /**
   * 生成 AST
   * @param tag
   * @param attrMap
   */
  function generateAST(tag, attrMap) {
    return {
      // 元素节点
      type: 1,
      // 标签名
      tag,
      // 原生属性对象
      rawAttr: attrMap,
      // 子节点
      children: [],
    };
  }

  /**
   * 处理闭合标签
   */
  function parseEnd() {
    // 将闭合标签从html字符串截掉

    html = html.slice(html.indexOf(">") + 1);
    // 进一步处理栈顶元素
    processElement();
  }

  /**
   * 处理元素的闭合标签时会调用
   * 进一步处理元素上各个属性,并将处理结果放到 attr 属性上
   * <input v-model="text"/>
   * <span v-bind:title="title"></span>
   * <button v-on:click="handleClick"> click me </div>
   */
  function processElement() {
    // 弹出栈顶元素, 进一步处理该元素
    const curEle = stack.pop();
    // 进一步处理 AST 对象中的 rawAttr 对象, { attrName: attrValue }, 处理结果放到attr属性
    const { rawAttr } = curEle;
    curEle.attr = {};
    // ['v-model', 'v-bind:title', 'v-on:click']
    const propertyArr = Object.keys(rawAttr);
    if (propertyArr.includes("v-model")) {
      // 处理 v-model 指令
      processVModel(curEle);
    } else if (propertyArr.find((item) => item.match(/v-bind:(.*)/))) {
      // 返回这个元素
      processVBind(curEle, RegExp.$1, rawAttr[`v-bind:${RegExp.$1}`]);
    } else if (propertyArr.find((item) => item.match(/v-on:(.*)/))) {
      processVOn(curEle, RegExp.$1, rawAttr[`v-on:${RegExp.$1}`]);
    }
    // 节点处理完属性后， 建立与父节点的联系
    const stackLen = stack.length;
    if (stackLen) {
      stack[stackLen - 1].children.push(curEle);
      curEle.parent = stack[stackLen - 1];
    }
  }

  /**
   * 处理v-model属性
   * <input type='text' v-model="test" />
   * @param curEle
   */
  function processVModel(curEle) {
    const { tag, attr, rawAttr } = curEle;
    const { type, "v-model": vModelValue } = rawAttr;

    if (tag === "input") {
      if (/text/.test(type)) {
        // 文本输入框
        attr.vModel = { tag, type: "text", value: vModelValue };
      } else if (/checkbox/.test(type)) {
        attr.vModel = { tag, type: "checkbox", value: vModelValue };
      }
    } else if (tag === "textarea") {
      attr.vModel = { tag, value: vModelValue };
    } else if (tag === "select") {
      attr.vModel = { tag, value: vModelValue };
    }
  }

  /**
   * 处理v-bind属性
   * @param curEle
   */
  function processVBind(curEle, bindKey, bindValue) {
    curEle.attr.vBind = { [bindKey]: bindValue };
  }

  /**
   * 处理v-on属性
   * @param curEle
   */
  function processVOn(curEle, vOnKey, vOnValue) {
    curEle.attr.vOn = { [vOnKey]: vOnValue };
  }

  /**
   * 处理标签内文本
   */
  function processChars(text) {
    // 去空格
    if (!text.trim()) return;

    // 构造文本节点的 AST 对象
    const textAST = {
      type: 3,
      text,
    };

    if (text.match(/{{(.*)}}/)) {
      // {{text}}
      textAST.expression = RegExp.$1.trim();
    }

    // 将文本节点放到栈顶元素的child里
    stack[stack.length - 1].children.push(textAST);
  }
}
