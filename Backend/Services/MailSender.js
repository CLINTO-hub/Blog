import otpGenerator from 'otp-generator';
import nodemailer from 'nodemailer';


export const generateOTP = () => {
    return otpGenerator.generate(6,  {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
};

export const sendOTPEmail = async (toEmail, otp) => {
    
   
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_MAIL,
            pass: process.env.SENDER_PASSWORD, 
        },
    });

   
    const mailOptions = {
        from: process.env.SENDER_MAIL, 
        to: toEmail,
        subject: 'Your OTP for Verification',
        text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    };

    try {
        
        await transporter.sendMail(mailOptions);
        
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error; 
    }
};
 