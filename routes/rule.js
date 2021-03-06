const express = require('express');
const router = express.Router();
const db = require('../modules/db');

router.get('/', function (req, res, next) {
    res.render('rule');
});


module.exports = router;
