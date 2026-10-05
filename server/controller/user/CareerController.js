// // controllers/careerController.js
// const JobApplication = require('../../models/CareerModel');
// const nodemailer = require('nodemailer');
// const transporter = require('../../config/nodemailerConfig');
// const path = require('path');
// const fs = require('fs');
// const multer = require('multer')


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
// // Apply for a job
// const applyForJob = async (req, res) => {
//   try {
//     const { name, email, educationalQualification, lookingFor, experience, phone, summary } = req.body;
//     const resume = req.file  // Ensure the resume file path is correctly captured

//     // Save to MongoDB
//     const newJobApplication = new JobApplication({
//       name,
//       email,
//       educationalQualification,
//       lookingFor,
//       experience,
//       phone,
//       summary,
//       fileData: resume.buffer, // Use file.buffer to store the file data
//       fileType: resume.mimetype 
//     });
//     await newJobApplication.save();

//     // Send email with application details
//     const mailOptions = {
//       from: email, // Sender address
//       to: 'support@reldaindia.com', // Receiver email (your email)
//       subject: 'New Job Application Submitted',
//       text: `
//         Name: ${name}
//         Email: ${email}
//         Educational Qualification: ${educationalQualification}
//         Looking For: ${lookingFor}
//         Experience: ${experience}
//         Phone: ${phone}
//         Summary: ${summary}
//       `,
//       attachments: resume ? [{
//         filename: resume.originalname,  // The original name of the file
//         content: resume.buffer,         // The file buffer
//         contentType: resume.mimetype    // The MIME type of the file
//       }] : [],
//     };
//     // Send email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('Error sending email:', error);
//         return res.status(500).json({ message: 'Error sending email' });
//       } else {
//         console.log('Email sent:', info.response);
//         return res.status(200).json({ message: 'Application submitted successfully' });
//       }
//     });
//   // Send confirmation email to the user
//     const userMailOptions = {
//       from: 'support@reldaindia.com', // Your official sender address
//       to: email,
//       subject: 'Your Job Application has been Received',
//       text: `
//       Dear ${name},

//       Thank you for applying for a position with us at Relda India.

//       We have received your application and resume successfully. Our team will review your details and contact you if your profile matches our requirements.

//       Summary of your submission:
//       - Qualification: ${educationalQualification}
//       - Looking For: ${lookingFor}
//       - Experience: ${experience}
//       - Phone: ${phone}

//       Best regards,  
//       Team Relda India
//       `
//     };

//     await transporter.sendMail(userMailOptions);

//   } catch (error) {
//     console.error('Server Error:', error);
//     return res.status(500).json({ message: 'Server Error' });
//   }
// };

// // Get all job applications
// const allCareers = async (req, res) => {
//   try {
//     const careers = await JobApplication.find({});
//     return res.status(200).json(careers); // Return the careers array directly
//   } catch (error) {
//     console.error('Error retrieving job applications:', error);
//     return res.status(500).json({ error: 'Failed to retrieve job applications. Please check the server logs for more details.' });
//   }
// };

// const getCareerFile = async (req, res) => {
//   try {
//     const career = await JobApplication.findById(req.params.id);
//     if (!career || !career.fileData) {
//       return res.status(404).json({ message: 'File not found' });
//     }

//     res.set('Content-Type', career.fileType);
//     res.send(career.fileData);
//   } catch (error) {
//     console.error('Error fetching file:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// // Export the functions
// module.exports = { 
//   upload,
//   applyForJob,
//   allCareers,
//   getCareerFile,
// };
const JobApplication = require('../../models/CareerModel');
const transporter = require('../../config/nodemailerConfig');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Memory storage to handle file buffers
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
// 1️⃣ APPLY FOR JOB HANDLER
// =========================================================================
const applyForJob = async (req, res) => {
  try {
    const { name, email, educationalQualification, lookingFor, experience, phone, summary } = req.body;
    const resume = req.file;

    // 🔒 Validation
    if (!name || !email || !educationalQualification || !lookingFor || !phone) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    if (!resume) {
      return res.status(400).json({ message: 'Resume document is required' });
    }

    // Save application to MongoDB
    const newJobApplication = new JobApplication({
      name,
      email,
      educationalQualification,
      lookingFor,
      experience,
      phone,
      summary,
      fileData: resume.buffer,
      fileType: resume.mimetype
    });

    await newJobApplication.save();

    // Prepare resume attachment
    const attachments = [
      {
        filename: resume.originalname,
        content: resume.buffer,
        contentType: resume.mimetype
      }
    ];

    // =========================================================================
    // 📩 HR / ADMIN NOTIFICATION EMAIL (New Candidate Application)
    // =========================================================================
    const adminMailOptions = {
      from: '"RELDA India Pvt Ltd" <support@reldaindia.com>',
      replyTo: email,
      to: 'admin@reldaindia.com',
      subject: `💼 New Job Application: ${name} (${lookingFor}) | RELDA India Pvt Ltd`,
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
                        💼 New Job Application Received
                      </h2>
                      <p style="color: #aaa; margin: 4px 0 0; font-size: 13px;">
                        Position: <span style="color: #ff4d4d; font-weight: 700;">${lookingFor}</span>
                      </p>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 26px 24px;">
                      
                      <!-- Candidate Details Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 22px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                            Candidate Overview
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Candidate Name</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 700; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${name}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Applying For</td>
                          <td style="padding: 10px 16px; color: #E60000; font-weight: 800; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${lookingFor}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Email Address</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            <a href="mailto:${email}" style="color: #E60000; text-decoration: none;">${email}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Contact Number</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            <a href="tel:${phone}" style="color: #111; text-decoration: none;">${phone}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Qualification</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${educationalQualification}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Experience</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${experience || 'Fresher'}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Resume File</td>
                          <td style="padding: 10px 16px; color: #E60000; font-weight: 700; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            📎 ${resume.originalname}
                          </td>
                        </tr>
                      </table>

                      <!-- Professional Summary Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fff9f9; border-left: 4px solid #E60000; border-radius: 6px; margin-bottom: 22px;">
                        <tr>
                          <td style="padding: 14px 16px;">
                            <span style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Professional Summary / Cover Note:</span>
                            <div style="font-size: 13px; font-weight: 500; color: #222; margin-top: 6px; line-height: 1.6;">
                              "${summary || 'No summary provided'}"
                            </div>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 15px 0 0; font-size: 12px; color: #888; text-align: center;">
                        * The candidate's resume document is attached with this email.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 18px 20px; text-align: center;">
                      <p style="margin: 0; font-size: 11px; color: #888;">
                        © ${new Date().getFullYear()} RELDA India Pvt Ltd. HR & Talent Acquisition Desk.
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
    // 📩 CANDIDATE ACKNOWLEDGMENT EMAIL (To the applicant)
    // =========================================================================
    const userMailOptions = {
      from: '"RELDA India Pvt Ltd" <support@reldaindia.com>',
      to: email,
      subject: `Application Received: ${lookingFor} | RELDA India Pvt Ltd`,
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
                      <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800;">Application Received! 🚀</h1>
                      <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">Thank you for applying to join our team</p>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 30px 25px;">
                      
                      <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                        Dear ${name},
                      </p>
                      <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                        Thank you for applying for a career opportunity with <strong>RELDA India Pvt Ltd</strong>! We have successfully received your profile and resume for the role of <strong>${lookingFor}</strong>.
                      </p>

                      <!-- Summary Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                            Application Summary
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Applied Role</td>
                          <td style="padding: 10px 16px; color: #E60000; font-weight: 800; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${lookingFor}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Qualification</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${educationalQualification}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Experience</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${experience || 'Fresher'}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px;">Review Status</td>
                          <td style="padding: 10px 16px; text-align: right;">
                            <span style="background: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                              Under HR Review
                            </span>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 20px; font-size: 14px; color: #555; line-height: 1.6;">
                        Our talent acquisition team will review your qualifications and experience against our current openings. If your profile matches our requirements, an HR representative will contact you directly for interview scheduling.
                      </p>

                      <!-- Support Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                              Questions regarding careers at RELDA?
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

    // Send both emails in parallel cleanly
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    return res.status(200).json({ message: 'Application submitted successfully' });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// =========================================================================
// 2️⃣ GET ALL JOB APPLICATIONS
// =========================================================================
const allCareers = async (req, res) => {
  try {
    const careers = await JobApplication.find({}).sort({ createdAt: -1 });
    return res.status(200).json(careers);
  } catch (error) {
    console.error('Error retrieving job applications:', error);
    return res.status(500).json({ error: 'Failed to retrieve job applications' });
  }
};

// =========================================================================
// 3️⃣ GET APPLICATION RESUME FILE
// =========================================================================
const getCareerFile = async (req, res) => {
  try {
    const career = await JobApplication.findById(req.params.id);
    if (!career || !career.fileData) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', career.fileType);
    res.send(career.fileData);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { 
  upload,
  applyForJob,
  allCareers,
  getCareerFile,
};