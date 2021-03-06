const express = require('express');
const router = express.Router();
const db = require('../modules/db');

router.get('/', function (req, res, next) {
    if (req.session.loggedin && req.session.userID) {
        db.query('SELECT * FROM office WHERE userID = ' + req.session.userID, function (error, results, fields) {
            if (error) {
                res.redirect('/');
            }
            let username = req.session.username;
            res.render('office', {userName: username, offices: results});
        });
    } else {
        res.redirect('/user/login');
    }
});

/* POST Office Insertion . */
router.post('/add', function (req, res) {
    if (req.session.loggedin) {
        let officeName = req.body.officeName;
        if (officeName) {
            let query = "INSERT INTO `office` (officeName, officeStatus, userID) VALUES ('" +
                officeName + "', '1', '" + request.session.userID + "')";
            db.query(query, (err, result) => {
                res.redirect('/office');
            });
        } else {
            res.redirect('/');
        }
    } else {
        res.redirect('/user/login');
    }
});

/* DELETE OFFICE */
router.get('/del/:officeID', function (req, res, next) {
    if (req.session.loggedin) {
        let officeID = req.params.officeID;
        if (officeID) {
            let query = "DELETE FROM `office` WHERE officeID = '" + officeID + "'";
            db.query(query, (err, result) => {
                //response.send(err.toString());
                res.redirect('/office');
            });
        }
    } else {
        res.redirect('/user/login');
    }
});

module.exports = router;
