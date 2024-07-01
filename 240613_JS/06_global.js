
//전역변수 & 지역변수
/*
let saverUser = '이은성';
function account () {
    let saverUser = '이귀엽'; //let 이 없을 경우, 함수 내에서 지역변수를 선언하는 것이 아니기 때문에 전역변수를 가르키게 된다.
    console.log('반갑습니다 : ' + saverUser + '님');
}  //함수가 종료됨에 따라 지역변수 saveUser 에 할당된 메모리는 삭제된다.
account();
console.log('또 오셨네요. ' + saverUser + '님');
*/


function account(userId) {
    let savedUser = '이은성';

    if(userId == savedUser){
        console.log('반갑습니다. ' + userId + '님');
    } else {
        console.log('로그인 실패했습니다.');
    }
}
account('이은성');