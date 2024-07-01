let userName = '이창현'; //전역변수
let userPW = '1111';

function account(userId, userpw){
    let savedName = '이창현'; //지역변수 : 데이터베이스 역할
    let savedPw = '1111';

    if(userId == savedName){
        if (userpw == savedPw){
            console.log('반갑습니다.' + userId + '님');
        } else {
            console.log('비밀번호가 틀렸습니다.');
        }
    } else {
        console.log('아이디가 틀렸습니다');
    }
}

account(userName, userPW);