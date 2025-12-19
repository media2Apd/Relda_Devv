const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const admin = require('../../firebase-admin');  // Import Firebase Admin SDK
const userModel = require('../../models/userModel');  // User model

// Function to send OTP to phone number

const { TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID, TWILIO_SERVICE_SID } = process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, { lazyLoading: true });

const sendOtpController = async (req, res) => {
    const { mobile } = req.body ?? {};
  
    if (!mobile) {
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }
  
    try {
      // Send OTP using Twilio Verify service
      let user = await userModel.findOne({ mobile: `+${mobile}` });
      if(user){
          const result = await client.verify
          .services(TWILIO_SERVICE_SID)
          .verifications.create({
            to: `+${mobile}`,  // Include country code
            channel: "sms",  // OTP sent via SMS
          });
    
        res.status(200).send({
          success: true,
          message: "OTP sent successfully",
          payload: result,
        })}else{
          res.status(400).send({
              success: false,
              message: "Number is not registered",
            })
  
        };
      } catch (err) {
        console.error(err);
        res.status(500).send({
          success: false,
          message: `Error in sending OTP: ${err.message}`,
        });
      }
      
  
  };

// Function to verify OTP

const verifyOtpController = async (req, res) => {
    const { mobile, otp } = req.body ?? {};

    if (!mobile || !otp) {
        return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
    }

    try {
        // Verify OTP using Twilio Verify service
        const result = await client.verify
            .services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: `+${mobile}`,  // Same phone number you sent OTP to
                code: otp,  // OTP entered by the user
            });

        if (result.status === "approved") {
            // OTP verified successfully, check if user exists in database
            let user = await userModel.findOne({ mobile: `+${mobile}` });

            if (!user) {
                // If user does not exist, you can create a new user or handle accordingly
                return res.status(404).send({
                    success: false,
                    message: "User not found. Please sign up first.",
                });
            }

            // Create JWT token after successful verification
            const tokenData = {
                _id: user._id,
                email: user.email,
                mobile: user.mobile,
            };

            const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: "8h" });

            const tokenOption = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
            };

            return res.cookie("token", token, tokenOption).status(200).json({
                success: true,
                message: "OTP verified successfully",
                data: token,
            });
        } else {
            res.status(400).send({
                success: false,
                message: "Invalid OTP. Please try again.",
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({
            success: false,
            message: `Error in verifying OTP: ${err.message}`,
        });
    }
};

  
  

// Function to login using email or phone number with password
async function loginWithPasswordController(req, res) {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: "Email/Phone and password are required", success: false });
    }

    try {
        let user;

        if (/\S+@\S+\.\S+/.test(login)) {  // Check if login is email
            user = await userModel.findOne({ email: login });
        } else {  // If it's not email, treat it as a phone number
            user = await userModel.findOne({ mobile: `+${login}` });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const tokenData = {
                _id: user._id,
                email: user.email,
                mobile: user.mobile,
            };

            const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, { expiresIn: '8h' });

            const tokenOption = {
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production',
                secure: true,
                sameSite: 'None',
            };

            return res.cookie("token", token, tokenOption).status(200).json({
                message: "Login successful",
                data: token,
                success: true,
            });
        } else {
            return res.status(400).json({ message: "Incorrect password", success: false });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Error during login",
            success: false,
        });
    }
}

module.exports = { sendOtpController, verifyOtpController, loginWithPasswordController };
