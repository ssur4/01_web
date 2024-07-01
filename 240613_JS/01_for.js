
//구구단 2단 출력
/*
for(var i = 1; i < 10; i++){
    console.log("2 * ", i, " = ", 2 * i);
}
*/

//for문의 구성요소 생략 가능(무한반복)

let i = 0;
for (; i < 101;){
    console.log('충전중 : ' + i + '%');
    i++;
}

console.log('충전이 완료되었습니다.');


//배열의 데이터 동적 추가 p.166

/*
var arr=[];

let i = 0;
for(; i < 10;){
    arr.push("2 * " + i + " = " + 2 * i);
    i++;
}

console.log(arr.length);

for (let index = 0; index < arr.length; index++) {
    console.log(arr[index]);
}
*/
