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
    const mysqldb = await setup();
    //console.log(req.body);
   
    // ************* (1) null 검사 ************    
    if (req.body && req.body.auth_id && req.body.password && req.body.email && req.body.name && req.body.id_number && req.body.phone && req.body.address) {        
        //console.log('null check ok')

        // ******** (2) ID 중복체크 *********
        const sqlSelect = `SELECT auth_id FROM Users WHERE auth_id = ?`;    //signup.ejs 에서 받아오는 값 : name =id
        mysqldb.query(sqlSelect, [req.body.auth_id], (err, result) => {
            if (result.length > 0) {
              console.log('아이디 중복');
              //res.send({msg : 'ID가 중복 되었습니다.'});
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
                //console.log('#3-2', req.body);
                req.body.password = sha(req.body.password + salt);

                // ***************** (3-3) Users 테이블 저장 *******************
                const { auth_id, password, email, name, id_number, phone, address } = req.body;
                //console.log('#3-3', req.body);
                const sqlInsertUsers = `INSERT INTO Users(auth_id, password, email, name, id_number, phone, address) 
                                        VALUES (?, ?, ?, ?, ?, ?, ?)`;
                mysqldb.query(sqlInsertUsers, [auth_id, password, email, name, id_number, phone, address], (err, Result) => {
                  //console.log(Result);
                  if (err) {
                    console.log(err);
                    //res.send({msg : `회원가입 실패`})
                    res.render('signup_workshop8.ejs', {data : {alertMsg : '회원가입 실패'}});
                  } else {
                    // *******************(3-4) UserSalt 저장 ********************
                    const userId = Result.insertId;
                    const sqlInsertSalt = `INSERT INTO UserSalt(user_id, salt) VALUES (?, ?)`;
                    mysqldb.query(sqlInsertSalt, [userId, salt], (err, result) => {
                      if(err) {
                        console.log(err);
                      } else {
                        //console.log('salt 저장 성공');
                        //res.send({msg : `회원가입 성공`});
                        res.render('index.ejs', {data : {alertMsg : '회원가입 성공'}});
                      }
                    });
                  }
                });
            }
        });
    } else {
      //res.send({msg : `다시 입력하세요.`});
      res.render('signup_workshop8.ejs', {data : {alertMsg : '다시 입력하세요.'}});
    }
});



// 로그인 처리
// ************* (1) 사용자의 로그인 요청 ********************
router.post('/auth/login', async (req, res) => {
// ***************** (2) Users DB 에서 사용자 ID 검색 ******************
  //console.log(req.body);
  const mysqldb = await setup();
  const sqlSelect = `SELECT auth_id FROM Users WHERE auth_id = ?`;    //menu.workshop8 에서 받아오는 값 : name =id
  mysqldb.query(sqlSelect, [req.body.auth_id], (err, result) => {
    //console.log('(2) result : ', result);

    // ************ (3) Salt 찾기 : Users DB.id == UserSalt DB.user_id
    if (result.length > 0) {
      const sqlSelectSaltPw = `SELECT salt, password FROM Users JOIN UserSalt ON Users.id = UserSalt.user_id WHERE Users.auth_id = ?`;
      mysqldb.query(sqlSelectSaltPw, [req.body.auth_id], (err, result) => {
        //console.log('(3) result : ', result);
        const salt = result[0].salt;
        const hashPw = sha(req.body.password + salt);

        // **************** (4) 판단 : 사용자 입력 PW + Salt == DB 저장 PW ******************
        if(hashPw == result[0].password){
          //login ok
          //console.log('로그인 성공');

          req.body.password = hashPw;
          req.session.user = req.body;
          res.cookie('uid', req.body.auth_id);
          res.render('index.ejs');
        } else {
          //console.log('패스워드 실패');
          res.render('index.ejs', {data : {alertMsg : '다시 로그인해주세요.'}});
        }
      });      
    } else {
      //console.log('ID 실패');
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

