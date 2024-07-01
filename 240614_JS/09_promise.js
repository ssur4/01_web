/*
function c() {
    console.log('c');
}

function a() {
    console.log('a');
}


function b() {
    console.log('b');
}

setTimeout(a, 3000);    //setTimeout : 비동기으로 구현이 되어있다.
setTimeout(b, 2000);
setTimeout(c, 1000);
*/

//동기식으로 구현
//콜백 헬 (Callback Hell)
/*
setTimeout(function() {
    console.log('a');

    setTimeout(function() {
        console.log('b');

        setTimeout(function() {
            console.log('c');
        }, 1000);
    }, 2000);
}, 3000);
*/

/*
var pro1 = new Promise(function(resolve, reject){ //resolve : 정상, reject : 비정상
    if (false) resolve(1);  //서버에 갔다와서, 조건이 참 > 값을 .then로 전달 및 실행
    else reject('처리오류');  //조건이 거짓 > 값을 .catch 로 전달 및 실행
}); 


pro1
    .then(function (value) { //true 일 때, 실행 : 프로미스의 처리가 끝난 뒤에 실행된다. => 동기식 구동
    console.log(value);
    })
    .catch(function(errMsg){       //false 일 때, 실행
        console.log(errMsg);
    });           
*/

function f(flag, time) {
    return new Promise((resolve, reject) => { //resolve : 정상, reject : 비정상
        if (flag) {
            setTimeout(resolve, time);
        } else {
            reject('처리오류');  //조건이 거짓 > 값을 .catch 로 전달 및 실행
        }
    });
}

f(true, 3000)
    .then(function () { //true 일 때, 실행 : 프로미스의 처리가 끝난 뒤에 실행된다. => 동기식 구동
        console.log('a');
        return f(true, 2000);
    })
    .then(function(){   
        console.log('b');
        return f(true, 1000);
    })
    .then(function() {
        console.log('c');
    })
    .catch(function(errMsg){       //false 일 때, 실행
        console.log(errMsg);        //catch 는 하나만 있으면 된다. false 일 경우 빠져나와서 바로 catch 를 수행할테니
    });   

