const mongoclient = require("mongodb").MongoClient;
const ObjId = require('mongodb').ObjectId;
const url = `mongodb+srv://admin:1234@cluster0.ye9yjnb.mongodb.net/
?retryWrites=true&w=majority&appName=Cluster0`;

const express = require("express");
const app = express();

//body-parser 라이브러리 추가
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

//EJS
app.set('view engine', 'ejs');

//static middleware 설정
app.use(express.static('public')); 

let mydb;

mongoclient
  .connect(url)
  .then((client) => {
    mydb = client.db('myboard');
    console.log('mongoDB OK');
    app.listen(8080, function () {
      console.log("포트 8080으로 서버 대기중 ... ");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/book", function (req, res) {
  res.send("도서 목록 관련 페이지입니다.");
});

app.get("/", function (req, res) {
  //render 의 경로는 views 가 default
  res.render("index.ejs");
});

app.get("/list", function (req, res) {
  list(req, res);
});


//forward 를 위한 list 요청에 대한 처리 분리
function list(req ,res) {
  mydb
  .collection('post')
  .find()
  .toArray()
  .then(result => {
    console.log(result);
    res.render('list.ejs', { data : result });
  });
}

//'/enter' 요청에 대한 처리 루틴
app.get('/enter', function(req, res){
  res.render('enter.ejs');
});

//'/save' 요청에 대한 post 방식의 처리 루틴
app.post('/save', function(req, res){
  // console.log(req.body.title);
  // console.log(req.body.content);
  mydb
    .collection('post')
    .insertOne(
      {title : req.body.title,
      content : req.body.content,
      date : req.body.someDate})
    .then(result => {
        //console.log(result);
        console.log('데이터 추가 성공');
        //forward
        list(req, res);
    });
});

app.post("/delete", function (req, res) {
  console.log(req.body);
  req.body._id = new ObjId(req.body._id);
  mydb.collection('post').deleteOne(req.body)
  .then(result=>{
    console.log('삭제완료');
    res.status(200).send();
  })
  .catch(err =>{
    console.log(err);
    res.status(500).send();
  });
});


//modal 을 통해서 client side renderign 구현으로 불필요해진부분
/*
app.get('/content/:_id', (req, res) => {
  mydb.collection('post')
  .findOne({ _id : new ObjId(req.params._id)})
  .then(result => {
    res.render('content.ejs', {data : result});
  })
  .catch(err => {
    console.log(err);
    res.status(500).send;
  });
});
*/

//modal 을 통해서 client side renderign 구현으로 불필요해진부분
/*
app.post('/edit', (req, res) => {
  console.log(req.body);
  res.render('edit.ejs', {data : req.body})
});
*/

app.post('/update', (req, res) => {
  mydb.collection('post')
  .updateOne({_id : new ObjId(req.body._id)},
    {$set : {title : req.body.title, content : req.body.content, date : req.body.someDate}})  // updateOne(조건, 변경항목)
  .then(result => {
    //res.redirect('/list');
    
    //forward
    list(req, res);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send();
  });
});

////////////// coocie test ///////////
const cookieParser = require('cookie-parser');
app.use(cookieParser('asdasdasdas'));
app.get('/cookie', (req, res) => {
  let milk = parseInt(req.signedCookies.milk) + 1000;
  if (isNaN(milk)){
    milk = 0;
  }
  
  //cookie 메소드 사용 : 자동으로 헤더 내 저장된다.
  res.cookie('milk', milk, {signed : true});
  res.cookie('name', '손빈');
  res.send('product: ' + req.signedCookies.milk + ", " + 'name: ' + req.signedCookies.name) ;
});