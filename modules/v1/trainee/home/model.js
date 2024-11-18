const { Sequelize, Op, fn, col } = require("sequelize");
const common = require("../../../../config/common");
const sequelize = require("../../../../models");
const moment = require("moment");
const _ = require('lodash');
const global = require("../../../../config/constants");
const email_template = require("../../../../config/template")
const enc_dec = require("../../../../middleware/encriptionDecription");
const UserCourse = require("../../../../models/tbl_user_course");
const { sortingParams, pagingParams, paginate } = require("../../../../helper/helper");
const Course = require("../../../../models/tbl_course");
const Category = require("../../../../models/tbl_category");
const UserFavoriteCourse = require("../../../../models/tbl_user_favorite_course");
const CourseReview = require("../../../../models/tbl_course_review");
const TrainerReview = require("../../../../models/tbl_trainer_review");
const Trainer = require("../../../../models/tbl_trainer");
const User = require("../../../../models/tbl_user");
const TrainerAssignCourse = require("../../../../models/tbl_trainer_assign_course");
const SearchCourse = require("../../../../models/tbl_search_course");
const UserLessionDetails = require("../../../../models/tbl_user_lession_detail");
const Lession = require("../../../../models/tbl_lession");
const ComplaintFeedBack = require("../../../../models/tbl_complaint_feedback");


const Home_Model = {

    // ==============================common function user course listing=========================
    getUserCourse: async (request) => {
        try {
            const page = (request.page !== "" && request.page !== undefined && request.page !== null) ? parseInt(request.page) : 1;
            const limit = (request.limit !== "" && request.limit !== undefined && request.limit !== null) ? parseInt(request.limit) : 10;
            const sort = (request.sort !== "" && request.sort !== undefined && request.sort !== null) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit }

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false,
                is_active: true,
                user_id: request._id,
                is_completed: false
            };

            if (request.course_id) {
                whereClause.course_id = request.course_id;
            }

            const courseWhereClause = {
                is_deleted: false,
                is_active: true,
            }

            if (request.is_random_test && request.is_completed) {

                if (request.is_upcoming) {
                    whereClause.is_completed = true;
                    courseWhereClause.is_upcoming = true;
                } else {
                    whereClause.is_completed = true;
                    courseWhereClause.is_upcoming = false;
                }

                if (request.is_test_completed) {
                    whereClause.is_completed = true;
                    courseWhereClause.is_upcoming = false;
                    whereClause.is_test_completed = true;
                }
            } else {
                if (request.is_completed) {
                    whereClause.is_completed = true
                }
            }



            // if (request.is_upcoming && request.is_upcoming !== undefined && request.is_upcoming !== null) {
            //     courseWhereClause.is_upcoming = true;
            // }

            // if (request.is_test_completed && request.is_test_completed !== undefined && request.is_test_completed !== null) {
            //     whereClause.is_test_completed = true
            //     console.log("completed test");

            // } else if (!request.is_test_completed && request.is_test_completed !== undefined && request.is_test_completed !== null) {
            //     whereClause.is_test_completed = false
            //     console.log("incompleted test");
            // }

            console.log(whereClause, "where clause", courseWhereClause);


            const result = await UserCourse.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Course,
                        required: true,
                        as: 'user_course',
                        where: courseWhereClause,
                        include: [
                            {
                                model: Category,
                                // attributes: ['id', 'name', 'is_deleted', 'is_active', 'created_at', 'updated_at'],
                                required: true,
                                as: 'course_category',
                                where: { is_deleted: false, is_active: true }
                            },
                            {
                                model: TrainerAssignCourse,
                                required: false,
                                as: 'assign_trainer',
                                include: [
                                    {
                                        model: Trainer,
                                        as: 'trainer_details',
                                        attributes: {
                                            exclude: ['password'],
                                        }
                                    }
                                ]
                            },
                            {
                                model: UserFavoriteCourse,
                                required: false,
                                as: 'user_favorite_course',
                                where: {
                                    user_id: request._id,
                                    is_deleted: false
                                },
                                attributes: ['is_favorite'],
                                limit: 1
                            }
                        ]
                    },
                ],
                order: _sortingParams,
                ...pagingParams_
            });

            result.rows.forEach(course => {
                // console.log(course);

                const favorite = course.user_course.user_favorite_course && course.user_course.user_favorite_course[0];
                // console.log(favorite);

                // Update the is_favorite field directly
                course.user_course.dataValues.is_favorite = favorite ? favorite.is_favorite : false;

            });

            // // Map result to include certificateUrl
            // const resultWithUrls = result.rows.map(userCourse => ({
            //     ...userCourse.toJSON(),
            //     certificateUrl: userCourse.certificateUrl,
            //     // trainerImageUrl:userCourse.assign_trainer.trainer_details.imageUrl
            // }));

            return paginate(result, paging);
        } catch (error) {
            throw error;
        }
    },

    // ==============================course listing=========================

    myCourseList: async (request) => {
        try {

            console.log(request, "request data in my course");

            const result = await Home_Model.getUserCourse(request);

            if (result.data.length > 0) {
                if (request.course_id) {
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
            throw error;
        }
    },

    addDeleteFavoriteCourse: async (request) => {
        try {
            const isExist = await UserFavoriteCourse.findOne({
                where: {
                    user_id: request._id,
                    course_id: request.course_id
                }
            });

            console.log(isExist);

            if (isExist) {
                const updateObj = {
                    is_deleted: false,
                    is_favorite: true
                };

                let message = "rest_keywords_course_favorite_add_success"

                if (isExist.is_favorite && !isExist.is_deleted) {
                    updateObj.is_favorite = false;
                    message = "rest_keywords_course_favorite_delete_success"
                }

                const result = await UserFavoriteCourse.update(updateObj, {
                    where: {
                        user_id: request._id,
                        course_id: request.course_id
                    }
                })


                return {
                    code: global.SUCCESS,
                    message: { keyword: message, content: result },
                    data: result,
                };

            } else {
                const result = await UserFavoriteCourse.create({
                    user_id: request._id,
                    course_id: request.course_id,
                    is_favorite: true
                });

                if (result && result.id) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_course_favorite_add_success', content: result },
                        data: result,
                    };
                }
            }
        } catch (error) {
            throw error;
        }
    },

    getUserFavoriteCourse: async (request) => {
        try {
            const page = (request.page !== "" && request.page !== undefined && request.page !== null) ? parseInt(request.page) : 1;
            const limit = (request.limit !== "" && request.limit !== undefined && request.limit !== null) ? parseInt(request.limit) : 10;
            const sort = (request.sort !== "" && request.sort !== undefined && request.sort !== null) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit }

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false,
                is_active: true,
                user_id: request._id,
                is_favorite: true
            };

            const courseWhereClause = {
                is_deleted: false,
                is_active: true,
            }


            const result = await UserFavoriteCourse.findAndCountAll({
                where: whereClause,
                attributes: {},
                include: [
                    {
                        model: Course,
                        required: true,
                        as: 'user_favorite_course',
                        where: courseWhereClause,
                        include: [
                            {
                                model: Category,
                                required: true,
                                as: 'course_category',
                                where: { is_deleted: false, is_active: true }
                            },
                            {
                                model: TrainerAssignCourse,
                                required: false,
                                as: 'assign_trainer',
                                include: [
                                    {
                                        model: Trainer,
                                        as: 'trainer_details',
                                        attributes: {
                                            exclude: ['password'],
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                ],
                order: _sortingParams,
                ...pagingParams_
            });

            // Update the is_purchage flag directly on result.rows
            await Promise.all(result.rows.map(async (favoriteCourse) => {
                const courseId = favoriteCourse.user_favorite_course.id;
                const isPurchased = await UserCourse.findOne({
                    where: {
                        user_id: request._id,
                        course_id: courseId,
                        is_expired: false
                    }
                });

                console.log(isPurchased, "purchage course");
                // Update the is_purchage flag directly on the existing object
                favoriteCourse.dataValues.is_purchage = isPurchased !== null;
            }));

            return paginate(result, paging);
        } catch (error) {
            throw error;
        }
    },

    // ==============================Favorite course listing=========================
    myFavoriteCourseList: async (request) => {
        try {
            const result = await Home_Model.getUserFavoriteCourse(request);

            if (result.data.length > 0) {
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
            throw error;
        }
    },

    //==================================Add Course review rating=============================
    addCourseReview: async (request) => {
        try {
            const isExist = await CourseReview.findOne({
                where: {
                    user_id: request._id,
                    course_id: request.course_id
                }
            });

            if (!isExist) {
                const reviewObj = {
                    user_id: request._id,
                    course_id: request.course_id,
                    rating: request.rating,
                    review: (request.review !== "" && request.review !== undefined && request.review !== null) ? request.review : null,
                    review_date: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                }
                const review = await CourseReview.create(reviewObj);

                if (review && review.id) {
                    const result = await CourseReview.findOne({
                        attributes: [
                            [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
                            [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
                        ],
                        where: {
                            course_id: request.course_id
                        },
                        raw: true
                    });

                    const avgRating = parseFloat(result.avgRating).toFixed(2); // Format the average rating to 2 decimal places
                    const totalReviews = parseInt(result.totalReviews);

                    await Course.update(
                        {
                            avg_review: avgRating,
                            total_review: totalReviews
                        },
                        {
                            where: {
                                id: request.course_id
                            }
                        }
                    );

                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_add_review_success', content: {} },
                        data: review,
                    };
                }
            } else {
                return {
                    code: global.OPRETION_FAILD,
                    message: { keyword: 'rest_keywords_existing_review_error', content: {} },
                    data: {},
                };
            }
        } catch (error) {
            throw error;
        }
    },

    //==================================Add Course review rating List=============================
    getCourseReviewList: async (request) => {
        try {
            const page = (request.page !== "" && request.page !== undefined && request.page !== null) ? parseInt(request.page) : 1;
            const limit = (request.limit !== "" && request.limit !== undefined && request.limit !== null) ? parseInt(request.limit) : 10;
            const sort = (request.sort !== "" && request.sort !== undefined && request.sort !== null) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit }

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false,
                is_active: true,
                course_id: request.course_id
            };

            const result = await CourseReview.findAndCountAll({
                where: whereClause,
                attributes: {},
                include: [
                    {
                        model: User,
                        attributes: ['id', 'full_name', 'image'
                            // [
                            //     Sequelize.fn('CONCAT',
                            //         process.env.S3_BASE_URL, global.USER_FOLDER, Sequelize.col('image'),
                            //     ),
                            //     'image',
                            // ],
                        ],
                        required: true,
                        as: 'user_course_review',
                    },
                ],
                order: _sortingParams,
                ...pagingParams_
            });

            return paginate(result, paging);
        } catch (error) {
            throw error;
        }
    },

    // ==============================course review listing=========================
    courseReviewList: async (request) => {
        try {
            const result = await Home_Model.getCourseReviewList(request);

            if (result.data.length > 0) {
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
            throw error;
        }
    },

    //==================================Add Trainer review rating=============================
    addTrainerReview: async (request) => {
        try {
            const isExist = await TrainerReview.findOne({
                where: {
                    user_id: request._id,
                    trainer_id: request.trainer_id
                }
            });

            if (!isExist) {
                const reviewObj = {
                    user_id: request._id,
                    trainer_id: request.trainer_id,
                    rating: request.rating,
                    review: (request.review !== "" && request.review !== undefined) ? request.review : null,
                    review_date: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                }
                const review = await TrainerReview.create(reviewObj);

                if (review && review.id) {
                    const result = await TrainerReview.findOne({
                        attributes: [
                            [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating'],
                            [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews']
                        ],
                        where: {
                            trainer_id: request.trainer_id
                        },
                        raw: true
                    });

                    const avgRating = parseFloat(result.avgRating).toFixed(2); // Format the average rating to 2 decimal places
                    const totalReviews = parseInt(result.totalReviews);

                    await Trainer.update(
                        {
                            avg_review: avgRating,
                            total_review: totalReviews
                        },
                        {
                            where: {
                                id: request.trainer_id
                            }
                        }
                    );

                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_add_review_success', content: {} },
                        data: review,
                    };
                }
            } else {
                return {
                    code: global.OPRETION_FAILD,
                    message: { keyword: 'rest_keywords_existing_review_error', content: {} },
                    data: {},
                };
            }
        } catch (error) {
            throw error;
        }
    },

    //==================================get trainer review rating List=============================
    getTrainerReviewList: async (request) => {
        try {
            const page = (request.page !== "" && request.page !== undefined && request.page !== null) ? parseInt(request.page) : 1;
            const limit = (request.limit !== "" && request.limit !== undefined && request.limit !== null) ? parseInt(request.limit) : 10;
            const sort = (request.sort !== "" && request.sort !== undefined && request.sort !== null) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit }

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false,
                is_active: true,
                trainer_id: request.trainer_id
            };

            const result = await TrainerReview.findAndCountAll({
                where: whereClause,
                attributes: {},
                include: [
                    {
                        model: User,
                        attributes: ['id', 'full_name', 'image'
                            // [
                            //     Sequelize.fn('CONCAT',
                            //         process.env.S3_BASE_URL, global.USER_FOLDER, Sequelize.col('image'),
                            //     ),
                            //     'image',
                            // ],
                        ],
                        required: true,
                        as: 'user_trainer_review',
                    },
                ],
                order: _sortingParams,
                ...pagingParams_
            });

            return paginate(result, paging);
        } catch (error) {
            throw error;
        }
    },

    //==================================Trainer review rating List=============================
    trainerReviewList: async (request) => {
        try {
            const result = await Home_Model.getTrainerReviewList(request);

            if (result.data.length > 0) {
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
            throw erro
        }
    },

    //==================================add user search data=============================
    addSearchData: async (request) => {
        try {
            const existData = await SearchCourse.findOne({ where: { user_id: request._id, course_id: request.course_id } });

            if (existData) {
                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keywords_search_data_update_success', content: {} },
                    data: existData,
                };
            } else {
                const insertData = await SearchCourse.create({ user_id: request._id, course_id: request.course_id });

                if (insertData && insertData.id) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_search_data_add_success', content: {} },
                        data: insertData,
                    };
                }
            }

            return {
                code: global.OPRETION_FAILD,
                message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} },
                data: {},
            };
        } catch (error) {
            throw error;
        }
    },

    // ==============================get recommended course listing=========================
    // getRecommededCourse: async (request) => {
    //     try {
    //         const search_query = request.search || '';
    //         const min_price = request.min_price ? parseFloat(request.min_price) : 0;
    //         const max_price = request.max_price ? parseFloat(request.max_price) : Infinity;
    //         const min_review = request.min_review ? parseFloat(request.min_review) : 0.0;
    //         const max_review = request.max_review ? parseFloat(request.max_review) : 5.0;

    //         console.log(min_review, max_review);


    //         const page = (request.page !== "" && request.page !== undefined) ? parseInt(request.page) : 1;
    //         const limit = (request.limit !== "" && request.limit !== undefined) ? parseInt(request.limit) : 10;
    //         const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

    //         const paging = { page: page, limit: limit }

    //         const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
    //         const pagingParams_ = pagingParams(paging);

    //         const whereClause = {
    //             is_deleted: false,
    //             is_active: true,
    //         };


    //         const courseWhereClause = {
    //             is_deleted: false,
    //             is_active: true,
    //         }

    //         const categoryWhereClause = {
    //             is_deleted: false,
    //             is_active: true
    //         };

    //         if (request.course_id) {
    //             whereClause.course_id = request.course_id;
    //         }

    //         if (request.user_id) {
    //             whereClause.user_id = request.user_id;
    //         }

    //         if (request.category_id) {
    //             courseWhereClause.category_id = request.category_id;
    //         }

    //         if (search_query) {
    //             courseWhereClause[Op.or] = [
    //                 { name: { [Op.like]: `%${search_query}%` } },
    //                 sequelize.literal(`EXISTS (
    //                     SELECT 1 FROM tbl_trainer_assign_courses as tac
    //                     JOIN tbl_trainers as t ON t.id = tac.trainer_id
    //                     WHERE tac.course_id = tbl_courses.id AND t.full_name LIKE '%${search_query}%'
    //                 )`)
    //             ];
    //         }

    //         if (max_price !== Infinity || min_price > 0) {
    //             courseWhereClause.price = {
    //                 [Op.between]: [min_price, max_price]
    //             };
    //         }

    //         if (max_review < 5 || min_review > 0) {
    //             courseWhereClause.avg_review = {
    //                 [Op.between]: [min_review, max_review]
    //             };
    //         }

    //         console.log(courseWhereClause, "course where clause");

    //         const result = await SearchCourse.findAndCountAll({
    //             where: whereClause,
    //             attributes: ['course_id', 'user_id', 'created_at', 'updated_at'],
    //             include: [
    //                 {
    //                     model: Course,
    //                     required: true,
    //                     as: 'recommende_course',
    //                     where: courseWhereClause,
    //                     include: [
    //                         {
    //                             model: Category,
    //                             required: true,
    //                             as: 'course_category',
    //                             where: categoryWhereClause,
    //                         },
    //                         {
    //                             model: TrainerAssignCourse,
    //                             required: false,
    //                             as: 'assign_trainer',
    //                             include: [
    //                                 {
    //                                     model: Trainer,
    //                                     as: 'trainer_details',
    //                                     attributes: ['id', 'full_name', 'email', 'country_code', 'phone_number', 'image'
    //                                         // [
    //                                         //     Sequelize.fn('CONCAT',
    //                                         //         process.env.S3_BASE_URL, global.TRAINER, Sequelize.col('image'),
    //                                         //     ),
    //                                         //     'image',
    //                                         // ],
    //                                     ]
    //                                 },
    //                             ],
    //                         },
    //                         {
    //                             model: UserFavoriteCourse,
    //                             required: false,
    //                             as: 'user_favorite_course',
    //                             where: {
    //                                 user_id: request._id,
    //                                 is_deleted: false
    //                             },
    //                             attributes: ['is_favorite'],
    //                             limit: 1
    //                         }
    //                     ],
    //                 },
    //             ],
    //             group: ['tbl_search_courses.course_id'], // Group by course_id to ensure unique courses
    //             order: _sortingParams,
    //             ...pagingParams_
    //         });

    //         result.rows.forEach(course => {
    //             // console.log(course.recommende_course);

    //             const favorite = course.recommende_course.user_favorite_course && course.recommende_course.user_favorite_course[0];
    //             console.log(favorite);

    //             // Update the is_favorite field directly
    //             course.dataValues.is_favorite = favorite ? favorite.is_favorite : false;

    //         });

    //         return paginate(result, paging);
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    getRecommededCourse: async (request) => {
        try {
            const search_query = request.search || '';
            const min_price = request.min_price ? parseFloat(request.min_price) : 0;
            const max_price = request.max_price ? parseFloat(request.max_price) : Infinity;
            const min_review = request.min_review ? parseFloat(request.min_review) : 0.0;
            const max_review = request.max_review ? parseFloat(request.max_review) : 5.0;

            const page = (request.page !== "" && request.page !== undefined && request.page !== null) ? parseInt(request.page) : 1;
            const limit = (request.limit !== "" && request.limit !== undefined && request.limit !== null) ? parseInt(request.limit) : 10;
            const sort = (request.sort !== "" && request.sort !== undefined && request.sort !== null) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit };

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const purchageCourse = await UserCourse.findAll({
                where: {
                    user_id: request._id
                },
                attributes: ['course_id']
            });

            const purchageCourseIds = purchageCourse.map(purchage => purchage.course_id);

            console.log(purchageCourseIds, "Purchage course id");

            // Define the where clause for the Course model
            const whereClause = {
                is_deleted: false,
                is_active: true,
                id: {
                    [Op.notIn]: purchageCourseIds
                }
            };

            const categoryWhereClause = {
                is_deleted: false,
                is_active: true
            };

            if (request.course_id) {
                whereClause.id = request.course_id;
            }

            if (request.category_id) {
                whereClause.category_id = request.category_id;
            }

            if (search_query) {
                whereClause[Op.or] = [
                    { name: { [Op.like]: `%${search_query}%` } },
                    sequelize.literal(`EXISTS (
                        SELECT 1 FROM tbl_trainer_assign_courses as tac
                        JOIN tbl_trainers as t ON t.id = tac.trainer_id
                        WHERE tac.course_id = tbl_courses.id AND t.full_name LIKE '%${search_query}%'
                    )`)
                ];
            }

            if (max_price !== Infinity || min_price > 0) {
                whereClause.price = {
                    [Op.between]: [min_price, max_price]
                };
            }

            if (max_review < 5 || min_review > 0) {
                whereClause.avg_review = {
                    [Op.between]: [min_review, max_review]
                };
            }

            console.log(whereClause, "course where clause");

            // Query the Course table first
            const result = await Course.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: SearchCourse,
                        required: true, // This ensures that only courses with associated SearchCourse entries are returned
                        as: 'recommende_course',
                        where: {
                            is_deleted: false,
                            is_active: true,
                        },
                        attributes: [],
                    },
                    {
                        model: Category,
                        required: true,
                        as: 'course_category',
                        where: categoryWhereClause,
                    },
                    {
                        model: TrainerAssignCourse,
                        required: false,
                        as: 'assign_trainer',
                        include: [
                            {
                                model: Trainer,
                                as: 'trainer_details',
                                attributes: ['id', 'full_name', 'email', 'country_code', 'phone_number', 'image']
                            },
                        ],
                    },
                    {
                        model: UserFavoriteCourse,
                        required: false,
                        as: 'user_favorite_course',
                        where: {
                            user_id: request._id,
                            is_deleted: false
                        },
                        attributes: ['is_favorite'],
                        limit: 1
                    }
                ],
                group: ['id'], // Group by Course ID to ensure unique courses
                order: _sortingParams,
                ...pagingParams_
            });

            result.rows.forEach(course => {
                // console.log(course.recommende_course);

                const favorite = course.user_favorite_course && course.user_favorite_course[0];
                // console.log(favorite);

                // Update the is_favorite field directly
                course.dataValues.is_favorite = favorite ? favorite.is_favorite : false;

            });


            return paginate(result, paging);
        } catch (error) {
            throw error;
        }
    },


    // ==============================recommended course listing=========================
    recommendedCourseList: async (request) => {
        try {
            const result = await Home_Model.getRecommededCourse(request);

            result.paging.total = result.paging.total.length

            if (result.data.length > 0) {
                if (request.course_id) {
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
            throw error;
        }
    },

    // ==============================common function for convert time into string=========================
    convertTimeToSeconds: (time) => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return (hours * 3600) + (minutes * 60) + seconds;
    },

    // ==============================add user lession details=========================
    addUserLessionDetails: async (request) => {
        try {
            console.log(request, "request data for user lession details");

            let data = {};
            let userCourseUpdateData = {
                total_watch_lession: 0,
                is_completed: false
            }
            const existData = await UserLessionDetails.findOne({
                where: { user_id: request._id, course_id: request.course_id, lession_id: request.lession_id }
            });

            let is_completed = false;

            const lessionData = await Lession.findOne({ where: { id: request.lession_id } });

            if (lessionData) {
                const durationSeconds = Home_Model.convertTimeToSeconds(lessionData.duration);
                const pauseTimeSeconds = Home_Model.convertTimeToSeconds(request.pause_time);

                const twoMinutesInSeconds = 2 * 60;

                // Compare pause_time with duration
                if (durationSeconds === pauseTimeSeconds || Math.abs(durationSeconds - pauseTimeSeconds) <= twoMinutesInSeconds) {
                    is_completed = true;
                }
            }

            if (existData) {
                data = await UserLessionDetails.update({
                    start_time: request.start_time,
                    pause_time: request.pause_time,
                    is_completed: is_completed
                }, {
                    where: { user_id: request._id, course_id: request.course_id, lession_id: request.lession_id } // Adding where clause to target the specific record
                });
            } else {
                data = await UserLessionDetails.create({
                    user_id: request._id,
                    course_id: request.course_id,
                    lession_id: request.lession_id,
                    start_time: request.start_time,
                    pause_time: request.pause_time,
                    is_completed: is_completed
                });
            }

            // Fetch the count of completed lessons
            const completedLessonsCount = await UserLessionDetails.count({
                where: { user_id: request._id, course_id: request.course_id, is_completed: true }
            });

            if (completedLessonsCount > 0) {
                userCourseUpdateData.total_watch_lession = completedLessonsCount
            }

            const totalCourseLession = await Course.findOne({ where: { id: request.course_id } });

            if (totalCourseLession && totalCourseLession.total_lession === completedLessonsCount) {
                userCourseUpdateData.is_completed = true
            }

            console.log(userCourseUpdateData, "user course update data");

            // Update the total_lession_watch in UserCourse
            await UserCourse.update(userCourseUpdateData,
                {
                    where: { user_id: request._id, course_id: request.course_id }
                });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keyword_success', content: {} },
                data: data,
            };

        } catch (error) {
            throw error;
        }
    },

    //==========================add complaint feedback==============================
    addComplaintFeedback: async (request) => {
        try {
            console.log(request, "request data of feedback");

            // Prepare the data to be inserted
            const feedbackData = {
                full_name: request.full_name,
                country_code: request.country_code,
                phone_number: request.phone_number,
                description: request.description,
                image: request.image
            };

            // Insert the data into the ContactUs table
            const insertData = await ComplaintFeedBack.create(feedbackData);

            if (insertData && insertData.id) {
                return {
                    code: global.SUCCESS,
                    message: {
                        keyword: 'rest_keyword_complaint_feedback_us_success',
                        content: {},
                    },
                    data: {},
                };
            }
        } catch (error) {
            throw error;
        }
    },


}

module.exports = Home_Model