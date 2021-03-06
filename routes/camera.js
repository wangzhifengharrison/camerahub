const express = require('express');
const router = express.Router();
const db = require('../modules/db');

router.get('/', function (req, res, next) {
    if (req.session.loggedin) {
        db.query('SELECT cameraID, cameraSN, cameraURL, cameraStatus FROM camera WHERE userID = ' + req.session.userID, function (error, results, fields) {
            if (error) {
                res.redirect('/');
            }
            let username = req.session.username;
            res.render('camera', {userName: username, cameras: results});
        });
    } else {
        res.redirect('/user/login');
    }

});

/* POST Camera Insertion . */
router.post('/add', function (request, response) {
    if (request.session.loggedin) {
        let cameraSN = request.body.cameraSN;
        let cameraURL = request.body.cameraFeed;
        if (cameraSN) {
            let query = "INSERT INTO `camera` (cameraSN, cameraURL, cameraStatus, userID) VALUES ('" +
                cameraSN + "', '" + cameraURL + "', '1', '" + request.session.userID + "')";
            db.query(query, (err, result) => {
                response.redirect('/camera');
            });
        } else {
            response.redirect('/camera');
        }
    } else {
        response.redirect('/');
    }
});

/* DELETE CAMERA */
router.get('/del/:cameraID', function (request, response, next) {
    if (request.session.loggedin) {
        let cameraID = request.params.cameraID;
        if (cameraID) {
            let query = "DELETE FROM `camera` WHERE cameraID = '" + cameraID + "'";
            db.query(query, (err, result) => {
                //response.send(err.toString());
                response.redirect('/camera');
            });
        }
    } else {
        response.redirect('/');
    }
});

module.exports = router;
