//while
/*
var arr=[];

let i = 0;
while(i < 10){
    arr.push("2 * " + i + " = " + 2 * i);
    i++;
}

console.log(arr.length);

for (let index = 0; index < arr.length; index++) {
    console.log(arr[index]);
}
*/

//break 예제
/*
let value = 0;
while(true){
    if (value > 100) {
        break;
    }
    console.log('value의 값 : ' + value);
    value++;
}

console.log("value 는 100보다 크다.");
*/

//continue 예제
/*
let value = 0;
while(value < 10){
    value++;
    if (value % 2 == 0) {
        continue;
    }
    console.log('value의 값 : ', value);

}
*/

//반복문 중첩

let dan = 2;

outside : while(dan < 10){  //반복문 라벨링
    let num = 1;
    while(num < 10){
        if(dan == 6 && num == 1){ //6단을 제외
            break outside;  //라벨을 활용한 break
        }
        console.log(dan + " * " + num + " = " + dan * num);
        num ++;
    }
    dan++;
    alert();
}