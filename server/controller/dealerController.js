const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const Dealer = require('../models/Dealer');
const transporter = require('../config/nodemailerConfig');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const { sendToZoho, attachFileToZohoRecord } = require("../helpers/zohoClient"); // ⬅️ Add this line

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    try {
      // Create the uploads directory if it does not exist
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
const submitApplication = async (req, res) => {
  try {
    const { name, phone, email, aadharNumber, GSTNumber, PanNumber } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: 'File is required' });

    if (!name || !phone || !email || !aadharNumber || !GSTNumber || !PanNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 1. Upload file to Cloudinary
    const cloudinaryUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'dealer_applications' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

    const uploadResult = await cloudinaryUpload();

    // 2. Save to MongoDB
    const newDealer = new Dealer({
      name,
      phone,
      email,
      aadharNumber,
      GSTNumber,
      PanNumber,
      fileUploadUrl: uploadResult.secure_url,
      fileType: file.mimetype,
    });
    await newDealer.save();

    // 3. Send Email
    const mailOptions = {
      from: email,
      to: 'support@reldaindia.com',
      subject: `New Authorized Dealer Application from ${name}`,
      text: `From,
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        PAN Number: ${PanNumber}
        GST Number: ${GSTNumber}   
        Aadhar Number: ${aadharNumber}
        Resume URL: ${uploadResult.secure_url}`,
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer,
          contentType: file.mimetype,
        }
      ]
    };

    await transporter.sendMail(mailOptions);
                  
    // 4. Send to Zoho CRM
    const zohoPayload = {
      Last_Name: name,
      Email: email,
      Phone: phone,
      Company: 'Authorized Dealer Applicant',
      Lead_Source: 'Dealer Form',
      Description: `PAN: ${PanNumber}\nGST: ${GSTNumber}\nAadhar: ${aadharNumber}`,
      Resume_URL: uploadResult.secure_url // Use the correct API name for your custom field in Zoho
    };

    const crmResponse = await sendToZoho('Leads', zohoPayload);
    console.log('🔍 Zoho CRM Response:', crmResponse);

    const leadData = crmResponse?.data?.[0];
    if (!leadData || !leadData.details?.id) {
      throw new Error('Zoho CRM lead creation failed or malformed response');
    }

    // 5. Attach file to Zoho record
    const leadId = leadData.details.id;
    await attachFileToZohoRecord('Leads', leadId, uploadResult.secure_url, file.originalname);

    res.json({ message: 'Application submitted successfully!', dealer: newDealer });
  } catch (error) {
    console.error('❌ Error processing application:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// module.exports = { upload, submitApplication };

const getAlldealer = async (req, res) => {
  try {
    const dealers = await Dealer.find();
    res.json(dealers);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

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
