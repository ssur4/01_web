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
            //console.log(result);
            //res.sendFile(__dirname + '/list.html');
            res.render('list.ejs', { data : result });  //result 를 data 에 할당하여 ejs 로 넘겨준다.
         });
    });

    app.get('/enter', function (req, res){
        res.render('enter.ejs');
    });

    //웹 관리자 도구의 'network' 에서 버튼을 누를 시, /save 요청이 가는 것을 확인 가능하다.
    app.post('/save', (req, res) => {
        console.log(req.body);

        mydb.collection('post')
            .insertOne({
            title : req.body.title,
            content : req.body.content,
            date : req.body.someDate
            }
            ).then(result => {
                console.log('저장 완료', result);
                res.send('데이터 추가 성공');
        }); 
    });

    app.post('/delete', (req, res) => {
        console.log(req.body._id);
        req.body._id = new ObjId(req.body._id);
        console.log(req.body._id);
        mydb
            .collection('post')
            .deleteOne(req.body)
            .then(result => {
                console.log(req.body, '삭제 완료');
                res.status(200).send();
            })
            .catch(err => {
                console.log(err);
                
            });
    })

// get 방식 -> body 존재 X
app.get('/content/:_id', (req, res) => {
    mydb.collection('post')
        .findOne({_id : new ObjId(req.params._id)})
        .then(result => {
            res.render('content.ejs', {data : result});
        })
        .catch(err => {
            res.status(500).send();
        })
});

//수정필요부분
app.get('/edit/:_id', (req, res) => {
    //console.log(req.params._id);  //확인
    mydb.collection('post')
    .findOne({_id : new ObjId(req.params._id)})
    .then(result => {
        res.render('edit.ejs', {data:result});
    })
    .catch(err => {
        res.status(500).send();
    });
});


app.post('/edit', (req, res) => {   //req : [body에 담긴, 데이터베이스의 _id값]
    //console.log(req.body);    //확인
    mydb.collection('post')
    .updateOne( 
        {_id : new ObjId(req.body._id)},
        {$set : {title: req.body.title, content : req.body.content, date : req.body.someDate}})
    .then(result => {
        console.log('수정 완료');
        res.redirect('/list');      //redirect() 사용 //get방식 '/list' 로 통신
    })
    .catch(err => {
        res.status(500).send();
    });;
})