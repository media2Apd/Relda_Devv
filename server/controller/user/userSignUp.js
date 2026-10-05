const express = require('express');
const userModel = require("../../models/userModel");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Joi = require('joi'); // Import Joi
const transporter = require('../../config/nodemailerConfig')
const { createZohoCustomer } = require("../../services/zohoCustomer.service");

// Setup Nodemailer transport
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     host: 'smtpout.secureserver.net',
//     port: 465,
//     secure: false,
//     auth: {
//         user: process.env.EMAIL1,
//         pass: process.env.PASSWORD1
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

// Define Joi schema
const userSchema = Joi.object({
       name: Joi.string().min(3).required().messages({
           'string.min': 'Name must be at least 3 characters long.',
           'any.required': 'Name is required.'
       }),
       email: Joi.string().email().required().messages({
           'string.email': 'Email must be a valid email address.',
           'any.required': 'Email is required.'
       }),
       password: Joi.string()
           .min(8)
           .max(16)
           .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
           .required()
           .messages({
               'string.min': 'Password must be at least 8 characters long.',
               'string.max': 'Password cannot exceed 16 characters.',
               'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
               'any.required': 'Password is required.'
           }),
       confirmPassword: Joi.string()
           .valid(Joi.ref('password'))
           .required()
           .messages({
               'any.only': 'Confirm Password must match the Password.',
               'any.required': 'Confirm Password is required.'
           }),
       mobile: Joi.string().pattern(/^\d{10,15}$/).required().messages({
           'string.pattern.base': 'Mobile number must be 10 digits.',
           'any.required': 'Mobile number is required.'
       }),
    address: Joi.object({
        country: Joi.string(),
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        postalCode: Joi.string().pattern(/^\d{5,10}$/)
    }).optional()
});

const userSignUpController = async (req, res) => {
    try {
        // Validate request body
        const { error, value } = userSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Validation failed",
                details: error.details.map(detail => ({
                    field: detail.context.key,
                    message: detail.message
                }))
            });
        }

        const { email, password, name, mobile } = value; // Use validated data

        const userEmail = await userModel.findOne({ email });
        const userMobile = await userModel.findOne({mobile: `+${ mobile }`});

        if (userEmail) {
            throw new Error("User email already exists.");
        }

        if (userMobile) {
            throw new Error("User mobile already exists.");
        }
        


        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        if (!hashPassword) {
            throw new Error("Something went wrong while hashing the password.");
        }

        const payload = {
            ...value,
            mobile: `+${mobile}`,
            role: "GENERAL",
            password: hashPassword
        };

        const userData = new userModel(payload);
        const saveUser = await userData.save();
// 🔥 CREATE ZOHO INVENTORY CUSTOMER
try {
  const zohoCustomer = await createZohoCustomer(saveUser);

  await userModel.findByIdAndUpdate(
    saveUser._id,
    { zohoCustomerId: zohoCustomer.contact_id }
  );

  console.log("✅ Zoho customer created:", zohoCustomer.contact_id);

} catch (zohoErr) {
  console.error("❌ Zoho customer creation failed:", zohoErr.message);
  // IMPORTANT: signup fail panna vendam
}

        // Sending confirmation email
     const mailOptions = {
    from: `"RELDA India Pvt Ltd" <support@reldaindia.com>`,
    to: email,
    subject: `Welcome to the RELDA Family, ${name}! 🎉 | RELDA India Pvt Ltd`,
    text: `Dear ${name},\n\nWelcome to RELDA India Pvt Ltd! We are thrilled to have you with us.\nExplore our wide range of innovative home & kitchen appliances designed to make your life smarter and easier.\n\nNeed assistance? Email: support@reldaindia.com | Phone: 9884890934\nVisit: https://www.reldaindia.com\n\nWarm Regards,\nRELDA India Pvt Ltd`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to RELDA India Pvt Ltd</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f5f7; padding: 30px 10px;">
          <tr>
            <td align="center">
              
              <!-- Main Card Container -->
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07);">
                
                <!-- 1️⃣ Top Logo Bar (White Background - 100% Crystal Clear Logo) -->
                <tr>
                  <td align="center" style="background-color: #ffffff; padding: 25px 20px; border-bottom: 2px solid #f2f2f2;">
                    <img src="https://res.cloudinary.com/dbbebewu2/image/upload/v1790846726/Logo_sjwqqe.png" alt="RELDA India Pvt Ltd" style="max-width: 170px; height: auto; display: block;" />
                  </td>
                </tr>

                <!-- 2️⃣ Brand Hero Banner (#E60000 Gradient) -->
                <tr>
                  <td style="background: linear-gradient(135deg, #E60000 0%, #b80000 100%); padding: 35px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">Welcome to the Family! 🎉</h1>
                    <p style="color: #ffe6e6; margin: 8px 0 0; font-size: 14px;">We're thrilled to have you with us</p>
                  </td>
                </tr>

                <!-- 3️⃣ Body Content -->
                <tr>
                  <td style="padding: 30px 25px;">
                    
                    <!-- Greeting -->
                    <p style="margin: 0 0 14px; font-size: 17px; color: #111; font-weight: 700;">
                      Hello ${name},
                    </p>
                    <p style="margin: 0 0 24px; font-size: 14px; color: #555; line-height: 1.6;">
                      Thank you for creating an account with <strong>RELDA India Pvt Ltd</strong>! We are dedicated to making your everyday life smarter, faster, and easier with our premium kitchen & home appliances.
                    </p>

                    <!-- Feature / Benefit Highlights Grid -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 26px;">
                      <tr>
                        <!-- Feature 1 -->
                        <td width="33%" align="center" style="padding: 14px 10px; background-color: #fafbfc; border: 1px solid #eef0f2; border-radius: 12px;">
                          <div style="font-size: 24px; margin-bottom: 6px;">✨</div>
                          <div style="font-size: 13px; font-weight: bold; color: #222;">Premium Quality</div>
                          <div style="font-size: 11px; color: #777; margin-top: 2px;">Durable & tested</div>
                        </td>
                        <td width="3%"></td>
                        <!-- Feature 2 -->
                        <td width="33%" align="center" style="padding: 14px 10px; background-color: #fafbfc; border: 1px solid #eef0f2; border-radius: 12px;">
                          <div style="font-size: 24px; margin-bottom: 6px;">🛡️</div>
                          <div style="font-size: 13px; font-weight: bold; color: #222;">Official Warranty</div>
                          <div style="font-size: 11px; color: #777; margin-top: 2px;">Comprehensive cover</div>
                        </td>
                        <td width="3%"></td>
                        <!-- Feature 3 -->
                        <td width="33%" align="center" style="padding: 14px 10px; background-color: #fafbfc; border: 1px solid #eef0f2; border-radius: 12px;">
                          <div style="font-size: 24px; margin-bottom: 6px;">🚚</div>
                          <div style="font-size: 13px; font-weight: bold; color: #222;">Fast Delivery</div>
                          <div style="font-size: 11px; color: #777; margin-top: 2px;">Direct to your door</div>
                        </td>
                      </tr>
                    </table>

                    <!-- CTA Button (Explore Products) -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                      <tr>
                        <td align="center">
                          <a href="https://www.reldaindia.com" target="_blank" style="background-color: #E60000; color: #ffffff; text-decoration: none; padding: 15px 38px; border-radius: 30px; font-size: 15px; font-weight: 800; display: inline-block; letter-spacing: 0.5px; box-shadow: 0 4px 16px rgba(230,0,0,0.3);">
                            EXPLORE APPLIANCES →
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Support Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1.5px dashed #E60000; border-radius: 12px; text-align: center; margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 16px 18px;">
                          <p style="margin: 0; font-size: 13px; color: #222; font-weight: 700;">
                            Have questions or need product guidance?
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

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "User created and confirmation email sent successfully!"
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userSignUpController;