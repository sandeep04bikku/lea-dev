const express = require('express')
const router = express.Router()
const home_controller = require("./controller")


router.post('/category-list', home_controller.categoryList);
router.post('/course-list', home_controller.courseList);
router.post('/user-course-list', home_controller.myCourseList);
router.post('/lession-list', home_controller.lessionList);
router.post('/add-delete-favorite-course', home_controller.addDeleteFavoriteCourse);
router.post('/user-favorite-course-list', home_controller.myFavoriteCourseList);
router.post('/add-course-review', home_controller.addCourseReview);
router.post('/course-review-list', home_controller.courseReviewList);
router.post('/add-trainer-review', home_controller.addTrainerReview);
router.post('/trainer-review-list', home_controller.trainerReviewList);
router.post('/add-search-course', home_controller.addSearchData);
router.post('/recommended-course-list', home_controller.recommendedCourseList);
router.post('/add-user-lession-details', home_controller.addUserLessionDetails);
router.post('/add-complaint-feedback', home_controller.addComplaintFeedback);


module.exports = router;