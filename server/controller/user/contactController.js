// const transporter = require('../../config/nodemailerConfig');
// const Contact = require('../../models/Contact');
// const { sendToZoho } = require("../../helpers/zohoClient"); // ⬅️ Add this line

// const sendCustomerSupportMessage = async (req, res) => {
//   const { name, email, message, phone, address, pincode } = req.body;

//   const mailOptions = {
//     from: email,
//     to: 'support@reldaindia.com', // Admin email
//     subject: `New Inquiry from ${name}`,
//     text: `${message}\n\nFrom,\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nAddress: ${address || 'N/A'}\nPincode: ${pincode || 'N/A'}`,
//   };

//   try {
//     // Save contact message to the database
//     const contact = new Contact({ name, email, message, phone, address, pincode });
//     await contact.save();

//     console.log('Sending email with options:', mailOptions); // Log email options

//     // Send email notification
//     await transporter.sendMail(mailOptions);
    
//     return res.status(200).json({ message: 'Message stored successfully and notification sent to admin' });
//   } catch (error) {
//     console.error('Error saving contact message or sending email:', error);
//     return res.status(500).json({ error: 'Failed to save contact message or send notification. Please check the server logs for more details.' });
//   }
// };

const transporter = require('../../config/nodemailerConfig');
const Contact = require('../../models/Contact');
const { sendToZoho } = require("../../helpers/zohoClient"); // ⬅️ Add this line

const sendCustomerSupportMessage = async (req, res) => {
  const { name, email, message, phone, address, pincode } = req.body;

  const mailOptions = {
    from: email,
    to: 'support@reldaindia.com',
    subject: `New Inquiry from ${name}`,
    text: `${message}\n\nFrom,\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nAddress: ${address || 'N/A'}\nPincode: ${pincode || 'N/A'}`,
  };

      // 2b. Send confirmation email to user
    const userMailOptions = {
      from: 'support@reldaindia.com', // Your official support email
      to: email,
      subject: 'We’ve Received Your Message!',
      text: `
Hi ${name},

Thank you for contacting Relda India.

We’ve received your message and our team will get back to you as soon as possible.

Here’s a copy of your inquiry:
"${message}"

If you need to update anything, feel free to reply to this email.

Warm regards,  
Team Relda India
      `
    };



  try {
    // 1. Save to MongoDB
    const contact = new Contact({ name, email, message, phone, address, pincode });
    await contact.save();

    // 2. Send email to admin
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(userMailOptions);

    // 3. Prepare Zoho CRM payload
    const zohoPayload = {
      Last_Name: name,
      Email: email,
      Phone: phone || '',
      Description: message,
      Street: address || '',
      Zip_Code: pincode || '',
      Lead_Source: 'Website Customer Support Form'
    };

    // 4. Send to Zoho CRM
    const crmResponse = await sendToZoho("Leads", zohoPayload); // Zoho module name can vary: Leads/Contacts/etc.
    console.log("✅ CRM Response:", crmResponse);

    return res.status(200).json({ message: 'Message stored, email sent, and synced with Zoho CRM.' });
  } catch (error) {
    console.error('Error handling contact message:', error);
    return res.status(500).json({ error: 'Failed to process contact message. See logs for details.' });
  }
};

// Function to retrieve all contact messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find({});
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving contact messages:', error);
    return res.status(500).json({ error: 'Failed to retrieve contact messages. Please check the server logs for more details.' });
  }
};

module.exports = { sendCustomerSupportMessage, getAllMessages };
