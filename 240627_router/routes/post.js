const router = require('express').Router();

function list(req, res) {
    mydb
      .collection("post")
      .find()
      .toArray()
      .then((result) => {
        //console.log(result);
        res.render("list.ejs", { data: result });
      });
}

router.get("/list", function (req, res) {
    //   conn.query("select * from post", function (err, rows, fields) {
    //     if (err) throw err;
    //     console.log(rows);
    //   });
    list(req, res);
  });

//'/enter' 요청에 대한 처리 루틴
router.get("/enter", function (req, res) {
    // res.sendFile(__dirname + '/enter.html');
    res.render("enter.ejs");
  });

//'/save' 요청에 대한 post 방식의 처리 루틴
router.post("/save", function (req, res) {
    //console.log(req.body.title);
    // console.log(req.body.content);
  
    mydb
      .collection("post")
      .insertOne({ title: req.body.title, content: req.body.content, date: req.body.someDate })
      .then((result) => {
        //console.log(result);
        console.log("데이터 추가 성공");
        list(req, res);
      });
  });

router.post("/delete", function (req, res) {
//console.log(req.body);
req.body._id = new ObjId(req.body._id);
mydb
    .collection("post")
    .deleteOne(req.body)
    .then((result) => {
    console.log("삭제완료");
    res.status(200).send();
    })
    .catch((err) => {
    console.log(err);
    res.status(500).send();
    });
});

router.post("/update", (req, res) => {
console.log(req.body);
mydb
    .collection("post")
    .updateOne({ _id: new ObjId(req.body._id) }, { $set: { title: req.body.title, content: req.body.content, date: req.body.someDate } })
    .then((result) => {
    //res.redirect('/list');
    list(req, res);
    })
    .catch((err) => {
    console.log(err);
    res.status(500).send();
    });
});

module.exports = router;