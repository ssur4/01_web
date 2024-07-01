const router = require("express").Router();
const setup = require('../db_setup');


router.get('/profile', async (req, res) => {
  if (req.session.user) {
    const { mysqldb } = await setup();
    const sql = 'SELECT * FROM Users WHERE user_id = ?';

    mysqldb.query(sql, [req.session.user.user_id], (err, rows) => {
      if (err) throw err;
      if (rows.length > 0) {
        res.render('profile.ejs', { user: rows[0] });
      } else {
        res.redirect('/login');
      }
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/profile/edit', async (req, res) => {
  if (req.session.user) {
    const updatedUser = { 
      name: req.body.username,
      id_number: req.body.ssn,
      phone: req.body.phone,
      email: req.body.useremail,
      address: req.body.address
    };
    const { mysqldb } = await setup();
    const sql = 'UPDATE Users SET ? WHERE user_id = ?';
    mysqldb.query(sql, [updatedUser, req.session.user.user_id], (err, result) => {
      if (err) throw err;
      res.redirect('/profile');
    });
  } else {
    res.redirect('/login');
  }
});


// 외부에서 사용할 수 있도록 router를 export
module.exports = router; 