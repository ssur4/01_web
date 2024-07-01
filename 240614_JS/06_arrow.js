/* 함수 선언식
function plus(a, b){
    return a + b;
}

console.log(plus);
console.log(plus(1, 2));
*/


/* 함수 표현식
let plus = function(a, b){
    return a + b;
};

console.log(plus);
console.log(plus(1, 2));
*/

//화살표 함수
let plus = (a, b) => {
    return a + b;
};

console.log(plus);
console.log(plus(1, 2));


//매개변수가 하나인 경우
let plus1 = a => a + 1;

console.log(plus1);
console.log(plus1(1));

//매개변수가 하나도 없는 경우
let plus2 = () => "plus";

console.log(plus2);
console.log(plus2());

