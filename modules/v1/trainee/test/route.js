const express = require('express')
const router = express.Router()
const test_controller = require("./controller")


router.post('/random-test-list', test_controller.randomTestList);
router.post('/user-attempt-test', test_controller.userAttemptedTest);
router.post('/attempt-test-data', test_controller.getAttemptedTestDetails);
router.post('/download-certificate', test_controller.downloadCertificate);
router.post('/user-test-count', test_controller.userAttemptedTestCount);
router.post('/pdf', test_controller.pdfGenerate);

module.exports = router;