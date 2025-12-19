const express = require('express');
// const router = express.Router();
const userModel = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const transporter = require('../../config/nodemailerConfig')
// router.post('/forgot-password', async (req, res) => {

    const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw new Error("Please provide an email");
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }

        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1h' });
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
       

        const mailOptions = {
            from: process.env.EMAIL1,
            to: user.email,    
            subject: 'Password Reset',
            text: `Click on this link to reset your password: ${resetLink}`
        };
        
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Password reset link has been sent to your email",
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            success: false,
            error: true
        });
    }
}


// router.post('/reset-password/:token', async (req, res) => {

    const resetPassword = async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
    
            if (!password) {
                throw new Error("Please provide a new password");
            }
    
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
            const user = await userModel.findById(decoded._id);
    
            if (!user) {
                throw new Error("Invalid token or user does not exist");
            }
    
            user.password = await bcrypt.hash(password, 10);
            await user.save();
    
            res.status(200).json({
                message: "Password has been reset successfully",
                success: true,
                error: false
            });
    
        } catch (err) {
            res.status(400).json({
                message: err.message || err,
                success: false,
                error: true
            });
        }
    }

    
module.exports = {
    forgetPassword, 
    resetPassword }
