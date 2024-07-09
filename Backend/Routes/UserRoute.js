import express from 'express'
import { forgotPassword, login, logout, resetPassword, sendOtp, signup } from '../Controllers/AuthController.js'

const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)
router.post('/sendotp',sendOtp)
router.post('/logout',logout)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',resetPassword)

export default router