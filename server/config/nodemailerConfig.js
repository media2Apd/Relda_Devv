// config/nodemailerConfig.js
// const nodemailer = require('nodemailer');
// require('dotenv').config(); // Ensure this line is included if you use dotenv

// const transporter = nodemailer.createTransport({
//   // service: 'mail.eldaappliances.com',
//   host: 'mail.eldaappliances.com',
//   port: 465,//587
//   secure: true,
//   auth: {
//       user: process.env.EMAIL1,
//       pass: process.env.PASSWORD1
//   },
//   tls: {
//       rejectUnauthorized: false
//   }
// });
// module.exports = transporter;

// const nodemailer = require('nodemailer')
// require('dotenv').config()
// const transporter = nodemailer.createTransport({
//     host: "smtpout.secureserver.net", 
//     port: 465, 
//     secure: true,
//     auth: {
//       user: process.env.EMAIL1,
//       pass: process.env.PASSWORD1
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
//   });

//   module.exports = transporter

const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL1,
    pass: process.env.PASSWORD1,
  },
  // logger: true,
  // debug: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Verification Error:", error.message);
  } else {
    console.log("SMTP transporter is ready!");
  }
});

module.exports = transporter;


// // config/nodemailerConfig.js
// const nodemailer = require('nodemailer');
// require('dotenv').config(); // Ensure this line is included if you use dotenv

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: 'smtp.example.com',
//   port: 587,
//   secure: false,
//   auth: {
//       user: process.env.EMAIL1,
//       pass: process.env.PASSWORD1
//   },
//   tls: {
//       rejectUnauthorized: false
//   }
// });
// module.exports = transporter;


