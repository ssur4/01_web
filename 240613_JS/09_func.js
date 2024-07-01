
//함수 표현식
/*
var nickName = function()
{
    console.log("이예쁜");
};
nickName();

nickName = function()
{
    console.log('이귀엽');
};
nickName();
*/

//함수를 변수에 복사
let nickName = function()
{
    console.log('이예쁜');
}

let userName = nickName;

userName();
nickName();