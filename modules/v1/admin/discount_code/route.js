const express = require('express')
const router = express.Router()
const discount_code_controller = require("./controller")


router.post('/add-discount-code', discount_code_controller.addDiscountCode);
router.post('/update-discount-code', discount_code_controller.updateDiscountCode);
router.post('/delete-discount-code', discount_code_controller.deleteDiscountCode);
router.post('/change-discount-code-status', discount_code_controller.changDiscountCodeStatus);
router.post('/discount-code-list', discount_code_controller.discountCodeList);
router.post('/discount-usage', discount_code_controller.discountUsage);

module.exports = router;