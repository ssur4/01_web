const router = require("express").Router();
const setup = require("../db_setup");

function list (mongodb, req, res) {
    mongodb.collection("post")
        .find()
        .toArray()
        .then(result => {
            console.log(result);
            res.render("list.ejs" , { data : result });
        });
}

router.get("/post/list", async (req, res) => {
    const { mongodb } = await setup();
    list(mongodb, req, res);
});

module.exports = router;