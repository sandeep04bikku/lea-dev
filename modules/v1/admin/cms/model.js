const { Sequelize, Op } = require("sequelize");
const common = require("../../../../config/common");
const sequelize = require("../../../../models");
const moment = require("moment");
const _ = require('lodash');
const global = require("../../../../config/constants");
const { sortingParams, pagingParams, paginate } = require("../../../../helper/helper");
const CMS = require("../../../../models/tbl_cms");
const FAQ = require("../../../../models/tbl_cms_faq");
const ContactUs = require("../../../../models/tbl_cms_contact_us");



const CMS_Model = {

    //==========================Add CMS==============================
    addUpdateCMS: async (request) => {
        try {
            const existingCms = await CMS.findOne({ where: { tag_name: request.tag_name } });

            if (existingCms) {
                await CMS.update(
                    {
                        title: request.title,
                        content: request.content,
                        is_deleted: false
                    },
                    {
                        where: { id: existingCms.id }
                    })

                const cmsData = await CMS.findByPk(existingCms.id)

                if (cmsData) {

                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_update_cms_data_success', content: {} }, data: cmsData };
                }

            } else {
                const insertData = await CMS.create({
                    tag_name: request.tag_name,
                    title: request.title,
                    content: request.content
                })

                if (insertData && insertData.id) {
                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_add_cms_data_success', content: {} }, data: insertData };

                }
            }

        } catch (error) {
            console.error('add/update cms error:', error.message, error.stack);
            throw new Error('add/update cms error.');
        }
    },

    //==========================CMS List==============================
    cmsList: async (request) => {
        try {
            
            const result = await CMS.findAll({
                where: { is_deleted: false }
            });

            console.log(result);
            

            if (result.length > 0) {
                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_data_success', content: {} },
                    data: result,
                };
            }

            return {
                code: global.NO_DATA_FOUND,
                message: { keyword: 'rest_keyword_no_data', content: {} },
                data: result,
            };

        } catch (error) {
            console.error('cms list error:', error.message, error.stack);
            throw new Error('cms list error.');
        }
    },


    //==========================Delete CMS==============================
    deleteCms: async (request) => {
        try {
            // Construct the dynamic where clause
            const whereClause = request.id ? { id: request.id } : {};

            // Perform the update operation
            const result = await CMS.update(
                { is_deleted: true },
                { where: whereClause }
            );

            // Determine the message based on whether an ID was provided
            const message = request.id
                ? { keyword: 'rest_keywords_cms_data_deleted_success', content: {} }
                : { keyword: 'rest_keywords_cms_all_data_deleted_success', content: {} };

            return {
                code: global.SUCCESS,
                message,
                data: result
            };

        } catch (error) {
            console.error('delete cms error:', error.message, error.stack);
            throw new Error('delete cms error.');
        }
    },

    //==========================add/update faq==============================
    addUpdateFAQ: async (request) => {
        try {
            if (request.id) {
                await FAQ.update(
                    {
                        question: request.question,
                        answer: request.answer
                    },
                    {
                        where: { id: request.id }
                    })

                const updatedData = await FAQ.findByPk(request.id);

                if (updatedData) {
                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_update_cms_faq_data_success', content: {} }, data: updatedData };
                }
            } else {
                const insertData = await FAQ.create({
                    question: request.question,
                    answer: request.answer
                })

                if (insertData && insertData.id) {
                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_add_cms_faq_data_success', content: {} }, data: insertData };
                }
            }
        } catch (error) {
            console.error('add/update faq error:', error.message, error.stack);
            throw new Error('add/update faq error.');
        }
    },

    //==========================get FAQ details==============================
    getFaq: async (request) => {
        try {
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

            // Get FAQ data with id
            if (request.id) {
                whereClause.id = request.id;
            }

            // Fetch data from FAQ model
            const result = await FAQ.findAndCountAll({
                where: whereClause,
                order: _sortingParams,
                ...pagingParams_
            });

            return paginate(result, paging);
        } catch (error) {
            console.error('get faq error:', error.message, error.stack);
            throw new Error('get faq error.');
        }
    },

    //==========================get FAQ List==============================
    faqList: async (request) => {
        try {
            const result = await CMS_Model.getFaq(request);

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
            console.error('faq list error:', error.message, error.stack);
            throw new Error('faq list error.');
        }
    },

     //==========================get Contact us details==============================
     getContactUs: async (request) => {
        try {
            const page = (request.page !== "" && request.page !== undefined) ? request.page : 1;
            const limit = (request.limit !== "" && request.limit !== undefined) ? request.limit : 10;
            const sort = (request.sort !== "" && request.sort !== undefined) ? request.sort : 'id:desc';

            const paging = { page: page, limit: limit }

            const _sortingParams = !_.isEmpty(sort) ? sortingParams(sort) : null;
            const pagingParams_ = pagingParams(paging);

            const whereClause = {
                is_deleted: false, // Default condition
            };

            // Get FAQ data with id
            if (request.id) {
                whereClause.id = request.id;
            }

            // Fetch data from FAQ model
            const result = await ContactUs.findAndCountAll({
                where: whereClause,
                order: _sortingParams,
                ...pagingParams_
            });

            return paginate(result, paging);
        } catch (error) {
            console.error('get contact us error:', error.message, error.stack);
            throw new Error('get contact us error.');
        }
    },

    //==========================get Contact us List==============================
    contactUsList: async (request) => {
        try {
            const result = await CMS_Model.getContactUs(request);

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
            console.error('contact list error:', error.message, error.stack);
            throw new Error('contact list error.');
        }
    },

  
}

module.exports = CMS_Model