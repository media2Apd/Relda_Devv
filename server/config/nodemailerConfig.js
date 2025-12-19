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
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net", // Replace if using a different provider
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL1,
    pass: process.env.PASSWORD1,
  },
  tls: {
    rejectUnauthorized: false, // Prevent issues with self-signed certificates
  },
  debug: true, // Enable debug output
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter Verification Error:", error);
  } else {
    console.log("Transporter is ready to send emails!");
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


