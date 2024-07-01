const https = require('https');     //내장 모듈
const fs = require('fs');       //내장 모듈

const express = require('express');
const app = express();

const option = {
    key : fs.readFileSync('server.key'),
    cert : fs.readFileSync('server.cert')
}

const mongoclient = require("mongodb").MongoClient;
const url = `mongodb+srv://admin:1234@cluster0.ye9yjnb.mongodb.net/
?retryWrites=true&w=majority&appName=Cluster0`;

let mydb;

mongoclient
    .connect(url)
    .then(client => {
        console.log('몽고 DB 접속 성공');
        mydb = client.db('myboard');

        https.createServer(option, app).listen(443, () => {
            console.log('HTTPS Server running on port 443');
        });

    })
    .catch(err => {
        console.log(err);
    });


const session = require('express-session');
app.use(session({
    secret : '암호화키',        //cookie(Sid) 를 암호화하는 설정
    resave : false,
    saveUninitialized : false
}));
    
///////// passport 등록 ///////
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session()); //생성된 passport 객체와 session을 바인딩하는 부분 (내장모듈 session 사용)

///////// facebook 인증 ///////
// 어떠한 전략으로 페이스북을 통해서 인정을 받을 것인지...
const FacebookStrategy = require('passport-facebook');

//내 서버에 /facebook 요청이 들어오면, 여권인증을 하겠다.
app.get('/facebook', passport.authenticate('facebook'));        //authenticate('facebook') 에서 facebook 은 어떤 것을 말하는 것인지?

//내 서버에 /facebook/callback 요청이 들어오면
app.get('/facebook/callback',
    passport.authenticate('facebook', {
        //GET방식으로 호출된다.
        successRedirect : '/',
        failureRedirect : '/fail'
    }),
    (req, res)=> {}
);


 //전달인자1 : 옵션객체, 전달인자2 : 콜백함수 
passport.use(new FacebookStrategy({
    clientID : '1023323875810844',
    clientSecret : 'f753f476b741ae97200a6e4baa2c0691',
    callbackURL : '/facebook/callback'      //GET방식으로 요청한다.
}, function(accessToken, refreshToken, profile, done) {
    //accessToken, refreshToken : jason web token -> 우리는 사용하지는 않을 것이다.
    //facebook 으로부터 사용자 아이디, 비밀번호를 profile 객체로 받는다.
    console.log('#2_profile : ', profile);
    const authkey = 'facebook' + profile.id;    //페이스북에서 이러한 이름으로 데이터를 준다.
    const authName = profile.displayName;       //페이스북에서 이러한 이름으로 데이터를 준다.

    //데이터베이스에서 찾아보고, 없으면 저장할 것이다.
    mydb.collection('account')
        .findOne( {userkey : authkey} )
        .then(result => {
            console.log('#3 : ', result);
            if (result != null) {
                console.log('#3-1 [O] : 페이스북 사용자를 우리 DB 에서 찾음 => 이전에 페이스북을 통한 로그인 이력이 있다.)');
                done(null, result);
            } else {
                console.log('#3-1 [X] : 페이스북 사용자를 우리 DB 에서 못찾음 => 처음 로그인하는 것이다.');
                mydb.collection('account')
                    .insertOne({
                        userkey : authkey,
                        userid : authName
                    })
                    .then(insertResult => {
                        if (insertResult != null) {
                            console.log('#3-2 : 페이스북 사용자를 우리 DB 에 저장 완료');
                            mydb.collection('account')
                                .findOne( {userkey : authkey} )
                                .then(result2 => {
                                    if (result2 != null){
                                        console.log('#3-3 : 페이스북 사용자를 우리 DB에 저장 후, 확인을 위해 다시 찾음');
                                        done(null, result2);
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
        .catch(err => {
            console.log(err);
        })
}));    


passport.serializeUser((user, done) => {
    try {
        console.log('#4 : serializeUser => ', user);
        done(null, user);
    }catch (err) {
        console.log(err);
    }
});

//인증을 받고, 시리얼라이즈된 데이터를 가지고 클라이언트에 가기 전에 디시리얼라이즈 실행된다.
passport.deserializeUser((user, done) => {
    console.log('#5 : DeserializeUser');

    mydb
    .collection("account")
    .findOne({ userkey: user.userkey })
    .then((result) => {
      console.log(result);
      done(null, result);
    }); //user는 이미 passport에 있는 객체라서 이렇게 매번 DB에 가서 확인할 필요가 전혀없다!
});

app.get('/', (req, res) => {
    console.log('/ 요청됨');

    try{
        console.log('#1 : ', req.session.passport);
        if (typeof req.session.passport != undefined && req.session.passport.user) {
            res.render('index.ejs', {data : req.session.passport});
        } else {
            res.render('index.ejs', {data : null});
        }
    } catch (err) {
        console.log('#1-1 : 에러발생');
        //오류가 발생하더라도 index 홈페이지로 이동하게 한다.
        res.render('index.ejs', {data : null});
    }
});

///////// login
app.get("/login", (req, res) => {
    console.log("/login : ", req.session.passport);
    res.render("login.ejs");
});