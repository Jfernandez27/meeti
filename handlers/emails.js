const nodemailer = require('nodemailer');
const emailConfig = require('../config/emails');
const fs = require('fs');
// const path = require('path');
const util = require('util');
const ejs = require('ejs');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
    },
});

exports.send = async (options) => {
    console.log(options);

    //Read template
    const file = __dirname + `/../views/emails/${options.file}.ejs`;
    // const file = path.join(__dirname, '../views/emails', `${options.file}.ejs`);

    //compile
    const compiled = ejs.compile(fs.readFileSync(file, 'utf8'));

    //make HTML
    const html = compiled({
        url: options.url,
    });

    //setup email options
    const emailOptions = {
        from: 'Meeti <noreply@meeti.com>',
        to: options.user.email,
        subject: options.subject,
        html,
    };

    //send email
    const sendEmail = util.promisify(transport.sendMail, transport);
    return sendEmail.call(transport, emailOptions);
};
