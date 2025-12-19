// controllers/careerController.js
const JobApplication = require('../../models/CareerModel');
const nodemailer = require('nodemailer');
const transporter = require('../../config/nodemailerConfig');
const path = require('path');
const fs = require('fs');
const multer = require('multer')
const cloudinary = require('../../config/cloudinary');
const streamifier = require('streamifier');
const { sendToZoho, attachFileToZohoRecord } = require("../../helpers/zohoClient"); // ⬅️ Add this line

const storage = multer.memoryStorage(); // Use memory storage to store files in memory

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('application/pdf') || file.mimetype.startsWith('application/msword') || file.mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and document files are allowed!'));
    }
  }
});
// Apply for a job
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
//       cc:'mediaexecutive2.apd@gmail.com',
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

//   } catch (error) {
//     console.error('Server Error:', error);
//     return res.status(500).json({ message: 'Server Error' });
//   }
// };
const applyForJob = async (req, res) => {
  try {
    const { name, email, educationalQualification, lookingFor, experience, phone, summary } = req.body;
    const resume = req.file;

    if (!resume) {
      return res.status(400).json({ message: 'Resume is required' });
    }

    // Upload resume to Cloudinary
    const cloudinaryUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'job_applications' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(resume.buffer).pipe(stream);
      });

    const result = await cloudinaryUpload();

    // Save to MongoDB
    const newJobApplication = new JobApplication({
      name,
      email,
      educationalQualification,
      lookingFor,
      experience,
      phone,
      summary,
      fileUploadUrl: result.secure_url,
      fileType: resume.mimetype
    });
    await newJobApplication.save();

    // Send email with resume URL
    const mailOptions = {
      from: email,
      to: 'support@reldaindia.com',
      cc: 'mediaexecutive2.apd@gmail.com',
      subject: 'New Job Application Submitted',
      text: `
        Name: ${name}
        Email: ${email}
        Educational Qualification: ${educationalQualification}
        Looking For: ${lookingFor}
        Experience: ${experience}
        Phone: ${phone}
        Summary: ${summary}
        Resume: ${result.secure_url}
      `
    };
        // Send confirmation email to the user
    const userMailOptions = {
      from: 'support@reldaindia.com', // Your official sender address
      to: email,
      subject: 'Your Job Application has been Received',
      text: `
      Dear ${name},

      Thank you for applying for a position with us at Relda India.

      We have received your application and resume successfully. Our team will review your details and contact you if your profile matches our requirements.

      Summary of your submission:
      - Qualification: ${educationalQualification}
      - Looking For: ${lookingFor}
      - Experience: ${experience}
      - Phone: ${phone}

      Best regards,  
      Team Relda India
      `
    };

    await transporter.sendMail(userMailOptions);


    await transporter.sendMail(mailOptions);

    // Create lead in Zoho CRM
    const zohoPayload = {
      Last_Name: name,
      Email: email,
      Phone: phone,
      Company: 'Job Application',
      Lead_Source: 'Career Form',
      Description: `Summary: ${summary}\nExperience: ${experience}\nQualification: ${educationalQualification}\nLooking For: ${lookingFor}`,
      Resume_URL: result.secure_url  // 🔁 Use your actual Zoho custom field API name here
    };

    const crmResponse = await sendToZoho("Leads", zohoPayload);
    console.log("🔍 Zoho CRM Response:", crmResponse);

    const leadData = crmResponse?.data?.[0];
if (!leadData || !leadData.details?.id) {
  throw new Error("Zoho CRM lead creation failed or malformed response");
}
const leadId = leadData.details.id;

await attachFileToZohoRecord("Leads", leadId, result.secure_url, resume.originalname);

    res.status(200).json({ message: 'Application submitted successfully' });

  } catch (error) {
    console.error('❌ Error in job application:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all job applications
const allCareers = async (req, res) => {
  try {
    const careers = await JobApplication.find({});
    return res.status(200).json(careers); // Return the careers array directly
  } catch (error) {
    console.error('Error retrieving job applications:', error);
    return res.status(500).json({ error: 'Failed to retrieve job applications. Please check the server logs for more details.' });
  }
};

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

// Export the functions
module.exports = { 
  upload,
  applyForJob,
  allCareers,
  getCareerFile,
};
