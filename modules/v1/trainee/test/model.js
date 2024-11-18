const { Sequelize, Op } = require("sequelize");
const path = require('path');
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
const Test = require("../../../../models/tbl_test");
const TestQuestion = require("../../../../models/tbl_question");
const UserAttemptTest = require("../../../../models/tbl_user_attempt_test");
const Options = require("../../../../models/tbl_option");
const UserAttemptedTestDetails = require("../../../../models/tbl_user_attempted_test_detail");
const s3_client = require("../../s3_client/model");



const Test_Model = {

    getTestList: async (request) => {
        try {
            console.log(request, "test request");


            const attemptedTests = await UserAttemptTest.findAll({
                where: {
                    user_id: request._id,
                    course_id: request.course_id
                },
                attributes: ['test_id']
            });

            const attemptedTestIds = attemptedTests.map(attempt => attempt.test_id);

            console.log(attemptedTestIds, "atempt test id");



            const whereClause = {
                is_deleted: false,
                is_active: true,
                course_id: request.course_id,
                id: {
                    [Op.notIn]: attemptedTestIds
                }
            };

            const result = await Test.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: TestQuestion,
                        as: 'test_questions',
                        include: [
                            {
                                model: Options,
                                as: 'option_details'
                            }
                        ]
                    }
                ],
            });

            console.log(result.rows, "test response");

            return result;
        } catch (error) {
            throw error;
        }
    },


    // ==============================Random Test listing=========================
    randomTestList: async (request) => {
        try {
            const result = await Test_Model.getTestList(request);

            if (result.rows.length > 0) {

                // Generate a random index
                const randomIndex = Math.floor(Math.random() * result.rows.length);
                // console.log(randomIndex);
                const randomTest = result.rows[randomIndex];

                // Function to shuffle an array
                const shuffleArray = (array) => {
                    for (let i = array.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [array[i], array[j]] = [array[j], array[i]];
                    }

                    return array;
                };

                // Shuffle the test_questions array
                randomTest.test_questions = shuffleArray(randomTest.test_questions);

                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_data_success', content: {} },
                    data: randomTest,
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

    // addUserAttemptedTest: async (request) => {
    //     try {
    //         const insertObj = {
    //             user_id: request._id,
    //             course_id: request.course_id,
    //             test_id: request.test_id,
    //             // answers: request.answers,
    //             total_question_skip: request.total_question_skip,
    //             total_question_attempt: request.total_question_attempt,
    //             correct_answer: request.correct_answer,
    //             wrong_answer: request.wrong_answer,
    //             is_completed: true
    //         }

    //         const result = await UserAttemptTest.create(insertObj);

    //         if (result && result.id) {
    //             // const detailsPromises = request.answers.map(answer => {
    //             //     return UserTestDetails.create({
    //             //         user_attempt_test_id: result.id,
    //             //         question_id: answer.question_id,
    //             //         option_id: answer.option_id
    //             //     }, { transaction });
    //             // });

    //             await Promise.all(detailsPromises);
    //             await UserCourse.update(
    //                 {
    //                     certificate: request.certificate,
    //                     is_test_completed: true
    //                 },
    //                 {
    //                     where: {
    //                         user_id: request._id,
    //                         course_id: request.course_id
    //                     }
    //                 })
    //             return {
    //                 code: global.SUCCESS,
    //                 message: { keyword: 'rest_keyword_test_submit_data_success', content: {} },
    //                 data: result,
    //             };
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    addUserAttemptedTest: async (request) => {
        try {
            // Fetch all questions and their options for the given test_id
            const testQuestions = await TestQuestion.findAll({
                where: { test_id: request.test_id },
                include: [
                    {
                        model: Options,
                        as: 'option_details'
                    }
                ]
            });

            // Initialize counters for correct and wrong answers
            let correctAnswersCount = 0;
            let wrongAnswersCount = 0;
            let skipQuestionCount = 0;
            let attemptedQuestionsCount = 0;

            // Iterate over the user's test data array
            for (const userAnswer of request.user_test_data) {
                // Find the corresponding question in the fetched test questions
                const question = testQuestions.find(q => q.id === userAnswer.question_id);

                // Check if the question exists
                if (question) {
                    // Determine if the question was skipped
                    const isSkipped = userAnswer.option_id === 0;

                    // Update counters based on whether the question was skipped
                    let isCorrect = false;
                    if (!isSkipped) {
                        attemptedQuestionsCount++;

                        // Find the correct option for the question
                        const correctOption = question.option_details.find(option => option.option === question.answer);

                        // Check if the user's option matches the correct option
                        if (correctOption && correctOption.id === userAnswer.option_id) {
                            correctAnswersCount++;
                            isCorrect = true;
                        } else {
                            wrongAnswersCount++;
                        }
                    } else {
                        skipQuestionCount++;
                    }


                    // Insert the user's test data into the userTestDetails table
                    await UserAttemptedTestDetails.create({
                        user_id: request._id,
                        test_id: request.test_id,
                        question_id: userAnswer.question_id,
                        option_id: isSkipped ? null : userAnswer.option_id,
                        is_correct: isCorrect
                    });
                }
            }

            const result = await UserAttemptTest.create({
                user_id: request._id,
                course_id: request.course_id,
                test_id: request.test_id,
                total_question_skip: skipQuestionCount,
                total_question_attempt: attemptedQuestionsCount,
                correct_answer: correctAnswersCount,
                wrong_answer: wrongAnswersCount,
                is_completed: true
            });

            if (result && result.id) {
                await UserCourse.update(
                    {
                        is_test_completed: true,
                        certificate: await Test_Model.pdfGenerate({ test_id: request.test_id, _id: request._id })
                    },
                    {
                        where: {
                            user_id: request._id,
                            course_id: request.course_id
                        }
                    })

                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_test_submit_data_success', content: {} },
                    data: result
                };
            }

            // Return the error
            return {
                code: global.OPRETION_FAILD,
                message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} },
                data: {}
            };
        } catch (error) {
            throw error;
        }
    },

    //========================get attempt test details================================
    getAttemptTestList: async (request) => {
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
            };

            // if (request.course_id) {
            //     whereClause.course_id = request.course_id;
            // }


            const result = await UserAttemptTest.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: Course,
                        as: 'attempted_Course',
                        include: [
                            {
                                model: Category,
                                as: 'course_category'
                            },
                            {
                                model: UserCourse,
                                as: 'user_course',
                                where: {
                                    user_id: request._id
                                }
                            }
                        ]
                    },
                    {
                        model: Test,
                        as: 'test_details'
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

    getAttemptedTestDetails: async (request) => {
        try {
            console.log(request, "request data for attempt test");

            const result = await Test_Model.getAttemptTestList(request);

            if (result.data.length > 0) {
                if (request.test_id) {
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

    // getAttemptedTestDetails: async (request) => {
    //     try {
    //         const result = await UserAttemptTest.findOne({
    //             where: {
    //                 user_id: request._id,
    //                 test_id: request.test_id
    //             }
    //         });

    //         if (result) {
    //             return {
    //                 code: global.SUCCESS,
    //                 message: { keyword: 'rest_keyword_data_success', content: {} },
    //                 data: result,
    //             };
    //         } else {
    //             return {
    //                 code: global.NO_DATA_FOUND,
    //                 message: { keyword: 'rest_keyword_no_data', content: {} },
    //                 data: {},
    //             };
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // },

    downloadCertificate: async (request) => {
        try {
            console.log(request._id);
            const whereClause = {
                user_id: request._id,
                course_id: request.course_id,
                is_test_completed: true
            }

            const courseWhereClause = {
                is_deleted: false,
                is_active: true,
            }

            const result = await UserCourse.findOne({
                where: whereClause,
                include: [
                    {
                        model: Course,
                        required: true,
                        as: 'user_course',
                        where: courseWhereClause,
                    }
                ]
            });

            if (result) {
                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_test_cerificate_download_success', content: {} },
                    data: result,
                };
            }

            return {
                code: global.NO_DATA_FOUND,
                message: { keyword: 'rest_keyword_no_test_attempt', content: {} },
                data: {},
            };
        } catch (error) {
            throw error;
        }
    },

    userAttemptedTestCount: async (request) => {
        try {
            const userTestCount = await UserAttemptTest.count({ where: { user_id: request._id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keyword_data_success', content: {} },
                data: userTestCount,
            };
        } catch (error) {
            throw error;
        }
    },

    pdfGenerate: async (request) => {
        try {
            const htmlContent = await email_template.testCertificateHTML();

            // if (!htmlContent) {
            //     return {
            //         code: global.OPRETION_FAILD,
            //         message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} },
            //         data: {},
            //     };
            // }

            console.log(htmlContent, "html content");

            // Generate PDF and upload directly to S3
            const fileName = `test_${request.test_id}_${request._id}.pdf`;
            const s3FileName = await s3_client.generatePDFAndUpload(htmlContent, fileName);

            console.log(s3FileName, "PDF generated and uploaded");

            // return {
            //     code: global.SUCCESS,
            //     message: { keyword: 'rest_keyword_data_success', content: {} },
            //     data: s3FileName,
            // };

            return s3FileName;

        } catch (error) {
            throw error
        }
    },


}

module.exports = Test_Model