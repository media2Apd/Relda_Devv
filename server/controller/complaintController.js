// controllers/complaintController.js
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const Complaint = require('../models/complaintmodel');
const transporter = require('../config/nodemailerConfig');

// Multer configuration for file uploads
// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     const uploadPath = path.join(__dirname, '../uploads');
//     try {
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
    // Allowed file types
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      // Accept file
      cb(null, true);
    } else {
      // Reject file
      cb(new Error('Only image files are allowed!'), false);
    }
  };
  
  // Configure multer with storage and file filter
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter
  }).single('fileUpload');

// const upload = multer({ storage: storage }).single('fileUpload');

// Complaint submission handler
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

  // Define email options
  const mailOptions = {
    from: 'admin@reldaindia.com', // admin's email
    to: 'support@reldaindia.com', // support team's email
    subject: 'New Customer Complaint',
    html: `
      <p><strong>New complaint from:</strong> ${customerName}</p>
      <p><strong>Order ID:</strong> ${orderID}</p>
      <p><strong>Mobile:</strong> ${mobileNumber}</p>
      <p><strong>Complaint:</strong><br>${complaintText}</p>
      <p><strong>Address:</strong><br>${address}</p>
      <p><strong>E-mail (Submitter):</strong> ${email}</p>  <!-- Added the submitter's email -->
      <p><strong>From (Admin Email):</strong> admin@eldaappliances.com</p>  <!-- Admin email -->
      <p><strong>Purchase Date:</strong>${purchaseDate}</p>
      <p><strong>Delivery Date:</strong>${deliveryDate}</p>
    `,  // HTML body content with line breaks
    attachments: [
      {
        filename: file.originalname,  // The name of the file as it should appear in the email
        content: file.buffer,         // The file content (in buffer format)
        encoding: 'base64',           // Ensure the file is encoded correctly
        contentType: file.mimetype    // The MIME type of the file (e.g., 'application/pdf', 'image/jpeg')
      }
    ]
  };
  
  

  try {
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
      fileData: file.buffer,        // Store file buffer
      fileType: file.mimetype       // Store file type for easier retrieval
    });

    await newComplaint.save();

      const userMailOptions = {
      from: 'admin@reldaindia.com',
      to: email,
      subject: 'Your Complaint Has Been Received',
      html: `
        <p>Dear ${customerName},</p>
        <p>Thank you for contacting us. Your complaint has been received and our support team will get back to you soon.</p>
        <p><strong>Complaint Details:</strong></p>
        <ul>
          <li><strong>Order ID:</strong> ${orderID}</li>
          <li><strong>Complaint:</strong> ${complaintText}</li>
          
        </ul>
        <p>If you have any further questions, please reply to this email.</p>
        <p>Best Regards,<br/>RELDA India Support Team</p>
      `,
      attachments: [
      {
        filename: file.originalname,  // The name of the file as it should appear in the email
        content: file.buffer,         // The file content (in buffer format)
        encoding: 'base64',           // Ensure the file is encoded correctly
        contentType: file.mimetype    // The MIME type of the file (e.g., 'application/pdf', 'image/jpeg')
      }
    ]
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Complaint submitted successfully.' });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ message: 'Failed to submit complaint.' });
  }
};
const getAllcomplaints= async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

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


// const getAllcomplaints = async (req, res) => {
//   try {
//     const complaints = await Complaint.find();

//     const complaintsWithFile = complaints.map((complaint) => ({
//       ...complaint._doc, // Spread other fields
//       file: complaint.fileData ? complaint.fileData.toString('base64') : null, // Check if fileData exists
//       fileType: complaint.fileType || null, // Check if fileType exists
//     }));

//     res.json(complaintsWithFile);
//   } catch (error) {
//     console.error('Error fetching complaints:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


module.exports = { upload, submitComplaint, getAllcomplaints, getComplaintFile };
