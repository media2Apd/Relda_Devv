// const Contactus = require('../../models/Contactus');
// const transporter = require('../../config/nodemailerConfig');


// // Function to store a contact message
// const sendContactusMessage = async (req, res) => {
//   const { name, email, message, phone } = req.body;

//   const mailOptions = {
//     from: email,
//     to: 'support@reldaindia.com', // Admin email
//     subject: `New ContactUs Message from ${name}`,
//     text: `${message}\n\nFrom,\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n`,
//   };
// const userMailOptions = {
//       from: 'support@reldaindia.com',
//       to: email,
//       subject: 'We have Received Your Message - Relda India',
//       text: `
//       Hi ${name},

//       Thank you for contacting Relda India. We've received your message and our support team will get back to you shortly.

//       Here's a copy of your message:
//       "${message}"

//       If you have any additional information or updates, feel free to reply to this email.

//       Best regards,  
//       Team Relda India
//       `
//     };

//   try {
//     // Save contact message to the database
//     const contactus = new Contactus({ name, email, message, phone });
//     await contactus.save();

//     await transporter.sendMail(mailOptions);
//     await transporter.sendMail(userMailOptions);


//     return res.status(200).json({ message: 'Message stored successfully' });
//   } catch (error) {
//     console.error('Error saving contact message:', error);
//     return res.status(500).json({ error: 'Failed to save contact message. Please check the server logs for more details.' });
//   }
// };

// // Function to retrieve all contact messages
// const getusAllMessages = async (req, res) => {
//   try {
//     const messages = await Contactus.find({});
//     return res.status(200).json(messages);
//   } catch (error) {
//     console.error('Error retrieving contact messages:', error);
//     return res.status(500).json({ error: 'Failed to retrieve contact messages. Please check the server logs for more details.' });
//   }
// };

// module.exports = { sendContactusMessage, getusAllMessages };
const Contactus = require('../../models/Contactus');
const transporter = require('../../config/nodemailerConfig');

// =========================================================================
// 1️⃣ SEND CONTACT US MESSAGE (STORE & NOTIFY)
// =========================================================================
const sendContactusMessage = async (req, res) => {
  const { name, email, message, phone } = req.body;

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
    subject: `💬 New Contact Us Message: ${name} | RELDA India Pvt Ltd`,
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
                      💬 New Contact Us Message Received
                    </h2>
                    <p style="color: #aaa; margin: 4px 0 0; font-size: 13px;">
                      Received via Website Contact Form
                    </p>
                  </td>
                </tr>

                <!-- Body Content -->
                <tr>
                  <td style="padding: 26px 24px;">
                    
                    <!-- Sender Details Table -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 22px;">
                      <tr style="background-color: #fafbfc;">
                        <td colspan="2" style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                          Sender Details
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 16px; color: #666; font-size: 13px; border-bottom: 1px solid #f0f0f0;">Name</td>
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
                    </table>

                    <!-- Message Content Box -->
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
                      © ${new Date().getFullYear()} RELDA India Pvt Ltd. Contact Management Desk.
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
  // 📩 CUSTOMER CONFIRMATION EMAIL
  // =========================================================================
  const userMailOptions = {
    from: '"RELDA India Pvt Ltd" <support@reldaindia.com>',
    to: email,
    subject: `We have Received Your Message! | RELDA India Pvt Ltd`,
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
                    <p style="color: #ffe6e6; margin: 6px 0 0; font-size: 14px;">Thank you for contacting RELDA India</p>
                  </td>
                </tr>

                <!-- Body Content -->
                <tr>
                  <td style="padding: 30px 25px;">
                    
                    <p style="margin: 0 0 14px; font-size: 16px; color: #111; font-weight: 700;">
                      Hi ${name},
                    </p>
                    <p style="margin: 0 0 22px; font-size: 14px; color: #555; line-height: 1.6;">
                      Thank you for contacting <strong>RELDA India Pvt Ltd</strong>. We have successfully received your message and our customer care team will get back to you shortly.
                    </p>

                    <!-- Copy of Message Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #eef0f2; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
                      <tr style="background-color: #fafbfc;">
                        <td style="padding: 12px 16px; font-size: 12px; font-weight: 800; color: #444; text-transform: uppercase; border-bottom: 1px solid #eef0f2;">
                          Summary of Your Message
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px; font-size: 14px; color: #333; line-height: 1.6; font-style: italic;">
                          "${message}"
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0 0 20px; font-size: 14px; color: #555; line-height: 1.6;">
                      If you have any additional details or updates to share, you can simply reply directly to this email.
                    </p>

                    <!-- Support Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 16px 18px;">
                          <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                            Need urgent assistance?
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
    const contactus = new Contactus({ name, email, message, phone });
    await contactus.save();

    // Send emails in parallel
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(userMailOptions)
    ]);

    console.log(`✅ ContactUs notification emails sent for: ${name} (${email})`);
    return res.status(200).json({ message: 'Message stored successfully' });

  } catch (error) {
    console.error('Error saving contact message:', error);
    return res.status(500).json({ error: 'Failed to save contact message. Please check the server logs for more details.' });
  }
};

// =========================================================================
// 2️⃣ GET ALL CONTACT US MESSAGES
// =========================================================================
const getusAllMessages = async (req, res) => {
  try {
    const messages = await Contactus.find({}).sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving contact messages:', error);
    return res.status(500).json({ error: 'Failed to retrieve contact messages. Please check the server logs for more details.' });
  }
};

module.exports = { sendContactusMessage, getusAllMessages };