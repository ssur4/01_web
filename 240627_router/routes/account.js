const router = require('express').Router();

router.get("/login", (req, res) => {
    if (req.session.user) {
      //res.send('이미 로그인 되어있습니다');
      res.render("/index.ejs", { user: req.session.user });
    } else {
      res.render("login.ejs");
    }
  });

router.post("/login", (req, res) => {
//console.log(req.body);
mydb
    .collection("account")
    .findOne({ userid: req.body.userid })
    .then((result) => {
    //console.log(result);

    let salt;
    const sql = `SELECT salt FROM UserSalt
                    WHERE userid = ?`;
    mysqlconn.query(sql, [req.body.userid], (err, rows, fields) => {
        console.log(rows);
        salt = rows[0].salt;

        const hashPw = sha(req.body.userpw + salt);
        console.log(hashPw);

        if (result != null && result.userpw == sha(hashPw)) { //  result 가 널이 아닐 때, 솔트를 가져와야한다. result != null 을 분리해서 하는 것이 성능면에서 좋다.
        req.body.userpw = hashPw;
        req.session.user = req.body;

        console.log("새로운 로그인");
        // res.send(`${req.session.user.userid}님 환영합니다`);
        res.render("index.ejs", { user: req.session.user });
        } else {
        //res.send("login fail");
        res.render("login.ejs");
        }
    });
    })
    .catch((err) => {
    console.log(err);
    res.status(500).send();
    });
});

router.get("/logout", (req, res) => {
console.log("로그아웃");
req.session.destroy();
res.render("index.ejs", { user: null });
});

router.get("/", function (req, res) {
if (req.session.user) {
    //res.send('이미 로그인 되어있습니다');
    res.render("index.ejs", { user: req.session.user });
} else {
    res.render("index.ejs", { user: null });
}
});

module.exports = router;