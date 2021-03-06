const express = require('express');
const router = express.Router();
const db = require('../modules/db');

router.get('/', function (req, res, next) {
    res.render('rule');
});

/* POST Rule Insertion . */
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

/* DELETE RULE */
router.get('/del/:ruleID', function (request, response, next) {
    if (request.session.loggedin) {
        let ruleID = request.params.ruleID;
        if (ruleID) {
            let query = "DELETE FROM `rule` WHERE ruleID = '" + ruleID + "'";
            db.query(query, (err, result) => {
                //response.send(err.toString());
                response.redirect('/rule');
            });
        }
    } else {
        response.redirect('/');
    }
});

module.exports = router;
