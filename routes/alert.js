const express = require('express');
const router = express.Router();
const db = require('../modules/db');
const mail = require('../modules/mail');
const fs = require("fs");
const alert = require('../modules/alert');

router.get('/', function (req, res, next) {
    db.query('SELECT userID FROM camera WHERE cameraID = ' + '1', function (error, results, fields) {
        let resultArray = results[0];
        res.send('Result: ' + results[0]['userID']);
    });
});

/* POST Alert Insertion . */
router.post('/add', function (req, res) {
    //let alertType = req.body.alertType;
    let alertMessage = req.body.alertMessage;
    let alertTimestamp = req.body.alertTimestamp;
    let cameraID = req.body.cameraID;
    console.log('alertMessage: ' + alertMessage);
    //Convert Base64 Image to file and store the filename in the database
    //let alertAttachedPicture = new Buffer(req.body.alertAttachedPicture, 'base64');
    let alertAttachedPicture = req.body.alertAttachedPicture;
    if (alertAttachedPicture.indexOf('data:image\/png;base64') > -1) {
        let alertAttachedPicture = req.body.alertAttachedPicture.replace(/^data:image\/png;base64,/, "");
        fs.writeFile("public/alert/" + alertTimestamp + ".png", alertAttachedPicture, 'base64', function (err) {
            console.log(err);
        });
        //fs.writeFileSync("public/alert/" + alertTimestamp + ".png", alertAttachedPicture);
        //Get the userID from cameraID
        db.query('SELECT userID, emailRecipient FROM camera WHERE cameraID = ' + cameraID, function (error, results, fields) {
            let userID = results[0]['userID'];
            let recipients = results[0]['emailRecipient'].split(',');
            let alertMessageIHL = '';
            if (alertMessage.substr(0, 1) === '1') {
                alertMessageIHL += 'Detected: No Hat\n';
            }
            if (alertMessage.substr(0, 1) === '2') {
                alertMessageIHL += 'Detected: Wearing Hat\n';
            }
            if (alertMessage.substr(1, 1) === '1') {
                alertMessageIHL += 'Detected: No Vest\n';
            }
            if (alertMessage.substr(1, 1) === '2') {
                alertMessageIHL += 'Detected: Wearing Vest\n';
            }
            /*
            if (alertMessage.substr(2, 1) === '1') {
                alertMessageIHL += 'Detected: No Object in Restricted Area\n';
            }
             */
            if (alertMessage.substr(2, 1) === '2') {
                alertMessageIHL += 'Detected: Intrusion in Restricted Area\n';
            }
            /*
            if (alertMessage.substr(3, 1) === '1') {
                alertMessageIHL += 'Detected: Not Running\n';
            }
             */
            if (alertMessage.substr(3, 1) === '2') {
                alertMessageIHL += 'Detected: Running\n';
            }
            /*
           if (alertMessage.substr(4, 1) === '1') {
               alertMessageIHL += 'Detected: Not Failing\n';
           }

             */
            if (alertMessage.substr(4, 1) === '2') {
                alertMessageIHL += 'Detected: Failing\n';
            }
            if (alertMessage && alertTimestamp) {
                let query = "INSERT INTO `alert` (alertMessage, alertTime, alertAttachment, userID, cameraID) VALUES ('" +
                    alertMessage + "', '" + alertTimestamp + "', '" + alertTimestamp + ".png" + "', '" + userID + "', '" + cameraID + "')";
                db.query(query, (err, result) => {
                    recipients.forEach(recipient => {
                        mail.sendMail(recipient, alertMessageIHL);
                    });
                    res.send('OK');
                });
            } else {
                res.send('ERROR');
            }
        });
    } else {
        res.send('IMAGE ERROR');
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
