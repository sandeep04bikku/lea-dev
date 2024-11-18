const express = require('express')
const router = express.Router()
const s3_client_controller = require("./controller")


router.post('/upload-image', s3_client_controller.imageUpload);

module.exports = router;