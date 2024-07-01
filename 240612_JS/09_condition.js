const readline = require('readline');

const rl = readline.createInterface({ //readline 객체의 createInterface 함수를 호출
    input : process.stdin,  //process 객체의 stdin 함수 호출
    output : process.stdout  //process 객체의 stdout 함수 호출
}); 

/*
rl.question('프로그래밍 언어 이름을 입력하시오',function(data){ //자바스크립트에서는 funcrtion도 객체이다.
    console.log('가장 좋아하는 프로그래밍 언어는 ' + data + '입니다.');
    rl.close(); //리소스 낭비를 위해서 입력을 받을 대기상태를 닫아준다.
} ); 
*/


/* 입력한 수의 짝수/홀수 판별
rl.question('정수를 입력하시오',function(num){ 
    num = num % 2;
    if (num) {
        console.log('홀수입니다.');
    } else {
        console.log('짝수입니다.');
    }
    rl.close(); //리소스 낭비를 위해서 입력을 받을 대기상태를 닫아준다.
} );
 */
