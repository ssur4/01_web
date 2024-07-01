//라이브러리? 호출
const { MongoClient } = require('mongodb');
const mysql = require('mysql2');

// 함수 호출을 통해서 이 파일이 동작할 것이다.
// 따라서 우리는 함수를 정의 해야한다.
let mongodb;
let mysqldb;

const setup = async () => {
    //우리는 이제부터 데이터베이스를 연결해야한다.
    //하지만 사용자가 이미 연결된 데이터베이스가 있다면, 굳이 다시 할 필요가 없다.
    //따라서, if 를 통해서 사용자가 이미 연결된 데이터베이스가 있는지 먼저 체크할 것이다.
    if (mongodb && mysqldb) {
        return { mongodb, mysqldb };
    }

    //DB 연결 과정에서 에러가 발생할 수 있다. => try.. catch.. 사용
    try {
        //몽고DB 연결
        const mogoDbUrl = process.env.MONGODB_URL;
        //connet : 비동기 모듈 => await 를 사용하여 동기식 동작을 하도록 해야한다.
        const mongoConn = await MongoClient.connect(mogoDbUrl, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
    
        mongodb = mongoConn.db(process.env.MONGODB_DB);
        console.log('mongodb conn ok');
    
        //MySQL 데이터베이스 연결
        mysqldb = mysql.createConnection({
            host : process.env.MYSQL_HOST,
            user : process.env.MYSQL_USER,
            password : process.env.MYSQL_PASSWORD,
            database : process.env.MYSQL_DB
        });
        mysqldb.connect();
        console.log('mysql conn ok');
    
        return { mongodb, mysqldb };
    } catch(err) {
        console.log('DB conn fail', err);
    }
};

//export : setup 함수
module.exports = setup;
