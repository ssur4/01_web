const setup = require('./db_setup');
const express = require('express');

const app = express();

const session = require('express-session');
app.use(session({
    secret : '암호화키',
    resave : false,
    saveUninitialized : false
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true})); //여러객체가 중복되어있어도 처리 가능하게 설정

//account 라우터 import
app.use('/', require('./routes/account.js'));
//post 라우터 import
app.use('/', require('./routes/post.js'));

app.get('/', (req, res) => {
    res.render('index.ejs');
});


app.listen(process.env.WEB_PORT, async () => {
    await setup();  //DB 구축이 된 다음 서버 가동이 되도록
    console.log('8080 server ready..');
});