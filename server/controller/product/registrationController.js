const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Registration = require('../../models/register');
const transporter = require('../../config/nodemailerConfig');
const { sendToZoho, attachFileToZohoRecord } = require("../../helpers/zohoClient"); // ⬅️ Add this line
// const nodemailer = require('nodemailer');  // Assuming you're using nodemailer for sending emails
const cloudinary = require('../../config/cloudinary'); // Assuming you have a cloudinary config file
// Set up multer for file uploads
const storage = multer.memoryStorage();  // Memory storage for files
const streamifier = require('streamifier');

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('application/pdf') ||
        file.mimetype.startsWith('application/msword') ||
        file.mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and document files are allowed!'));
    }
  }
});

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     console.log('Received file:', file);
//     if (
//       file.mimetype.startsWith('application/pdf') ||
//       file.mimetype.startsWith('application/msword') ||
//       file.mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')
//     ) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only PDF and document files are allowed!'));
//     }
//   },
// }).single('file');


// Controller to handle product registration
// const registerProduct = async (req, res) => {
//   const { email, name, phone, orderNumber, serialNumber, installationDate } = req.body;
//   const file = req.file;

//   if (!file) {
//     return res.status(400).json({ message: 'File upload is required' });
//   }

  

//   try {
//     // Setup email configuration
//     const mailOptions = {
//       from: email,
//       to: 'support@reldaindia.com',
//       subject: `New Product Registration from ${name}`,
//       text: `From,\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nOrder Number: ${orderNumber || 'N/A'}\nSerial Number: ${serialNumber || 'N/A' }\nInstallation Date: ${installationDate || 'N/A'}`,
//       attachments: [{
//         filename: file.originalname,  // The original name of the file
//         content: file.buffer,         // The file buffer
//         contentType: file.mimetype    // The MIME type of the file
//       }],
//     };

//     // Save product registration in the database
//     const registration = new Registration({
//       name,
//       phone,
//       email,
//       orderNumber,
//       serialNumber,
//       installationDate,
//       fileData: file.buffer,  // Save the file buffer data (or any specific data you require)
//       fileUpload: file.originalname, // Store the original file name
//     });

//     await registration.save();
//     await transporter.sendMail(mailOptions);  // Send email
 
//     const zohoPayload = {
//        Last_Name: name,
//           Phone: phone,
//           Email: email,
//           Company: 'Individual',
//           Lead_Source: 'Product Registration',
//           Description: `Order Number: ${orderNumber}\nSerial Number: ${serialNumber}\nInstallation Date: ${installationDate}`,
//           file_name: file.originalname,
//     };
//     const crmResponse = await sendToZoho("Leads", zohoPayload); // Zoho module name can vary: Leads/Contacts/etc.
//     console.log("✅ CRM Response:", crmResponse);
//     res.status(200).send('Registration successful');
//   } catch (error) {
//     console.error('Error registering product:', error);
//     res.status(500).send(error.message);
//   }
// };
const registerProduct = async (req, res) => {
  const { email, name, phone, orderNumber, serialNumber, installationDate } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'File upload is required' });
  }

  try {
    // Upload to Cloudinary using buffer stream
    const cloudinaryUpload = () =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "product_registrations" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

    const cloudResult = await cloudinaryUpload();

    // Save to MongoDB
    const registration = new Registration({
      name,
      phone,
      email,
      orderNumber,
      serialNumber,
      installationDate,
      fileData: file.buffer,
      fileUpload: file.originalname,
       fileUrl: cloudResult.secure_url, 
    });
    await registration.save();

    // Send email with file attachment
    const mailOptions = {
      from: email,
      to: 'support@reldaindia.com',
      subject: `New Product Registration from ${name}`,
      text: `From,\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nOrder Number: ${orderNumber || 'N/A'}\nSerial Number: ${serialNumber || 'N/A'}\nInstallation Date: ${installationDate || 'N/A'}`,
      attachments: [{
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype
      }],
    };
    await transporter.sendMail(mailOptions);

        // ✅ Confirmation Email to Customer
    const customerMail = {
      from: 'support@reldaindia.com',
      to: email,
      subject: 'Thank you for registering your product',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2 style="color: #007bff;">Hi ${name},</h2>
          <p>Thank you for registering your product with Relda India.</p>
          <p>We have received your registration details successfully. Our support team will review it shortly.</p>
          <h4>Registration Details:</h4>
          <ul>
            <li><strong>Order Number:</strong> ${orderNumber || 'N/A'}</li>
            <li><strong>Serial Number:</strong> ${serialNumber || 'N/A'}</li>
            <li><strong>Installation Date:</strong> ${installationDate || 'N/A'}</li>
          </ul>
          <p>If you have any further queries, feel free to contact our support team.</p>
          <br>
          <p>Best Regards,<br>Relda India Team</p>
        </div>
      `
    };
    await transporter.sendMail(customerMail);

    // Create Zoho CRM Lead
    const zohoPayload = {
      Last_Name: name,
      Phone: phone,
      Email: email,
      Company: 'Individual',
      Lead_Source: 'Product Registration',
      Description: `Order Number: ${orderNumber}\nSerial Number: ${serialNumber}\nInstallation Date: ${installationDate}`,
      Image_URL: cloudResult.secure_url // Optional field in Zoho
    };

    const crmResponse = await sendToZoho("Leads", zohoPayload);
    console.log("🔍 Zoho CRM Response:", crmResponse);

    const leadData = crmResponse?.data?.[0];
if (!leadData || !leadData.details?.id) {
  throw new Error("Zoho CRM lead creation failed or malformed response");
}
const leadId = leadData.details.id;

await attachFileToZohoRecord("Leads", leadId, cloudResult.secure_url, file.originalname);


    res.status(200).send('Registration successful');
  } catch (error) {
    console.error('❌ Error in product registration:', error);
    res.status(500).send(error.message);
  }
};
// Controller to retrieve all product registrations
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({});
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Controller to retrieve a file associated with a registration
const getRegFile = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', 'application/pdf'); // Assuming the file is a PDF
    res.send(registration.fileData);  // Make sure fileData exists in your model
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  registerProduct,
  upload,
  getAllRegistrations,
  getRegFile
};
