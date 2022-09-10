/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Dep.js":
/*!********************!*\
  !*** ./src/Dep.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "popTarget": () => (/* binding */ popTarget),
/* harmony export */   "pushTarget": () => (/* binding */ pushTarget)
/* harmony export */ });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 该对象提供 依赖收集(depend)  和 派发更新 (notify)
// 在 notify 中 去调用 watcher 的 update  方法
/** vue 项目中包含很多组件, 各个组件是自治的
 *    那么 watcher 可能会有多个
 *    每一个 watcher 用于描述一个渲染行为 或 计算行为
 *      子组件发生数据的更新, 页面需要重新渲染(vue 中 是局部)
 *      例如 vue 中推荐是使用 计算属性 代替复杂的 插值表达式.
           计算属性是会伴随其使用的属性的变化而变化的
           `name: () => this.firstName + this.lastName`
           计算属性 依赖于 属性 firstName 和 属性 lastName
           只要被依赖的属性发生变化, 那么就会促使计算属性 **重新计算** ( Watcher
 */

/**
 * 依赖收集与派发更新是怎么运行起来的?
 *    我们在访问的时候 就会进行收集, 在修改的时候就会更新, 那么收集什么就更新什么
 *    所谓的依赖收集 **实际上就是告诉当前的 watcher 什么属性被访问了**,
 *    那么在这个 watcher 计算的时候 或 渲染页面的时候 就会 将这些收集到的属性进行更新.
 */

/**
 *  如何将 属性 与 当前 watcher 关联起来?
 *    在全局 准备一个 targetStack ( watcher 栈, 简单的理解为 watcher "数组", 把一个操作中需要使用的 watcher 都存储起来 )
 *    在 Watcher 调用 get 方法的时候, 将当前 Watcher 放到全局, 在 get 之前结束的时候(之后), 将这个 全局的 watcher 移除. 提供: pushTarget, popTarget
 *    在每一个属性中 都有 一个 Dep 对象
 *
 *   我们在访问对象属性的时候 ( get ), 我们的渲染 watcher 就在全局中.
 *   将 属性与 watcher 关联, 其实就是将当前渲染的 watcher 存储到属性相关的 dep 中.
 *   同时, 将 dep 也存储到 当前全局的 watcher 中. ( 互相引用的关系 )
 *
 *   属性引用了当前的渲染 watcher, **属性知道谁渲染它**
 *   当前渲染 watcher 引用了 访问的属性 ( Dep ), **当前的 Watcher 知道渲染了什么属性**
 */

var depid = 0;

var Dep = function () {
  function Dep() {
    _classCallCheck(this, Dep);

    this.id = depid++;
    this.subs = []; // 存储的事与当前Dep 关联的 watcher
  }

  _createClass(Dep, [{
    key: "addSub",
    value: function addSub(sub) {
      this.subs.push(sub);
    }
  }, {
    key: "removeSub",
    value: function removeSub(sub) {
      for (var i = this.subs.length - 1; i >= 0; i--) {
        if (sub === this.subs[i]) {
          this.subs.splice(i, 1);
        }
      }
    }

    /**就是将当前的Dep与当前的watcher 互相关联*/

  }, {
    key: "depend",
    value: function depend() {
      if (Dep.target) {
        this.addSub(Dep.target); // 将当前的 watcher 存入到当前的 Dep 上
        Dep.target.addDep(this); // 将当前的 dep 与 当前的渲染watcher关联
      }
    }

    /**
     * 触发与之关联的 watcher 的 update 方法, 起到更新作用
     */

  }, {
    key: "notify",
    value: function notify() {
      // 在真实的 Vue 中是依次触发 this.subs 中的 watcher 的 update 方法
      // 此时, deps 中已经关联到需要使用的 watcher 了
      var deps = this.subs.slice();
      deps.forEach(function (watcher) {
        watcher.update();
      });
    }
  }]);

  return Dep;
}();

// 全局的容器存储渲染 watcher


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dep);
Dep.target = null;

var targetStack = [];

/** 将当前操作的 watcher 存储到全局 watcher 中, 参数 target 就是当前的 watcher */
function pushTarget(target) {
  targetStack.unshift(Dep.target); // vue 源码中是 push
  Dep.target = target;
}

/**将当前 watcher 踢出*/
function popTarget() {
  Dep.target = targetStack.shift(); // 踢到最后,就是Undefined
}

/**
 * 在 watcher 调用 get 方法的时候, 调用 pushTarget(this)
 * 调用结束, 调用 popTarget()
 * */

/***/ }),

/***/ "./src/Observer.js":
/*!*************************!*\
  !*** ./src/Observer.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Observer": () => (/* binding */ Observer),
/* harmony export */   "defineReactive": () => (/* binding */ defineReactive),
/* harmony export */   "observe": () => (/* binding */ observe)
/* harmony export */ });
/* harmony import */ var _def_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./def.js */ "./src/def.js");
/* harmony import */ var _Dep_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Dep.js */ "./src/Dep.js");
/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./array.js */ "./src/array.js");
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }





var Observer = function () {
  function Observer(value) {
    _classCallCheck(this, Observer);

    this.value = value;
    this.dep = new _Dep_js__WEBPACK_IMPORTED_MODULE_1__["default"]();
    (0,_def_js__WEBPACK_IMPORTED_MODULE_0__.def)(value, "__ob__", this);
    if (Array.isArray(value)) {
      // 对每一个元素处理
      value.__proto__ = _array_js__WEBPACK_IMPORTED_MODULE_2__.arrayMethods;
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  _createClass(Observer, [{
    key: "walk",
    value: function walk(obj) {
      var keys = Object.keys(obj);
      for (var i = 0; i < keys.length; i++) {
        var prop = keys[i];
        defineReactive(obj, keys[i], obj[prop]);
      }
    }

    // 处理数组

  }, {
    key: "observeArray",
    value: function observeArray(items) {
      for (var i = 0; i < items.length; i++) {
        observe(items[i]); // 对每个成员进行响应式处理
      }
    }
  }]);

  return Observer;
}();

function observe(value) {
  var ob = void 0;

  if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && value != null) {
    ob = new Observer(value);
  }
  return ob;
}

/**响应式核心**/
function defineReactive(data, key, value) {
  // 过滤非对象

  var dep = new _Dep_js__WEBPACK_IMPORTED_MODULE_1__["default"]();

  var childOb = observe(value);

  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get: function get() {
      dep.depend();
      if (childOb) {
        childOb.dep.depend();
        if (Array.isArray(value)) {
          // 嵌套为数组的情况
          dependArray(value);
        }
      }
      return value;
    },
    set: function set(newVal) {
      if (newVal === value) {
        return;
      }
      // 数据变成响应式
      if ((typeof newVal === "undefined" ? "undefined" : _typeof(newVal)) === "object" && newVal != null) {
        observe(newVal);
      }
      value = newVal;

      childOb = observe(newVal);

      // 派发更新, 找到全局的 watcher, 调用 update
      dep.notify();
    }
  });
}

function dependArray(value) {
  for (var e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/***/ }),

/***/ "./src/array.js":
/*!**********************!*\
  !*** ./src/array.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arrayMethods": () => (/* binding */ arrayMethods)
/* harmony export */ });
/* harmony import */ var _def_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./def.js */ "./src/def.js");


// 备份 数组 原型对象
var arrayProto = Array.prototype;
// 通过继承的方式 创建新的 arrayMethdos
// 原理
// let arr = []
// arr -> Array.prototype -> Object.prototype
// arr -> 改写的方法  -> Array.prototype -> Object.prototype
var arrayMethods = Object.create(arrayProto);

// 操作数组的七个方法，这七个方法可以改变数组自身
var methodsToPatch = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];

// 改写原型方法
methodsToPatch.forEach(function (method) {
  // 缓存原生方法,比如Push
  var original = arrayProto[method];

  // debugger;
  (0,_def_js__WEBPACK_IMPORTED_MODULE_0__.def)(arrayMethods, method, function mutator() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // 执行原生方法
    var result = original.apply(this, args);
    var ob = this.__ob__;
    console.log("method", ob);
    var inserted = void 0;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
    }
    // 对新插入的元素做响应式处理
    if (inserted) ob.observeArray(inserted);
    // 通知更新
    ob.dep.notify();
    return result;
  });
});
//-------------------数组响应式-ends

/***/ }),

/***/ "./src/compiler-ast/compileToFunction.js":
/*!***********************************************!*\
  !*** ./src/compiler-ast/compileToFunction.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ compileToFunction)
/* harmony export */ });
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parse.js */ "./src/compiler-ast/parse.js");
/* harmony import */ var _generate_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./generate.js */ "./src/compiler-ast/generate.js");



function compileToFunction(template) {
  // 将模板编译为 ast
  var ast = (0,_parse_js__WEBPACK_IMPORTED_MODULE_0__["default"])(template);
  // 从 ast 生成渲染函数
  var render = (0,_generate_js__WEBPACK_IMPORTED_MODULE_1__["default"])(ast);
  return render;
}

/***/ }),

/***/ "./src/compiler-ast/generate.js":
/*!**************************************!*\
  !*** ./src/compiler-ast/generate.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ generate)
/* harmony export */ });
function generate(ast) {
  console.log(ast);
}

/***/ }),

/***/ "./src/compiler-ast/index.js":
/*!***********************************!*\
  !*** ./src/compiler-ast/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mount)
/* harmony export */ });
/* harmony import */ var _compileToFunction_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./compileToFunction.js */ "./src/compiler-ast/compileToFunction.js");

function mount(vm) {
  if (!vm.$options.render) {
    // 配置项上没有 render 函数, 则进行编译
    var _vm$$options = vm.$options,
        el = _vm$$options.el,
        template = _vm$$options.template;

    // 获取模板字符串

    if (template) {
      // 存在 template 选项
      template = template;
    } else if (el) {
      // 存在挂载点
      template = document.querySelector(el).outerHTML;
    }

    // 生成渲染函数
    var render = (0,_compileToFunction_js__WEBPACK_IMPORTED_MODULE_0__["default"])(template);

    // 将渲染函数挂载到 $options 上
    vm.$options.render = render;
  }
}

/***/ }),

/***/ "./src/compiler-ast/parse.js":
/*!***********************************!*\
  !*** ./src/compiler-ast/parse.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ parse)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ "./src/utils.js");
var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



function parse(template) {
  // 最终返回的 ast
  var root = null;

  // 备份模板
  var html = template;

  // 存放ast对象
  var stack = [];

  // 遍历 html 模板字符串
  while (html.trim()) {
    // 注释标签
    if (html.indexOf("<!--") === 0) {
      // 找到注释结点的结束位置 <!-- comment --><div></div>
      var endIdx = html.indexOf("-->");
      html = html.slice(endIdx + 3);
      continue;
    }

    var startIdx = html.indexOf("<");
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
      var nextStartIdx = html.indexOf("<");
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
    var endIdx = html.indexOf(">");
    // 截取开始标签内的所有内容, 'div id = "app"'
    var content = html.slice(1, endIdx);
    // 更新 html, 将contetn从 html 上截掉
    html = html.slice(endIdx + 1);
    // 标签名和属性字符串
    var tagName = "",
        attrStr = "";
    // 找到 content 中的第一个空格
    var firstSpaceIdx = content.indexOf(" ");
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
    var attrs = attrStr ? attrStr.split(" ") : [];

    // 进一步处理属性数组, 得到一个map对象
    var attrMap = parseAttrs(attrs);
    // 生成AST
    var elementAST = generateAST(tagName, attrMap);

    if (!root) {
      // 说明吸纳着处理的标签是最开始的第一个标签
      root = elementAST;
    }
    // 将 AST 对象 push 到栈中, 当遇到它的结束标签时, 就将栈顶的 ast 对象 pop 踹
    stack.push(elementAST);

    // 自闭和标签, 比如 <input v-model="test"/>
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.isUnaryTag)(tagName)) {
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
    var attrMap = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = attrs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var attr = _step.value;

        // id="app"
        var _attr$split = attr.split("="),
            _attr$split2 = _slicedToArray(_attr$split, 2),
            attrName = _attr$split2[0],
            attrValue = _attr$split2[1];

        attrMap[attrName] = attrValue;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
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
      tag: tag,
      // 原生属性对象
      rawAttr: attrMap,
      // 子节点
      children: []
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
    var curEle = stack.pop();
    // 进一步处理 AST 对象中的 rawAttr 对象, { attrName: attrValue }, 处理结果放到attr属性
    var rawAttr = curEle.rawAttr;

    curEle.attr = {};
    // ['v-model', 'v-bind:title', 'v-on:click']
    var propertyArr = Object.keys(rawAttr);
    if (propertyArr.includes("v-model")) {
      // 处理 v-model 指令
      processVModel(curEle);
    } else if (propertyArr.find(function (item) {
      return item.match(/v-bind:(.*)/);
    })) {
      // 返回这个元素
      processVBind(curEle, RegExp.$1, rawAttr["v-bind:" + RegExp.$1]);
    } else if (propertyArr.find(function (item) {
      return item.match(/v-on:(.*)/);
    })) {
      processVOn(curEle, RegExp.$1, rawAttr["v-on:" + RegExp.$1]);
    }
    // 节点处理完属性后， 建立与父节点的联系
    var stackLen = stack.length;
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
    var _curEle$attr = curEle.attr,
        tag = _curEle$attr.tag,
        attr = _curEle$attr.attr,
        rawAttr = _curEle$attr.rawAttr;
    var type = rawAttr.type,
        vModelValue = rawAttr["v-model"];


    if (tag === "input") {
      if (/text/.test(type)) {
        // 文本输入框
        attr.vModel = { tag: tag, type: "text", value: vModelValue };
      } else if (/checkbox/.test(type)) {
        attr.vModel = { tag: tag, type: "checkbox", value: vModelValue };
      }
    } else if (tag === "textarea") {
      attr.vModel = { tag: tag, value: vModelValue };
    } else if (tag === "select") {
      attr.vModel = { tag: tag, value: vModelValue };
    }
  }

  /**
   * 处理v-bind属性
   * @param curEle
   */
  function processVBind(curEle, bindKey, bindValue) {
    curEle.attr.VBind = _defineProperty({}, bindKey, bindValue);
  }

  /**
   * 处理v-on属性
   * @param curEle
   */
  function processVOn(curEle, vOnKey, vOnValue) {
    curEle.attr.VOn = _defineProperty({}, vOnKey, vOnValue);
  }

  /**
   * 处理标签内文本
   */
  function processChars(text) {
    // 去空格
    if (!text.trim()) return;

    // 构造文本节点的 AST 对象
    var textAST = {
      type: 3,
      text: text
    };

    if (text.match(/{{(.*)}}/)) {
      // {{text}}
      textAST.expression = RegExp.$1.trim();
    }

    // 将文本节点放到栈顶元素的child里
    stack[stack.length - 1].children.push(textAST);
  }
}

/***/ }),

/***/ "./src/def.js":
/*!********************!*\
  !*** ./src/def.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "def": () => (/* binding */ def)
/* harmony export */ });
function def(obj, key, val, enumerable) {
  // debugger;
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/***/ }),

/***/ "./src/initData.js":
/*!*************************!*\
  !*** ./src/initData.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Observer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Observer.js */ "./src/Observer.js");
/* harmony import */ var _proxy_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./proxy.js */ "./src/proxy.js");
/* harmony import */ var _wjyvue_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./wjyvue.js */ "./src/wjyvue.js");
// initData 方法, 响应式




_wjyvue_js__WEBPACK_IMPORTED_MODULE_2__["default"].prototype.initData = function () {
  // 遍历 this._data的成员，将 属性转换为响应式的，将 直接属性，代理到实例上
  var keys = Object.keys(this._data);
  // 响应式化
  (0,_Observer_js__WEBPACK_IMPORTED_MODULE_0__.observe)(this._data);
  // 代理到app.xxx
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var element = _step.value;

      (0,_proxy_js__WEBPACK_IMPORTED_MODULE_1__["default"])(this, "_data", element);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

/***/ }),

/***/ "./src/proxy.js":
/*!**********************!*\
  !*** ./src/proxy.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ proxy)
/* harmony export */ });
/**将某一个对象的属性 访问 映射到某一个属性成员上*/
function proxy(target, prop, key) {
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get: function get() {
      return target[prop][key];
    },
    set: function set(nv) {
      target[prop][key] = nv;
    }
  });
}

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isUnaryTag": () => (/* binding */ isUnaryTag)
/* harmony export */ });
/**
 * 判断指定标签是否为自闭和标签
 * @param tagName
 */
function isUnaryTag(tagName) {
  return ["input"].includes(tagName);
}

/***/ }),

/***/ "./src/wjyvue.js":
/*!***********************!*\
  !*** ./src/wjyvue.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WJYVue)
/* harmony export */ });
/* harmony import */ var _initData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./initData.js */ "./src/initData.js");
/* harmony import */ var _compiler_ast_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./compiler-ast/index */ "./src/compiler-ast/index.js");



function WJYVue(options) {
  this._data = typeof options.data === "function" ? options.data() : options.data; // data属性
  this.$options = options;
  this._el = options.el;
  this.initData(); // 将data进行响应式转换, 进行代理

  if (this.$options.el) {
    this.$mount(); // 挂载
  }
}

// 挂载方法
WJYVue.prototype.$mount = function () {
  (0,_compiler_ast_index__WEBPACK_IMPORTED_MODULE_1__["default"])(this);
};

__webpack_require__.g.WJYVue = WJYVue;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/wjyvue.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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d0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7VUVOQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3dqeWdyaXQvLi9zcmMvRGVwLmpzIiwid2VicGFjazovL3dqeWdyaXQvLi9zcmMvT2JzZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vd2p5Z3JpdC8uL3NyYy9hcnJheS5qcyIsIndlYnBhY2s6Ly93anlncml0Ly4vc3JjL2NvbXBpbGVyLWFzdC9jb21waWxlVG9GdW5jdGlvbi5qcyIsIndlYnBhY2s6Ly93anlncml0Ly4vc3JjL2NvbXBpbGVyLWFzdC9nZW5lcmF0ZS5qcyIsIndlYnBhY2s6Ly93anlncml0Ly4vc3JjL2NvbXBpbGVyLWFzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly93anlncml0Ly4vc3JjL2NvbXBpbGVyLWFzdC9wYXJzZS5qcyIsIndlYnBhY2s6Ly93anlncml0Ly4vc3JjL2RlZi5qcyIsIndlYnBhY2s6Ly93anlncml0Ly4vc3JjL2luaXREYXRhLmpzIiwid2VicGFjazovL3dqeWdyaXQvLi9zcmMvcHJveHkuanMiLCJ3ZWJwYWNrOi8vd2p5Z3JpdC8uL3NyYy91dGlscy5qcyIsIndlYnBhY2s6Ly93anlncml0Ly4vc3JjL3dqeXZ1ZS5qcyIsIndlYnBhY2s6Ly93anlncml0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dqeWdyaXQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dqeWdyaXQvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly93anlncml0L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2p5Z3JpdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dqeWdyaXQvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly93anlncml0L3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly93anlncml0L3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyDor6Xlr7nosaHmj5Dkvpsg5L6d6LWW5pS26ZuGKGRlcGVuZCkgIOWSjCDmtL7lj5Hmm7TmlrAgKG5vdGlmeSlcbi8vIOWcqCBub3RpZnkg5LitIOWOu+iwg+eUqCB3YXRjaGVyIOeahCB1cGRhdGUgIOaWueazlVxuLyoqIHZ1ZSDpobnnm67kuK3ljIXlkKvlvojlpJrnu4Tku7YsIOWQhOS4que7hOS7tuaYr+iHquayu+eahFxuICogICAg6YKj5LmIIHdhdGNoZXIg5Y+v6IO95Lya5pyJ5aSa5LiqXG4gKiAgICDmr4/kuIDkuKogd2F0Y2hlciDnlKjkuo7mj4/ov7DkuIDkuKrmuLLmn5PooYzkuLog5oiWIOiuoeeul+ihjOS4ulxuICogICAgICDlrZDnu4Tku7blj5HnlJ/mlbDmja7nmoTmm7TmlrAsIOmhtemdoumcgOimgemHjeaWsOa4suafkyh2dWUg5LitIOaYr+WxgOmDqClcbiAqICAgICAg5L6L5aaCIHZ1ZSDkuK3mjqjojZDmmK/kvb/nlKgg6K6h566X5bGe5oCnIOS7o+abv+WkjeadgueahCDmj5LlgLzooajovr7lvI8uXG4gICAgICAgICAgIOiuoeeul+WxnuaAp+aYr+S8muS8tOmaj+WFtuS9v+eUqOeahOWxnuaAp+eahOWPmOWMluiAjOWPmOWMlueahFxuICAgICAgICAgICBgbmFtZTogKCkgPT4gdGhpcy5maXJzdE5hbWUgKyB0aGlzLmxhc3ROYW1lYFxuICAgICAgICAgICDorqHnrpflsZ7mgKcg5L6d6LWW5LqOIOWxnuaApyBmaXJzdE5hbWUg5ZKMIOWxnuaApyBsYXN0TmFtZVxuICAgICAgICAgICDlj6ropoHooqvkvp3otZbnmoTlsZ7mgKflj5HnlJ/lj5jljJYsIOmCo+S5iOWwseS8muS/g+S9v+iuoeeul+WxnuaApyAqKumHjeaWsOiuoeeulyoqICggV2F0Y2hlclxuICovXG5cbi8qKlxuICog5L6d6LWW5pS26ZuG5LiO5rS+5Y+R5pu05paw5piv5oCO5LmI6L+Q6KGM6LW35p2l55qEP1xuICogICAg5oiR5Lus5Zyo6K6/6Zeu55qE5pe25YCZIOWwseS8mui/m+ihjOaUtumbhiwg5Zyo5L+u5pS555qE5pe25YCZ5bCx5Lya5pu05pawLCDpgqPkuYjmlLbpm4bku4DkuYjlsLHmm7TmlrDku4DkuYhcbiAqICAgIOaJgOiwk+eahOS+nei1luaUtumbhiAqKuWunumZheS4iuWwseaYr+WRiuivieW9k+WJjeeahCB3YXRjaGVyIOS7gOS5iOWxnuaAp+iiq+iuv+mXruS6hioqLFxuICogICAg6YKj5LmI5Zyo6L+Z5LiqIHdhdGNoZXIg6K6h566X55qE5pe25YCZIOaIliDmuLLmn5PpobXpnaLnmoTml7blgJkg5bCx5LyaIOWwhui/meS6m+aUtumbhuWIsOeahOWxnuaAp+i/m+ihjOabtOaWsC5cbiAqL1xuXG4vKipcbiAqICDlpoLkvZXlsIYg5bGe5oCnIOS4jiDlvZPliY0gd2F0Y2hlciDlhbPogZTotbfmnaU/XG4gKiAgICDlnKjlhajlsYAg5YeG5aSH5LiA5LiqIHRhcmdldFN0YWNrICggd2F0Y2hlciDmoIgsIOeugOWNleeahOeQhuino+S4uiB3YXRjaGVyIFwi5pWw57uEXCIsIOaKiuS4gOS4quaTjeS9nOS4remcgOimgeS9v+eUqOeahCB3YXRjaGVyIOmDveWtmOWCqOi1t+adpSApXG4gKiAgICDlnKggV2F0Y2hlciDosIPnlKggZ2V0IOaWueazleeahOaXtuWAmSwg5bCG5b2T5YmNIFdhdGNoZXIg5pS+5Yiw5YWo5bGALCDlnKggZ2V0IOS5i+WJjee7k+adn+eahOaXtuWAmSjkuYvlkI4pLCDlsIbov5nkuKog5YWo5bGA55qEIHdhdGNoZXIg56e76ZmkLiDmj5Dkvps6IHB1c2hUYXJnZXQsIHBvcFRhcmdldFxuICogICAg5Zyo5q+P5LiA5Liq5bGe5oCn5LitIOmDveaciSDkuIDkuKogRGVwIOWvueixoVxuICpcbiAqICAg5oiR5Lus5Zyo6K6/6Zeu5a+56LGh5bGe5oCn55qE5pe25YCZICggZ2V0ICksIOaIkeS7rOeahOa4suafkyB3YXRjaGVyIOWwseWcqOWFqOWxgOS4rS5cbiAqICAg5bCGIOWxnuaAp+S4jiB3YXRjaGVyIOWFs+iBlCwg5YW25a6e5bCx5piv5bCG5b2T5YmN5riy5p+T55qEIHdhdGNoZXIg5a2Y5YKo5Yiw5bGe5oCn55u45YWz55qEIGRlcCDkuK0uXG4gKiAgIOWQjOaXtiwg5bCGIGRlcCDkuZ/lrZjlgqjliLAg5b2T5YmN5YWo5bGA55qEIHdhdGNoZXIg5LitLiAoIOS6kuebuOW8leeUqOeahOWFs+ezuyApXG4gKlxuICogICDlsZ7mgKflvJXnlKjkuoblvZPliY3nmoTmuLLmn5Mgd2F0Y2hlciwgKirlsZ7mgKfnn6XpgZPosIHmuLLmn5PlroMqKlxuICogICDlvZPliY3muLLmn5Mgd2F0Y2hlciDlvJXnlKjkuoYg6K6/6Zeu55qE5bGe5oCnICggRGVwICksICoq5b2T5YmN55qEIFdhdGNoZXIg55+l6YGT5riy5p+T5LqG5LuA5LmI5bGe5oCnKipcbiAqL1xuXG5sZXQgZGVwaWQgPSAwO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVwIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pZCA9IGRlcGlkKys7XG4gICAgdGhpcy5zdWJzID0gW107IC8vIOWtmOWCqOeahOS6i+S4juW9k+WJjURlcCDlhbPogZTnmoQgd2F0Y2hlclxuICB9XG5cbiAgYWRkU3ViKHN1Yikge1xuICAgIHRoaXMuc3Vicy5wdXNoKHN1Yik7XG4gIH1cblxuICByZW1vdmVTdWIoc3ViKSB7XG4gICAgZm9yIChsZXQgaSA9IHRoaXMuc3Vicy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgaWYgKHN1YiA9PT0gdGhpcy5zdWJzW2ldKSB7XG4gICAgICAgIHRoaXMuc3Vicy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoq5bCx5piv5bCG5b2T5YmN55qERGVw5LiO5b2T5YmN55qEd2F0Y2hlciDkupLnm7jlhbPogZQqL1xuICBkZXBlbmQoKSB7XG4gICAgaWYgKERlcC50YXJnZXQpIHtcbiAgICAgIHRoaXMuYWRkU3ViKERlcC50YXJnZXQpOyAvLyDlsIblvZPliY3nmoQgd2F0Y2hlciDlrZjlhaXliLDlvZPliY3nmoQgRGVwIOS4ilxuICAgICAgRGVwLnRhcmdldC5hZGREZXAodGhpcyk7IC8vIOWwhuW9k+WJjeeahCBkZXAg5LiOIOW9k+WJjeeahOa4suafk3dhdGNoZXLlhbPogZRcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog6Kem5Y+R5LiO5LmL5YWz6IGU55qEIHdhdGNoZXIg55qEIHVwZGF0ZSDmlrnms5UsIOi1t+WIsOabtOaWsOS9nOeUqFxuICAgKi9cbiAgbm90aWZ5KCkge1xuICAgIC8vIOWcqOecn+WunueahCBWdWUg5Lit5piv5L6d5qyh6Kem5Y+RIHRoaXMuc3VicyDkuK3nmoQgd2F0Y2hlciDnmoQgdXBkYXRlIOaWueazlVxuICAgIC8vIOatpOaXtiwgZGVwcyDkuK3lt7Lnu4/lhbPogZTliLDpnIDopoHkvb/nlKjnmoQgd2F0Y2hlciDkuoZcbiAgICBsZXQgZGVwcyA9IHRoaXMuc3Vicy5zbGljZSgpO1xuICAgIGRlcHMuZm9yRWFjaCgod2F0Y2hlcikgPT4ge1xuICAgICAgd2F0Y2hlci51cGRhdGUoKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vLyDlhajlsYDnmoTlrrnlmajlrZjlgqjmuLLmn5Mgd2F0Y2hlclxuRGVwLnRhcmdldCA9IG51bGw7XG5cbmxldCB0YXJnZXRTdGFjayA9IFtdO1xuXG4vKiog5bCG5b2T5YmN5pON5L2c55qEIHdhdGNoZXIg5a2Y5YKo5Yiw5YWo5bGAIHdhdGNoZXIg5LitLCDlj4LmlbAgdGFyZ2V0IOWwseaYr+W9k+WJjeeahCB3YXRjaGVyICovXG5leHBvcnQgZnVuY3Rpb24gcHVzaFRhcmdldCh0YXJnZXQpIHtcbiAgdGFyZ2V0U3RhY2sudW5zaGlmdChEZXAudGFyZ2V0KTsgLy8gdnVlIOa6kOeggeS4reaYryBwdXNoXG4gIERlcC50YXJnZXQgPSB0YXJnZXQ7XG59XG5cbi8qKuWwhuW9k+WJjSB3YXRjaGVyIOi4ouWHuiovXG5leHBvcnQgZnVuY3Rpb24gcG9wVGFyZ2V0KCkge1xuICBEZXAudGFyZ2V0ID0gdGFyZ2V0U3RhY2suc2hpZnQoKTsgLy8g6Lii5Yiw5pyA5ZCOLOWwseaYr1VuZGVmaW5lZFxufVxuXG4vKipcbiAqIOWcqCB3YXRjaGVyIOiwg+eUqCBnZXQg5pa55rOV55qE5pe25YCZLCDosIPnlKggcHVzaFRhcmdldCh0aGlzKVxuICog6LCD55So57uT5p2fLCDosIPnlKggcG9wVGFyZ2V0KClcbiAqICovXG4iLCJpbXBvcnQgeyBkZWYgfSBmcm9tIFwiLi9kZWYuanNcIjtcbmltcG9ydCBEZXAgZnJvbSBcIi4vRGVwLmpzXCI7XG5pbXBvcnQgeyBhcnJheU1ldGhvZHMgfSBmcm9tIFwiLi9hcnJheS5qc1wiO1xuXG5leHBvcnQgY2xhc3MgT2JzZXJ2ZXIge1xuICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmRlcCA9IG5ldyBEZXAoKTtcbiAgICBkZWYodmFsdWUsIFwiX19vYl9fXCIsIHRoaXMpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgLy8g5a+55q+P5LiA5Liq5YWD57Sg5aSE55CGXG4gICAgICB2YWx1ZS5fX3Byb3RvX18gPSBhcnJheU1ldGhvZHM7XG4gICAgICB0aGlzLm9ic2VydmVBcnJheSh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMud2Fsayh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgd2FsayhvYmopIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBwcm9wID0ga2V5c1tpXTtcbiAgICAgIGRlZmluZVJlYWN0aXZlKG9iaiwga2V5c1tpXSwgb2JqW3Byb3BdKTtcbiAgICB9XG4gIH1cblxuICAvLyDlpITnkIbmlbDnu4RcbiAgb2JzZXJ2ZUFycmF5KGl0ZW1zKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JzZXJ2ZShpdGVtc1tpXSk7IC8vIOWvueavj+S4quaIkOWRmOi/m+ihjOWTjeW6lOW8j+WkhOeQhlxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gb2JzZXJ2ZSh2YWx1ZSkge1xuICBsZXQgb2I7XG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB2YWx1ZSAhPSBudWxsKSB7XG4gICAgb2IgPSBuZXcgT2JzZXJ2ZXIodmFsdWUpO1xuICB9XG4gIHJldHVybiBvYjtcbn1cblxuLyoq5ZON5bqU5byP5qC45b+DKiovXG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lUmVhY3RpdmUoZGF0YSwga2V5LCB2YWx1ZSkge1xuICAvLyDov4fmu6TpnZ7lr7nosaFcblxuICBjb25zdCBkZXAgPSBuZXcgRGVwKCk7XG5cbiAgbGV0IGNoaWxkT2IgPSBvYnNlcnZlKHZhbHVlKTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGF0YSwga2V5LCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0KCkge1xuICAgICAgZGVwLmRlcGVuZCgpO1xuICAgICAgaWYgKGNoaWxkT2IpIHtcbiAgICAgICAgY2hpbGRPYi5kZXAuZGVwZW5kKCk7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIC8vIOW1jOWll+S4uuaVsOe7hOeahOaDheWGtVxuICAgICAgICAgIGRlcGVuZEFycmF5KHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH0sXG4gICAgc2V0KG5ld1ZhbCkge1xuICAgICAgaWYgKG5ld1ZhbCA9PT0gdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8g5pWw5o2u5Y+Y5oiQ5ZON5bqU5byPXG4gICAgICBpZiAodHlwZW9mIG5ld1ZhbCA9PT0gXCJvYmplY3RcIiAmJiBuZXdWYWwgIT0gbnVsbCkge1xuICAgICAgICBvYnNlcnZlKG5ld1ZhbCk7XG4gICAgICB9XG4gICAgICB2YWx1ZSA9IG5ld1ZhbDtcblxuICAgICAgY2hpbGRPYiA9IG9ic2VydmUobmV3VmFsKTtcblxuICAgICAgLy8g5rS+5Y+R5pu05pawLCDmib7liLDlhajlsYDnmoQgd2F0Y2hlciwg6LCD55SoIHVwZGF0ZVxuICAgICAgZGVwLm5vdGlmeSgpO1xuICAgIH0sXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZXBlbmRBcnJheSh2YWx1ZSkge1xuICBmb3IgKGxldCBlLCBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGUgPSB2YWx1ZVtpXTtcbiAgICBlICYmIGUuX19vYl9fICYmIGUuX19vYl9fLmRlcC5kZXBlbmQoKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShlKSkge1xuICAgICAgZGVwZW5kQXJyYXkoZSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBkZWYgfSBmcm9tIFwiLi9kZWYuanNcIjtcblxuLy8g5aSH5Lu9IOaVsOe7hCDljp/lnovlr7nosaFcbmNvbnN0IGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG4vLyDpgJrov4fnu6fmib/nmoTmlrnlvI8g5Yib5bu65paw55qEIGFycmF5TWV0aGRvc1xuLy8g5Y6f55CGXG4vLyBsZXQgYXJyID0gW11cbi8vIGFyciAtPiBBcnJheS5wcm90b3R5cGUgLT4gT2JqZWN0LnByb3RvdHlwZVxuLy8gYXJyIC0+IOaUueWGmeeahOaWueazlSAgLT4gQXJyYXkucHJvdG90eXBlIC0+IE9iamVjdC5wcm90b3R5cGVcbmV4cG9ydCBjb25zdCBhcnJheU1ldGhvZHMgPSBPYmplY3QuY3JlYXRlKGFycmF5UHJvdG8pO1xuXG4vLyDmk43kvZzmlbDnu4TnmoTkuIPkuKrmlrnms5XvvIzov5nkuIPkuKrmlrnms5Xlj6/ku6XmlLnlj5jmlbDnu4Toh6rouqtcbmNvbnN0IG1ldGhvZHNUb1BhdGNoID0gW1xuICBcInB1c2hcIixcbiAgXCJwb3BcIixcbiAgXCJzaGlmdFwiLFxuICBcInVuc2hpZnRcIixcbiAgXCJzcGxpY2VcIixcbiAgXCJzb3J0XCIsXG4gIFwicmV2ZXJzZVwiLFxuXTtcblxuLy8g5pS55YaZ5Y6f5Z6L5pa55rOVXG5tZXRob2RzVG9QYXRjaC5mb3JFYWNoKGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgLy8g57yT5a2Y5Y6f55Sf5pa55rOVLOavlOWmglB1c2hcbiAgY29uc3Qgb3JpZ2luYWwgPSBhcnJheVByb3RvW21ldGhvZF07XG5cbiAgLy8gZGVidWdnZXI7XG4gIGRlZihhcnJheU1ldGhvZHMsIG1ldGhvZCwgZnVuY3Rpb24gbXV0YXRvciguLi5hcmdzKSB7XG4gICAgLy8g5omn6KGM5Y6f55Sf5pa55rOVXG4gICAgY29uc3QgcmVzdWx0ID0gb3JpZ2luYWwuYXBwbHkodGhpcywgYXJncyk7XG4gICAgY29uc3Qgb2IgPSB0aGlzLl9fb2JfXztcbiAgICBjb25zb2xlLmxvZyhcIm1ldGhvZFwiLCBvYik7XG4gICAgbGV0IGluc2VydGVkO1xuICAgIHN3aXRjaCAobWV0aG9kKSB7XG4gICAgICBjYXNlIFwicHVzaFwiOlxuICAgICAgY2FzZSBcInVuc2hpZnRcIjpcbiAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJzcGxpY2VcIjpcbiAgICAgICAgaW5zZXJ0ZWQgPSBhcmdzLnNsaWNlKDIpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgLy8g5a+55paw5o+S5YWl55qE5YWD57Sg5YGa5ZON5bqU5byP5aSE55CGXG4gICAgaWYgKGluc2VydGVkKSBvYi5vYnNlcnZlQXJyYXkoaW5zZXJ0ZWQpO1xuICAgIC8vIOmAmuefpeabtOaWsFxuICAgIG9iLmRlcC5ub3RpZnkoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9KTtcbn0pO1xuLy8tLS0tLS0tLS0tLS0tLS0tLS0t5pWw57uE5ZON5bqU5byPLWVuZHNcbiIsImltcG9ydCBwYXJzZSBmcm9tIFwiLi9wYXJzZS5qc1wiO1xuaW1wb3J0IGdlbmVyYXRlIGZyb20gXCIuL2dlbmVyYXRlLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbXBpbGVUb0Z1bmN0aW9uKHRlbXBsYXRlKSB7XG4gIC8vIOWwhuaooeadv+e8luivkeS4uiBhc3RcbiAgY29uc3QgYXN0ID0gcGFyc2UodGVtcGxhdGUpO1xuICAvLyDku44gYXN0IOeUn+aIkOa4suafk+WHveaVsFxuICBjb25zdCByZW5kZXIgPSBnZW5lcmF0ZShhc3QpO1xuICByZXR1cm4gcmVuZGVyO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2VuZXJhdGUoYXN0KSB7XG4gIGNvbnNvbGUubG9nKGFzdCk7XG59XG4iLCJpbXBvcnQgY29tcGlsZVRvRnVuY3Rpb24gZnJvbSBcIi4vY29tcGlsZVRvRnVuY3Rpb24uanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1vdW50KHZtKSB7XG4gIGlmICghdm0uJG9wdGlvbnMucmVuZGVyKSB7XG4gICAgLy8g6YWN572u6aG55LiK5rKh5pyJIHJlbmRlciDlh73mlbAsIOWImei/m+ihjOe8luivkVxuICAgIGxldCB7IGVsLCB0ZW1wbGF0ZSB9ID0gdm0uJG9wdGlvbnM7XG5cbiAgICAvLyDojrflj5bmqKHmnb/lrZfnrKbkuLJcbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgIC8vIOWtmOWcqCB0ZW1wbGF0ZSDpgInpoblcbiAgICAgIHRlbXBsYXRlID0gdGVtcGxhdGU7XG4gICAgfSBlbHNlIGlmIChlbCkge1xuICAgICAgLy8g5a2Y5Zyo5oyC6L2954K5XG4gICAgICB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpLm91dGVySFRNTDtcbiAgICB9XG5cbiAgICAvLyDnlJ/miJDmuLLmn5Plh73mlbBcbiAgICBjb25zdCByZW5kZXIgPSBjb21waWxlVG9GdW5jdGlvbih0ZW1wbGF0ZSk7XG5cbiAgICAvLyDlsIbmuLLmn5Plh73mlbDmjILovb3liLAgJG9wdGlvbnMg5LiKXG4gICAgdm0uJG9wdGlvbnMucmVuZGVyID0gcmVuZGVyO1xuICB9XG59XG4iLCJpbXBvcnQgeyBpc1VuYXJ5VGFnIH0gZnJvbSBcIi4uL3V0aWxzLmpzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlKHRlbXBsYXRlKSB7XG4gIC8vIOacgOe7iOi/lOWbnueahCBhc3RcbiAgbGV0IHJvb3QgPSBudWxsO1xuXG4gIC8vIOWkh+S7veaooeadv1xuICBsZXQgaHRtbCA9IHRlbXBsYXRlO1xuXG4gIC8vIOWtmOaUvmFzdOWvueixoVxuICBjb25zdCBzdGFjayA9IFtdO1xuXG4gIC8vIOmBjeWOhiBodG1sIOaooeadv+Wtl+espuS4slxuICB3aGlsZSAoaHRtbC50cmltKCkpIHtcbiAgICAvLyDms6jph4rmoIfnrb5cbiAgICBpZiAoaHRtbC5pbmRleE9mKFwiPCEtLVwiKSA9PT0gMCkge1xuICAgICAgLy8g5om+5Yiw5rOo6YeK57uT54K555qE57uT5p2f5L2N572uIDwhLS0gY29tbWVudCAtLT48ZGl2PjwvZGl2PlxuICAgICAgY29uc3QgZW5kSWR4ID0gaHRtbC5pbmRleE9mKFwiLS0+XCIpO1xuICAgICAgaHRtbCA9IGh0bWwuc2xpY2UoZW5kSWR4ICsgMyk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFydElkeCA9IGh0bWwuaW5kZXhPZihcIjxcIik7XG4gICAgLy8g5Yy56YWN5Yiw5q2j5bi45qCH562+LCDlpoIgPGRpdiBpZCA9IFwiYXBwXCI+PC9kaXY+XG4gICAgaWYgKHN0YXJ0SWR4ID09PSAwKSB7XG4gICAgICAvLyDnnIvmmK/lkKbmmK/nu5PmnZ/moIfnrb7vvIwg5ZCm5YiZ5bCx5piv5byA5aeL5qCH562+XG4gICAgICBpZiAoaHRtbC5pbmRleE9mKFwiPC9cIikgPT09IDApIHtcbiAgICAgICAgLy8g57uT5p2f5qCH562+XG4gICAgICAgIHBhcnNlRW5kKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyDlvIDlp4vmoIfnrb5cbiAgICAgICAgcGFyc2VTdGFydCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoc3RhcnRJZHggPiAwKSB7XG4gICAgICAvLyDlnKjlvIDlp4vmoIfnrb7kuYvliY3mnInkuIDmrrXmlofmnKw6ICBjb250ZW50PC9kaXY+XG4gICAgICAvLyDmr5TlpoLov5nph4zpnaLnmoQgY29udGVudDxcbiAgICAgIGNvbnN0IG5leHRTdGFydElkeCA9IGh0bWwuaW5kZXhPZihcIjxcIik7XG4gICAgICBpZiAoc3RhY2subGVuZ3RoKSB7XG4gICAgICAgIC8vIHN0YWNrIOS4jeS4uuepuiwg6K+05piO5paH5pys5piv5qCI6aG25YWD57Sg55qE5paH5pys6IqC54K5XG4gICAgICAgIHByb2Nlc3NDaGFycyhodG1sLnNsaWNlKDAsIG5leHRTdGFydElkeCkpO1xuICAgICAgICBodG1sID0gaHRtbC5zbGljZShuZXh0U3RhcnRJZHgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByb290O1xuXG4gIC8qKlxuICAgKuWkhOeQhuW8gOWni+agh+etviwg5q+U5aaCIDxkaXYgaWQgPSBcImFwcFwiPiA8aDM+XG4gICAqL1xuICBmdW5jdGlvbiBwYXJzZVN0YXJ0KCkge1xuICAgIC8vIOWMuemFjeW8gOWni+agh+etvueahOe7k+adn+S9jee9riw8ZGl2IGlkID0gXCJhcHBcIj7kuK3nmoQgPlxuICAgIGNvbnN0IGVuZElkeCA9IGh0bWwuaW5kZXhPZihcIj5cIik7XG4gICAgLy8g5oiq5Y+W5byA5aeL5qCH562+5YaF55qE5omA5pyJ5YaF5a65LCAnZGl2IGlkID0gXCJhcHBcIidcbiAgICBjb25zdCBjb250ZW50ID0gaHRtbC5zbGljZSgxLCBlbmRJZHgpO1xuICAgIC8vIOabtOaWsCBodG1sLCDlsIZjb250ZXRu5LuOIGh0bWwg5LiK5oiq5o6JXG4gICAgaHRtbCA9IGh0bWwuc2xpY2UoZW5kSWR4ICsgMSk7XG4gICAgLy8g5qCH562+5ZCN5ZKM5bGe5oCn5a2X56ym5LiyXG4gICAgbGV0IHRhZ05hbWUgPSBcIlwiLFxuICAgICAgYXR0clN0ciA9IFwiXCI7XG4gICAgLy8g5om+5YiwIGNvbnRlbnQg5Lit55qE56ys5LiA5Liq56m65qC8XG4gICAgY29uc3QgZmlyc3RTcGFjZUlkeCA9IGNvbnRlbnQuaW5kZXhPZihcIiBcIik7XG4gICAgaWYgKGZpcnN0U3BhY2VJZHggPT09IC0xKSB7XG4gICAgICAvLyDmsqHmnInmib7liLDnqbrmoLwsIOivtOaYjuagh+etvuayoeacieWxnuaAp++8jOWmgiA8aDM+PC9oMz5cbiAgICAgIHRhZ05hbWUgPSBjb250ZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICB0YWdOYW1lID0gY29udGVudC5zbGljZSgwLCBmaXJzdFNwYWNlSWR4KTtcbiAgICAgIC8vIOWxnuaAp+Wtl+espuS4sizlpoIgaWQ9XCJhcHBcIiBjbGFzcz1cInRlc3RcIlxuICAgICAgYXR0clN0ciA9IGNvbnRlbnQuc2xpY2UoZmlyc3RTcGFjZUlkeCArIDEpO1xuICAgIH1cblxuICAgIC8vLS0tLeW3sue7j+iOt+WPluWIsOagh+etvuWQjeWSjOWxnuaAp+Wtl+espuS4slxuXG4gICAgLy8g5aSE55CG5bGe5oCnXG4gICAgLy8gWydpZD1cImFwcFwiJywgJ2NsYXNzPVwidGVzdFwiJ11cbiAgICBjb25zdCBhdHRycyA9IGF0dHJTdHIgPyBhdHRyU3RyLnNwbGl0KFwiIFwiKSA6IFtdO1xuXG4gICAgLy8g6L+b5LiA5q2l5aSE55CG5bGe5oCn5pWw57uELCDlvpfliLDkuIDkuKptYXDlr7nosaFcbiAgICBjb25zdCBhdHRyTWFwID0gcGFyc2VBdHRycyhhdHRycyk7XG4gICAgLy8g55Sf5oiQQVNUXG4gICAgY29uc3QgZWxlbWVudEFTVCA9IGdlbmVyYXRlQVNUKHRhZ05hbWUsIGF0dHJNYXApO1xuXG4gICAgaWYgKCFyb290KSB7XG4gICAgICAvLyDor7TmmI7lkLjnurPnnYDlpITnkIbnmoTmoIfnrb7mmK/mnIDlvIDlp4vnmoTnrKzkuIDkuKrmoIfnrb5cbiAgICAgIHJvb3QgPSBlbGVtZW50QVNUO1xuICAgIH1cbiAgICAvLyDlsIYgQVNUIOWvueixoSBwdXNoIOWIsOagiOS4rSwg5b2T6YGH5Yiw5a6D55qE57uT5p2f5qCH562+5pe2LCDlsLHlsIbmoIjpobbnmoQgYXN0IOWvueixoSBwb3Ag6Li5XG4gICAgc3RhY2sucHVzaChlbGVtZW50QVNUKTtcblxuICAgIC8vIOiHqumXreWSjOagh+etviwg5q+U5aaCIDxpbnB1dCB2LW1vZGVsPVwidGVzdFwiLz5cbiAgICBpZiAoaXNVbmFyeVRhZyh0YWdOYW1lKSkge1xuICAgICAgLy8g6K+05piO5piv6Ieq6Zet5ZKM5qCH562+LCDnm7TmjqXov5vlhaXpl63lkIjmoIfnrb7lpITnkIbmtYHnqItcbiAgICAgIHByb2Nlc3NFbGVtZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOW+l+WIsCBrZXksIHZhbHVlIOW9ouW8j+eahCBNYXAg5a+56LGhLFxuICAgKiDov5jmnInkuIDkupsgdi1mb3IsIHYtYmluZOetieaMh+S7pOWwseWcqOi/memHjOmdouWkhOeQhlxuICAgKiBAcGFyYW0gYXR0cnNcbiAgICovXG4gIGZ1bmN0aW9uIHBhcnNlQXR0cnMoYXR0cnMpIHtcbiAgICBjb25zdCBhdHRyTWFwID0ge307XG4gICAgZm9yIChjb25zdCBhdHRyIG9mIGF0dHJzKSB7XG4gICAgICAvLyBpZD1cImFwcFwiXG4gICAgICBjb25zdCBbYXR0ck5hbWUsIGF0dHJWYWx1ZV0gPSBhdHRyLnNwbGl0KFwiPVwiKTtcbiAgICAgIGF0dHJNYXBbYXR0ck5hbWVdID0gYXR0clZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gYXR0ck1hcDtcbiAgfVxuXG4gIC8qKlxuICAgKiDnlJ/miJAgQVNUXG4gICAqIEBwYXJhbSB0YWdcbiAgICogQHBhcmFtIGF0dHJNYXBcbiAgICovXG4gIGZ1bmN0aW9uIGdlbmVyYXRlQVNUKHRhZywgYXR0ck1hcCkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyDlhYPntKDoioLngrlcbiAgICAgIHR5cGU6IDEsXG4gICAgICAvLyDmoIfnrb7lkI1cbiAgICAgIHRhZyxcbiAgICAgIC8vIOWOn+eUn+WxnuaAp+WvueixoVxuICAgICAgcmF3QXR0cjogYXR0ck1hcCxcbiAgICAgIC8vIOWtkOiKgueCuVxuICAgICAgY2hpbGRyZW46IFtdLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog5aSE55CG6Zet5ZCI5qCH562+XG4gICAqL1xuICBmdW5jdGlvbiBwYXJzZUVuZCgpIHtcbiAgICAvLyDlsIbpl63lkIjmoIfnrb7ku45odG1s5a2X56ym5Liy5oiq5o6JXG5cbiAgICBodG1sID0gaHRtbC5zbGljZShodG1sLmluZGV4T2YoXCI+XCIpICsgMSk7XG4gICAgLy8g6L+b5LiA5q2l5aSE55CG5qCI6aG25YWD57SgXG4gICAgcHJvY2Vzc0VsZW1lbnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlpITnkIblhYPntKDnmoTpl63lkIjmoIfnrb7ml7bkvJrosIPnlKhcbiAgICog6L+b5LiA5q2l5aSE55CG5YWD57Sg5LiK5ZCE5Liq5bGe5oCnLOW5tuWwhuWkhOeQhue7k+aenOaUvuWIsCBhdHRyIOWxnuaAp+S4ilxuICAgKiA8aW5wdXQgdi1tb2RlbD1cInRleHRcIi8+XG4gICAqIDxzcGFuIHYtYmluZDp0aXRsZT1cInRpdGxlXCI+PC9zcGFuPlxuICAgKiA8YnV0dG9uIHYtb246Y2xpY2s9XCJoYW5kbGVDbGlja1wiPiBjbGljayBtZSA8L2Rpdj5cbiAgICovXG4gIGZ1bmN0aW9uIHByb2Nlc3NFbGVtZW50KCkge1xuICAgIC8vIOW8ueWHuuagiOmhtuWFg+e0oCwg6L+b5LiA5q2l5aSE55CG6K+l5YWD57SgXG4gICAgY29uc3QgY3VyRWxlID0gc3RhY2sucG9wKCk7XG4gICAgLy8g6L+b5LiA5q2l5aSE55CGIEFTVCDlr7nosaHkuK3nmoQgcmF3QXR0ciDlr7nosaEsIHsgYXR0ck5hbWU6IGF0dHJWYWx1ZSB9LCDlpITnkIbnu5PmnpzmlL7liLBhdHRy5bGe5oCnXG4gICAgY29uc3QgeyByYXdBdHRyIH0gPSBjdXJFbGU7XG4gICAgY3VyRWxlLmF0dHIgPSB7fTtcbiAgICAvLyBbJ3YtbW9kZWwnLCAndi1iaW5kOnRpdGxlJywgJ3Ytb246Y2xpY2snXVxuICAgIGNvbnN0IHByb3BlcnR5QXJyID0gT2JqZWN0LmtleXMocmF3QXR0cik7XG4gICAgaWYgKHByb3BlcnR5QXJyLmluY2x1ZGVzKFwidi1tb2RlbFwiKSkge1xuICAgICAgLy8g5aSE55CGIHYtbW9kZWwg5oyH5LukXG4gICAgICBwcm9jZXNzVk1vZGVsKGN1ckVsZSk7XG4gICAgfSBlbHNlIGlmIChwcm9wZXJ0eUFyci5maW5kKChpdGVtKSA9PiBpdGVtLm1hdGNoKC92LWJpbmQ6KC4qKS8pKSkge1xuICAgICAgLy8g6L+U5Zue6L+Z5Liq5YWD57SgXG4gICAgICBwcm9jZXNzVkJpbmQoY3VyRWxlLCBSZWdFeHAuJDEsIHJhd0F0dHJbYHYtYmluZDoke1JlZ0V4cC4kMX1gXSk7XG4gICAgfSBlbHNlIGlmIChwcm9wZXJ0eUFyci5maW5kKChpdGVtKSA9PiBpdGVtLm1hdGNoKC92LW9uOiguKikvKSkpIHtcbiAgICAgIHByb2Nlc3NWT24oY3VyRWxlLCBSZWdFeHAuJDEsIHJhd0F0dHJbYHYtb246JHtSZWdFeHAuJDF9YF0pO1xuICAgIH1cbiAgICAvLyDoioLngrnlpITnkIblrozlsZ7mgKflkI7vvIwg5bu656uL5LiO54i26IqC54K555qE6IGU57O7XG4gICAgY29uc3Qgc3RhY2tMZW4gPSBzdGFjay5sZW5ndGg7XG4gICAgaWYgKHN0YWNrTGVuKSB7XG4gICAgICBzdGFja1tzdGFja0xlbiAtIDFdLmNoaWxkcmVuLnB1c2goY3VyRWxlKTtcbiAgICAgIGN1ckVsZS5wYXJlbnQgPSBzdGFja1tzdGFja0xlbiAtIDFdO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDlpITnkIZ2LW1vZGVs5bGe5oCnXG4gICAqIDxpbnB1dCB0eXBlPSd0ZXh0JyB2LW1vZGVsPVwidGVzdFwiIC8+XG4gICAqIEBwYXJhbSBjdXJFbGVcbiAgICovXG4gIGZ1bmN0aW9uIHByb2Nlc3NWTW9kZWwoY3VyRWxlKSB7XG4gICAgY29uc3QgeyB0YWcsIGF0dHIsIHJhd0F0dHIgfSA9IGN1ckVsZS5hdHRyO1xuICAgIGNvbnN0IHsgdHlwZSwgXCJ2LW1vZGVsXCI6IHZNb2RlbFZhbHVlIH0gPSByYXdBdHRyO1xuXG4gICAgaWYgKHRhZyA9PT0gXCJpbnB1dFwiKSB7XG4gICAgICBpZiAoL3RleHQvLnRlc3QodHlwZSkpIHtcbiAgICAgICAgLy8g5paH5pys6L6T5YWl5qGGXG4gICAgICAgIGF0dHIudk1vZGVsID0geyB0YWcsIHR5cGU6IFwidGV4dFwiLCB2YWx1ZTogdk1vZGVsVmFsdWUgfTtcbiAgICAgIH0gZWxzZSBpZiAoL2NoZWNrYm94Ly50ZXN0KHR5cGUpKSB7XG4gICAgICAgIGF0dHIudk1vZGVsID0geyB0YWcsIHR5cGU6IFwiY2hlY2tib3hcIiwgdmFsdWU6IHZNb2RlbFZhbHVlIH07XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0YWcgPT09IFwidGV4dGFyZWFcIikge1xuICAgICAgYXR0ci52TW9kZWwgPSB7IHRhZywgdmFsdWU6IHZNb2RlbFZhbHVlIH07XG4gICAgfSBlbHNlIGlmICh0YWcgPT09IFwic2VsZWN0XCIpIHtcbiAgICAgIGF0dHIudk1vZGVsID0geyB0YWcsIHZhbHVlOiB2TW9kZWxWYWx1ZSB9O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDlpITnkIZ2LWJpbmTlsZ7mgKdcbiAgICogQHBhcmFtIGN1ckVsZVxuICAgKi9cbiAgZnVuY3Rpb24gcHJvY2Vzc1ZCaW5kKGN1ckVsZSwgYmluZEtleSwgYmluZFZhbHVlKSB7XG4gICAgY3VyRWxlLmF0dHIuVkJpbmQgPSB7IFtiaW5kS2V5XTogYmluZFZhbHVlIH07XG4gIH1cblxuICAvKipcbiAgICog5aSE55CGdi1vbuWxnuaAp1xuICAgKiBAcGFyYW0gY3VyRWxlXG4gICAqL1xuICBmdW5jdGlvbiBwcm9jZXNzVk9uKGN1ckVsZSwgdk9uS2V5LCB2T25WYWx1ZSkge1xuICAgIGN1ckVsZS5hdHRyLlZPbiA9IHsgW3ZPbktleV06IHZPblZhbHVlIH07XG4gIH1cblxuICAvKipcbiAgICog5aSE55CG5qCH562+5YaF5paH5pysXG4gICAqL1xuICBmdW5jdGlvbiBwcm9jZXNzQ2hhcnModGV4dCkge1xuICAgIC8vIOWOu+epuuagvFxuICAgIGlmICghdGV4dC50cmltKCkpIHJldHVybjtcblxuICAgIC8vIOaehOmAoOaWh+acrOiKgueCueeahCBBU1Qg5a+56LGhXG4gICAgY29uc3QgdGV4dEFTVCA9IHtcbiAgICAgIHR5cGU6IDMsXG4gICAgICB0ZXh0LFxuICAgIH07XG5cbiAgICBpZiAodGV4dC5tYXRjaCgve3soLiopfX0vKSkge1xuICAgICAgLy8ge3t0ZXh0fX1cbiAgICAgIHRleHRBU1QuZXhwcmVzc2lvbiA9IFJlZ0V4cC4kMS50cmltKCk7XG4gICAgfVxuXG4gICAgLy8g5bCG5paH5pys6IqC54K55pS+5Yiw5qCI6aG25YWD57Sg55qEY2hpbGTph4xcbiAgICBzdGFja1tzdGFjay5sZW5ndGggLSAxXS5jaGlsZHJlbi5wdXNoKHRleHRBU1QpO1xuICB9XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gZGVmKG9iaiwga2V5LCB2YWwsIGVudW1lcmFibGUpIHtcbiAgLy8gZGVidWdnZXI7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwge1xuICAgIHZhbHVlOiB2YWwsXG4gICAgZW51bWVyYWJsZTogISFlbnVtZXJhYmxlLFxuICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgfSk7XG59XG4iLCIvLyBpbml0RGF0YSDmlrnms5UsIOWTjeW6lOW8j1xuaW1wb3J0IHsgb2JzZXJ2ZSB9IGZyb20gXCIuL09ic2VydmVyLmpzXCI7XG5pbXBvcnQgcHJveHkgZnJvbSBcIi4vcHJveHkuanNcIjtcbmltcG9ydCBXSllWdWUgZnJvbSBcIi4vd2p5dnVlLmpzXCI7XG5cbldKWVZ1ZS5wcm90b3R5cGUuaW5pdERhdGEgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIOmBjeWOhiB0aGlzLl9kYXRh55qE5oiQ5ZGY77yM5bCGIOWxnuaAp+i9rOaNouS4uuWTjeW6lOW8j+eahO+8jOWwhiDnm7TmjqXlsZ7mgKfvvIzku6PnkIbliLDlrp7kvovkuIpcbiAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLl9kYXRhKTtcbiAgLy8g5ZON5bqU5byP5YyWXG4gIG9ic2VydmUodGhpcy5fZGF0YSk7XG4gIC8vIOS7o+eQhuWIsGFwcC54eHhcbiAgZm9yIChjb25zdCBlbGVtZW50IG9mIGtleXMpIHtcbiAgICBwcm94eSh0aGlzLCBcIl9kYXRhXCIsIGVsZW1lbnQpO1xuICB9XG59O1xuIiwiLyoq5bCG5p+Q5LiA5Liq5a+56LGh55qE5bGe5oCnIOiuv+mXriDmmKDlsITliLDmn5DkuIDkuKrlsZ7mgKfmiJDlkZjkuIoqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcHJveHkodGFyZ2V0LCBwcm9wLCBrZXkpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCB7XG4gICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0KCkge1xuICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXVtrZXldO1xuICAgIH0sXG4gICAgc2V0KG52KSB7XG4gICAgICB0YXJnZXRbcHJvcF1ba2V5XSA9IG52O1xuICAgIH0sXG4gIH0pO1xufVxuIiwiLyoqXG4gKiDliKTmlq3mjIflrprmoIfnrb7mmK/lkKbkuLroh6rpl63lkozmoIfnrb5cbiAqIEBwYXJhbSB0YWdOYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1VuYXJ5VGFnKHRhZ05hbWUpIHtcbiAgcmV0dXJuIFtcImlucHV0XCJdLmluY2x1ZGVzKHRhZ05hbWUpO1xufVxuIiwiaW1wb3J0IFwiLi9pbml0RGF0YS5qc1wiO1xuaW1wb3J0IG1vdW50IGZyb20gXCIuL2NvbXBpbGVyLWFzdC9pbmRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBXSllWdWUob3B0aW9ucykge1xuICB0aGlzLl9kYXRhID1cbiAgICB0eXBlb2Ygb3B0aW9ucy5kYXRhID09PSBcImZ1bmN0aW9uXCIgPyBvcHRpb25zLmRhdGEoKSA6IG9wdGlvbnMuZGF0YTsgLy8gZGF0YeWxnuaAp1xuICB0aGlzLiRvcHRpb25zID0gb3B0aW9ucztcbiAgdGhpcy5fZWwgPSBvcHRpb25zLmVsO1xuICB0aGlzLmluaXREYXRhKCk7IC8vIOWwhmRhdGHov5vooYzlk43lupTlvI/ovazmjaIsIOi/m+ihjOS7o+eQhlxuXG4gIGlmICh0aGlzLiRvcHRpb25zLmVsKSB7XG4gICAgdGhpcy4kbW91bnQoKTsgLy8g5oyC6L29XG4gIH1cbn1cblxuLy8g5oyC6L295pa55rOVXG5XSllWdWUucHJvdG90eXBlLiRtb3VudCA9IGZ1bmN0aW9uICgpIHtcbiAgbW91bnQodGhpcyk7XG59O1xuXG5nbG9iYWwuV0pZVnVlID0gV0pZVnVlO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL3dqeXZ1ZS5qc1wiKTtcbiIsIiJdLCJuYW1lcyI6WyJkZXBpZCIsIkRlcCIsImlkIiwic3VicyIsInN1YiIsInB1c2giLCJpIiwibGVuZ3RoIiwic3BsaWNlIiwidGFyZ2V0IiwiYWRkU3ViIiwiYWRkRGVwIiwiZGVwcyIsInNsaWNlIiwiZm9yRWFjaCIsIndhdGNoZXIiLCJ1cGRhdGUiLCJ0YXJnZXRTdGFjayIsInB1c2hUYXJnZXQiLCJ1bnNoaWZ0IiwicG9wVGFyZ2V0Iiwic2hpZnQiLCJkZWYiLCJhcnJheU1ldGhvZHMiLCJPYnNlcnZlciIsInZhbHVlIiwiZGVwIiwiQXJyYXkiLCJpc0FycmF5IiwiX19wcm90b19fIiwib2JzZXJ2ZUFycmF5Iiwid2FsayIsIm9iaiIsImtleXMiLCJPYmplY3QiLCJwcm9wIiwiZGVmaW5lUmVhY3RpdmUiLCJpdGVtcyIsIm9ic2VydmUiLCJvYiIsImRhdGEiLCJrZXkiLCJjaGlsZE9iIiwiZGVmaW5lUHJvcGVydHkiLCJjb25maWd1cmFibGUiLCJlbnVtZXJhYmxlIiwiZ2V0IiwiZGVwZW5kIiwiZGVwZW5kQXJyYXkiLCJzZXQiLCJuZXdWYWwiLCJub3RpZnkiLCJlIiwibCIsIl9fb2JfXyIsImFycmF5UHJvdG8iLCJwcm90b3R5cGUiLCJjcmVhdGUiLCJtZXRob2RzVG9QYXRjaCIsIm1ldGhvZCIsIm9yaWdpbmFsIiwibXV0YXRvciIsImFyZ3MiLCJyZXN1bHQiLCJhcHBseSIsImNvbnNvbGUiLCJsb2ciLCJpbnNlcnRlZCIsInBhcnNlIiwiZ2VuZXJhdGUiLCJjb21waWxlVG9GdW5jdGlvbiIsInRlbXBsYXRlIiwiYXN0IiwicmVuZGVyIiwibW91bnQiLCJ2bSIsIiRvcHRpb25zIiwiZWwiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJvdXRlckhUTUwiLCJpc1VuYXJ5VGFnIiwicm9vdCIsImh0bWwiLCJzdGFjayIsInRyaW0iLCJpbmRleE9mIiwiZW5kSWR4Iiwic3RhcnRJZHgiLCJwYXJzZUVuZCIsInBhcnNlU3RhcnQiLCJuZXh0U3RhcnRJZHgiLCJwcm9jZXNzQ2hhcnMiLCJjb250ZW50IiwidGFnTmFtZSIsImF0dHJTdHIiLCJmaXJzdFNwYWNlSWR4IiwiYXR0cnMiLCJzcGxpdCIsImF0dHJNYXAiLCJwYXJzZUF0dHJzIiwiZWxlbWVudEFTVCIsImdlbmVyYXRlQVNUIiwicHJvY2Vzc0VsZW1lbnQiLCJhdHRyIiwiYXR0ck5hbWUiLCJhdHRyVmFsdWUiLCJ0YWciLCJ0eXBlIiwicmF3QXR0ciIsImNoaWxkcmVuIiwiY3VyRWxlIiwicG9wIiwicHJvcGVydHlBcnIiLCJpbmNsdWRlcyIsInByb2Nlc3NWTW9kZWwiLCJmaW5kIiwiaXRlbSIsIm1hdGNoIiwicHJvY2Vzc1ZCaW5kIiwiUmVnRXhwIiwiJDEiLCJwcm9jZXNzVk9uIiwic3RhY2tMZW4iLCJwYXJlbnQiLCJ2TW9kZWxWYWx1ZSIsInRlc3QiLCJ2TW9kZWwiLCJiaW5kS2V5IiwiYmluZFZhbHVlIiwiVkJpbmQiLCJ2T25LZXkiLCJ2T25WYWx1ZSIsIlZPbiIsInRleHQiLCJ0ZXh0QVNUIiwiZXhwcmVzc2lvbiIsInZhbCIsIndyaXRhYmxlIiwicHJveHkiLCJXSllWdWUiLCJpbml0RGF0YSIsIl9kYXRhIiwiZWxlbWVudCIsIm52Iiwib3B0aW9ucyIsIl9lbCIsIiRtb3VudCIsImdsb2JhbCJdLCJzb3VyY2VSb290IjoiIn0=