import User from '../Models/UserModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { generateOTP, sendOTPEmail } from '../Services/MailSender.js'

//generate jwt token
export const generateToken = (user)=>{
    console.log('user1',user);
    return jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:'15d',
    })
}

//signup controller for user
export const signup = async (req, res) => {
  try {
    const { email, firstname, lastname, password, confirmPassword, gender } = req.body;
    console.log(req.body);

    if (!email || !firstname || !lastname || !password || !confirmPassword || !gender) {
      return res.status(400).json({ message: "Please enter valid details" });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^\s]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long, include small letters, capital letters, and numbers, and must not include spaces."
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password doesn't match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      firstname,
      lastname,
      password: hashPassword,
      gender
    });

    await newUser.save();

    const otp = generateOTP();
    sendOTPEmail(email, otp); // Implement your email sending logic here

    res.status(200).json({ success: true, message: "User successfully created. OTP sent to email.", otp });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}


//user login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter the email & password" });
        }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist, check the email" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.status(400).json({ status: false, message: "Password incorrect" });
        }
        
        const token = generateToken(user)

            const{...rest} = user._doc

            res.setHeader('Set-Cookie', cookie.serialize('jwt', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 15, 
                sameSite: 'strict',
            }));
            res.status(200).json({
                success: true, message: 'Successfully logged in', token, data:{...rest}
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

//SendOtp to mail
export const sendOtp = async (req, res) => {
    try {
      const { email } = req.body;
      const otp = generateOTP();
      sendOTPEmail(email, otp);
      res.status(200).json({ message: "Otp sent successfully", otp: otp });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to sent otp" });
    }
  };

  export const logout = async (req, res) => {
    try {
      res.clearCookie('jwt', { path: '/' });
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };


  //Generate otp for Forgetpassword
  export const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: "Please enter your email address" });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User with this email does not exist" });
      }
  
      const otp = generateOTP();
      sendOTPEmail(email, otp); 
  
      
      user.resetPasswordOTP = otp;
      console.log('otp',user.resetPasswordOTP);
  
      await user.save();
  
      res.status(200).json({ success: true, message: "OTP sent to email", otp });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  // Verify OTP and set new password
  export const resetPassword = async (req, res) => {
    try {
      const { email, otp, newPassword, confirmPassword } = req.body;

      console.log(email,otp);
  
      if (!email || !otp || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "Please provide all required fields" });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
  
      const user = await User.findOne({ email });

      console.log('usr',user.resetPasswordOTP);
      console.log('otp',otp);
  
      if (!user) {
        return res.status(404).json({ message: "User with this email does not exist" });
      }
  
      // Check if OTP is valid and not expired
      if (user.resetPasswordOTP !== otp ) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(newPassword, salt);
  
      // Update the user's password
      user.password = hashPassword;
      user.resetPasswordOTP = undefined;
  
      await user.save();
  
      res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const verifyToken = async (req, res) => {
    try {
        const token = req.body.token;
        console.log('token',token);
        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('decode',decoded);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await User.findById(decoded.id);
        console.log('user',user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};