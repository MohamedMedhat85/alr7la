const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "alr7la.travel@gmail.com",
        pass: "rfvj uqqn woff quyn",   //APPP PASSWORD NOT THE REAL PASSWORD
    },
});

module.exports = transporter;