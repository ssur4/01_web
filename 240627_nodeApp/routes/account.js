const router = require('express').Router();
const setup = require('../db_setup');

const sha = require('sha256');

//회원가입 화면 보기
router.get('/account/enter', (req, res) => {
    res.render('enter.ejs');
});

//회원가입 처리
router.post('/account/save', async (req, res) => {
    const { mongodb, mysqldb } = await setup();
    mongodb
        .collection('account')
        .findOne({userid : req.body.userid})
        .then(result => {
            //result 가 있으면, 중복상태
            //없으면, result = null
            if (result) {
                res.render('enter.ejs', {data : {msg : 'ID가 중복되었습니다.'}});
            } else {
                const generateSalt = (length = 16) => {
                    const crypto = require('crypto');       //crypto -> 내장모듈
                    return crypto.randomBytes(length).toString('hex');     //random 하게 받은 것을 16진수 스타일 스트링으로 반환
                };

                const salt = generateSalt();
                console.log(req.body);
                req.body.userpw = sha(req.body.userpw + salt);
                mongodb.collection('account')
                    .insertOne(req.body)
                    .then(result => {
                        if (result) {
                            console.log('회원가입 성공');
                            const sql = `INSERT INTO usersalt(userid, salt) VALUES (?,?)`;
                            mysqldb.query(sql, [req.body.userid, salt], (err, rows, fields) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('salt 저장 성공');
                                }
                            });  //(sql, [], mysql 갔다와서 실행할 콜백함수)
                            res.redirect('/');
                        }   else {
                            console.log('회원가입 fail');
                            res.render('enter.ejs', {data : {alertMsg : '회원가입 fail'}});
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.render('enter.ejs', {data : {alertMsg : '회원가입 fail'}});
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.render('enter.ejs', {data : {alertMsg : '회원가입 fail'}});
        });
});


//로그인 처리
router.post('/account/login', async (req, res) => {
    console.log(req.body);
    const { mongodb, mysqldb } = await setup();
    mongodb.collection('account')
    .findOne({userid : req.body.userid})
    .then(result => {
        if (result) {
            const sql = `SELECT salt FROM usersalt WHERE userid = ?`;
            mysqldb.query(sql, [req.body.userid], (err, rows, fields) => {  // sql, 쿼리를 수행하고 받은 결과를 받을 파라미터, sql 실행하고 난 뒤 수행할 콜백함수
                    const salt = rows[0].salt;
                    const hashPw = sha(req.body.userpw + salt);
                    if (result.userpw == hashPw) {
                        //login ok
                        req.body.userpw = hashPw;
                        req.session.user = req.body;    //serialize : 유저객체
                        res.cookie('uid', req.body.userid);     // cookid(쿠키 키, 쿠키 밸류)
                        res.render('index.ejs');
                    } else {
                        //pw fail
                        res.render('index.ejs', {data : {alertMsg : '다시 로그인해주세요.'}});
                    }
                })        
        } else {
            //login fail
            res.render('index.ejs', {data : {alertMsg : '다시 로그인해주세요.'}});
        }
    })
    .catch(err => {
        //login fail
        res.render('index.ejs', {data : {alertMsg : '다시 로그인해주세요.'}});
    });

    // try {
    //     const { mongodb, mysqldb } = await setup();     //DB 연결이 된 후, 홈 화면을 보여줄 수 있도록 await
    //     res.send('Login : DB conn ok');
    // } catch (err) {
    //     res.status(500).send('db fail');
    // }
});

router.get("/account/logout", (req, res) => {
    req.session.destroy();
    res.render('index.ejs');
})

module.exports = router;