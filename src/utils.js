/**
 * 判断指定标签是否为自闭和标签
 * @param tagName
 */
export function isUnaryTag(tagName) {
  return ["input"].includes(tagName);
}

/**
 * 判断是否为平台的保留标签
 */
export function isReserveTag(tagName) {
  const reserveTag = [
    "div",
    "h3",
    "span",
    "input",
    "select",
    "option",
    "p",
    "button",
    "template",
  ];
  return reserveTag.includes(tagName);
}
