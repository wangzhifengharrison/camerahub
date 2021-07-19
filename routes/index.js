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
            db.query('SELECT (SELECT COUNT(*) FROM alert) AS alertCount, (SELECT COUNT(*) FROM camera) AS cameraCount, (SELECT COUNT(*) FROM office) AS officeCount', function (error, countResults, fields) {
                if (error) {
                    res.redirect('/');
                }
                res.locals.userID = req.session.userID;
                res.locals.username = req.session.username;
                res.render('main', {userName: res.locals.username, alerts: results, countResults: countResults});
            });

        });

    } else {
        res.redirect('/user/login');
    }
});

router.get('/test', function (req, res, next) {
    res.locals.userID = 1;
    res.locals.username = 'TEST';
    res.render('main', {
        userName: res.locals.username,
        alerts: [],
        countResults: [{alertCount: 3, cameraCount: 1, officeCount: 1}]
    });

});

module.exports = router;
