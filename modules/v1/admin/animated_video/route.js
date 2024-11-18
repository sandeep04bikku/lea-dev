const express = require('express')
const router = express.Router()
const animated_video_controller = require("./controller")


router.post('/add-animated-video', animated_video_controller.addAnimatedVideo);
router.post('/update-animated-video', animated_video_controller.updateAnimatedVideo);
router.post('/delete-animated-video', animated_video_controller.deleteAnimatedVideo);
router.post('/change-animated-video-status', animated_video_controller.changeAnimatedVideoStatus);
router.post('/animated-video-list', animated_video_controller.animatedVideoList);

module.exports = router;