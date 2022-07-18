/**
 * 判断指定标签是否为自闭和标签
 * @param tagName
 */
export function isUnaryTag(tagName) {
  return ["input"].includes(tagName);
}
