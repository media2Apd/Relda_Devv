// const transporter = require('../../config/nodemailerConfig');
// const Contact = require('../../models/Contact');

// const sendCustomerSupportMessage = async (req, res) => {
//   const { name, email, message, phone, address, pincode } = req.body;

//   const mailOptions = {
//     from: email,
//     to: 'support@reldaindia.com', // Admin email
//     subject: `New Inquiry from ${name}`,
//     text: `${message}\n\nFrom,\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\nAddress: ${address || 'N/A'}\nPincode: ${pincode || 'N/A'}`,
//   };

//  const userMailOptions = {
//       from: 'support@reldaindia.com', // Your official support email
//       to: email,
//       subject: 'We have Received Your Message!',
//       text: `
// Hi ${name},

// Thank you for contacting Relda India.

// We've received your message and our team will get back to you as soon as possible.

// Here's a copy of your inquiry:
// "${message}"

// If you need to update anything, feel free to reply to this email.

// Warm regards,  
// Team Relda India
//       `
//     };


//   try {
//     // Save contact message to the database
//     const contact = new Contact({ name, email, message, phone, address, pincode });
//     await contact.save();

//     console.log('Sending email with options:', mailOptions); // Log email options

//     // Send email notification
//     await transporter.sendMail(mailOptions);
//     await transporter.sendMail(userMailOptions);

    
//     return res.status(200).json({ message: 'Message stored successfully and notification sent to admin' });
//   } catch (error) {
//     console.error('Error saving contact message or sending email:', error);
//     return res.status(500).json({ error: 'Failed to save contact message or send notification. Please check the server logs for more details.' });
//   }
// };


// // Function to retrieve all contact messages
// const getAllMessages = async (req, res) => {
//   try {
//     const messages = await Contact.find({});
//     return res.status(200).json(messages);
//   } catch (error) {
//     console.error('Error retrieving contact messages:', error);
//     return res.status(500).json({ error: 'Failed to retrieve contact messages. Please check the server logs for more details.' });
//   }
// };

// module.exports = { sendCustomerSupportMessage, getAllMessages };
const transporter = require('../../config/nodemailerConfig');
const Contact = require('../../models/Contact');

// =========================================================================
// 1️⃣ SEND CUSTOMER SUPPORT / CONTACT MESSAGE
// =========================================================================
const sendCustomerSupportMessage = async (req, res) => {
  const { name, email, message, phone, address, pincode } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // =========================================================================
  // 📩 ADMIN / SUPPORT NOTIFICATION EMAIL
  // =========================================================================
  const mailOptions = {
    from: '"RELDA India Pvt Ltd" <support@reldaindia.com>',
    replyTo: email,
    to: 'admin@reldaindia.com',
    subject: `💬 New Customer Inquiry: ${name} | RELDA India Pvt Ltd`,
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

                <!-- Admin Alert Header -->
                <tr>
                  <td style="background-color: #1a1a1a; padding: 22px 25px; text-align: left; border-left: 6px solid #E60000;">
                    <h2 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: 700;">
                      💬 New Customer Inquiry Received
                    </h2>
                    <p style="color: #aaa; margin: 4px 0 0; font-size: 13px;">
                      Received via Website Contact Support Form
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 26px 24px;">
                    
                    <!-- Customer Details Table -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 22px;">
                      <tr style="background-color: #fafbfc;">
                        <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                          Customer Information
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Customer Name</td>
                        <td style="padding: 10px 16px; color: #111; font-weight: 700; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                          ${name}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Email Address</td>
                        <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                          <a href="mailto:${email}" style="color: #E60000; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Phone Number</td>
                        <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                          <a href="tel:${phone}" style="color: #111; text-decoration: none;">${phone || 'N/A'}</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Address</td>
                        <td style="padding: 10px 16px; color: #111; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                          ${address || 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Pincode</td>
                        <td style="padding: 10px 16px; color: #111; font-weight: 600; font-size: 13px; text-align: right; border-bottom: 1px solid #f0f0f0;">
                          ${pincode || 'N/A'}
                        </td>
                      </tr>
                    </table>

                    <!-- Customer Message Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fff9f9; border-left: 4px solid #E60000; border-radius: 6px; margin-bottom: 22px;">
                      <tr>
                        <td style="padding: 14px 16px;">
                          <span style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: 800;">Message Content:</span>
                          <div style="font-size: 14px; font-weight: 500; color: #222; margin-top: 6px; line-height: 1.6; white-space: pre-wrap;">
                            "${message}"
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 15px 0 0; font-size: 12px; color: #888; text-align: center;">
                      You can reply directly to this email to respond to ${name}.
                    </p>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #1a1a1a; padding: 18px 20px; text-align: center;">
                    <p style="margin: 0; font-size: 11px; color: #888;">
                      © ${new Date().getFullYear()} RELDA India Pvt Ltd. Support Management.
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
  // 📩 CUSTOMER ACKNOWLEDGMENT EMAIL
  // =========================================================================
  const userMailOptions = {
    from: '"RELDA India Pvt Ltd" <support@reldaindia.com>',
    to: email,
    subject: `We've Received Your Message! | RELDA India Pvt Ltd`,
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
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">Message Received! 💬</h1>
                    <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">We're reviewing your inquiry</p>
                  </td>
                </tr>

                <!-- Body Content -->
                <tr>
                  <td style="padding: 30px 25px;">
                    
                    <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                      Hello ${name},
                    </p>
                    <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                      Thank you for contacting <strong>RELDA India Pvt Ltd</strong>! We have received your inquiry and our support team will get back to you as soon as possible.
                    </p>

                    <!-- Copy of Message Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                      <tr style="background-color: #fafbfc;">
                        <td style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                          Copy of Your Message
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px; font-size: 14px; color: #333; line-height: 1.6; font-style: italic;">
                          "${message}"
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0 0 20px; font-size: 14px; color: #555; line-height: 1.6;">
                      Our customer service representative will respond to your inquiry within <strong>24 business hours</strong>. If you need to update any details, you can simply reply to this email.
                    </p>

                    <!-- Support Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 16px 18px;">
                          <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                            Need immediate assistance?
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

  try {
    // Save contact message to MongoDB
    const contact = new Contact({ name, email, message, phone, address, pincode });
    await contact.save();

    // Send emails in parallel
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    console.log(`✅ Support inquiry emails sent for: ${name} (${email})`);
    return res.status(200).json({ message: 'Message stored successfully and notification sent to admin' });

  } catch (error) {
    console.error('Error saving contact message or sending email:', error);
    return res.status(500).json({ error: 'Failed to save contact message or send notification.' });
  }
};

// =========================================================================
// 2️⃣ GET ALL MESSAGES
// =========================================================================
const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving contact messages:', error);
    return res.status(500).json({ error: 'Failed to retrieve contact messages.' });
  }
};

module.exports = { sendCustomerSupportMessage, getAllMessages };