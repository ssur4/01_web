let id = '잠수';
let pw = '1111';

let user = {
    id, //id : id,
    pw, //pw : pw
    name : "sb",
    mobile : "000-0000-0000",
    contury : "대한민국",
    a : function() {
        console.log("a");
    }
};

console.log(user);

//for ~ in 반복문 수행 : 프로퍼티를 하나씩 꺼내서 처리

for(let info in user){
    console.log(`${info} : ${user[info]}`);
}