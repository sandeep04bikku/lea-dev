const express = require('express')
const router = express.Router()
const course_controller = require("./controller")


router.post('/add-course', course_controller.addCourse);
router.post('/update-course', course_controller.updateCourse);
router.post('/delete-course', course_controller.deleteCourse);
router.post('/change-course-status', course_controller.changeCourseStatus);
router.post('/course-list', course_controller.courseList);
router.post('/add-lession', course_controller.addLession);
router.post('/update-lession', course_controller.updateLession);
router.post('/delete-lession', course_controller.deleteLession);
router.post('/delete-bulk-lession', course_controller.deleteBulkLession);
router.post('/change-lession-status', course_controller.changeLessionStatus);
router.post('/lession-list', course_controller.lessionList);
router.post('/enroll-course-users', course_controller.enrollCourseUserList);
router.post('/course-review-list', course_controller.courseReviewList);
router.post('/assign-course', course_controller.assignCourse);
router.post('/trainer-assign-course-list', course_controller.trainerAssignCourseList);


module.exports = router;