//인증 : 로그인, 로그아웃, 회원가입 등 
const router = require("express").Router();
const setup = require('../db_setup');
const sha = require('sha256');


// 회원가입 화면 보기 라우터 
router.get('/auth/signup', (req, res) => {
    res.render('signup_workshop8.ejs');
});

// 회원가입 처리 
router.post('/auth/signup', async (req, res) => {
    const { mysqldb } = await setup();
   
    // ************* (1) null 검사 ************    
    if (req.body && req.body.user_id && req.body.password && req.body.email && req.body.name && req.body.id_number && req.body.phone && req.body.address) {        

        // ******** (2) ID 중복체크 *********
        const sqlSelect = `SELECT user_id FROM Users WHERE user_id = ?`;    //signup.ejs 에서 받아오는 값 : name =id
        mysqldb.query(sqlSelect, [req.body.user_id], (err, result) => {

            if (result.length > 0) {
              console.log('아이디 중복');
              res.render('signup_workshop8.ejs', {data : {alertMsg : 'ID가 중복 되었습니다.'}});
            } else {                
                // *********** (3) 중복 확인 후, 데이터베이스 등록 *********
                // ***********  (3-1) salt 생성 ****************
                const generateSalt = (length = 16) => {
                  const crypto = require('crypto');
                  return crypto.randomBytes(length).toString('hex');
                };

                // ************** (3-2) 비밀번호 암호화 *******************
                const salt = generateSalt();
                req.body.password = sha(req.body.password + salt);

                // ***************** (3-3) Users 테이블 저장 *******************
                const { user_id, password, email, name, id_number, phone, address } = req.body;
                const sqlInsertUsers = `INSERT INTO Users(user_id, password, email, name, id_number, phone, address) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
                mysqldb.query(sqlInsertUsers, [user_id, password, email, name, id_number, phone, address], (err, Result) => {
                  if (err) {
                    console.log(err);
                    res.render('signup_workshop8.ejs', {data : {alertMsg : '회원가입 실패'}});
                  } else {
                    // *******************(3-4) AuthSalt 저장 ********************
                    const userId = Result.insertId;
                    const sqlInsertSalt = `INSERT INTO AuthSalt(user_id, salt) VALUES (?, ?)`;
                    mysqldb.query(sqlInsertSalt, [userId, salt], (err, result) => {
                      if(err) {
                        console.log(err);
                      } else {
                        res.render('index.ejs', {data : {alertMsg : '회원가입 성공'}});
                      }
                    });
                  }
                });
            }
        });
    } else {
      res.render('signup_workshop8.ejs', {data : {alertMsg : '다시 입력하세요.'}});
    }
});



// 로그인 처리
// ************* (1) 사용자의 로그인 요청 ********************
router.post('/auth/login', async (req, res) => {

// ***************** (2) Users DB 에서 사용자 ID 검색 ******************
  const { mysqldb } = await setup();
  const sqlSelect = `SELECT user_id FROM Users WHERE user_id = ?`;    //menu.workshop8 에서 받아오는 값 : name =id
  mysqldb.query(sqlSelect, [req.body.user_id], (err, result) => {

    // ************ (3) Salt 찾기 : Users DB.id == AuthSalt DB.user_id
    if (result.length > 0) {
      const sqlSelectSaltPw = `SELECT salt, password FROM Users JOIN AuthSalt ON Users.id = AuthSalt.user_id WHERE Users.user_id = ?`;
      mysqldb.query(sqlSelectSaltPw, [req.body.user_id], (err, result) => {
        const salt = result[0].salt;
        const hashPw = sha(req.body.password + salt);

        // **************** (4) 판단 : 사용자 입력 PW + Salt == DB 저장 PW ******************
        if(hashPw == result[0].password){

          req.body.password = hashPw;
          req.session.user = req.body;
          res.cookie('uid', req.body.user_id);
          res.render('index.ejs', { user : req.session.user });

        } else {
          res.render('index.ejs', {data : {alertMsg : '다시 로그인해주세요.'}});
        }
      });      
    } else {
      res.render('index.ejs', {data : {alertMsg : '다시 로그인해주세요.'}});
    }
  });
});

// 로그아웃 처리
router.get("/auth/logout", (req, res) => {
    req.session.destroy();
    console.log('로그아웃');
    res.render('index.ejs');
})

// 외부에서 사용할 수 있도록 router를 export
module.exports = router; 

