const express = require('express')
const router = express.Router()
const auth_controller = require("./controller")



router.post("/encryption_demo", auth_controller.encryption);
router.post("/decryption_demo", auth_controller.decryption);

router.post('/login-admin', auth_controller.login);
router.post('/logout-admin', auth_controller.logout);
router.post('/get-admin', auth_controller.getAdmin);
router.post('/forget-password', auth_controller.forgetPassword);
router.post('/resend-otp', auth_controller.resendOtp);
router.post('/verify-otp', auth_controller.verifyOtp);
router.post('/create-new-password', auth_controller.createNewPassword);

router.post('/change-password', auth_controller.changePassword);




module.exports = router;