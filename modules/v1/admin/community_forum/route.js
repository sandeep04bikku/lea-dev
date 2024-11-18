const express = require('express')
const router = express.Router()
const community_forum_controller = require("./controller")


router.post('/add-coomunity-forum-answer', community_forum_controller.addCommunityForumAnswer);
router.post('/community-forum-list', community_forum_controller.communityForumList);
router.post('/community-forum-answer-list', community_forum_controller.communityForumAnswerList);
router.post('/update-correct-answer', community_forum_controller.updateCorrectAnswer);
router.post('/add-blog', community_forum_controller.addBlog);
router.post('/update-blog', community_forum_controller.updateBlog);
router.post('/delete-blog', community_forum_controller.deleteBlog);
router.post('/change-blog-status', community_forum_controller.changeBlogStatus);
router.post('/blog-list', community_forum_controller.blogList);

module.exports = router;