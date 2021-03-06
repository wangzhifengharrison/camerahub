const express = require('express');
const router = express.Router();
const db = require('../modules/db');

router.get('/login', function (req, res, next) {
    res.render('login', {ErrorInfo: ''});
});

router.post('/login', function (request, response) {
    let username = request.body.username;
    let password = request.body.password;
    if (username && password) {
        //todo: Hash the password
        db.query('SELECT * FROM user WHERE userAccount = ? AND userPassword = ?', [username, password], function (error, results, fields) {
            try {
                if (results.length > 0) {
                    request.session.loggedin = true;
                    request.session.username = results[0].userName;
                    request.session.userID = results[0].userID;
                    response.redirect('/');
                } else {
                    response.render('login', {ErrorInfo: 'Username and Password not match!'});
                }
            } catch (e) {
                response.redirect('/user/login');
            }
        });
    } else {
        response.render('index', {ErrorInfo: 'Please enter Username and Password!'});
    }
});

router.get('/logout', function (req, res, next) {
    req.session.loggedin = false;
    res.redirect('/user/login');
});

module.exports = router;
