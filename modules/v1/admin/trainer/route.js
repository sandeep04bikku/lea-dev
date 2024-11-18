const express = require('express')
const router = express.Router()
const trainer_controller = require("./controller")


router.post('/add-single-trainer', trainer_controller.addSingleTrainer);
router.post('/add-bulk-trainers', trainer_controller.addBulktrainers);
router.post('/update-trainer', trainer_controller.updateTrainer);
router.post('/delete-trainer', trainer_controller.deleteTrainer);
router.post('/change-trainer-status', trainer_controller.changeTrainerStatus);
router.post('/trainer-list', trainer_controller.trainerList);
router.post('/trainer-review-list', trainer_controller.trainerReviewList);

module.exports = router;