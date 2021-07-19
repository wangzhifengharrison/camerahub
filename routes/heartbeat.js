const express = require('express');
const router = express.Router();
const serverUp = require('../bin/www');

router.post('/', function (req, res, next) {
    console.log('Got Heartbeat Package: ' + Date.now());
    serverUp.changeStatus();
    res.send('OK');
});

module.exports = router;
