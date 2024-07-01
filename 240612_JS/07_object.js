//객체 생성
/*
var msg = {
    name : '불꽃남자',
    commnet : '포기를 모르는 남자',
    age : 19
};

var array = [];

console.log(array);
console.log(typeof array);

array.push(msg);
array.push(msg);

console.log(array);

console.log(typeof msg);
console.log();
*/

//new 연산자 사용

var msg = new Object();

msg = {
     name : '불꽃남자',
    commnet : '포기를 모르는 남자',
    age : 19
};

var array = new Array();
array.push(msg);
array.push(msg);

console.log(array);



