/*
let n = 2;

switch(n)
{
    case 1:
        console.log(1);
        break;
    case 2:
        console.group(2);
        break;
    default:
        console.log("default");
        break;
}
*/


const readline = require('readline');
const rl = readline.createInterface({
    input : process.stdin,
    output : process.stdout
});


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



