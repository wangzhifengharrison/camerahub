const express = require('express');
const router = express.Router();
const db = require('../modules/db');
const mail = require('../modules/mail');
const fs = require("fs");
const alert = require('../bin/www');

router.get('/', function (req, res, next) {
    if (req.session.loggedin) {

        db.query('SELECT * FROM alert JOIN camera ON alert.cameraID = camera.cameraID WHERE alert.userID = ' + req.session.userID + ' ORDER BY alert.alertID DESC', function (error, results, fields) {
            if (error) {
                res.redirect('/');
            }
            let username = req.session.username;
            res.locals.userID = req.session.userID;
            res.locals.username = req.session.username;
            res.render('alert', {userName: username, alerts: results});
        });
    } else {
        res.redirect('/user/login');
    }
});

/* POST Alert Insertion . */
router.post('/add', function (req, res, next) {
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
                    //Send Email
                    recipients.forEach(recipient => {
                        mail.sendMail(recipient, alertMessageIHL);
                    });
                    //Websocket
                    alert.ioObject.sockets.emit('alert', cameraID + '|' + alertMessageIHL + '|' + alertTimestamp);
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

router.get('/wipe', function (req, res, next) {
    let query = "TRUNCATE TABLE `alert`";
    db.query(query, (err, result) => {
        res.redirect('/notification');
    });
});

module.exports = router;
