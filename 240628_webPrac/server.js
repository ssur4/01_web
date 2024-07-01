const setup = require('./db_setup');    // DB 연결부 import
const express = require('express');

const app = express();

app.listen(process.env.WEB_PORT, async () => {
    await setup();  //DB 구축이 된 다음 서버 가동이 되도록
    console.log('8080 server ready..');
});