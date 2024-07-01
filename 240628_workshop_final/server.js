const setup = require('./db_setup'); // return 된 객체가 아닌 db_setup.js에서 module.exports = setup; 한 setup 함수를 가져옴
const express = require('express');

const app = express(); // express 객체를 app 변수에 저장

const session = require('express-session'); 
app.use(session({
    secret: 'my_secret_key', 
    resave: false, // 
    saveUninitialized: false
})); 

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); // true : 중첩된 객체 표현 허용

app.get('/', (req, res) => {
    res.render('index.ejs');
});


app.use('/', require('./routes/user.js'));    // 사용자
app.use('/', require('./routes/auth.js'));    // 인증
app.use('/', require('./routes/account.js')); // 계좌

app.listen(process.env.WEB_PORT, async () => {
    await setup(); // setup 함수를 실행
    console.log("8080 서버가 준비되었습니다.");
});