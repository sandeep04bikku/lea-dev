const express = require('express')
const router = express.Router()
const user_controller = require("./controller")


router.post('/add-user', user_controller.addUser);
router.post('/add-bulk-users', user_controller.addBulkUsers);
router.post('/update-user', user_controller.updateUser);
router.post('/delete-user', user_controller.deleteUser);
router.post('/change-user-status', user_controller.changeUserStatus);
router.post('/user-list', user_controller.userList);

module.exports = router;