const express = require('express')
const router = express.Router()
const corporate_profile_controller = require("./controller")


router.post('/add-corporate-profile', corporate_profile_controller.addCorporateProfile);
router.post('/delete-corporate-profile', corporate_profile_controller.deleteCorporateProfile);
router.post('/change-corporate-profile-status', corporate_profile_controller.changeCorporateprofileStatus);
router.post('/corporate-profile-list', corporate_profile_controller.corporateProfileList);
router.post('/course-assign-to-user', corporate_profile_controller.courseAssignToUser);

module.exports = router;