const express = require('express')
const router = express.Router()
const auth_controller = require("./controller")


router.post('/signup-user', auth_controller.signup);
router.post('/login-user', auth_controller.login);
router.post('/complete-profile', auth_controller.completeProfile);
router.post('/logout-user', auth_controller.logout);
router.post('/get-user', auth_controller.getUser);
router.post('/update-user', auth_controller.updateUser);
router.post('/forget-password', auth_controller.forgetPassword);
router.post('/resend-otp', auth_controller.resendOtp);
router.post('/verify-otp', auth_controller.verifyOtp);
router.post('/create-new-password', auth_controller.createNewPassword);
router.post('/change-password', auth_controller.changePassword);
router.post('/change-language', auth_controller.changeLanguage);
router.post('/language-list', auth_controller.languageList);
router.post('/country-list', auth_controller.countryList);
router.post('/city-list', auth_controller.cityList);
router.post('/delete-user', auth_controller.deleteUser);
router.post("/add-contact-us", auth_controller.addContactUs);

module.exports = router;