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
        res.redirect('/');
    }
});

/* POST Office Insertion . */
router.post('/add', function (request, response) {
    if (request.session.loggedin) {
        let officeName = request.body.officeName;
        if (officeName) {
            let query = "INSERT INTO `office` (officeName, officeStatus, userID) VALUES ('" +
                officeName + "', '1', '" + request.session.userID + "')";
            db.query(query, (err, result) => {
                response.redirect('/office');
            });
        } else {
            response.redirect('/office');
        }
    } else {
        response.redirect('/');
    }
});

/* DELETE OFFICE */
router.get('/del/:officeID', function (request, response, next) {
    if (request.session.loggedin) {
        let officeID = request.params.officeID;
        if (officeID) {
            let query = "DELETE FROM `office` WHERE officeID = '" + officeID + "'";
            db.query(query, (err, result) => {
                //response.send(err.toString());
                response.redirect('/office');
            });
        }
    } else {
        response.redirect('/');
    }
});

module.exports = router;
