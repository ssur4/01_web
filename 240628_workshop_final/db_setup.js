const dotenv = require('dotenv').config(); // dotenv 모듈을 가져옴
const mysql = require('mysql2');

let mysqldb;

// 비동기 처리
const setup = async () => {

    // ********* 이미 연결되어 있으면 함수 종료 *********
    if(mysqldb) { 
        return { mysqldb };
    }

    try {
        // MySQL 연결
        mysqldb = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });
        mysqldb.connect();
        console.log('MySQL 접속 성공');

        return { mysqldb };

    } catch (error) {
        console.error('DB 접속 에러: ', error);
        throw error; 
    }
    
};

// ********* setup 함수를 외부에서 사용할 수 있도록 export 함 *********
module.exports = setup; 
// ************************************************************
