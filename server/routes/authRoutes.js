const express = require('express');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation,
} = require('../validators/authValidator');

const router = express.Router();

router.post('/register', registerValidation, validate, authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/resend-otp', authController.resendOtp);
router.post('/login', loginValidation, validate, authController.login);
router.post('/google', authController.googleLogin);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, authController.resetPassword);

router.use(protect);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);
router.put('/profile', updateProfileValidation, validate, authController.updateProfile);
router.put('/change-password', authController.changePassword);

module.exports = router;
