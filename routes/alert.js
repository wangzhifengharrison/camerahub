const express = require('express');
const router = express.Router();
const db = require('../modules/db');
const fs = require("fs");

/* POST Alert Insertion . */
router.post('/add', function (req, res) {
    let alertType = req.body.alertType;
    let alertMessage = req.body.alertMessage;
    let alertTimestamp = req.body.alertTimestamp;
    let cameraID = req.body.cameraID;
    //Convert Base64 Image to file and store the filename in the database
    let alertAttachedPicture = new Buffer(req.body.alertAttachedPicture, 'base64');
    fs.writeFileSync("public/alert/" + alertTimestamp + ".png", alertAttachedPicture);
    //Get the userID from cameraID
    let userID;
    if (alertType && alertMessage && alertTimestamp) {
        let query = "INSERT INTO `alert` (alertMessage, alertType, alertTime, alertAttachment, userID, cameraID) VALUES ('" +
            alertMessage + "', '" + alertType + "', '" + alertTimestamp + "', '" + alertTimestamp + ".png" + "', '" + userID + "', '" + cameraID + "')";
        db.query(query, (err, result) => {
            res.redirect('/office');
        });
    } else {
        res.redirect('/');
    }
});

/* DELETE Alert */
router.get('/del/:alertID', function (req, res, next) {
    let alertID = req.params.alertID;
    if (alertID) {
        let query = "DELETE FROM `alert` WHERE alertID = '" + alertID + "'";
        db.query(query, (err, result) => {
            res.send('OK');
        });
    }
});

module.exports = router;
