const express = require('express')
const router = express.Router()
const language_controller = require("./controller")


router.post('/add-language', language_controller.addlanguage);
router.post('/update-language', language_controller.updateLanguage);
router.post('/delete-language', language_controller.deletelanguage);
router.post('/change-language-status', language_controller.changelanguageStatus);
router.post('/language-list', language_controller.languageList);

module.exports = router;