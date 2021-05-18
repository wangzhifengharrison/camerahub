const mail = require('nodemailer');
const transporter = mail.createTransport({
    service: 'gmail',
    //proxy: 'http://127.0.0.1:10809', //For testing in countries which blocked gmail
    auth: {
        user: 'nodeexecutor@gmail.com',
        pass: 'sQaEEt4tkpmknkq'
    }
});

exports.sendMail = function($mailAddress, $mailBody) {
    let mailOptions = {
        from: 'nodeexecutor@gmail.com',
        to: $mailAddress,
        subject: 'Alert Notification',
        text: $mailBody
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}