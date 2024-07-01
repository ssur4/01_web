const dotenv = require('dotenv').config();
const { MongoClient } = require('mongodb');
// 중괄호 표현? moghdb 에서 똑같은 이름을 가진 것을 바로 리턴하겠다는 것.
// 동일 표현 : const mongoclient = require('mongodb').MongoClient
const mysql = require('mysql2');

let mongodb;
let mysqldb;

// 복습 : async, await 
const setup = async () => {
    
    // 이미 연결된 데이터베이스 있을 경우, 다시 데이터베이스를 연결하는 것을 막기위한 조건문
    if (mongodb && mysqldb) {
        return { mongodb, mysqldb };
    }

    try{
        const mogoDbUrl = process.env.MONGODB_URL; // 환경변수 설정 (process -> 내장함수)
        const mongoConn = await MongoClient.connect(mogoDbUrl, {
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
        mongodb = mongoConn.db(process.env.MONGODB_DB); //환경변수 설정 :process.env.MONGODB_DB
        console.log('mongoDb conn ok');

        mysqldb = mysql.createConnection({
            //환경변수 설정
            host : process.env.MYSQL_HOST,
            user : process.env.MYSQL_USER,
            password : process.env.MYSQL_PASSWORD,
            database : process.env.MYSQL_DB
        });
        mysqldb.connect();
        console.log('mysql conn ok');

        return { mongodb, mysqldb };
    } catch (err) {
    console.log('DB conn fail', err);
    throw err;      //에러가 뜬다면, 여기서 종료시켜, 서버가동이 아예 안되도록 할 것이다.
    }
};

module.exports = setup;

