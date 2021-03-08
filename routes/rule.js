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
        let officeName = req.body.officeName;
        if (officeName) {
            let query = "INSERT INTO `office` (officeName, officeStatus, userID) VALUES ('" +
                officeName + "', '1', '" + request.session.userID + "')";
            db.query(query, (err, result) => {
                res.redirect('/rule');
            });
        } else {
            res.redirect('/rule');
        }
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
