const express = require('express');
const router = express.Router();

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/logout', function (req, res, next) {
    res.redirect('/user/login');
});

module.exports = router;
