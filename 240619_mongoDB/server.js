const express = require('express');
const app = express();

//드라이버 객체 리턴 //mongoClient 프로퍼티를 소문자로 사용하기 위함
const mongoclient = require('mongodb').MongoClient;
const url = `mongodb+srv://admin:1234@cluster0.ye9yjnb.mongodb.net/
?retryWrites=true&w=majority&appName=Cluster0`;

//bodyParser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

//templet engine EJS setting
app.set('view engine', 'ejs');

let mydb;
mongoclient
    .connect(url) //connect 메소드 호출
    .then(client => {
        console.log('몽고DB 접속 성공');
        mydb = client.db('myboard');
             app.listen(8080, function(){
                console.log('8080 server ready..');
            });
    })
    .catch(err => {
        console.log('error');
    });
    
    app.get('/list', function(req, res){
        mydb
        .collection('post')
        .find()
        .toArray()        //컬렉션의 이름이 argumet 로 들어가야한다. //toArray : find 의 결과를 배열로 변환
        .then(result => {
            console.log(result);
            //res.sendFile(__dirname + '/list.html');
            res.render('list.ejs', { data : result });  //result 를 data 에 할당하여 ejs 로 넘겨준다.
         });
    });

    app.get('/enter', function (req, res){
        res.sendFile(__dirname + '/enter.html');
    });

    //웹 관리자 도구의 'network' 에서 버튼을 누를 시, /save 요청이 가는 것을 확인 가능하다.
    app.post('/save', (req, res) => {
        mydb.collection('post').insertOne({
            title : req.body.title,
            content : req.body.content
        }).then(result => {
            console.log('저장 완료', result);
            res.send('ok')
        }); 
    })

