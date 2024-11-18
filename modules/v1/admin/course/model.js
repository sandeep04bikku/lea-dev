const { Sequelize, Op, where, col, fn } = require("sequelize");
const { t } = require("localizify");
const common = require("../../../../config/common");
const sequelize = require("../../../../models");
const moment = require("moment");
const _ = require('lodash');
const email_template = require("../../../../config/template")
const enc_dec = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");
const Course = require("../../../../models/tbl_course");
const { sortingParams, pagingParams, paginate } = require("../../../../helper/helper");
const Lession = require("../../../../models/tbl_lession");
const Category = require("../../../../models/tbl_category");
const UserFavoriteCourse = require("../../../../models/tbl_user_favorite_course");
const UserCourse = require("../../../../models/tbl_user_course");
const User = require("../../../../models/tbl_user");
const CourseReview = require("../../../../models/tbl_course_review");
const TrainerAssignCourse = require("../../../../models/tbl_trainer_assign_course");
const Trainer = require("../../../../models/tbl_trainer");
const UserLessionDetails = require("../../../../models/tbl_user_lession_detail");


const Course_Model = {

    //==========================Add single course==============================
    addCourse: async (request) => {
        try {
            console.log(request);
            const courseObj = {
                category_id: request.category_id,
                language: request.language,
                name: request.name,
                description: request.description,
                validity: request.validity,
                price: request.price,
                image: request.image,
                file: request.file
            }

            const courseData = await Course.create(courseObj);

            if (courseData && courseData.id) {

                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_add_course_data_success', content: {} },
                    data: courseData,
                };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: {} };
        } catch (error) {
            console.error('course:- ', 'add course:', error.message, error.stack);
            throw new Error('add course error.');
        }
    },

    //==========================update single Course==============================
    updateCourse: async (request) => {
        try {

            console.log(request, "update course request");

            const courseData = await Course.findOne({ where: { id: request.id, is_deleted: false, is_active: true } });

            if (courseData) {

                const updateObj = {
                    category_id: request.category_id,
                    language: request.language,
                    name: request.name,
                    description: request.description,
                    price: request.price,
                    validity: request.validity
                }

                if (request.image !== "" && request.image !== undefined) {
                    updateObj.image = request.image
                }

                if (request.file !== "" && request.file !== undefined) {
                    updateObj.file = request.file
                }

                await Course.update(updateObj, { where: { id: request.id } });

                const updatedCourse = await Course.findOne({ where: { id: request.id } });


                if (updatedCourse) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_course_data_update_success', content: {} },
                        data: updatedCourse,
                    };
                }
            }


            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error
        }
    },

    //==========================Delete single Course==============================
    deleteCourse: async (request) => {
        try {
            const deleteCourse = await Course.update({ is_deleted: true }, { where: { id: request.id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keywords_course_data_deleted_success', content: {} },
                data: deleteCourse,
            };

        } catch (error) {
            throw error;
        }
    },

    //==========================Change status of single Course==============================
    changeCourseStatus: async (request) => {
        try {
            let message = 'rest_keywords_course_data_active_status_success';

            const CourseStatus = await Course.update({ is_active: request.is_active }, { where: { id: request.id, is_deleted: false } });

            if (!request.is_active) {
                message = 'rest_keywords_course_data_blocked_status_success';
            }
            return {
                code: global.SUCCESS,
                message: { keyword: message, content: CourseStatus },
                data: CourseStatus,
            };
        } catch (error) {
            throw error
        }
    },

    // // ==============================Common function of course listing=========================
    // getCourse: async (request) => {
    //     try {
    //         const search_query = request.search || '';
    //         const filter_value = request.filter || '';
    //         const min_price = (request.min_price !== "" && request.min_price !== undefined) ? parseFloat(request.min_price) : 0;
    //         const max_price = (request.max_price !== "" && request.max_price !== undefined) ? parseFloat(request.max_price) : Infinity;
    //         const min_review = (request.min_review !== "" && request.min_review !== undefined) ? parseFloat(request.min_review) : 0;
    //         const max_review = (request.max_review !== "" && request.max_review !== undefined) ? parseFloat(request.max_review) : 5;

    //         const page = (request.page !== "" && request.page !== undefined) ? request.page : 1;
    //         const limit = (request.limit !== "" && request.limit !== undefined) ? request.limit : 10;
    //         const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

    //         const paging = { page: page, limit: limit };

    //         const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
    //         const pagingParams_ = pagingParams(paging);

    //         const whereClause = {
    //             is_deleted: false,
    //         };

    //         if (request.role === "user") {
    //             whereClause.is_active = true;
    //         }

    //         const categoryWhereClause = {
    //             is_deleted: false,
    //         };

    //         if (request.id) {
    //             whereClause.id = request.id;
    //         }

    //         if (request.language) {
    //             whereClause.language = request.language;
    //         }

    //         if (request.category_id) {
    //             whereClause.category_id = request.category_id;
    //         }

    //         if (filter_value === 'deleted') {
    //             whereClause.is_deleted = true;
    //         } else if (filter_value === 'active') {
    //             whereClause.is_deleted = false;
    //             whereClause.is_active = true;
    //         } else if (filter_value === 'inactive') {
    //             whereClause.is_deleted = false;
    //             whereClause.is_active = false;
    //         }

    //         if (search_query) {
    //             whereClause[Op.or] = [
    //                 { name: { [Op.like]: `%${search_query}%` } },
    //                 { '$assign_trainer.trainer_details.full_name$': { [Op.like]: `%${search_query}%` } }
    //                 // sequelize.literal(`\`assign_trainer->trainer_details\`.\`full_name\` LIKE '%${search_query}%'`),
    //             ];
    //         }

    //         if (max_price !== Infinity) {
    //             whereClause.price = {
    //                 [Op.between]: [min_price, max_price]
    //             };
    //         } else if (min_price > 0) {
    //             whereClause.price = {
    //                 [Op.gte]: min_price
    //             };
    //         }

    //         if (max_review < 5) {
    //             whereClause.avg_review = {
    //                 [Op.between]: [min_review, max_review]
    //             };
    //         } else if (min_review > 0) {
    //             whereClause.avg_review = {
    //                 [Op.gte]: min_review
    //             };
    //         }

    //         const includeOptions = [
    //             {
    //                 model: Category,
    //                 required: true,
    //                 as: 'course_category',
    //                 where: categoryWhereClause
    //             },
    //             {
    //                 model: TrainerAssignCourse,
    //                 as: 'assign_trainer',
    //                 include: [
    //                     {
    //                         model: Trainer,
    //                         as: 'trainer_details',
    //                         attributes: {
    //                             exclude: ['password']
    //                         }
    //                     }
    //                 ]
    //             }
    //         ];

    //         if (request.role === 'user') {
    //             includeOptions.push({
    //                 model: UserFavoriteCourse,
    //                 required: false,
    //                 as: 'user_favorite_course',
    //                 where: {
    //                     user_id: request._id,
    //                     is_deleted: false
    //                 },
    //                 attributes: ['is_favorite'],
    //                 limit: 1
    //             });
    //         }

    //         const result = await Course.findAndCountAll({
    //             where: whereClause,
    //             include: includeOptions,
    //             order: _sortingParams,
    //             ...pagingParams_
    //         });

    //         return paginate(result, paging);
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    getCourse: async (request) => {
        try {
            const search_query = request.search || '';
            const filter_value = request.filter || '';
            const min_price = request.min_price ? parseFloat(request.min_price) : 0;
            const max_price = request.max_price ? parseFloat(request.max_price) : Infinity;
            const min_review = request.min_review ? parseFloat(request.min_review) : 0;
            const max_review = request.max_review ? parseFloat(request.max_review) : 5;

            const page = request.page || 1;
            const limit = request.limit || 10;
            const sort = request.sort || 'id:desc';

            const paging = { page: page, limit: limit };

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: filter_value === 'deleted',
            };

            if (request.role === "user") {
                whereClause.is_active = true;
            }

            const categoryWhereClause = {
                is_deleted: false,
            };

            if (request.id) whereClause.id = request.id;
            if (request.language) whereClause.language = request.language;
            if (request.category_id) whereClause.category_id = request.category_id;

            if (filter_value === 'active') {
                whereClause.is_active = true;
            } else if (filter_value === 'inactive') {
                whereClause.is_active = false;
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

            const includeOptions = [
                {
                    model: Category,
                    required: true,
                    as: 'course_category',
                    where: categoryWhereClause
                },
                {
                    model: TrainerAssignCourse,
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
            ];

            if (request.role === 'user') {
                includeOptions.push({
                    model: UserFavoriteCourse,
                    required: false,
                    as: 'user_favorite_course',
                    where: {
                        user_id: request._id,
                        is_deleted: false
                    },
                    attributes: ['is_favorite'],
                    limit: 1
                });
            }

            const result = await Course.findAndCountAll({
                where: whereClause,
                include: includeOptions,
                order: _sortingParams,
                ...pagingParams_
            });

            if (request.role === 'user') {
                result.rows.forEach(course => {
                    console.log(course);

                    const favorite = course.user_favorite_course && course.user_favorite_course[0];
                    console.log(favorite);

                    // Update the is_favorite field directly
                    course.dataValues.is_favorite = favorite ? favorite.is_favorite : false;

                });

                // Update the is_purchage flag directly on result.rows
                await Promise.all(result.rows.map(async (course) => {
                    const courseId = course.id;
                    const isPurchased = await UserCourse.findOne({
                        where: {
                            user_id: request._id,
                            course_id: courseId,
                            is_expired: false
                        }
                    });

                    //console.log(isPurchased, "purchage course");
                    // Update the is_purchage flag directly on the existing object
                    course.dataValues.is_purchage = isPurchased !== null;
                }));
            }

            return paginate(result, paging);
        } catch (error) {
            throw error;
        }
    },

    // ==============================course listing=========================
    CourseList: async (request) => {
        try {
            const result = await Course_Model.getCourse(request);

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
            throw error;
        }
    },

    //==========================Add Single Lesson with video==============================
    addSingleLession: async (course_id, request) => {
        try {
            const courseObj = {
                course_id: course_id,
                language: request.language,
                title: request.title,
                video: request.video,
                duration: request.duration,
                file: (request.file !== "" && request.file !== undefined) ? request.file : null
            };

            const lessonData = await Lession.create(courseObj);

            // Calculate the total number of lessons
            const totalLesson = await Lession.count({
                where: { course_id: course_id, is_deleted: false }
            });

            // Retrieve all lessons for the given course_id
            const lessons = await Lession.findAll({
                where: { course_id: course_id, is_deleted: false },
                attributes: ['duration']
            });

            // Calculate the total duration
            let totalDurationInSeconds = 0;
            lessons.forEach(lesson => {
                const [hours, minutes, seconds] = lesson.duration.split(':').map(Number);
                totalDurationInSeconds += hours * 3600 + minutes * 60 + seconds;
            });

            // Convert total duration back to "HH:mm:ss" format
            const totalHours = Math.floor(totalDurationInSeconds / 3600);
            const totalMinutes = Math.floor((totalDurationInSeconds % 3600) / 60);
            const totalSeconds = totalDurationInSeconds % 60;
            const totalDuration = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

            // Update the Course table
            await Course.update(
                {
                    total_lession: totalLesson,
                    duration: totalDuration
                },
                { where: { id: course_id } }
            );

            return lessonData;

        } catch (error) {
            throw error;
        }
    },

    //==========================Add Multiple Lesson with video==============================
    addLession: async (requests) => {
        try {

            const addedLessions = [];
            const errors = [];

            for (const lessionRequest of requests.lession_data) {

                const lessionData = await Course_Model.addSingleLession(requests.course_id, lessionRequest);

                if (lessionData && lessionData.id) {
                    addedLessions.push(lessionData);
                } else {
                    // If adding the lession fails, store an error message
                    errors.push({
                        request: lessionRequest,
                        message: 'Failed to add lession'
                    });
                }
            }

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keyword_add_lession_data_success', content: {} },
                data: { addedLessions, errors }
            };

        } catch (error) {
            throw error;
        }
    },

    //==========================Update Lesson with video==============================
    updateLession: async (request) => {
        try {

            const updateObj = {
                course_id: request.course_id,
                title: request.title,
                duration: request.duration,
            }

            if (request.video !== "" && request.video !== undefined) {
                updateObj.video = request.video;
            }

            if (request.file !== "" && request.file !== undefined) {
                updateObj.file = request.file
            }


            await Lession.update(updateObj, { where: { id: request.id } });

            // Retrieve all lessons for the given course_id
            const lessons = await Lession.findAll({
                where: { course_id: request.course_id, is_deleted: false },
                attributes: ['duration']
            });

            // Calculate the total duration
            let totalDurationInSeconds = 0;
            lessons.forEach(lesson => {
                const [hours, minutes, seconds] = lesson.duration.split(':').map(Number);
                totalDurationInSeconds += hours * 3600 + minutes * 60 + seconds;
            });

            // Convert total duration back to "HH:mm:ss" format
            const totalHours = Math.floor(totalDurationInSeconds / 3600);
            const totalMinutes = Math.floor((totalDurationInSeconds % 3600) / 60);
            const totalSeconds = totalDurationInSeconds % 60;
            const totalDuration = `${String(totalHours).padStart(2, '0')}:${String(totalMinutes).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

            // Update the Course table
            await Course.update(
                {
                    duration: totalDuration
                },
                { where: { id: request.course_id } }
            );

            const updatedLession = await Lession.findOne({ where: { id: request.id } });


            if (updatedLession) {
                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keywords_lession_data_update_success', content: {} },
                    data: updatedLession,
                };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error;
        }
    },

    //==========================Delete single Lession==============================
    deleteLession: async (request) => {
        try {
            console.log(request);
            const deleteLession = await Lession.update({ is_deleted: true }, { where: { id: request.id } });

            const totalLession = await Lession.count({
                where: { course_id: request.course_id, is_deleted: false }
            });

            console.log(totalLession, "hjkh");

            await Course.update(
                {
                    total_lession: totalLession,
                },
                { where: { id: request.course_id } }
            );

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keywords_lession_data_deleted_success', content: {} },
                data: { deleteLession, id: request.id },
            };

        } catch (error) {
            throw error;
        }
    },

    //==========================Delete Lession in bulk==============================
    deleteBulkLession: async (request) => {
        try {

            const deleteLession = await Lession.update(
                { is_deleted: true },
                { where: { course_id: request.course_id } }
            );

            if (deleteLession[0] > 0) {
                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keywords_lession_data_deleted_success', content: {} },
                    data: deleteLession,
                };
            } else {
                return {
                    code: global.OPRETION_FAILD,
                    message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} },
                    data: []
                };
            }

        } catch (error) {
            throw error;
        }
    },

    //==========================Change status of single Course==============================
    changeLessionStatus: async (request) => {
        try {
            let message = 'rest_keywords_lession_data_active_status_success';

            const lessionStatus = await Lession.update({ is_active: request.is_active }, { where: { id: request.id, is_deleted: false } });

            if (!request.is_active) {
                message = 'rest_keywords_lession_data_blocked_status_success';
            }
            return {
                code: global.SUCCESS,
                message: { keyword: message, content: {} },
                data: lessionStatus,
            };
        } catch (error) {
            throw error
        }
    },

    // ==============================Common function of lession listing=========================
    getLession: async (request) => {
        try {
            const page = (request.page !== "" && request.page !== undefined) ? request.page : 1;
            const limit = (request.limit !== "" && request.limit !== undefined) ? request.limit : 10;
            const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit };

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false,
                course_id: request.course_id,
            };

            // Filter by id if provided
            if (request.id) {
                whereClause.id = request.id;
            }

            const result = await Lession.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: UserLessionDetails,
                        as: 'user_lession',
                        required: false,
                        where: {
                            user_id: request._id
                        }
                    }
                ],
                order: _sortingParams,
                ...pagingParams_,
            });


            return paginate(result, paging);
        } catch (error) {
            throw error;
        }
    },

    // ==============================course listing=========================
    lessionList: async (request) => {
        try {
            const result = await Course_Model.getLession(request);

            // console.log(result);

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

    getEnrollCourseUser: async (request) => {
        try {
            const search_query = request.search || '';
            const filter_value = request.filter || '';
            const page = (request.page !== "" && request.page !== undefined) ? request.page : 1;
            const limit = (request.limit !== "" && request.limit !== undefined) ? request.limit : 10;
            const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit };

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false,
                course_id: request.course_id,
            };

            // Filter by id if provided
            if (request.id) {
                whereClause.id = request.id;
            }

            const result = await UserCourse.findAndCountAll({
                where: whereClause,
                attributes: {},
                include: [
                    {
                        model: User,
                        attributes: {
                            exclude: ['password', 'social_id'],
                        },
                        // attributes: ['id', 'email', 'country_code', 'phone_number', 'full_name', 'created_at', 'is_active', 'is_deleted',
                        //     [
                        //         fn('CONCAT',
                        //             process.env.S3_BASE_URL, global.USER_FOLDER, col('image'),
                        //         ),
                        //         'image',
                        //     ],
                        // ],
                        as: "enroll_user",
                        where: {
                            is_deleted: false,
                            is_active: true
                        }
                    }
                ],
                order: _sortingParams,
                ...pagingParams_,
            });

            return paginate(result, paging);
        } catch (error) {
            throw error;
        }
    },

    enrollCourseUserList: async (request) => {
        try {
            const result = await Course_Model.getEnrollCourseUser(request);

            // console.log(result);

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

    getCourseReview: async (request) => {
        try {

            const page = (request.page !== "" && request.page !== undefined) ? request.page : 1;
            const limit = (request.limit !== "" && request.limit !== undefined) ? request.limit : 10;
            const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit };

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false,
            };

            if (request.course_id) {
                whereClause.course_id = request.course_id;
            }


            const result = await CourseReview.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        attributes: {
                            exclude: ['password', 'social_id'],
                        },
                        // attributes: ['id', 'full_name',
                        //     [
                        //         fn('CONCAT',
                        //             process.env.S3_BASE_URL, global.USER_FOLDER, col('image'),
                        //         ),
                        //         'image',
                        //     ],
                        // ],
                        as: "user_course_review",
                        where: {
                            is_deleted: false,
                            is_active: true
                        }
                    }
                ],
                order: _sortingParams,
                ...pagingParams_,
            });

            return paginate(result, paging);
        } catch (error) {
            throw error;
        }
    },

    courseReviewList: async (request) => {
        try {
            console.log(request, "course review list request");

            const result = await Course_Model.getCourseReview(request);

            // console.log(result);

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

    //===========================assign course to trainer =================================
    assignCourse: async (request) => {
        try {
            const existingCourse = await TrainerAssignCourse.findOne({ where: { course_id: request.course_id, trainer_id: request.trainer_id } });

            if (!existingCourse) {
                const insertData = await TrainerAssignCourse.create({
                    course_id: request.course_id,
                    trainer_id: request.trainer_id
                })

                if (insertData && insertData.id) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keyword_assign_course_success', content: {} },
                        data: insertData,
                    };
                }
            } else {
                return {
                    code: global.OPRETION_FAILD,
                    message: { keyword: 'rest_keyword_assign_course_exist_error', content: {} },
                    data: {},
                };
            }
        } catch (error) {
            throw error;
        }
    },

    // // ==============================Common function of course listing=========================
    // getCourse: async (request) => {
    //     try {
    //         const search_query = request.search || '';
    //         const filter_value = request.filter || '';
    //         const min_price = (request.min_price !== "" && request.min_price !== undefined) ? parseFloat(request.min_price) : 0;
    //         const max_price = (request.max_price !== "" && request.max_price !== undefined) ? parseFloat(request.max_price) : Infinity;
    //         const min_review = (request.min_review !== "" && request.min_review !== undefined) ? parseFloat(request.min_review) : 0;
    //         const max_review = (request.max_review !== "" && request.max_review !== undefined) ? parseFloat(request.max_review) : 5;

    //         const page = (request.page !== "" && request.page !== undefined) ? request.page : 1;
    //         const limit = (request.limit !== "" && request.limit !== undefined) ? request.limit : 10;
    //         const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

    //         const paging = { page: page, limit: limit };

    //         const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
    //         const pagingParams_ = pagingParams(paging);

    //         const whereClause = {
    //             is_deleted: false,
    //         };

    //         if (request.role === "user") {
    //             whereClause.is_active = true;
    //         }

    //         const categoryWhereClause = {
    //             is_deleted: false,
    //         };

    //         if (request.id) {
    //             whereClause.id = request.id;
    //         }

    //         if (request.language) {
    //             whereClause.language = request.language;
    //         }

    //         if (request.category_id) {
    //             whereClause.category_id = request.category_id;
    //         }

    //         if (filter_value === 'deleted') {
    //             whereClause.is_deleted = true;
    //         } else if (filter_value === 'active') {
    //             whereClause.is_deleted = false;
    //             whereClause.is_active = true;
    //         } else if (filter_value === 'inactive') {
    //             whereClause.is_deleted = false;
    //             whereClause.is_active = false;
    //         }

    //         if (search_query) {
    //             whereClause[Op.or] = [
    //                 { name: { [Op.like]: `%${search_query}%` } },
    //                 { '$assign_trainer.trainer_details.full_name$': { [Op.like]: `%${search_query}%` } }
    //                 // sequelize.literal(`\`assign_trainer->trainer_details\`.\`full_name\` LIKE '%${search_query}%'`),
    //             ];
    //         }

    //         if (max_price !== Infinity) {
    //             whereClause.price = {
    //                 [Op.between]: [min_price, max_price]
    //             };
    //         } else if (min_price > 0) {
    //             whereClause.price = {
    //                 [Op.gte]: min_price
    //             };
    //         }

    //         if (max_review < 5) {
    //             whereClause.avg_review = {
    //                 [Op.between]: [min_review, max_review]
    //             };
    //         } else if (min_review > 0) {
    //             whereClause.avg_review = {
    //                 [Op.gte]: min_review
    //             };
    //         }

    //         const includeOptions = [
    //             {
    //                 model: Category,
    //                 required: true,
    //                 as: 'course_category',
    //                 where: categoryWhereClause
    //             },
    //             {
    //                 model: TrainerAssignCourse,
    //                 as: 'assign_trainer',
    //                 include: [
    //                     {
    //                         model: Trainer,
    //                         as: 'trainer_details',
    //                         attributes: {
    //                             exclude: ['password']
    //                         }
    //                     }
    //                 ]
    //             }
    //         ];

    //         if (request.role === 'user') {
    //             includeOptions.push({
    //                 model: UserFavoriteCourse,
    //                 required: false,
    //                 as: 'user_favorite_course',
    //                 where: {
    //                     user_id: request._id,
    //                     is_deleted: false
    //                 },
    //                 attributes: ['is_favorite'],
    //                 limit: 1
    //             });
    //         }

    //         const result = await Course.findAndCountAll({
    //             where: whereClause,
    //             include: includeOptions,
    //             order: _sortingParams,
    //             ...pagingParams_
    //         });

    //         return paginate(result, paging);
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    //==============================common function for get assig trainer course======================
    getTrainerAssignCourse: async (request) => {
        try {
            const search_query = request.search || '';
            const filter_value = request.filter || '';


            const page = request.page || 1;
            const limit = request.limit || 10;
            const sort = request.sort || 'id:desc';

            const paging = { page: page, limit: limit };

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: filter_value === 'deleted',
            };

            if (request.role === "user") {
                whereClause.is_active = true;
            }

            const categoryWhereClause = {
                is_deleted: false,
            };

            if (request.id) whereClause.id = request.id;
            if (request.language) whereClause.language = request.language;
            if (request.category_id) whereClause.category_id = request.category_id;

            if (filter_value === 'active') {
                whereClause.is_active = true;
            } else if (filter_value === 'inactive') {
                whereClause.is_active = false;
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



            const result = await Course.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: TrainerAssignCourse,
                        required: true,
                        as: 'assign_trainer',
                        where: {
                            trainer_id: request._id
                        },
                    },
                    {
                        model: Category,
                        required: true,
                        as: 'course_category',
                        where: categoryWhereClause
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

    // ==============================course listing=========================
    trainerAssignCourseList: async (request) => {
        try {
            const result = await Course_Model.getTrainerAssignCourse(request);

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
            throw error;
        }
    },

}

module.exports = Course_Model