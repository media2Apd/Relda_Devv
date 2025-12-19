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

const submitApplication = async (req, res) => {
  try {
      const { name, phone, email, aadharNumber, GSTNumber, PanNumber } = req.body;
      const file = req.file;

      if (!file) {
          return res.status(400).json({ message: 'File is required' });
      }

      // Log the received file and body
      console.log('Received file:', file);
      console.log('Received body:', req.body);

      // Construct email options
      const mailOptions = {
          from: email,
          to: 'support@reldaindia.com',
          subject: `New Authorized Dealer control from ${name}`,
          text: `From,\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nPanNumber: ${PanNumber || 'N/A'}\nGSTNumber: ${GSTNumber || 'N/A' }\nAadharNumber: ${aadharNumber || 'N/A'}`,
          headers: {
            'X-Mailer': 'Nodemailer',
            'X-Custom-Header': 'My Custom Header',
          },
          attachments: [
            {
              filename: file.originalname,  // The name of the file as it should appear in the email
              content: file.buffer,         // The file content (in buffer format)
              encoding: 'base64',           // Ensure the file is encoded correctly
              contentType: file.mimetype    // The MIME type of the file (e.g., 'application/pdf', 'image/jpeg')
            }
          ]
      };
	    const userConfirmationMail = {
  from: 'support@reldaindia.com',
  to: email,
  subject: 'Your Authorized Dealer Application has been received',
  html: `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
      <h2 style="color: #007bff;">Hi ${name},</h2>
      <p>Thank you for applying to become an Authorized Dealer with <strong>Relda India</strong>.</p>
      <p>We've received your application and our team will review your details shortly.</p>
      
      <h4>Summary of your submission:</h4>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>PAN Number:</strong> ${PanNumber}</li>
        <li><strong>GST Number:</strong> ${GSTNumber}</li>
        <li><strong>Aadhar Number:</strong> ${aadharNumber}</li>
        
      </ul>

      <p>If we need any further information, we'll reach out to you via email or phone.</p>
      <br>
      <p>Best regards,<br>The Relda India Team</p>
    </div>
  `
};

await transporter.sendMail(userConfirmationMail);
      // Validate input fields
      if (!name || !phone || !email || !aadharNumber || !GSTNumber || !PanNumber) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      const newDealer = new Dealer({
          name,
          phone,
          email,
          aadharNumber,
          GSTNumber,
          PanNumber,
          fileData: file.buffer,
          fileType: file.mimetype
      });

      await newDealer.save();
      await transporter.sendMail(mailOptions);

      res.json({ message: 'Application submitted successfully!', dealer: newDealer });
  } catch (error) {
      console.error('Error processing form submission:', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
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
