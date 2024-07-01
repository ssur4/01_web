const express = require('express');
const app = express();

app.listen(8081,function(){
    console.log('server ready...');
});

//라우팅
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index2.html');
});

//라우팅
app.get('/book', function(req, res){
    res.send('도서 관련 페이지입니다.');
});


/*
const http = require('http');

//http 서버를 만들어준다.
const server = http.createServer((req, res) => {    
    res.statusCode = 200;       //정상응답 상태 코드
    res.setHeader('Content-Type', 'text/html'); //내가 작성한 content 를 html로 해석하겠다고, 해석기를 설정
    res.end("<h1>hello world</h1>");
});

server.listen(3000,'127.0.0.1', () => {   //listen
    console.log('server ready...');
});
*/


