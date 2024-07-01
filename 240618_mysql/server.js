//서버측코드

const mysql = require('mysql2');        //import라이브러리 //return받은 라이브러리
const conn = mysql.createConnection({   
    host : 'localhost',
    user : 'root',
    password : 'bini9351',
    database : 'myboard'
});
//createConnection : 옵션객체, 자바스크립트 객체 형태의 아규먼트를 넣어줘야한다.
//mySQL 연결 설정


const express = require('express');    //function을 리턴하여 할당한 것
const app = express();                  //express 함수 호출하는 동작을 변수로 할당

app.use(express.static('public'));      //static resource 설정

app.listen(8080, function(){
    console.log('8080 server ready..');
});


app.get('/list', function(req, res){
    conn.connect(); //mySQL 연결 완료
    conn.query('SELECT post.id, post.title, profile.writer, post.created FROM post INNER JOIN profile ON post.profile_id = profile.id', function(err, rows, fields){   //인자1: sql  //구문인자2: 수행결과를 받을 콜백함수
        if(err) {
            console.log(err);
        } else {
            console.log('데이터베이스를 조회합니다.');
            console.log(rows);          //서버측 콘솔에 rows 출력
            res.send(rows);             //요청에 대한 응답으로 rows 반환
        }
    });
})

//라우팅코드 (static resource 설정으로 필요 없어짐)
/*
app.get('/', function(req, res){       
    res.sendFile(__dirname + "/public/index.html");
});
*/
