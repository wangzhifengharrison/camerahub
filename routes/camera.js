const express = require('express');
const router = express.Router();
const db = require('../modules/db');
const multer = require('multer');
// const mail = require('../modules/mail');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/camera')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname.substring(file.originalname.length - 4))
    }
})
const upload = multer({storage: storage})

router.get('/', function (req, res, next) {
    if (req.session.loggedin) {
        db.query('SELECT * FROM camera JOIN office ON camera.officeID = office.officeID WHERE camera.userID = ' + req.session.userID, function (error, results, fields) {
            if (error) {
                res.redirect('/');
            }
            db.query('SELECT * FROM office WHERE userID = ' + req.session.userID, function (error, officeResults, fields) {
                if (error) {
                    res.redirect('/');
                }
                let username = req.session.username;
                res.locals.userID = req.session.userID;
                res.locals.username = req.session.username;
                res.render('camera', {userName: username, offices: officeResults, cameras: results});
            });
        });
    } else {
        res.redirect('/user/login');
    }

});

router.get('/test', function (req, res, next) {
    res.locals.userID = 1;
    res.locals.username = 'TEST';
    res.render('camera', {
        userName: res.locals.username,
        offices: [],
        cameras: []
    });

});

/* POST Camera Insertion . */
router.post('/add', upload.single('selectImage'), function (req, res, next) {
    //console.log(req.body);
    if (req.session.loggedin) {
        //console.log('req.body.selectImage ' + req.body.selectImage);
        //console.log('req.file ' + req.files);
        let cameraSN = req.body.cameraSN;
        let cameraURL = req.body.cameraFeed;
        let officeID = req.body.officeID;
        let emailRecipient = req.body.noticeMails;
        let isTestHat = '0';
        let isTestVest = '0';
        let isTestRunning = '0';
        let isTestFailing = '0';
        let isTestArea = '0';
        let cameraImage = ''
        if (req.file) {
            console.log('Camera Image: ' + req.file.filename);
            cameraImage = req.file.filename;
        }

        if (req.body.hatTrigger === 'on') {
            isTestHat = '1';
        }
        if (req.body.vestTrigger === 'on') {
            isTestVest = '1';
        }
        if (req.body.runningTrigger === 'on') {
            isTestRunning = '1';
        }
        if (req.body.failingTrigger === 'on') {
            isTestFailing = '1';
        }
        if (req.body.zoneTrigger === 'on') {
            isTestArea = '1';
        }
        let cameraRule = isTestHat + isTestVest + isTestRunning + isTestFailing + isTestArea;
        let ruleValue = req.body.polygonPoints;
        if (cameraSN) {
            let query = "INSERT INTO `camera` (cameraSN, officeID, cameraURL, cameraRule, ruleValue, emailRecipient, cameraImage, cameraStatus, userID) VALUES ('" +
                cameraSN + "', '" + officeID + "', '" + cameraURL + "', '" + cameraRule + "', '" + ruleValue + "', '" + emailRecipient + "', '" + cameraImage + "', '0', '" + req.session.userID + "')";
            db.query(query, (err, result) => {
                res.redirect('/camera');
            });
            //console.log(query);
        } else {
            res.redirect('/');
        }

    } else {
        res.redirect('/user/login');
    }

});

/* DELETE CAMERA */
router.get('/del/:cameraID', function (req, res, next) {
    if (req.session.loggedin) {
        let cameraID = req.params.cameraID;
        if (cameraID) {
            let query = "DELETE FROM `camera` WHERE cameraID = '" + cameraID + "'";
            db.query(query, (err, result) => {
                //response.send(err.toString());
                res.redirect('/camera');
            });
        }
    } else {
        res.redirect('/user/login');
    }
});

//Set One Camera Activated
router.get('/active/:cameraID', function (req, res, next) {
    if (req.session.loggedin) {
        let cameraID = req.params.cameraID;
        if (cameraID) {
            let query = "UPDATE `camera` SET cameraStatus = 0";
            db.query(query, (err, result) => {
                let query = "UPDATE `camera` SET cameraStatus = 1 WHERE cameraID = '" + cameraID + "'";
                db.query(query, (err, result) => {
                    res.redirect('/camera');
                });
            });
        }
    } else {
        res.redirect('/user/login');
    }
});

//Set One Camera Deactivated
router.get('/deactivate/:cameraID', function (req, res, next) {
    if (req.session.loggedin) {
        let cameraID = req.params.cameraID;
        if (cameraID) {
            let query = "UPDATE `camera` SET cameraStatus = 0 WHERE cameraID = '" + cameraID + "'";
            db.query(query, (err, result) => {
                res.redirect('/camera');
            });
        }
    } else {
        res.redirect('/user/login');
    }
});


// API ACCESS FOR CAMERA List
router.get('/list', function (req, res, next) {
    let query = "SELECT * FROM camera";
    db.query(query, (err, result) => {
        res.send(JSON.stringify(result));
    });
});

router.get('/getone', function (req, res, next) {
    // mail.sendMail('1124236437@qq.com', 'test one');
    let query = "SELECT * FROM camera WHERE cameraStatus = 1";
    db.query(query, (err, result) => {
        res.send(JSON.stringify(result));
    });
});


module.exports = router;
