const express = require('express');
const router = express.Router();
const db = require('../modules/db');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.loggedin) {
        db.query('SELECT * FROM alert JOIN camera ON alert.cameraID = camera.cameraID WHERE alert.userID = ' + req.session.userID + ' ORDER BY alert.alertID DESC', function (error, results, fields) {
            if (error) {
                res.redirect('/');
            }
            res.locals.userID = req.session.userID;
            res.locals.username = req.session.username;
            res.render('main',{userName: res.locals.username, alerts: results});
        });

    } else {
        res.redirect('/user/login');
    }
});

module.exports = router;
