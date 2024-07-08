const express = require('express');
const DB_connect = require('../DB.js');

const router = express.Router();


//// QnA 게시물 목록 출력 (제목, 작성날짜, 답변상태)
router.get('/qna/list', async (req, res) => {
    const { mysqldb } = await DB_connect();
    const sqlSelectQna = `SELECT title, created, status FROM question`;
    mysqldb.query(sqlSelectQna, (err, rows) => {
        if (rows) {
            console.log(rows);
            res.send('질문 목록입니다.');
            //res.render('qna.ejs', { data : rows });
        } else {
            console.log(err);
            res.send('QnA 게시판 오류');
        }
    });
});

// QnA > 상세보기
router.post('/qna/content', async (req, res) => {
    if (req.body.userId) {
        const {mysqldb} = await DB_connect();
        const userId = req.body.userId;
        
        // (1) DB 에서 사용자 ID 검색
        const sqlSelectUserId = `SELECT user_id FROM question WHERE user_id = ?`
        mysqldb.query(sqlSelectUserId, [userId], (err, result) => {

            if (err) {
                console.log(err);
                res.send('DB 조회 오류');
            }
            
            // (2) 사용자 id 검증
            //jwt
            if ( userId == result.user_id) {
                // (3) 질문 및 응답 게시글 내용 출력
                const sqlSelectQA = `SELECT *  FROM question LEFT JOIN answer ON question.id = answer.qusetion_id WHERE qusetsion.user_id = ?`;
                //jwt
                mysqldb.query(sqlSelectQA, [req.body.userId], (err, result) => {
                    if (result) {
                        console.log(result);
                        res.send('글 상세보기');
                        //res.render('/qna/content.ejs', {data : result});
                    } else {
                        console.log(err);
                        res.send('글 조회 오류');
                    }                
                });
            }  else {
                console.log(err);
                res.send('잘못된 접근입니다.');
                //res.render('qna.ejs', {data : {alertmsg : '잘못된 접근입니다.}})
            }
        });
    } else {
        console.log(err);
        res.send('로그인 먼저 해주세요');
        //res.render('/qna.ejs', {data : { alertMsg : '로그인 먼저 해주세요'}});
    }
}); 

//// QnA > question 글 작성창
//// 로그인된 사용자만 작성창 보기 가능
router.post('/qna/enter', (req, res) => {
    //jwt
    if (req.body.userId) {
        res.render('qna/enter.ejs');
    } else {
        console.log(err);
        res.send('로그인 먼저 해주세요');
        //res.render('/qna.ejs', {data : { alertMsg : '로그인 먼저 해주세요'}});
    }
});

//// QnA > Question 글 작성 저장
router.post('/qna/save', (req, res) => {
    const { user_id, title, content, created, file, img, status } = req.body;
    
    //사용자 확인 : jwt
    if (req.body.userId) {
        const values = { user_id, title, content, created, file, img, status };
        const sqlQInsert  = `INSERT INTO question VALUES titile = ?, content = ?, created = ?, file = ?, img = ?, status = ?`;
        mysqldb.query(sqlQInsert, values, (err, result) => {
            if (result) {
                res.send('질문 작성 완료');
                //res.render('/qna.ejs', {data : { alertMsg : '질문 작성 완료.'}});
            } else {
                console.log(err);
                res.send('서버 오류 : 잠시 후 다시 시도해주세요.')
                //res.render('/qna.ejs', {data : { alertMsg : '서버 오류 : 잠시 후 다시 시도해주세요.'}});
            }
        });
    } else {
        console.log(err);
        res.send('로그인 먼저 해주세요');
        //res.render('/qna.ejs', {data : { alertMsg : '로그인 먼저 해주세요'}});
    }
});



//// QnA > question 글 수정
router.post('/qna/update', async (req, res) => {

    //jwt
    if (req.body.userId) {
        const {mysqldb} = await DB_connect();
        const userId = req.body.userId;
        const { title, content, created, file, img} = req.body;
    
        //// 본인 글에 대해서만 수정 가능 + 본인 확인
        const sqlSelectUserId = `SELECT user_id FROM question WHERE user_id = ?`
        mysqldb.query(sqlSelectUserId, [userId], (err, result) => {
            if (userId == result.user_id) {    
                const values = [title, content, created, file, img, userId];
                const sqlQUpdate = `UPDATE question 
                                    SET title = ?, content =?, created =?, file =?, img =?
                                    WHERE user_id = ?`;
    
                mysqldb.query(sqlQUpdate, values, (err, result) => {
                    if (result) {
                        res.redirect('/qna/list');
                        res.send('글 수정 완료');
                        //res.render('/qna.ejs', {data : { alertMsg : '글 수정 완료'}});
                    } else {
                        console.log(err);
                        res.send('서버 오류 : 잠시 후 다시 시도 해주세요.');
                        //res.render('/qna.ejs', {data : { alertMsg : '서버 오류 : 잠시 후 다시 시도해주세요.'}});
                    }
                });
            } else {
                console.log(err);
                res.send('작성자가 아닙니다.');
                //res.render('/qna.ejs', {data : { alertMsg : '작성자가 아닙니다.'}});
            }
        });
    } else {
        console.log(err);
        res.send('로그인 먼저 해주세요');
        //res.render('/qna.ejs', {data : { alertMsg : '로그인 먼저 해주세요'}});
    }
})


//// QnA > 게시글 삭제
//// 본인 글만 삭제 가능
//// 질문 삭제 => 데이터베이스에서 
router.post('/qna/delete', async(req, res) => {
    //jwt
    if (req.body.userId) {
        userId = req.body.userId;
        const {mysqldb} = await DB_connect();

        // 본인 작성 확인
        const sqlSelectUserId = `SELECT user_id FROM question WHERE user_id = ?`        
        mysqldb.query(sqlSelectUserId, [userId], (err, result) => {
            if (userId == result.user_id) {
                const sqlDelete = `DELETE FROM question WHERE user_id = ?`;
                mysqldb.query(sqlDelete, [userId], (err, result) => {
                    if (result) {
                        res.send('정상 삭제되었습니다.');
                        //res.render('/qna.ejs', {data : { alertMsg : '정상 삭제되었습니다.'}});
                    } else {
                        console.log(err);
                        res.send('서버 오류 : 잠시 후 다시 시도 해주세요.');
                        //res.render('/qna.ejs', {data : { alertMsg : '서버 오류 : 잠시 후 다시 시도해주세요.'}});
                    }
                });
            } else {
                console.log(err);
                res.send('작성자가 아닙니다.');
                //res.render('/qna.ejs', {data : { alertMsg : '작성자가 아닙니다.'}});
            }
    });
    } else {
        console.log(err);
        res.send('로그인 먼저 해주세요');
        //res.render('/qna.ejs', {data : { alertMsg : '로그인 먼저 해주세요'}});
    }
})


// ***************** Answer *********************

//// 답변 작성
// 답변 작성 창은, 질문 상세보기 창에서 버튼을 눌러서 창이 뜬다.
// router.get("/qna/answer", async (req, res) => {
//     const {mysqldb} = await DB_connect();

//     // ###### 관리자 권한 검증 코드 작성 필요 #######


// })

// router.post('/qna/enter', (req, res) => {
//     //jwt
//     if (req.body.userId) {
//         res.render('qna/enter.ejs');
//     } else {
//         console.log(err);
//         res.send('로그인 먼저 해주세요');
//         //res.render('/qna.ejs', {data : { alertMsg : '로그인 먼저 해주세요'}});
//     }
// });






module.exports = router;