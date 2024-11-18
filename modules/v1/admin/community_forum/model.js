const { Sequelize, Op } = require("sequelize");
const { t } = require("localizify");
const common = require("../../../../config/common");
const sequelize = require("../../../../models");
const moment = require("moment");
const _ = require('lodash');
const enc_dec = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");
const { sortingParams, pagingParams, paginate } = require("../../../../helper/helper");
const CommunityForum = require("../../../../models/tbl_community_forum");
const CommunityForumAnswer = require("../../../../models/tbl_community_forum_answer");
const User = require("../../../../models/tbl_user");
const Admin = require("../../../../models/tbl_admin");
const Trainer = require("../../../../models/tbl_trainer");
const Blogs = require("../../../../models/tbl_blog");
const Category = require("../../../../models/tbl_category");



const Community_Forum_Model = {


    //==========================add Community Forum==============================
    addCommunityForum: async (request) => {
        try {
            const insertObj = {
                user_id: request._id,
                query: request.query,
                query_time: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
            }
            const insertData = await CommunityForum.create(insertObj);

            if (insertData && insertData.id) {
                return { code: global.SUCCESS, message: { keyword: 'rest_keywords_query_add_success', content: {} }, data: insertData };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            console.error('add community forum error:', error.message, error.stack);
            throw new Error('add community forum error.');
        }
    },

    //==========================add Community Forum Answer==============================
    addCommunityForumAnswer: async (request) => {
        try {
            const insertObj = {
                community_forum_id: request.community_forum_id,
                _id: request._id,
                role: request.role,
                answer: request.answer,
                is_correct: false,
                answer_time: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
            }
            const insertData = await CommunityForumAnswer.create(insertObj);

            if (insertData && insertData.id) {
                return { code: global.SUCCESS, message: { keyword: 'rest_keywords_query_answer_add_success', content: {} }, data: insertData };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            console.error('add community forum answer error:', error.message, error.stack);
            throw new Error('add community forum answer error.');
        }
    },

    updateCorrectAnswer: async (request) => {
        try {
            await CommunityForumAnswer.update({ is_correct: true }, { where: { id: request.id } });

            const updateData = await CommunityForumAnswer.findOne({ where: { id: request.id } });

            if (updateData) {
                return { code: global.SUCCESS, message: { keyword: 'rest_keywords_query_answer_correct_pinned_success', content: {} }, data: updateData };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };

        } catch (error) {
            console.error('update correct answer error:', error.message, error.stack);
            throw new Error('update correct answer error.');
        }
    },

    //  //==========================get communityForum details==============================
    //  getCommunityForum: async (request) => {
    //     try {
    //         const page = (request.page !== "" && request.page !== undefined) ? request.page : 1;
    //         const limit = (request.limit !== "" && request.limit !== undefined) ? request.limit : 10;
    //         const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

    //         const paging = { page: page, limit: limit };
    //         const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
    //         const pagingParams_ = pagingParams(paging);

    //         const whereClause = {
    //             is_deleted: false, // Default condition
    //         };

    //         if (request.role === 'user') {
    //             whereClause.is_active = true;
    //         }

    //         // Get Category data with id
    //         if (request.id) {
    //             whereClause.id = request.id;
    //         }

    //         // Fetch CommunityForum data
    //         const forums = await CommunityForum.findAndCountAll({
    //             where: whereClause,
    //             include: [
    //                 {
    //                     model: User,
    //                     as: 'query_user',
    //                     attributes: {
    //                         exclude: ['password', 'social_id']
    //                     }
    //                 }
    //             ],
    //             order: _sortingParams,
    //             ...pagingParams_
    //         });

    //         // Fetch CommunityForumAnswer data
    //         const answers = await CommunityForumAnswer.findAll({
    //             where: {
    //                 community_forum_id: forums.rows.map(forum => forum.id),
    //                 is_deleted: false
    //             }
    //         });

    //         // Fetch details based on role
    //         const answerDetailsPromises = answers.map(async (answer) => {
    //             let details = {};
    //             if (answer.role === 'admin') {
    //                 details = await Admin.findByPk(answer._id, {
    //                     attributes: {
    //                         exclude: ['password', 'social_id']
    //                     }
    //                 });
    //             } else if (answer.role === 'trainer') {
    //                 details = await Trainer.findByPk(answer._id, {
    //                     attributes: {
    //                         exclude: ['password', 'social_id']
    //                     }
    //                 });
    //             } else if (answer.role === 'user') {
    //                 details = await User.findByPk(answer._id, {
    //                     attributes: {
    //                         exclude: ['password', 'social_id']
    //                     }
    //                 });
    //             }
    //             return {
    //                 ...answer.toJSON(),
    //                 details: details || null
    //             };
    //         });

    //         // Wait for all detail promises to resolve
    //         const detailedAnswers = await Promise.all(answerDetailsPromises);

    //         // Combine forums and detailed answers
    //         const forumWithAnswers = forums.rows.map(forum => {
    //             return {
    //                 ...forum.toJSON(),
    //                 community_forum_answer: detailedAnswers
    //                     .filter(answer => answer.community_forum_id === forum.id)
    //             };
    //         });

    //         return paginate({
    //             count: forumWithAnswers.length,
    //             rows: forumWithAnswers
    //         }, paging);
    //         return paginate(result, paging);
    //     } catch (error) {
    //         throw error; // Handle the error as per your application's needs
    //     }
    // },

    //==========================get communityForum details==============================
    getCommunityForum: async (request) => {
        try {
            const page = (request.page !== "" && request.page !== undefined && request.page !== null) ? request.page : 1;
            const limit = (request.limit !== "" && request.limit !== undefined && request.limit !== null) ? request.limit : 5;
            const sort = (request.sort !== "" && request.sort !== undefined && request.sort !== null) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit };
            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false, // Default condition
            };

            if (request.role === 'user') {
                whereClause.is_active = true;
            }

            // Get Category data with id
            if (request.id) {
                whereClause.id = request.id;
            }

            // Fetch CommunityForum data
            const result = await CommunityForum.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        as: 'query_user',
                        attributes: ['id', 'full_name', 'image', 'role'],
                    }
                ],
                order: _sortingParams,
                ...pagingParams_
            });

            const forumsWithAnswers = await Promise.all(result.rows.map(async (forum) => {
                try {
                    console.log('Fetching answers for forum ID:', forum.id); // Debugging
    
                    const answers = await Community_Forum_Model.getCommunityForumAnswer({ community_forum_id: forum.id });
                    console.log('Answers fetched:', answers); // Debugging
    
                    return {
                        ...forum.toJSON(),
                        community_forum_answers: answers.data
                    };
                } catch (error) {
                    throw error
                }
            }));
    
            // console.log('Forums with answers:', forumsWithAnswers); // Debugging
            result.rows = forumsWithAnswers;

            return paginate(result, paging);
        } catch (error) {
            console.error('get community forum error:', error.message, error.stack);
            throw new Error('get community forum error.');
        }
    },

    //==========================get community forum List==============================
    communityForumList: async (request) => {
        try {
            const result = await Community_Forum_Model.getCommunityForum(request);

            if (result.data.length > 0) {

                if (request.id) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keyword_data_success', content: {} },
                        data: result.data[0],
                    };
                }

                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_data_success', content: {} },
                    data: result,
                };
            } else {
                return {
                    code: global.NO_DATA_FOUND,
                    message: { keyword: 'rest_keyword_no_data', content: {} },
                    data: result,
                };
            }

        } catch (error) {
            console.error('community forum list error:', error.message, error.stack);
            throw new Error('community forum list error.');
        }
    },

    //==========================get communityForum Answer details==============================
    getCommunityForumAnswer: async (request) => {
        try {
            console.log(request, "community forum answer request");

            const page = (request.page !== "" && request.page !== undefined && request.page !== null) ? request.page : 1;
            const limit = (request.limit !== "" && request.limit !== undefined && request.limit !== null) ? request.limit : 10;
            const sort = (request.sort !== "" && request.sort !== undefined && request.sort !== null) ? request.sort : 'is_correct:desc,id:desc';

            const paging = { page: page, limit: limit };
            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false, // Default condition
                community_forum_id: request.community_forum_id
            };

            if (request.role === 'user') {
                whereClause.is_active = true;
            }

            // Get Category data with id
            if (request.id) {
                whereClause.id = request.id;
            }

            // Fetch CommunityForum data
            const result = await CommunityForumAnswer.findAndCountAll({
                where: whereClause,
                order: _sortingParams,
                ...pagingParams_
            });

            // Function to get the post person details based on role
            const getPostPersonDetails = async (answer) => {
                let post_person = {};
                if (answer.role === 'admin') {
                    post_person = await Admin.findByPk(answer._id, {
                        attributes: ['id', 'full_name', 'image', 'role'],
                    });
                } else if (answer.role === 'trainer') {
                    post_person = await Trainer.findByPk(answer._id, {
                        attributes: ['id', 'full_name', 'image', 'role'],
                    });
                } else if (answer.role === 'user') {
                    post_person = await User.findByPk(answer._id, {
                        attributes: ['id', 'full_name', 'image', 'role'],
                    });
                }
                return post_person;
            };

            // Use Promise.all to ensure all asynchronous operations are complete
            const updateAnswers = result.rows.map(async (answer) => {
                const post_person = await getPostPersonDetails(answer);
                answer.dataValues.post_person = post_person;
            });

            await Promise.all(updateAnswers);

            return paginate(result, paging);
        } catch (error) {
            console.error('get community forum answer error:', error.message, error.stack);
            throw new Error('get community forum answer error.');
        }
    },

    //==========================get community forum answer List==============================
    communityForumAnswerList: async (request) => {
        try {
            const result = await Community_Forum_Model.getCommunityForumAnswer(request);

            if (result.data.length > 0) {

                if (request.id) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keyword_data_success', content: {} },
                        data: result.data[0],
                    };
                }

                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_data_success', content: {} },
                    data: result,
                };
            } else {
                return {
                    code: global.NO_DATA_FOUND,
                    message: { keyword: 'rest_keyword_no_data', content: {} },
                    data: result,
                };
            }

        } catch (error) {
            console.error('community forum answer list:', error.message, error.stack);
            throw new Error('community forum answer list error.');
        }
    },

    //==========================Add blog==============================
    addBlog: async (request) => {
        try {
            const insertObj = {
                category_id: request.category_id,
                title: request.title,
                description: request.description,
                image: request.image,
                blog_date: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
            }
            const insertData = await Blogs.create(insertObj);

            if (insertData && insertData.id) {
                return { code: global.SUCCESS, message: { keyword: 'rest_keywords_blog_add_success', content: {} }, data: insertData };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            console.error('add blog:', error.message, error.stack);
            throw new Error('add blog error.');
        }
    },

    //==========================update blog==============================
    updateBlog: async (request) => {
        try {
            const updateObj = {
                category_id: request.category_id,
                title: request.title,
                description: request.description,
                image: request.image,
            }
            await Blogs.update(updateObj, { where: { id: request.id } });

            const updateData = await Community_Forum_Model.getBlogList({ id: request.id })

            if (updateData.data) {
                return { code: global.SUCCESS, message: { keyword: 'rest_keywords_blog_update_success', content: {} }, data: updateData.data[0] };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            console.error('update blog:', error.message, error.stack);
            throw new Error('update blog error.');
        }
    },

    //==========================get blog details==============================
    getBlogList: async (request) => {
        try {
            const search_query = request.search || '';
            const filter_value = request.filter || '';

            const page = (request.page !== "" && request.page !== undefined && request.page !== null) ? request.page : 1;
            const limit = (request.limit !== "" && request.limit !== undefined && request.limit !== null) ? request.limit : 10;
            const sort = (request.sort !== "" && request.sort !== undefined && request.sort !== null) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit };
            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false, // Default condition
            };

            if (request.role === 'user') {
                whereClause.is_active = true;
            }

            // Get Blog data with id
            if (request.id) {
                whereClause.id = request.id;
            }

            // Where clause based on filter_value
            if (filter_value === 'deleted') {
                whereClause.is_deleted = true;
            } else if (filter_value === 'active') {
                whereClause.is_deleted = false;
                whereClause.is_active = true;
            } else if (filter_value === 'inactive') {
                whereClause.is_deleted = false;
                whereClause.is_active = false;
            }

            // Add search query condition to search by name
            if (search_query) {
                whereClause.title = { [Op.like]: `%${search_query}%` };
            }

            // Fetch Blog data
            const result = await Blogs.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Category,
                        as: 'blog_category',
                    }
                ],
                order: _sortingParams,
                ...pagingParams_
            });

            return paginate(result, paging);
        } catch (error) {
            console.error('get blog list:', error.message, error.stack);
            throw new Error('get blog list error.');
        }
    },

    //==========================get blog List==============================
    blogList: async (request) => {
        console.log(request, "blog request");

        try {
            const result = await Community_Forum_Model.getBlogList(request);

            // console.log(result);
            if (result.data.length > 0) {

                if (request.id) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keyword_data_success', content: {} },
                        data: result.data[0],
                    };
                }

                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_data_success', content: {} },
                    data: result,
                };
            } else {
                return {
                    code: global.NO_DATA_FOUND,
                    message: { keyword: 'rest_keyword_no_data', content: {} },
                    data: result,
                };
            }

        } catch (error) {
            console.error('blog list:', error.message, error.stack);
            throw new Error('blog list error.');
        }
    },

    //==========================Delete Blog==============================
    deleteBlog: async (request) => {
        try {
            const deleteBlog = await Blogs.update({ is_deleted: true }, { where: { id: request.id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keywords_blog_delete_success', content: {} },
                data: { deleteBlog, id: request.id },
            };

        } catch (error) {
            console.error('delete blog:', error.message, error.stack);
            throw new Error('delete blog error.');
        }
    },

    //==========================Change status of blog active/blocked==============================
    changeBlogStatus: async (request) => {
        try {
            let message = 'rest_keywords_blog_active_status_success';

            const blogStatus = await Blogs.update({ is_active: request.is_active }, { where: { id: request.id, is_deleted: false } });

            if (!request.is_active) {
                message = 'rest_keywords_blog_blocked_status_success';
            }
            return {
                code: global.SUCCESS,
                message: { keyword: message, content: {} },
                data: { blogStatus, id: request.id },
            };
        } catch (error) {
            console.error('change blog status:', error.message, error.stack);
            throw new Error('change blog status error.');
        }
    },

}

module.exports = Community_Forum_Model