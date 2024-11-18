const express = require('express')
const router = express.Router()
const subadmin_controller = require("./controller")

router.post('/add-subadmin', subadmin_controller.addSubAdmin);
router.post('/update-subadmin', subadmin_controller.updateSubAdmin);
router.post('/delete-subadmin', subadmin_controller.deleteSubadmin);
router.post('/change-subadmin-status', subadmin_controller.changeSubadminStatus);
router.post('/subadmin-list', subadmin_controller.subadminList);
router.post('/permission-modules', subadmin_controller.permissionModuleList);
router.post('/subadmin-permission-list', subadmin_controller.subadminPermissionList);
router.post('/add-permission', subadmin_controller.addPermission);
router.post('/update-permission', subadmin_controller.updatePermission);

module.exports = router;