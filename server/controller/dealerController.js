// const fs = require('fs').promises;
// const path = require('path');
// const multer = require('multer');
// const Dealer = require('../models/Dealer');
// const transporter = require('../config/nodemailerConfig');

// // Set up Multer for file uploads
// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     const uploadPath = path.join(__dirname, '../uploads');
//     try {
//       // Create the uploads directory if it does not exist
//       await fs.mkdir(uploadPath, { recursive: true });
//       cb(null, uploadPath);
//     } catch (err) {
//       cb(err);
//     }
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`);
//   }
// });

// const upload = multer({ storage: storage }).single('fileUpload');

// const submitApplication = async (req, res) => {
//   try {
//       const { name, phone, email, aadharNumber, GSTNumber, PanNumber } = req.body;
//       const file = req.file;

//       if (!file) {
//           return res.status(400).json({ message: 'File is required' });
//       }

//       // Log the received file and body
//       console.log('Received file:', file);
//       console.log('Received body:', req.body);

//       // Construct email options
//       const mailOptions = {
//           from: email,
//           to: 'support@reldaindia.com',
//           subject: `New Authorized Dealer control from ${name}`,
//           text: `From,\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nPanNumber: ${PanNumber || 'N/A'}\nGSTNumber: ${GSTNumber || 'N/A' }\nAadharNumber: ${aadharNumber || 'N/A'}`,
//           headers: {
//             'X-Mailer': 'Nodemailer',
//             'X-Custom-Header': 'My Custom Header',
//           },
//           attachments: [
//             {
//               filename: file.originalname,  // The name of the file as it should appear in the email
//               content: file.buffer,         // The file content (in buffer format)
//               encoding: 'base64',           // Ensure the file is encoded correctly
//               contentType: file.mimetype    // The MIME type of the file (e.g., 'application/pdf', 'image/jpeg')
//             }
//           ]
//       };
// 	    const userConfirmationMail = {
//   from: 'support@reldaindia.com',
//   to: email,
//   subject: 'Your Authorized Dealer Application has been received',
//   html: `
//     <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
//       <h2 style="color: #007bff;">Hi ${name},</h2>
//       <p>Thank you for applying to become an Authorized Dealer with <strong>Relda India</strong>.</p>
//       <p>We've received your application and our team will review your details shortly.</p>
      
//       <h4>Summary of your submission:</h4>
//       <ul>
//         <li><strong>Email:</strong> ${email}</li>
//         <li><strong>Phone:</strong> ${phone}</li>
//         <li><strong>PAN Number:</strong> ${PanNumber}</li>
//         <li><strong>GST Number:</strong> ${GSTNumber}</li>
//         <li><strong>Aadhar Number:</strong> ${aadharNumber}</li>
        
//       </ul>

//       <p>If we need any further information, we'll reach out to you via email or phone.</p>
//       <br>
//       <p>Best regards,<br>The Relda India Team</p>
//     </div>
//   `
// };

// await transporter.sendMail(userConfirmationMail);
//       // Validate input fields
//       if (!name || !phone || !email || !aadharNumber || !GSTNumber || !PanNumber) {
//           return res.status(400).json({ message: 'All fields are required' });
//       }

//       const newDealer = new Dealer({
//           name,
//           phone,
//           email,
//           aadharNumber,
//           GSTNumber,
//           PanNumber,
//           fileData: file.buffer,
//           fileType: file.mimetype
//       });

//       await newDealer.save();
//       await transporter.sendMail(mailOptions);

//       res.json({ message: 'Application submitted successfully!', dealer: newDealer });
//   } catch (error) {
//       console.error('Error processing form submission:', error);
//       return res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// };

// // module.exports = { upload, submitApplication };

// const getAlldealer = async (req, res) => {
//   try {
//     const dealers = await Dealer.find();
//     res.json(dealers);
//   } catch (error) {
//     console.error('Error fetching applications:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// const getDealerFile = async (req, res) => {
//   try {
//     const dealer = await Dealer.findById(req.params.id);
//     if (!dealer || !dealer.fileData) {
//       return res.status(404).json({ message: 'File not found' });
//     }

//     res.set('Content-Type', dealer.fileType);
//     res.send(dealer.fileData);
//   } catch (error) {
//     console.error('Error fetching file:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// module.exports = {
//   upload,
//   submitApplication,
//   getAlldealer,
//   getDealerFile,
// };
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const Dealer = require('../models/Dealer');
const transporter = require('../config/nodemailerConfig');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`);
  }
});

const upload = multer({ storage: storage }).single('fileUpload');

// =========================================================================
// 1️⃣ SUBMIT DEALER APPLICATION HANDLER
// =========================================================================
const submitApplication = async (req, res) => {
  try {
    const { name, phone, email, aadharNumber, GSTNumber, PanNumber } = req.body;
    const file = req.file;

    // 🔒 Validation (Must be checked first)
    if (!name || !phone || !email || !aadharNumber || !GSTNumber || !PanNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!file) {
      return res.status(400).json({ message: 'Document file is required' });
    }

    // Read file buffer safely if diskStorage was used
    const fileBuffer = file.buffer || (file.path ? await fs.readFile(file.path) : null);

    // Save to Database
    const newDealer = new Dealer({
      name,
      phone,
      email,
      aadharNumber,
      GSTNumber,
      PanNumber,
      fileData: fileBuffer,
      fileType: file.mimetype
    });

    await newDealer.save();

    // Prepare attachment for email
    const attachments = [
      {
        filename: file.originalname,
        content: fileBuffer,
        contentType: file.mimetype
      }
    ];

    // =========================================================================
    // 📩 ADMIN ALERT EMAIL (New Authorized Dealer Application)
    // =========================================================================
    const adminMailOptions = {
      from: '"RELDA India Pvt Ltd" <support@reldaindia.com>',
      replyTo: email,
      to: 'admin@reldaindia.com',
      subject: `🏢 New Authorized Dealer Application: ${name} | RELDA India Pvt Ltd`,
      attachments,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 10px;">
            <tr>
              <td align="center">
                
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
                  
                  <!-- Top White Logo Bar -->
                  <tr>
                    <td align="center" style="background-color: #ffffff; padding: 22px 20px; border-bottom: 2px solid #f2f2f2;">
                      <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 160px; height: auto; display: block;" />
                    </td>
                  </tr>

                  <!-- Admin Alert Header -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 22px 25px; text-align: left; border-left: 6px solid #E60000;">
                      <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700;">
                        🏢 Authorized Dealership Application
                      </h2>
                      <p style="color: #aaa; margin: 4px 0 0; font-size: 13px;">
                        A new dealer partnership request has been submitted.
                      </p>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 26px 24px;">
                      
                      <!-- Applicant Details Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 22px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                            Dealer Applicant Details
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Applicant Name</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 700; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${name}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Email Address</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            <a href="mailto:${email}" style="color: #E60000; text-decoration: none;">${email}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Phone Number</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            <a href="tel:${phone}" style="color: #111; text-decoration: none;">${phone}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">PAN Number</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 700; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace;">
                            ${PanNumber.toUpperCase()}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">GST Number</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 700; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace;">
                            ${GSTNumber.toUpperCase()}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Aadhar Number</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 700; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace;">
                            ${aadharNumber}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Attached Document</td>
                          <td style="padding: 10px 16px; color: #E60000; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            📎 ${file.originalname}
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 15px 0 0; font-size: 12px; color: #888; text-align: center;">
                        * Attached applicant document (PAN / GST / Certificate) is included with this email.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 18px 20px; text-align: center;">
                      <p style="margin: 0; font-size: 11px; color: #888;">
                        © ${new Date().getFullYear()} RELDA India Pvt Ltd. Dealer Onboarding Desk.
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
      `
    };

    // =========================================================================
    // 📩 APPLICANT ACKNOWLEDGMENT EMAIL (To the applicant)
    // =========================================================================
    const userConfirmationMail = {
      from: '"RELDA India Pvt Ltd" <support@reldaindia.com>',
      to: email,
      subject: `Application Received: Authorized Dealership | RELDA India Pvt Ltd`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 10px;">
            <tr>
              <td align="center">
                
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
                  
                  <!-- Top White Logo Bar -->
                  <tr>
                    <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 2px solid #f2f2f2;">
                      <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 170px; height: auto; display: block;" />
                    </td>
                  </tr>

                  <!-- Red Hero Banner -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #E60000 0%, #b80000 100%); padding: 30px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">Application Received! 🤝</h1>
                      <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">Authorized Dealership Partnership</p>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 30px 25px;">
                      
                      <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                        Dear ${name},
                      </p>
                      <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                        Thank you for your interest in becoming an <strong>Authorized Dealer</strong> with <strong>RELDA India Pvt Ltd</strong>. We have successfully received your dealership application and business credentials.
                      </p>

                      <!-- Summary Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                            Application Summary
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Applicant Name</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 700; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${name}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Registered Email</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${email}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Registered Phone</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${phone}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Status</td>
                          <td style="padding: 10px 16px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            <span style="background: #fff3e0; color: #e65100; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                              Under Review & Verification
                            </span>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 20px; font-size: 14px; color: #555; line-height: 1.6;">
                        Our commercial sales and dealer onboarding team is currently reviewing your business credentials (PAN, GSTIN, and regional location). A representative will contact you within <strong>2 to 3 business days</strong> to discuss partnership terms and dealership margins.
                      </p>

                      <!-- Support Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                              Have questions regarding dealership onboard?
                            </p>
                            <p style="margin: 6px 0 0; font-size: 13px; color: #666;">
                              Email us: <a href="mailto:support@reldaindia.com" style="color: #E60000; text-decoration: none; font-weight: bold;">support@reldaindia.com</a> &nbsp;|&nbsp; Call: <a href="tel:9884890934" style="color: #E60000; text-decoration: none; font-weight: bold;">9884890934</a>
                            </p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 20px 0 0; font-size: 14px; color: #333; line-height: 1.5;">
                        Warm Regards,<br>
                        <strong style="color: #E60000; font-size: 15px;">RELDA India Pvt Ltd</strong>
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 22px 20px; text-align: center;">
                      <p style="margin: 0 0 6px; font-size: 12px; color: #888;">
                        © ${new Date().getFullYear()} RELDA India Pvt Ltd. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 12px; color: #666;">
                        <a href="https://www.reldaindia.com" style="color: #ffffff; text-decoration: none; font-weight: 600;">www.reldaindia.com</a>
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
      `
    };

    // Send emails in parallel
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userConfirmationMail)
    ]);

    res.json({ message: 'Application submitted successfully!', dealer: newDealer });
  } catch (error) {
    console.error('Error processing form submission:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// =========================================================================
// 2️⃣ GET ALL DEALER APPLICATIONS
// =========================================================================
const getAlldealer = async (req, res) => {
  try {
    const dealers = await Dealer.find().sort({ createdAt: -1 });
    res.json(dealers);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// =========================================================================
// 3️⃣ GET DEALER ATTACHED FILE
// =========================================================================
const getDealerFile = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.params.id);
    if (!dealer || !dealer.fileData) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', dealer.fileType);
    res.send(dealer.fileData);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  upload,
  submitApplication,
  getAlldealer,
  getDealerFile,
};