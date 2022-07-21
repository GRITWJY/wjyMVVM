var isDone = false;
// 数字
var decLiteral = 6;
var hexLiteral = 0xf00d;
var binaryLiteral = 10;
var octalLiteral = 484;
// 字符串
var namew = "bob";
var sentence = "Hello, my name is ".concat(namew);
var list = [1, 2, 3];
var list2 = [1, 3, 4];
// 元组
var x;
x = ["hello", 10];
// x[3] = "world"; // OK, 字符串可以赋值给(string | number)类型
console.log(x[0].substr(1));
// console.log(x[3]);
// 枚举
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
})(Color || (Color = {}));
var c = Color.Green;
console.log(Color);
