//let dic = new Object();


const dic = {
    boy : '소년',
    girl : "소녀",
    friend : '친구',
}

dic.apple = '사과'; //객체 프로퍼티 추가
dic.ten = 10;
console.log(dic);

delete dic.girl;   //객체 프로퍼티 삭제
console.log(dic);

dic.boy = '청년';
console.log(dic);