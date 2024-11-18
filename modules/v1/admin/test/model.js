const { Sequelize, Op, where } = require("sequelize");
const { t } = require("localizify");
const common = require("../../../../config/common");
const sequelize = require("../../../../models");
const moment = require("moment");
const _ = require('lodash');
const email_template = require("../../../../config/template")
const enc_dec = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");
const { sortingParams, pagingParams, paginate } = require("../../../../helper/helper");
const Test = require("../../../../models/tbl_test");
const TestQuestion = require("../../../../models/tbl_question");
const Course = require("../../../../models/tbl_course");
const UserAttemptTest = require("../../../../models/tbl_user_attempt_test");
const User = require("../../../../models/tbl_user");
const Options = require("../../../../models/tbl_option");


const Test_Model = {

    //==========================Add single test==============================
    addTest: async (request) => {
        try {
            console.log(request);

            const existingTest = await Test.findOne({ where: { course_id: request.course_id } });

            if (existingTest) {
                return {
                    code: global.OPRETION_FAILD,
                    message: { keyword: 'rest_keyword_test_existing_error', content: {} },
                    data: [],
                };
            }

            const testObj = {
                course_id: request.course_id,
                name: request.name,
                time_limit: request.time_limit,
                instructions: request.instructions,
            }


            const testData = await Test.create(testObj);

            if (testData && testData.id) {

                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_add_test_data_success', content: {} },
                    data: testData,
                };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error;
        }
    },

    //==========================update single test==============================
    updateTest: async (request) => {

        console.log(request);

        try {
            const testData = await Test.findOne({ where: { id: request.id, is_deleted: false, is_active: true } });

            if (testData) {

                const updateObj = {
                    course_id: request.course_id,
                    name: request.name,
                    time_limit: request.time_limit,
                    instructions: request.instructions,
                }

                await Test.update(updateObj, { where: { id: request.id } });

                const updatedTest = await Test.findOne({ where: { id: request.id } });


                if (updatedTest) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_test_data_update_success', content: {} },
                        data: updatedTest,
                    };
                }
            }


            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error
        }
    },

    //==========================Delete single Tets==============================
    deleteTest: async (request) => {
        try {
            const deleteTest = await Test.update({ is_deleted: true }, { where: { id: request.id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keywords_test_data_deleted_success', content: {} },
                data: deleteTest,
            };

        } catch (error) {
            throw error;
        }
    },

    //==========================Change status of single Test==============================
    changeTestStatus: async (request) => {
        try {
            let message = 'rest_keywords_test_data_active_status_success';

            const deleteStatus = await Test.update({ is_active: request.is_active }, { where: { id: request.id, is_deleted: false } });

            if (!request.is_active) {
                message = 'rest_keywords_test_data_blocked_status_success';
            }
            return {
                code: global.SUCCESS,
                message: { keyword: message, content: {} },
                data: deleteStatus,
            };
        } catch (error) {
            throw error
        }
    },

    // ==============================Common function of test listing=========================
    getTest: async (request) => {
        try {
            const search_query = request.search || '';
            const filter_value = request.filter || '';
            const page = (request.page !== "" && request.page !== undefined) ? request.page : 1;
            const limit = (request.limit !== "" && request.limit !== undefined) ? request.limit : 10;
            const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit }

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false,
            };

            //get user data with id
            if (request.id) {
                whereClause.id = request.id;
            }

            // where clause based on filterValue
            if (filter_value === 'deleted') {
                whereClause.is_deleted = true;
            } else if (filter_value === 'active') {
                whereClause.is_deleted = false;
                whereClause.is_active = true;
            } else if (filter_value === 'inactive') {
                whereClause.is_deleted = false;
                whereClause.is_active = false;
            }

            if (search_query) {
                whereClause[Op.or] = [
                    { name: { [Op.like]: `%${search_query}%` } },
                ];
            }


            const result = await Test.findAndCountAll({
                where: whereClause,
                attributes: {},
                include: [
                    {
                        model: Course,
                        as: 'test_course',
                        where: { is_deleted: false }
                    }
                ],
                order: _sortingParams,
                ...pagingParams_
            });

            return paginate(result, paging);
        } catch (error) {
            throw error;
        }
    },

    // ==============================Test listing=========================
    testList: async (request) => {
        try {
            const result = await Test_Model.getTest(request);

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

    //==========================Add Single Question with Answer==============================
    addQuestion: async (test_id, request) => {
        try {
            const insertObj = {
                test_id: test_id,
                question: request.question,
                answer: request.answer,
                marks_per_question: request.marks_per_question,
            };

            // Insert the question into the TestQuestion table
            const insertData = await TestQuestion.create(insertObj);

            if (insertData && insertData.id) {
                // Create options for the inserted question
                const optionPromises = request.options.map(option => {
                    return Options.create({
                        question_id: insertData.id,
                        option: option.text
                    });
                });

                await Promise.all(optionPromises);
            }

            // Calculate the new total marks
            const totalMarks = await TestQuestion.sum('marks_per_question', {
                where: { test_id: test_id }
            });

            // Calculate the total number of questions
            const totalQuestions = await TestQuestion.count({
                where: { test_id: test_id }
            });

            // Update the test table with the new total marks and total number of questions
            await Test.update(
                {
                    total_marks: totalMarks,
                    total_question: totalQuestions
                },
                { where: { id: test_id } }
            );

            return insertData;

        } catch (error) {
            throw error;
        }
    },

    //==========================Add Multiple Question with language==============================
    addSingleQuestion: async (request) => {
        try {
            const insertData = await Test_Model.addQuestion(request.test_id, request);

            if (insertData && insertData.id) {
                const updatedData = await Test_Model.getQuestion({ id: insertData.id, test_id: request.test_id })
                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_add_question_data_success', content: {} },
                    data: updatedData.data[0]
                };
            }

        } catch (error) {
            throw error;
        }
    },

    //==========================Add Multiple Question with language==============================
    addBulkQuestion: async (requests) => {
        try {

            const addedQuestion = [];
            const errors = [];

            for (const request of requests.question_data) {

                const insertData = await Test_Model.addQuestion(requests.test_id, request);

                if (insertData && insertData.id) {
                    addedQuestion.push(insertData);
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
                message: { keyword: 'rest_keyword_add_bulk_question_data_success', content: {} },
                data: { addedQuestion, errors }
            };

        } catch (error) {
            throw error;
        }
    },

    //==========================Update Lesson with video==============================
    updateQuestion: async (request) => {
        try {
            const updateObj = {
                test_id: request.test_id,
                question: request.question,
                answer: request.answer,
                marks_per_question: request.marks_per_question,
            };

            // Update the question in the TestQuestion table
            await TestQuestion.update(updateObj, { where: { id: request.id } });

            // Update the options in the Options table
            const optionPromises = request.options.map(option => {
                return Options.update(
                    { option: option.text },
                    { where: { id: option.id, question_id: request.id } }
                );
            });

            await Promise.all(optionPromises);

            // Calculate the new total marks
            const totalMarks = await TestQuestion.sum('marks_per_question', {
                where: { test_id: request.test_id }
            });

            // Calculate the total number of questions
            const totalQuestions = await TestQuestion.count({
                where: { test_id: request.test_id }
            });

            // Update the test table with the new total marks and total number of questions
            await Test.update(
                {
                    total_marks: totalMarks,
                    total_question: totalQuestions
                },
                { where: { id: request.test_id } }
            );

            // Fetch the updated data
            const updatedData = await Test_Model.getQuestion({ id: request.id, test_id: request.test_id })

            if (updatedData.data) {
                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keywords_question_data_update_success', content: {} },
                    data: updatedData.data[0],
                };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            console.error("Error in updateQuestion:", error);
            throw error;
        }
    },

    //==========================Delete single Lession==============================
    deleteQuestion: async (request) => {
        try {
            const deleteData = await TestQuestion.update({ is_deleted: true }, { where: { id: request.id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keywords_question_data_deleted_success', content: {} },
                data: deleteData,
            };

        } catch (error) {
            throw error;
        }
    },

    //==========================Delete Lession in bulk==============================
    deleteBulkQuestion: async (request) => {
        try {

            const deleteData = await TestQuestion.update(
                { is_deleted: true },
                { where: { test_id_id: request.test_id } }
            );

            if (deleteData[0] > 0) {
                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keywords_question_bulk_data_deleted_success', content: {} },
                    data: deleteData,
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
    changeQuestionStatus: async (request) => {
        try {
            let message = 'rest_keywords_question_data_active_status_success';

            const statusData = await TestQuestion.update({ is_active: request.is_active }, { where: { id: request.id, is_deleted: false } });

            if (!request.is_active) {
                message = 'rest_keywords_question_data_blocked_status_success';
            }
            return {
                code: global.SUCCESS,
                message: { keyword: message, content: {} },
                data: statusData,
            };
        } catch (error) {
            throw error
        }
    },

    getQuestion: async (request) => {
        try {
            const page = (request.page !== "" && request.page !== undefined) ? request.page : 1;
            const limit = (request.limit !== "" && request.limit !== undefined) ? request.limit : 10;
            const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit };

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false,
                test_id: request.test_id,
            };

            // Filter by id if provided
            if (request.id) {
                whereClause.id = request.id;
            }


            const result = await TestQuestion.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Options,
                        as: 'option_details'
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

    // ==============================Test question listing=========================
    testQuestionList: async (request) => {
        try {
            const result = await Test_Model.getQuestion(request);

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

    getTestAttemptedUser: async (request) => {
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
                test_id: request.test_id,
            };

            // Filter by id if provided
            if (request.id) {
                whereClause.id = request.id;
            }

            const result = await UserAttemptTest.findAndCountAll({
                where: whereClause,
                attributes: {},
                include: [
                    {
                        model: User,
                        attributes: {
                            exclude: ['password', 'social_id']
                        },
                        as: "attempted_user",
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

    testAttemptedUserList: async (request) => {
        try {
            const result = await Test_Model.getTestAttemptedUser(request);

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
    }

}

module.exports = Test_Model