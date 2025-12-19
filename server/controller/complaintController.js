// controllers/complaintController.js
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const Complaint = require('../models/complaintmodel');
const transporter = require('../config/nodemailerConfig');
const streamifier = require('streamifier');
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
//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: 'Complaint submitted successfully.' });
//   } catch (error) {
//     console.error('Error submitting complaint:', error);
//     res.status(500).json({ message: 'Failed to submit complaint.' });
//   }
// };

const cloudinary  = require('../config/cloudinary');
const { sendToZoho, attachFileToZohoRecord } = require("../helpers/zohoClient"); 
const uploadBufferToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', public_id: `complaints/${filename}` },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const submitComplaint = async (req, res) => {
  try {
    const {
      customerName,
      orderID,
      mobileNumber,
      email,
      address,
      purchaseDate,
      deliveryDate,
      complaintText
    } = req.body;

    const file = req.file;

    // 🔍 Validate inputs
    if (!customerName || !orderID || !mobileNumber || !complaintText || !address) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }

    // ☁️ Upload to Cloudinary
    const cloudinaryResult = await uploadBufferToCloudinary(file.buffer, file.originalname);
    const fileUrl = cloudinaryResult.secure_url;

    // 📤 Send to Zoho CRM
   const crmPayload = {

    
           Last_Name: customerName,         // 👈 Required by Zoho         // 👈 Use Full_Name instead of Last_Name
      Company   : 'Complaint Form',     // ✅ Required
      Phone     : mobileNumber,
      Email     : email,
      Lead_Source: 'Complaint Form',
      Description: `
        Complaint: ${complaintText}
        Order ID: ${orderID}
        Purchase Date: ${purchaseDate || 'N/A'}
        Delivery Date: ${deliveryDate || 'N/A'}
        Address: ${address}
        Cloudinary File URL: ${fileUrl}
      `
    
  
};


    /* --- Send to Zoho --------------------------------------------------- */
    console.log('🟡 Zoho CRM Payload →', JSON.stringify(crmPayload, null, 2));
    const crmResponse = await sendToZoho('Leads', crmPayload);
    console.log('🟢 Zoho CRM Response ←', JSON.stringify(crmResponse, null, 2));

    const recordId =
      crmResponse?.data?.[0]?.details?.id || null;   // null if creation failed

    /* -------------------------------------------------------------------- */
    /* 4. ATTACH FILE TO LEAD (only if it was created)                      */
    /* -------------------------------------------------------------------- */
    if (recordId) {
      await attachFileToZohoRecord(
        'Leads',
        recordId,
        fileUrl,
        file.originalname
      );
    }

    // 💾 Save to MongoDB
    const newComplaint = new Complaint({
      customerName,
      orderID,
      mobileNumber,
      email,
      address,
      purchaseDate,
      deliveryDate,
      complaintText,
      cloudinaryUrl: fileUrl
    });

    await newComplaint.save();

    // 📧 Send Notification Email
    const mailOptions = {
      from: 'admin@reldaindia.com',
      to: 'support@reldaindia.com',
      subject: 'New Customer Complaint',
      html: `
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Order ID:</strong> ${orderID}</p>
        <p><strong>Mobile:</strong> ${mobileNumber}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Address:</strong><br>${address}</p>
        <p><strong>Purchase Date:</strong> ${purchaseDate}</p>
        <p><strong>Delivery Date:</strong> ${deliveryDate}</p>
        <p><strong>Complaint:</strong><br>${complaintText}</p>
        <p><strong>Attachment:</strong> <a href="${fileUrl}" target="_blank">View File</a></p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: 'Complaint submitted successfully.',
      cloudinaryUrl: fileUrl
    });

  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ message: 'Failed to submit complaint.', error: error.message });
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
