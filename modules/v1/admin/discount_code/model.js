const { Sequelize, Op, fn } = require("sequelize");
const { t } = require("localizify");
const common = require("../../../../config/common");
const sequelize = require("../../../../models");
const moment = require("moment");
const _ = require('lodash');
const enc_dec = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");
const { sortingParams, pagingParams, paginate } = require("../../../../helper/helper");
const DiscountCode = require("../../../../models/tbl_discount_code");
const Course = require("../../../../models/tbl_course");
const UserCourse = require("../../../../models/tbl_user_course");
const User = require("../../../../models/tbl_user");



const Discount_Code_Model = {
    //==========================check unique discount code==============================

    checkUniqueCode: async (code) => {
        try {
            const existingDiscountCode = await DiscountCode.findOne({
                where: {
                    code: {
                        [Op.eq]: fn('BINARY', code) // Enforce case-sensitive comparison using BINARY
                    }
                }
            });
    
            return !!existingDiscountCode; 
        } catch (error) {
            throw error
        }
    },

    //==========================add discount code==============================
    addDiscountCode: async (request) => {
        try {

            if (!await Discount_Code_Model.checkUniqueCode(request.code)) {
                const insertObj = {
                    course_id: (request.course_id !== "" && request.course_id !== undefined) ? request.course_id : 0,
                    name: request.name,
                    code: request.code,
                    percentage: request.percentage,
                    description: request.description,
                    start_date: request.start_date,
                    expiry_date: request.expiry_date
                }

                const discountData = await DiscountCode.create(insertObj);

                if (discountData) {
                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_add_discount_code_data_success', content: {} }, data: discountData };
                }
            } else {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_add_discount_code_exist_error', content: {} }, data: {} };

            }



        } catch (error) {
            throw error
        }
    },

    //==========================update discount code==============================
    updateDiscountCode: async (request) => {
        try {
            const discountCodeData = await DiscountCode.findOne({ where: { id: request.id, is_deleted: false, is_active: true } });

            const updateObj = {
                course_id: (request.course_id !== "" && request.course_id !== undefined) ? request.course_id : 0,
                name: request.name,
                code: request.code,
                percentage: request.percentage,
                description: request.description,
                start_date: request.start_date,
                expiry_date: request.expiry_date
            }

            if (discountCodeData) {

                if (await Discount_Code_Model.checkUniqueCode(request.code)) {
                    if (discountCodeData.code === request.code) {
                        updateObj.code = discountCodeData.code
                    } else {
                        return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_add_discount_code_exist_error', content: {} }, data: {} };
                    }
                }


                await DiscountCode.update(updateObj, { where: { id: request.id } });


                const result = await Discount_Code_Model.getDiscountCode({ id: request.id });

                if (result.data) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_discount_code_data_update_success', content: {} },
                        data: result.data[0],
                    };
                }
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error
        }
    },

    //==========================Delete discount code==============================
    deleteDiscountCode: async (request) => {
        try {
            const deleteDiscountCode = await DiscountCode.update({ is_deleted: true }, { where: { id: request.id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keywords_discount_code_data_deleted_success', content: {} },
                data: { deleteDiscountCode, id: request.id },
            };

        } catch (error) {
            throw error;
        }
    },

    //==========================Change status of Discount Code active/blocked==============================
    changeDiscountCoderStatus: async (request) => {
        try {
            let message = 'rest_keywords_discount_code_data_active_status_success';

            const categoryStatus = await DiscountCode.update({ is_active: request.is_active }, { where: { id: request.id, is_deleted: false } });

            if (!request.is_active) {
                message = 'rest_keywords_discount_code_data_blocked_status_success';
            }
            return {
                code: global.SUCCESS,
                message: { keyword: message, content: {} },
                data: { categoryStatus, id: request.id },
            };
        } catch (error) {
            throw error
        }
    },

    //==========================get Discount code details==============================
    getDiscountCode: async (request) => {
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
                is_deleted: false, // Default condition
            };

            if (request.role === 'user') {
                whereClause.is_active = true;
            }

            // Get discount data with id
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
                whereClause.name = { [Op.like]: `%${search_query}%` };
            }

            // Fetch data from Category model
            const result = await DiscountCode.findAndCountAll({
                where: whereClause,
                attributes: {}, // Specify attributes if needed
                include: [
                    {
                        model: Course,
                        as: 'discount_course'
                    }
                ],
                order: _sortingParams,
                ...pagingParams_
            });

            return paginate(result, paging);
        } catch (error) {
            throw error; // Handle the error as per your application's needs
        }
    },

    //==========================get category List==============================
    discountCodeList: async (request) => {
        try {
            const result = await Discount_Code_Model.getDiscountCode(request);

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

    getDiscountUsage: async (request) => {
        try {

            const page = (request.page !== "" && request.page !== undefined) ? request.page : 1;
            const limit = (request.limit !== "" && request.limit !== undefined) ? request.limit : 10;
            const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit }

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false, // Default condition
                discount_code_id: request.discount_code_id
            };


            // Fetch data from Category model
            const result = await UserCourse.findAndCountAll({
                where: whereClause,
                attributes: {},
                include: [
                    {
                        model: User,
                        attributes: {
                            exclude: ['password', 'social_id']
                        },
                        as: 'enroll_user'
                    }
                ],
                order: _sortingParams,
                ...pagingParams_
            });

            return paginate(result, paging);
        } catch (error) {
            throw error; // Handle the error as per your application's needs
        }
    },

    //==========================get discount usage by trainee==============================
    discountUsageList: async (request) => {
        try {
            const result = await Discount_Code_Model.getDiscountUsage(request);

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

}

module.exports = Discount_Code_Model