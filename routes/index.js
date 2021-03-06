const express = require('express');
const router = express.Router();
const db = require('../modules/db');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.loggedin) {
        res.render('main',);
    } else {
        res.redirect('/user/login');
    }
});

module.exports = router;
