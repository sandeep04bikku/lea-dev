const express = require('express')
const router = express.Router()
const cms_controller = require("./controller")


router.post("/add-update-cms", cms_controller.addUpdateCms);
router.post("/cms-list", cms_controller.cmsList);
router.post("/delete-cms", cms_controller.deleteCms);
router.post("/add-update-faq", cms_controller.addUpdateFaq);
router.post("/faq-list", cms_controller.faqList);
router.post("/contact-us-list", cms_controller.contactUsList);

module.exports = router;