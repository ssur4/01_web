const router = require("express").Router();
const setup = require('../db_setup');


// 세션 확인 미들웨어
const sessionChecker = (req, res, next) => {
    if (typeof req.session.user != "undefined") {
        next();
    } else {
        res.render('accounts.ejs', {data: {alertCode: alarm.needLogin}});
        // res.render('accounts.ejs', {data: {alertMsg: alarm.needLogin}});
    }
};

// 알림 코드
const alarm = {
   'needLogin' : 'AR001',
    'accountAdded': 'AR002',
    'accountDeleted': 'AR003',
    'InsufficientBalance': 'AR004'
};



// 사용자의 계좌 정보 조회
router.get('/account', sessionChecker, async (req, res) => { 
    const { mysqldb } = await setup();
    const userId = req.session.user.user_id;

    const sql = `SELECT * FROM accounts WHERE user_id = ?`;    
    mysqldb.query(sql, userId, (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            console.log(rows);
            res.render('accounts.ejs', { data: rows, userName: req.session.user.name });
        }
    });
});


// 계좌 추가 페이지 보기
router.get('/account/add', sessionChecker, (req, res) => {
    res.render('account_add.ejs');
});


// 계좌번호 생성
const generateAccountNumber = (userId, accountType) => {
    // 계좌 유형 코드
    const accountTypeCodes = {
        'AC01': '입출금통장 (체크계좌)',
        'AC02': '예금계좌 (저축예금)',
        'AC03': '정기예금',
        'AC04': '적금계좌 (정기적금)',
        'AC05': '외화계좌',
        'AC06': '주택청약종합저축',
        'AC07': 'ISA (개인종합자산관리계좌)',
        'AC08': '연금저축계좌'
    };

    // 계좌 유형 코드가 유효한지 확인
    if (!accountTypeCodes[accountType]) {
        throw new Error('유효하지 않은 계좌 유형 코드입니다.');
    }
    
    // 랜덤한 숫자 8자리 생성
    const randomPart = Math.floor(10000000 + Math.random() * 90000000);

    // 계좌 유형 코드의 마지막 2자리 추출
    const lastTwoCharacters = accountType.slice(-2);

    // 계좌 번호 생성: 랜덤 숫자 + 계좌 유형 코드 뒤 2자리
    const accountNumber = `${randomPart}${lastTwoCharacters}`;

    return accountNumber;
};


// 계좌 추가
// router.post('/account/add', sessionChecker, async (req, res) => {
//     const { mysqldb } = await setup();
    
//     // 계좌번호 생성
//     const accountNumber = generateAccountNumber(req.session.user.user_id, req.body.accountType);

//     const { accountType, initialBalance } = req.body;
//     const userId = req.session.user.user_id;

//     const sql = 'INSERT INTO Accounts (user_id, account_number, balance, account_type) VALUES (?, ?, ?, ?)';
//     mysqldb.query(sql, [userId, accountNumber, initialBalance, accountType], (err, result) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send();
//         } else {
//             res.render('accounts.ejs', {data: {alertCode: alarm.accountAdded}});
//             // res.redirect('/accounts');
//         }
//     });
// });



// 계좌 추가
router.post('/account/add', sessionChecker, async (req, res) => {
    const { mysqldb } = await setup();
    
    // 계좌번호 생성
    const accountNumber = generateAccountNumber(req.session.user.user_id, req.body.accountType);

    const { accountType, initialBalance } = req.body;
    const userId = req.session.user.user_id;

    // 트랜잭션 시작
    mysqldb.beginTransaction((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }

        // Accounts 테이블에 데이터 삽입
        const sqlInsertAccount = 'INSERT INTO Accounts (user_id, account_number, balance, account_type) VALUES (?, ?, ?, ?)';
        mysqldb.query(sqlInsertAccount, [userId, accountNumber, initialBalance, accountType], (err, result) => {
            if (err) {
                return mysqldb.rollback(() => {
                    console.log(err);
                    res.status(500).send();
                });
            }

            // 새로 생성된 계좌의 ID 가져오기
            const accountId = result.insertId;

            // AccountHistory 테이블에 초기 내역 추가
            const sqlInsertHistory = 'INSERT INTO AccountHistory (account_id, transaction_type, amount, balance, description) VALUES (?, ?, ?, ?, ?)';
            const transactionType = 'deposit';
            const description = '계좌 생성 초기 입금';

            mysqldb.query(sqlInsertHistory, [accountId, transactionType, initialBalance, initialBalance, description], (err, result) => {
                if (err) {
                    return mysqldb.rollback(() => {
                        console.log(err);
                        res.status(500).send();
                    });
                }

                // 트랜잭션 커밋
                mysqldb.commit((err) => {
                    if (err) {
                        return mysqldb.rollback(() => {
                            console.log(err);
                            res.status(500).send();
                        });
                    }
                    
                    res.render('accounts.ejs', {data: {alertCode: alarm.accountAdded}});
                });
            });
        });
    });
});



// 계좌 삭제
router.post('/account/delete', sessionChecker, async (req, res) => {
    const { mysqldb } = await setup();
    const { accountNumber } = req.body; 

    const sql = 'DELETE FROM Accounts WHERE account_number = ? AND user_id = ?';
    mysqldb.query(sql, [accountNumber, req.session.user.user_id], (err, result) => {
        console.log("sql : ", accountNumber, req.session.user.user_id);
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            // res.redirect('/account');
            res.render('accounts.ejs', {data: {alertCode: alarm.accountDeleted}});
        }
    });
});



// 계좌 거래 내역 조회
router.get('/account/history', sessionChecker, async (req, res) => {
    const { mysqldb } = await setup();
    const accountNumber = req.query.account_number;

    const sql = `
        SELECT h.*, a.account_number 
        FROM AccountHistory h
        JOIN Accounts a ON h.account_id = a.id
        WHERE a.account_number = ?`;

    mysqldb.query(sql, [accountNumber], (err, rows) => {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            // 날짜 형식 변환 함수
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = ('0' + (date.getMonth() + 1)).slice(-2);
                const day = ('0' + date.getDate()).slice(-2);
                const hours = ('0' + date.getHours()).slice(-2);
                const minutes = ('0' + date.getMinutes()).slice(-2);
                const seconds = ('0' + date.getSeconds()).slice(-2);

                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            };

            // 각 거래 내역의 날짜 형식 변환
            const formattedRows = rows.map(row => ({
                ...row,
                transaction_date: formatDate(row.transaction_date)
            }));

            console.log(formattedRows);
            res.render('account_history.ejs', { data: formattedRows });
        }
    });
});




// 입금 처리
router.post('/account/deposit', sessionChecker, async (req, res) => {
    const { mysqldb } = await setup();
    const { accountNumber, amount, description } = req.body;
    const userId = req.session.user.user_id;

    mysqldb.beginTransaction((err) => {
        const findAccountSql = 'SELECT id, balance FROM Accounts WHERE account_number = ? AND user_id = ?';
        mysqldb.query(findAccountSql, [accountNumber, userId], (err, result) => {
            if (err) {
                console.error('Error finding account:', err);
                res.status(500).send();
            }

            const accountId = result[0].id;
            const currentBalance = parseFloat(result[0].balance);
            const amountToAdd = parseFloat(amount);
            const newBalance = currentBalance + amountToAdd;

            const updateBalanceSql = 'UPDATE Accounts SET balance = ? WHERE user_id = ? AND account_number = ?';
            mysqldb.query(updateBalanceSql, [newBalance, userId, accountNumber], (err) => {
                // 롤백
                if (err) {
                    return mysqldb.rollback(() => {
                        console.error(err);
                        res.status(500).send();
                    });
                }

                const insertHistorySql = `
                    INSERT INTO AccountHistory (account_id, transaction_type, amount, balance, description) 
                    VALUES (?, 'deposit', ?, ?, ?)`;
                mysqldb.query(insertHistorySql, [accountId, amountToAdd, newBalance, description], (err) => {
                    if (err) {
                        return mysqldb.rollback(() => {
                            console.error(err);
                            res.status(500).send();
                        });
                    }

                    // 트랜젝션 커밋
                    mysqldb.commit((err) => {
                        // 롤백
                        if (err) {
                            return mysqldb.rollback(() => {
                                console.error(err);
                                res.status(500).send();
                            });
                        }

                        console.log('트랜젝션 성공');
                        res.redirect(`/account/history?account_number=${accountNumber}`);
                    });
                });
            });
        });
    });
});

// 출금 처리
router.post('/account/withdraw', sessionChecker, async (req, res) => {
    const { mysqldb } = await setup();
    const { accountNumber, amount, description } = req.body;
    const userId = req.session.user.user_id;

    mysqldb.beginTransaction((err) => {
        const findAccountSql = 'SELECT id, balance FROM Accounts WHERE account_number = ? AND user_id = ?';
        mysqldb.query(findAccountSql, [accountNumber, userId], (err, result) => {
            if (err) {
                console.error(err);
                    res.status(500).send();
            }

            if (result.length === 0) {
                console.error('계좌를 찾을 수 없습니다.');
                    res.status(404).send();
            }

            const accountId = result[0].id;
            const currentBalance = parseFloat(result[0].balance);
            const amountToWithdraw = parseFloat(amount);

            // 출금 금액이 잔액보다 많을 경우 에러 처리
            if (currentBalance < amountToWithdraw) {
                return mysqldb.rollback(() => {
                    console.error('잔액부족');
                    // res.redirect(`/account/history?account_number=${accountNumber}`);
                    res.render('accounts.ejs', {data: {alertCode: alarm.InsufficientBalance}});
                });
            }

            const newBalance = currentBalance - amountToWithdraw;

            const updateBalanceSql = 'UPDATE Accounts SET balance = ? WHERE user_id = ? AND account_number = ?';
            mysqldb.query(updateBalanceSql, [newBalance, userId, accountNumber], (err) => {
                if (err) {
                    return mysqldb.rollback(() => {
                        console.error('Error updating balance:', err);
                        res.status(500).send();
                    });
                }

                const insertHistorySql = `
                    INSERT INTO AccountHistory (account_id, transaction_type, amount, balance, description) 
                    VALUES (?, 'withdraw', ?, ?, ?)`;
                mysqldb.query(insertHistorySql, [accountId, amountToWithdraw, newBalance, description], (err) => {
                    if (err) {
                        return mysqldb.rollback(() => {
                            console.error('Error inserting account history:', err);
                            res.status(500).send();
                        });
                    }

                    // 트랜잭션 커밋
                    mysqldb.commit((err) => {
                        if (err) {
                            return mysqldb.rollback(() => {
                                console.error('Error committing transaction:', err);
                                res.status(500).send();
                            });
                        }

                        console.log('Transaction successful');
                        res.redirect(`/account/history?account_number=${accountNumber}`);
                    });
                });
            });
        });
    });
});



// 외부에서 사용할 수 있도록 router를 export
module.exports = router; 
