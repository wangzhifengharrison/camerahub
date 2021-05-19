const express = require('express');
const router = express.Router();
const db = require('../modules/db');

router.get('/', function (req, res, next) {
    if (req.session.loggedin) {
        db.query('SELECT * FROM camera JOIN office ON camera.officeID = office.officeID WHERE camera.userID = ' + req.session.userID, function (error, results, fields) {
            if (error) {
                res.redirect('/');
            }
            db.query('SELECT * FROM office WHERE userID = ' + req.session.userID, function (error, officeResults, fields) {
                if (error) {
                    res.redirect('/');
                }
                let username = req.session.username;
                res.render('camera', {userName: username, offices: officeResults, cameras: results});
            });
        });
    } else {
        res.redirect('/user/login');
    }

});

/* POST Camera Insertion . */
router.post('/add', function (req, res) {
    //console.log(req.body);
    if (req.session.loggedin) {
        let cameraSN = req.body.cameraSN;
        let cameraURL = req.body.cameraFeed;
        let officeID = req.body.officeID;
        let emailRecipient = req.body.noticeMails;
        let isTestHat = '0';
        let isTestVest = '0';
        let isTestRunning = '0';
        let isTestFailing = '0';
        let isTestArea = '0';
        if (req.body.hatTrigger === 'on') {
            isTestHat = '1';
        }
        if (req.body.vestTrigger === 'on') {
            isTestVest = '1';
        }
        if (req.body.runningTrigger === 'on') {
            isTestRunning = '1';
        }
        if (req.body.failingTrigger === 'on') {
            isTestFailing = '1';
        }
        if (req.body.zoneTrigger === 'on') {
            isTestArea = '1';
        }
        let cameraRule = isTestHat + isTestVest + isTestRunning + isTestFailing + isTestArea;
        let ruleValue = req.body.polygonPoints;
        if (cameraSN) {
            let query = "INSERT INTO `camera` (cameraSN, officeID, cameraURL, cameraRule, ruleValue, emailRecipient, cameraStatus, userID) VALUES ('" +
                cameraSN + "', '" + officeID + "', '" + cameraURL + "', '" + cameraRule + "', '" + ruleValue + "', '" + emailRecipient + "', '0', '" + req.session.userID + "')";
            db.query(query, (err, result) => {
                res.redirect('/camera');
            });
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/user/login');
    }

});

/* DELETE CAMERA */
router.get('/del/:cameraID', function (req, res, next) {
    if (req.session.loggedin) {
        let cameraID = req.params.cameraID;
        if (cameraID) {
            let query = "DELETE FROM `camera` WHERE cameraID = '" + cameraID + "'";
            db.query(query, (err, result) => {
                //response.send(err.toString());
                res.redirect('/camera');
            });
        }
    } else {
        res.redirect('/user/login');
    }
});

//Set One Camera Activated
router.get('/active/:cameraID', function (req, res, next) {
    if (req.session.loggedin) {
        let cameraID = req.params.cameraID;
        if (cameraID) {
            let query = "UPDATE `camera` SET cameraStatus = 0";
            db.query(query, (err, result) => {
                let query = "UPDATE `camera` SET cameraStatus = 1 WHERE cameraID = '" + cameraID + "'";
                db.query(query, (err, result) => {
                    res.redirect('/camera');
                });
            });
        }
    } else {
        res.redirect('/user/login');
    }
});

module.exports = router;
