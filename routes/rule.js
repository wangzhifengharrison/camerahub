const express = require('express');
const router = express.Router();
const db = require('../modules/db');

router.get('/', function (req, res, next) {
    if (req.session.loggedin) {
        db.query('SELECT * FROM rule JOIN camera ON rule.cameraID = camera.cameraID WHERE rule.userID = ' + req.session.userID, function (error, results, fields) {
            if (error) {
                res.redirect('/');
            }
            db.query('SELECT * FROM camera JOIN office ON camera.officeID = office.officeID WHERE camera.userID = ' + req.session.userID, function (error, cameraResults, fields) {
                if (error) {
                    res.redirect('/');
                }
                let username = req.session.username;
                res.render('rule', {userName: username, rules: results, cameras: cameraResults});
            });
        });
    } else {
        res.redirect('/user/login');
    }
});

/* POST Rule Insertion . */
router.post('/add', function (req, res) {
    if (req.session.loggedin) {
        let cameraID = req.body.cameraID;
        let ruleType = req.body.ruleType;
        let ruleValue = '';
        switch (ruleType)
        {
            case '1':
                //OBJECT DETECTION
                ruleValue += req.body.isMask ? req.body.maskLogic === '1' ? '11' : '10' : '00';
                ruleValue += req.body.isHat ? req.body.hatLogic === '1' ? '11' : '10' : '00';
                ruleValue += req.body.isVest ? req.body.vestLogic === '1' ? '11' : '10' : '00';
                ruleValue += req.body.isShoes ? req.body.shoesLogic === '1' ? '11' : '10' : '00';
                //The system will report as a string like '11100010'
                break;
            case '2':
                //MOTION
                ruleValue += req.body.isFailing ? 1 : 0;
                ruleValue += req.body.isRunning ? 1 : 0;
                break;
            case '3':
                //AREA
                ruleValue += req.body.polygonPoints;
                break;
        }
        let query = "INSERT INTO `rule` (ruleType, ruleValue, cameraID, userID) VALUES ('" +
            ruleType + "', '" + ruleValue + "', '" + cameraID + "', '" + req.session.userID + "')";
        db.query(query, (err, result) => {
            if(err)
            {
                console.log(err.message);
            }
            res.redirect('/rule');
        });
    } else {
        res.redirect('/user/login');
    }
});

/* DELETE RULE */
router.get('/del/:ruleID', function (req, res, next) {
    if (req.session.loggedin) {
        let ruleID = req.params.ruleID;
        if (ruleID) {
            let query = "DELETE FROM `rule` WHERE ruleID = '" + ruleID + "'";
            db.query(query, (err, result) => {
                //response.send(err.toString());
                res.redirect('/rule');
            });
        }
    } else {
        res.redirect('/user/login');
    }
});

module.exports = router;
