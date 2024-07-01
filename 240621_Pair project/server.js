const express = require('express');
const app = express();

//드라이버 객체 리턴 //mongoClient 프로퍼티를 소문자로 사용하기 위함
const mongoclient = require('mongodb').MongoClient;
const ObjId = require('mongodb').ObjectId;
const url = `mongodb+srv://admin:1234@cluster0.ye9yjnb.mongodb.net/
?retryWrites=true&w=majority&appName=Cluster0`;

//bodyParser middleware
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

//templet engine EJS setting
//default 값이라서, 작성하지 않더라도 문제 없다???
//views 를 다른 파일로 수정 : app.set('views', path.join(__dirneame, '폴더명'));
app.set('view engine', 'ejs');

//navBar 홈으로.. (작성 중)
/* 
app.get('/home', function(req, res){
    console.log('go home ');
    res.sendFile('index.html');
});
*/

//몽고DB 연결
let mydb;
mongoclient
    .connect(url) //connect 메소드 호출
    .then(client => {
        console.log('몽고DB 접속 성공');
        mydb = client.db('pair');
             app.listen(8080, function(){
                console.log('8080 server ready..');
            });
    })
    .catch(err => {
        console.log('error');
    });


    //매물목록
    app.get('/realestate', function(req, res){
        mydb
        .collection('realestate')
        .find()
        .toArray()
        .then(result => {
            res.render('realestate.ejs', { data : result });
         });
    });

    //매물등록페이지
    app.get('/enter', function (req, res){
        res.render('enter.ejs');
    });

    //매물등록
    app.post('/save', (req, res) => {
        mydb.collection('realestate')
            .insertOne({
            title : req.body.title,
            price : req.body.price,
            address : req.body.address,
            size : req.body.size,
            num : req.body.num,
            date : req.body.someDate
            }
            ).then(result => {
                console.log('저장 완료', result);
                res.redirect('/realestate');
        }); 
    });

    //매수
    app.post('/delete', (req, res) => {
        console.log(req.body._id);
        req.body._id = new ObjId(req.body._id);
        console.log(req.body._id);
        mydb
            .collection('realestate')
            .deleteOne(req.body)
            .then(result => {
                console.log(req.body, '구매 완료');
                res.status(200).send();
            })
            .catch(err => {
                console.log(err);
            });
    })

    // get 방식 -> body 존재 X
    //상세페이지
    app.get('/content/:_id', (req, res) => {
        mydb.collection('realestate')
            .findOne({_id : new ObjId(req.params._id)})
            .then(result => {
                res.render('content.ejs', {data : result});
            })
            .catch(err => {
                res.status(500).send();
            })
    });

    app.get('/edit/:_id', (req, res) => {
        //console.log(req.params._id);  //확인
        mydb.collection('realestate')
        .findOne({_id : new ObjId(req.params._id)})
        .then(result => {
            res.render('edit.ejs', {data:result});
        })
        .catch(err => {
            res.status(500).send();
        });
    });

    app.post('/edit', (req, res) => {   
        mydb.collection('realestate')
        .updateOne( 
            {_id : new ObjId(req.body._id)},
            {$set : {title: req.body.title,
                price : req.body.price,
                address : req.body.address,
                size : req.body.size,
                num : req.body.num,
                date : req.body.someDate}})
        .then(result => {
            console.log('수정 완료');
            res.redirect('/realestate');
        })
        .catch(err => {
            res.status(500).send();
        });;
    })

    //검색기능
    app.get('/search', function(req, res){
        console.log(req.query.value)

        mydb
        .collection('realestate')
        .find({ title : req.query.value})
        .toArray()        //컬렉션의 이름이 argumet 로 들어가야한다. //toArray : find 의 결과를 배열로 변환
        .then(result => {
            res.render('realestate.ejs', { data : result });  //result 를 data 에 할당하여 ejs 로 넘겨준다.
         });
    });