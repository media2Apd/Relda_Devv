const Contactus = require('../../models/Contactus');
const transporter = require('../../config/nodemailerConfig');


// Function to store a contact message
const sendContactusMessage = async (req, res) => {
  const { name, email, message, phone } = req.body;

  const mailOptions = {
    from: email,
    to: 'support@reldaindia.com', // Admin email
    subject: `New ContactUs Message from ${name}`,
    text: `${message}\n\nFrom,\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n`,
  };
const userMailOptions = {
      from: 'support@reldaindia.com',
      to: email,
      subject: 'We have Received Your Message - Relda India',
      text: `
      Hi ${name},

      Thank you for contacting Relda India. We've received your message and our support team will get back to you shortly.

      Here's a copy of your message:
      "${message}"

      If you have any additional information or updates, feel free to reply to this email.

      Best regards,  
      Team Relda India
      `
    };

  try {
    // Save contact message to the database
    const contactus = new Contactus({ name, email, message, phone });
    await contactus.save();

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(userMailOptions);


    return res.status(200).json({ message: 'Message stored successfully' });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return res.status(500).json({ error: 'Failed to save contact message. Please check the server logs for more details.' });
  }
};

// Function to retrieve all contact messages
const getusAllMessages = async (req, res) => {
  try {
    const messages = await Contactus.find({});
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving contact messages:', error);
    return res.status(500).json({ error: 'Failed to retrieve contact messages. Please check the server logs for more details.' });
  }
};

module.exports = { sendContactusMessage, getusAllMessages };
