const express = require('express');
const userModel = require("../../models/userModel");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Joi = require('joi'); // Import Joi
const transporter = require('../../config/nodemailerConfig')
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

        // Sending confirmation email
        const mailOptions = {
            from: process.env.EMAIL1,
            to: email,
            subject: 'Welcome to RELDA India!',
            text: `Dear ${name},\n\nThank you for signing up with RELDA India! We are here to make your life easier and smarter
with our innovative products.\nIf you have any questions, feel free to email us at [support@reldaindia.com] or call us at [9884890934].
We’re always happy to help!\nWelcome to the RELDA family!\n\nBest Regards,\nThe Relda India Team.`,
            html: `<p>Dear ${name},</p><p>Thank you for signing up with RELDA India! We are here to make your life easier and smarter
with our innovative products. </p><p>If you have any questions, feel free to email us at [support@reldaindia.com] or call us at [9884890934].
We’re always happy to help!</p><p>Welcome to the RELDA family!</p><p>Best Regards,<br>The Relda India Team.</p>`
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