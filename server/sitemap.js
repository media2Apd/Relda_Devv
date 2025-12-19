const Complaint = require('../models/complaintmodel');
const transporter = require('../config/nodemailerConfig');

// Helper function to send an email
const sendEmail = async (customerName, orderID, mobileNumber, complaintText) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Ensure you have this in your .env file
    to: 'support@yourcompany.com', // Support email address
    subject: 'New Customer Complaint',
    text: `A new complaint has been submitted by ${customerName}.\nComplaint Details:\nOrder ID: ${orderID}\nMobile: ${mobileNumber}\nComplaint: ${complaintText}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email notification.');
  }
};

// Controller function to handle complaint submission
const submitComplaint = async (req, res) => {
  const { customerName, orderID, mobileNumber, email, address, purchaseDate, deliveryDate, complaintText, fileUpload } = req.body;

  try {
    // Save complaint to the database
    const newComplaint = new Complaint({
      customerName,
      orderID,
      mobileNumber,
      email,
      address,
      purchaseDate,
      deliveryDate,
      complaintText,
      fileUpload, // Optional: If file upload is handled
    });
    await newComplaint.save();

    // Send email notification to support
    await sendEmail(customerName, orderID, mobileNumber, complaintText);

    // Respond with success
    res.status(200).json({ message: 'Complaint submitted successfully.' });
  } catch (error) {
    console.error('Error submitting complaint:', error);
    res.status(500).json({ message: 'Failed to submit complaint.' });
  }
};

module.exports = { submitComplaint };  // Correct export of submitComplaint function
