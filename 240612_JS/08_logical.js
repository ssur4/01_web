
/*
var id = 'jamsuham';
var pw = '1111';
var result = (id == 'jamsuham' && pw == '1111') ? '로그인되었습니다.' : '아이디 또는 비번이 틀렸습니다.';

console.log(result);
*/

/*
id = 'ssss';
result = (id == 'jamsuham' && pw == '1111') ? '로그인되었습니다.' : '아이디 또는 비번이 틀렸습니다.';

console.log(result);
*/


/*!연산자 실습
console.log(!'jamsuham');
console.log(!null);
console.log(!0);
console.log(!1);
*/


//nullish 실습
/*고전적인방법
var id = 'jamsuham';
var result = (id !== null && id !== undefined) ? '아이디가 입력되었습니다.' : '아이디가 입력되지 않았습니다.';
console.log(result);
*/

//개선 nullish 병합 연산자 '??'
var id = 'jamsuham';
var result = id ?? null ? '아이디가 입력되었습니다.' : '아이디가 입력되지 않았습니다.';
console.log(result);
