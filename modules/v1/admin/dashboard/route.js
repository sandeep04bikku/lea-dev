const express = require('express')
const router = express.Router()
const dashboard_controller = require("./controller")



router.post("/admin-dashboard", dashboard_controller.AdminDashboard);
router.post("/country-list", dashboard_controller.countryList);
router.post("/city-list", dashboard_controller.cityList);





module.exports = router;