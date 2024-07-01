// const readline = require('readline');
// const rl = readline.createInterface({
//     input : process.stdin,
//     output : process.stdout
// });

//아아디 : userId
//비밀번호 : userPw
//비밀번호 확인 : userPwCheck
//이름 : name

let userId = sign.getElementById('inpuId');
let userPw = signup.getElementById('inpuPw');
let userPwCheck = signup.getElementById('inputPwCheck');;
let userName = signup.getElementById('inputName');

signup(userId, userPw, userPwCheck,userName);

function signup(userId, userPw, userPwCheck, name){

        //아이디 조건 : 한글이 들어가면 안된다.
        const userIdNameCheck = /^[a-zA-Z0-9]+$/;
        if (!userIdNameCheck.test(userId)) {
            alert('아이디를 다시 입력하세요. (영어와 숫자만 허용됩니다.)');
            return;
        }
        
        //비밀번호 일치여부  확인
        if (userPw !== userPwCheck){
            alert('비밀번호가 일치 하지 않습니다. 다시 입력해주세요');
            return;
        }

        //이름 조건 : 영어나 숫자가 들어가면 안됨
        if (!userIdNameCheck.test(name)) {
            alert('이름을 다시 입력하세요. (한글만 허용됩니다.)');
            return;
        }
};



/* 참고
//로그인
let userName = '이창현'; //전역변수
let userPW = '1111';

function sign(userId, userpw){
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

//입력 받기
rl.question('C 드라이브를 포맷하겠습니까? <y> or <n>',function(an){
    switch(an){
        case 'y':
            console.log('예, 드라이브를 포맷하겠습니다.')
            break;
        case  'n':
            console.log('아니요, 드라이브를 포맷하지 않겠습니다.')
            break;
        default:
            console.log('유효하지 않은 문자입니다.')
            break;
    }
    rl.close();
});
*/