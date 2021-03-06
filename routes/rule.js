const express = require('express');
const router = express.Router();

router.get('/list', function (req, res, next) {
    res.render('rule');
});

router.get('/add', function (req, res, next) {
    res.render('rule');
});

module.exports = router;
