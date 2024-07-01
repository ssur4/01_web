//배열 기본값 설정
//값이 할당 안되었을 때만, 기본 값을 사용한다.

/*
const [r, g, b = 'blue'] = ['red', 'green', 'aaa'];

console.log(r);
console.log(g);
console.log(b);

const [a, b2, ... rest] = ['C#', 'javascript', 'react', 'python', 'C++'];

console.log(b2);
console.log(rest);
console.log(rest.length);

const arr1 = [1, 2];
const arr2 = [3, 4, 5];
const arr3 = [arr1, arr2];
const arr4 = [...arr1, ...arr2];

console.log(arr3);
console.log(arr4);

//객체 구조 분해
let {id, pw, name, age} = {id : 'a', pw : 'b', name : 'c', age : '30'};
console.log(id);

*/

//객체의 나머지 요소 가져오기
let user = {
    id : 'a',
    pw : 'b',
    name : 'c',
    age : 'd'
};

let {id, ...rest} = user;

console.log(id);
console.log(rest.pw);
console.log(rest.name);
console.log(rest.age);


