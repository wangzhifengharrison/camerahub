const express = require('express');
const router = express.Router();
const db = require('../modules/db');

router.get('/', function (req, res, next) {
    res.render('rule');
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


module.exports = router;
