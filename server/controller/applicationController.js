// const path = require('path');
// const fs = require('fs');
// const multer = require('multer');
// const Application = require('../models/Application');
// const transporter = require('../config/nodemailerConfig');


// // Set up Multer for file uploads
// const storage = multer.memoryStorage(); // Use memory storage to store files in memory

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('application/pdf') || file.mimetype.startsWith('application/msword') || file.mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only PDF and document files are allowed!'));
//     }
//   }
// });

// const handleFormSubmission = async (req, res) => {
//   try {
//     const { name, email, aadharNumber, gstNumber, panNumber, phone, address } = req.body;
//     const file = req.file;

//     const mailOptions = {
//       from: email,
//       to: 'support@reldaindia.com', // Admin email
//       subject: `New Authourized service control from ${name}`,
//       text: `${message}\n\nFrom,\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nAddress: ${address || 'N/A'}\nPanNumber: ${panNumber || 'N/A'}\nGSTNumber: ${gstNumber || 'N/A' }\n AdharNumber: ${aadharNumber || 'N/A'}`,
//       attachments: [
//         {
//           filename: file.originalname,  // The name of the file as it should appear in the email
//           content: file.buffer,         // The file content (in buffer format)
//           encoding: 'base64',           // Ensure the file is encoded correctly
//           contentType: file.mimetype    // The MIME type of the file (e.g., 'application/pdf', 'image/jpeg')
//         }
//       ]
//     };

//     if (!name || !email || !aadharNumber || !gstNumber || !panNumber || !phone || !address || !file) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const newApplication = new Application({
//       name,
//       email,
//       aadharNumber,
//       gstNumber,
//       panNumber,
//       phone,
//       address,
//       fileData: file.buffer, // Use file.buffer to store the file data
//       fileType: file.mimetype  // Store the file type
//     });

//     await newApplication.save();

//     await transporter.sendMail(mailOptions);

//     res.json({ message: 'Application submitted successfully!' });
//   } catch (error) {
//     console.error('Error processing form submission:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// const getAllApplications = async (req, res) => {
//   try {
//     const applications = await Application.find();
//     res.json(applications);
//   } catch (error) {
//     console.error('Error fetching applications:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// const getApplicationFile = async (req, res) => {
//   try {
//     const application = await Application.findById(req.params.id);
//     if (!application || !application.fileData) {
//       return res.status(404).json({ message: 'File not found' });
//     }

//     res.set('Content-Type', application.fileType);
//     res.send(application.fileData);
//   } catch (error) {
//     console.error('Error fetching file:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// module.exports = {
//   upload,
//   handleFormSubmission,
//   getAllApplications,
//   getApplicationFile,
// };
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Application = require('../models/Application');
const transporter = require('../config/nodemailerConfig');

// Set up Multer for file uploads (Memory storage to handle buffer)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('application/pdf') ||
      file.mimetype.startsWith('application/msword') ||
      file.mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and document files are allowed!'), false);
    }
  }
});

// =========================================================================
// 1️⃣ HANDLE FORM SUBMISSION (APPLICATION + EMAILS)
// =========================================================================
const handleFormSubmission = async (req, res) => {
  try {
    const { name, email, aadharNumber, gstNumber, panNumber, phone, address } = req.body;
    const file = req.file;

    // 🔒 Validation (Must be checked first)
    if (!name || !email || !aadharNumber || !gstNumber || !panNumber || !phone || !address || !file) {
      return res.status(400).json({ message: 'All fields including document are required' });
    }

    // Save application to database
    const newApplication = new Application({
      name,
      email,
      aadharNumber,
      gstNumber,
      panNumber,
      phone,
      address,
      fileData: file.buffer,
      fileType: file.mimetype
    });

    await newApplication.save();

    // Prepare attachment for email
    const attachments = [
      {
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype
      }
    ];

    // =========================================================================
    // 📩 ADMIN ALERT EMAIL (New Authorized Service Center Application)
    // =========================================================================
    const adminMailOptions = {
      from: '"RELDA India Pvt Ltd" <support@reldaindia.com>',
      replyTo: email,
      to: 'admin@reldaindia.com',
      subject: `🏢 New Authorized Service Center Application: ${name} | RELDA India Pvt Ltd`,
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
                        🏢 Authorized Service Center Application
                      </h2>
                      <p style="color: #aaa; margin: 4px 0 0; font-size: 13px;">
                        A new partner onboarding request has been submitted.
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
                            Applicant Details
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
                            ${panNumber.toUpperCase()}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">GST Number</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 700; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0; font-family: monospace;">
                            ${gstNumber.toUpperCase()}
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

                      <!-- Proposed Center Address Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #eef0f2; border-radius: 10px; margin-bottom: 20px;">
                        <tr>
                          <td style="padding: 14px 16px;">
                            <span style="font-size: 11px; font-weight: bold; color: #777; text-transform: uppercase;">Proposed Service Center Address:</span>
                            <p style="margin: 6px 0 0; font-size: 13px; color: #333; line-height: 1.5;">${address}</p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 15px 0 0; font-size: 12px; color: #888; text-align: center;">
                        * Attached applicant document (Aadhar / PAN / Certificate) is included with this email.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 18px 20px; text-align: center;">
                      <p style="margin: 0; font-size: 11px; color: #888;">
                        © ${new Date().getFullYear()} RELDA India Pvt Ltd. Partner Onboarding Desk.
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
    const applicantMailOptions = {
      from: '"RELDA India Pvt Ltd" <support@reldaindia.com>',
      to: email,
      subject: `Application Received: Authorized Service Center | RELDA India Pvt Ltd`,
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
                      <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">Authorized Service Center Partnership</p>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 30px 25px;">
                      
                      <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                        Dear ${name},
                      </p>
                      <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                        Thank you for your interest in partnering with <strong>RELDA India Pvt Ltd</strong> as an Authorized Service Center! We have successfully received your application details and uploaded documentation.
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
                        Our dealer and service operations team is currently reviewing your application credentials (PAN, GSTIN, and facility location). An onboarding officer will contact you within <strong>2 to 3 business days</strong> for the next verification and agreement steps.
                      </p>

                      <!-- Support Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                              Have questions regarding your application?
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

    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(applicantMailOptions)
    ]);

    console.log(`✅ Application submitted & emails sent for: ${name} (${email})`);
    res.json({ message: 'Application submitted successfully!' });

  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// =========================================================================
// 2️⃣ GET ALL APPLICATIONS
// =========================================================================
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// =========================================================================
// 3️⃣ GET APPLICATION ATTACHED FILE
// =========================================================================
const getApplicationFile = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application || !application.fileData) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', application.fileType);
    res.send(application.fileData);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  upload,
  handleFormSubmission,
  getAllApplications,
  getApplicationFile,
};