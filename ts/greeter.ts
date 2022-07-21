let isDone: boolean = false;

// 数字
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;

// 字符串
let namew: string = "bob";

let sentence: string = `Hello, my name is ${namew}`;

let list: number[] = [1, 2, 3];
let list2: Array<number> = [1, 3, 4];

// 元组
let x: [string, number];
x = ["hello", 10];
// x[3] = "world"; // OK, 字符串可以赋值给(string | number)类型
console.log(x[0].substr(1));
// console.log(x[3]);

// 枚举
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;
console.log(Color);

// let notSure: any = 4;
// notSure = "maybe a string instead";
// notSure = false; // okay, definitely a boolean

let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
// prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.

// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
  throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
  return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
  while (true) {}
}
