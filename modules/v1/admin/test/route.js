const express = require('express')
const router = express.Router()
const test_controller = require("./controller")


router.post('/add-test',test_controller.addTest);
router.post('/update-test', test_controller.updateTest);
router.post('/delete-test', test_controller.deleteTest);
router.post('/change-test-status', test_controller.changeTestStatus);
router.post('/test-list', test_controller.testList);
router.post('/question-list', test_controller.testQuestionList);
router.post('/add-single-question', test_controller.addSingleQuestion);
router.post('/add-bulk-question', test_controller.addBulkQuestion);
router.post('/update-question', test_controller.updateQuestion);
router.post('/delete-question', test_controller.deleteQuestion);
router.post('/delete-bulk-question', test_controller.deleteBulkQuestion);
router.post('/change-question-status', test_controller.changeQuestionStatus);
router.post('/test-attempt-users', test_controller.testAttempteduserList);


module.exports = router;