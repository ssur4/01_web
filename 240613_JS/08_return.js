const readline = require('readline');
const rl = readline.createInterface({  //옵션기능
    input : process.stdin,
    output : process.stdput
});

function checkAge(age){
    if (age > 19){
        return 1;
    } else {
        return 0;
    }
}

rl.readline("나이를 입력하세요 : ", function(nai){
    if (checkAge(nai)){
        console.log('입장 가능합니다.');
    }
    else {
        console.log('입장 불가합니다.')
    }
    rl.close;
});