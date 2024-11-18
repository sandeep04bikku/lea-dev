const express = require('express')
const router = express.Router()
const category_controller = require("./controller")


router.post('/add-category', category_controller.addCategory);
router.post('/update-category', category_controller.updateCategory);
router.post('/delete-category', category_controller.deleteCategory);
router.post('/change-category-status', category_controller.changeCategoryStatus);
router.post('/category-list', category_controller.categoryList);

module.exports = router;