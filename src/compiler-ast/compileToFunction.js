import parse from "./parse.js";
import generate from "./generate.js";

export default function compileToFunction(template) {
  // 将模板编译为 ast
  const ast = parse(template);
  // 从 ast 生成渲染函数
  const render = generate(ast);
  return render;
}
