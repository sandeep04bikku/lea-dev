const express = require("express");
const router = express.Router();
const headerValidation = require("../../middleware/headerValidators")

//============================aws s3 client import start=============================
const s3_client = require("./s3_client/route");
//============================aws s3 client import end=============================

//============================Admin Module Import Start=============================
const admin_auth = require("./admin/auth/route");
const admin_user_model = require("./admin/user/route");
const admin_trainer_model = require("./admin/trainer/route");
const admin_category_model = require("./admin/category/route");
const admin_course_model = require("./admin/course/route");
const admin_test_model = require("./admin/test/route");
const admin_dashboard_model = require("./admin/dashboard/route");
const admin_discount_model = require("./admin/discount_code/route");
const admin_corporate_profile_model = require("./admin/corporate_profile/route");
const admin_subadmin_model = require("./admin/sub_admin/route");
const admin_community_forum_model = require("./admin/community_forum/route");
const admin_language_model = require("./admin/language/route");
const admin_animated_video = require("./admin/animated_video/route");
const admin_cms = require("./admin/cms/route");
//============================Admin Module Import End=============================

//============================User Module Import Start=============================
const user_auth = require("./trainee/auth/route");
const user_home = require("./trainee/home/route");
const user_test = require("./trainee/test/route");
//============================User Module Import End=============================


//============================Middleware Start=============================
router.use("/", headerValidation.extractHeaderLanguage);
router.use("/", headerValidation.validateHeaderType);
router.use("/", headerValidation.validateApiKey);
router.use("/", headerValidation.validateHeaderToken);
//============================Middleware End=============================

//============================aws s3 client start=============================
router.use("/lea/v1/s3-client", s3_client);
//============================aws s3 client end=============================

//============================Admin Module Start=============================
router.use("/lea/v1/admin/auth", admin_auth);
router.use("/lea/v1/admin/user", admin_user_model);
router.use("/lea/v1/admin/trainer", admin_trainer_model);
router.use("/lea/v1/admin/category", admin_category_model);
router.use("/lea/v1/admin/course", admin_course_model);
router.use("/lea/v1/admin/test", admin_test_model);
router.use("/lea/v1/admin/dashboard", admin_dashboard_model);
router.use("/lea/v1/admin/discount", admin_discount_model);
router.use("/lea/v1/admin/corporate", admin_corporate_profile_model);
router.use("/lea/v1/admin/subadmin", admin_subadmin_model);
router.use("/lea/v1/admin/community-forum", admin_community_forum_model);
router.use("/lea/v1/admin/language", admin_language_model);
router.use("/lea/v1/admin/animated-video", admin_animated_video);
router.use("/lea/v1/admin/cms", admin_cms);
//============================Admin Module End=============================

//============================User Module Start=============================
router.use("/lea/v1/user/auth", user_auth);
router.use("/lea/v1/user/home", user_home);
router.use("/lea/v1/user/test", user_test);
//============================User Module End=============================



module.exports = router;