// // controllers/complaintController.js
// const fs = require('fs').promises;
// const path = require('path');
// const multer = require('multer');
// const Complaint = require('../models/complaintmodel');
// const transporter = require('../config/nodemailerConfig');

// // Multer configuration for file uploads
// // const storage = multer.diskStorage({
// //   destination: async (req, file, cb) => {
// //     const uploadPath = path.join(__dirname, '../uploads');
// //     try {
// //       await fs.mkdir(uploadPath, { recursive: true });
// //       cb(null, uploadPath);
// //     } catch (err) {
// //       cb(err);
// //     }
// //   },
// //   filename: (req, file, cb) => {
// //     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
// //     cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`);
// //   }
// // });

// const storage = multer.diskStorage({
//     destination: async (req, file, cb) => {
//       const uploadPath = path.join(__dirname, '../uploads');
//       try {
//         await fs.mkdir(uploadPath, { recursive: true });
//         cb(null, uploadPath);
//       } catch (err) {
//         cb(err);
//       }
//     },
//     filename: (req, file, cb) => {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       cb(null, `${file.fieldname}-${uniqueSuffix}.${file.originalname.split('.').pop()}`);
//     }
//   });
  
//   // File filter to allow only image files
//   const fileFilter = (req, file, cb) => {
//     // Allowed file types
//     const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    
//     if (allowedMimeTypes.includes(file.mimetype)) {
//       // Accept file
//       cb(null, true);
//     } else {
//       // Reject file
//       cb(new Error('Only image files are allowed!'), false);
//     }
//   };
  
//   // Configure multer with storage and file filter
//   const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter
//   }).single('fileUpload');

// // const upload = multer({ storage: storage }).single('fileUpload');

// // Complaint submission handler
// const submitComplaint = async (req, res) => {
//   const { customerName, orderID, mobileNumber, email, address, purchaseDate, deliveryDate, complaintText } = req.body;
//   const file = req.file;

//   // Check required fields
//   if (!customerName || !orderID || !mobileNumber || !complaintText || !address) {
//     return res.status(400).json({ message: 'Missing required fields.' });
//   }

//   // Check if file is uploaded
//   if (!file) {
//     return res.status(400).json({ message: 'File is required' });
//   }

//   // Define email options
//   const mailOptions = {
//     from: 'admin@reldaindia.com', // admin's email
//     to: 'support@reldaindia.com', // support team's email
//     subject: 'New Customer Complaint',
//     html: `
//       <p><strong>New complaint from:</strong> ${customerName}</p>
//       <p><strong>Order ID:</strong> ${orderID}</p>
//       <p><strong>Mobile:</strong> ${mobileNumber}</p>
//       <p><strong>Complaint:</strong><br>${complaintText}</p>
//       <p><strong>Address:</strong><br>${address}</p>
//       <p><strong>E-mail (Submitter):</strong> ${email}</p>  <!-- Added the submitter's email -->
//       <p><strong>From (Admin Email):</strong> admin@eldaappliances.com</p>  <!-- Admin email -->
//       <p><strong>Purchase Date:</strong>${purchaseDate}</p>
//       <p><strong>Delivery Date:</strong>${deliveryDate}</p>
//     `,  // HTML body content with line breaks
//     attachments: [
//       {
//         filename: file.originalname,  // The name of the file as it should appear in the email
//         content: file.buffer,         // The file content (in buffer format)
//         encoding: 'base64',           // Ensure the file is encoded correctly
//         contentType: file.mimetype    // The MIME type of the file (e.g., 'application/pdf', 'image/jpeg')
//       }
//     ]
//   };
  
  

//   try {
//     // Save complaint details to the database
//     const newComplaint = new Complaint({
//       customerName,
//       orderID,
//       mobileNumber,
//       email,
//       address,
//       purchaseDate,
//       deliveryDate,
//       complaintText,
//       fileData: file.buffer,        // Store file buffer
//       fileType: file.mimetype       // Store file type for easier retrieval
//     });

//     await newComplaint.save();

//       const userMailOptions = {
//       from: 'admin@reldaindia.com',
//       to: email,
//       subject: 'Your Complaint Has Been Received',
//       html: `
//         <p>Dear ${customerName},</p>
//         <p>Thank you for contacting us. Your complaint has been received and our support team will get back to you soon.</p>
//         <p><strong>Complaint Details:</strong></p>
//         <ul>
//           <li><strong>Order ID:</strong> ${orderID}</li>
//           <li><strong>Complaint:</strong> ${complaintText}</li>
          
//         </ul>
//         <p>If you have any further questions, please reply to this email.</p>
//         <p>Best Regards,<br/>RELDA India Support Team</p>
//       `,
//       attachments: [
//       {
//         filename: file.originalname,  // The name of the file as it should appear in the email
//         content: file.buffer,         // The file content (in buffer format)
//         encoding: 'base64',           // Ensure the file is encoded correctly
//         contentType: file.mimetype    // The MIME type of the file (e.g., 'application/pdf', 'image/jpeg')
//       }
//     ]
//     };

//     await transporter.sendMail(userMailOptions);
//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: 'Complaint submitted successfully.' });
//   } catch (error) {
//     console.error('Error submitting complaint:', error);
//     res.status(500).json({ message: 'Failed to submit complaint.' });
//   }
// };
// const getAllcomplaints= async (req, res) => {
//   try {
//     const complaints = await Complaint.find();
//     res.json(complaints);
//   } catch (error) {
//     console.error('Error fetching applications:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// const getComplaintFile = async (req, res) => {
//   try {
//     const complaint = await Complaint.findById(req.params.id);
//     if (!complaint || !complaint.fileData) {
//       return res.status(404).json({ message: 'File not found' });
//     }

//     res.set('Content-Type', complaint.fileType);
//     res.send(complaint.fileData);
//   } catch (error) {
//     console.error('Error fetching file:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


// // const getAllcomplaints = async (req, res) => {
// //   try {
// //     const complaints = await Complaint.find();

// //     const complaintsWithFile = complaints.map((complaint) => ({
// //       ...complaint._doc, // Spread other fields
// //       file: complaint.fileData ? complaint.fileData.toString('base64') : null, // Check if fileData exists
// //       fileType: complaint.fileType || null, // Check if fileType exists
// //     }));

// //     res.json(complaintsWithFile);
// //   } catch (error) {
// //     console.error('Error fetching complaints:', error);
// //     res.status(500).json({ message: 'Internal Server Error' });
// //   }
// // };


// module.exports = { upload, submitComplaint, getAllcomplaints, getComplaintFile };
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const Complaint = require('../models/complaintmodel');
const transporter = require('../config/nodemailerConfig');

// Multer disk storage configuration
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

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
}).single('fileUpload');

// =========================================================================
// SUBMIT COMPLAINT HANDLER
// =========================================================================
const submitComplaint = async (req, res) => {
  const { customerName, orderID, mobileNumber, email, address, purchaseDate, deliveryDate, complaintText } = req.body;
  const file = req.file;

  // Check required fields
  if (!customerName || !orderID || !mobileNumber || !complaintText || !address) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  // Check if file is uploaded
  if (!file) {
    return res.status(400).json({ message: 'File is required' });
  }

  try {
    // Read file buffer if diskStorage was used
    const fileBuffer = file.buffer || (file.path ? await fs.readFile(file.path) : null);

    // Save complaint details to the database
    const newComplaint = new Complaint({
      customerName,
      orderID,
      mobileNumber,
      email,
      address,
      purchaseDate,
      deliveryDate,
      complaintText,
      fileData: fileBuffer,
      fileType: file.mimetype
    });

    await newComplaint.save();

    // Prepare email attachment
    const attachments = [
      {
        filename: file.originalname,
        content: fileBuffer,
        contentType: file.mimetype
      }
    ];

    // =========================================================================
    // 1️⃣ SUPPORT / ADMIN COMPLAINT ALERT EMAIL
    // =========================================================================
    const supportMailOptions = {
      from: 'support@reldaindia.com',
      to: 'admin@reldaindia.com',
      subject: `🚨 New Customer Complaint - Order #${orderID} | RELDA India Pvt Ltd`,
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

                  <!-- Admin Alert Banner -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 22px 25px; text-align: left; border-left: 6px solid #E60000;">
                      <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700;">
                        🚨 New Customer Complaint - <span style="color: #ff4d4d;">Order #${orderID}</span>
                      </h2>
                      <p style="color: #aaa; margin: 4px 0 0; font-size: 13px;">
                        A customer has registered an issue. Review full details below.
                      </p>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 26px 24px;">
                      
                      <!-- Customer Information Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 22px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                            Customer & Order Information
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Customer Name</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 700; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${customerName}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Order ID</td>
                          <td style="padding: 10px 16px; color: #E60000; font-weight: 800; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            #${orderID}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Mobile Number</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            <a href="tel:${mobileNumber}" style="color: #111; text-decoration: none;">${mobileNumber}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Email Address</td>
                          <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            <a href="mailto:${email}" style="color: #E60000; text-decoration: none;">${email}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Purchase Date</td>
                          <td style="padding: 10px 16px; color: #111; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${purchaseDate || 'N/A'}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Delivery Date</td>
                          <td style="padding: 10px 16px; color: #111; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            ${deliveryDate || 'N/A'}
                          </td>
                        </tr>
                      </table>

                      <!-- Complaint Description Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fff9f9; border-left: 4px solid #E60000; border-radius: 6px; margin-bottom: 22px;">
                        <tr>
                          <td style="padding: 14px 16px;">
                            <span style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Complaint Details:</span>
                            <div style="font-size: 14px; font-weight: 600; color: #222; margin-top: 6px; line-height: 1.6;">
                              "${complaintText}"
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Customer Address -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fcfcfc; border: 1px solid #eef0f2; border-radius: 10px; margin-bottom: 20px;">
                        <tr>
                          <td style="padding: 12px 16px;">
                            <span style="font-size: 11px; font-weight: bold; color: #777; text-transform: uppercase;">Customer Address:</span>
                            <p style="margin: 4px 0 0; font-size: 13px; color: #333; line-height: 1.5;">${address}</p>
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 15px 0 0; font-size: 12px; color: #888; text-align: center;">
                        * Attached customer proof photo is included with this email.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #1a1a1a; padding: 18px 20px; text-align: center;">
                      <p style="margin: 0; font-size: 11px; color: #888;">
                        © ${new Date().getFullYear()} RELDA India Pvt Ltd. Support Management Portal.
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
    // 2️⃣ CUSTOMER COMPLAINT ACKNOWLEDGMENT EMAIL
    // =========================================================================
    const userMailOptions = {
      from: 'support@reldaindia.com',
      to: email,
      subject: `Complaint Received - Order #${orderID} | RELDA India Pvt Ltd`,
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
                    <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 2px solid #f2f2f2;">
                      <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 170px; height: auto; display: block;" />
                    </td>
                  </tr>

                  <!-- Red Hero Banner -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #E60000 0%, #b80000 100%); padding: 30px 20px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">We're Here to Help</h1>
                      <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">Your complaint has been successfully registered</p>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding: 30px 25px;">
                      
                      <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                        Dear ${customerName},
                      </p>
                      <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                        Thank you for contacting RELDA India Customer Support. We have received your complaint regarding <strong>Order #${orderID}</strong>. Our technical support team is currently reviewing your issue.
                      </p>

                      <!-- Summary Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                        <tr style="background-color: #fafbfc;">
                          <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                            Complaint Summary
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Order Reference</td>
                          <td style="padding: 10px 16px; color: #E60000; font-weight: 800; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            #${orderID}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Status</td>
                          <td style="padding: 10px 16px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                            <span style="background: #fff3e0; color: #e65100; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">
                              Under Review
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 16px; color: #666; font-size: 13px; vertical-align: top;">Registered Issue</td>
                          <td style="padding: 12px 16px; color: #222; font-weight: 600; font-size: 13px; text-align: right; line-height: 1.5;">
                            "${complaintText}"
                          </td>
                        </tr>
                      </table>

                      <p style="margin: 0 0 20px; font-size: 14px; color: #555; line-height: 1.6;">
                        Our service executive will reach out to you via call or email within <strong>24 to 48 business hours</strong> to assist you with resolution, replacement, or on-site service.
                      </p>

                      <!-- Support Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 16px 18px;">
                            <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                              Need urgent support?
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
      transporter.sendMail(userMailOptions),
      transporter.sendMail(supportMailOptions)
    ]);

    res.status(200).json({ message: 'Complaint submitted successfully.' });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ message: 'Failed to submit complaint.' });
  }
};

// =========================================================================
// GET ALL COMPLAINTS
// =========================================================================
const getAllcomplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// =========================================================================
// GET COMPLAINT FILE
// =========================================================================
const getComplaintFile = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint || !complaint.fileData) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', complaint.fileType);
    res.send(complaint.fileData);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { upload, submitComplaint, getAllcomplaints, getComplaintFile };