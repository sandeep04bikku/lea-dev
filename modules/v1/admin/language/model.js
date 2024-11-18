const { Sequelize, Op } = require("sequelize");
const { t } = require("localizify");
const common = require("../../../../config/common");
const sequelize = require("../../../../models");
const moment = require("moment");
const _ = require('lodash');
const email_template = require("../../../../config/template")
const enc_dec = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");
const { sortingParams, pagingParams, paginate } = require("../../../../helper/helper");
const Language = require("../../../../models/tbl_language");



const Language_Model = {

    //=========================check unique language by name==================================
    checkLanguage: async (name) => {
        try {
            const language = await Language.findOne({ where: { name } });
            if (language) {
                return true;
            }

            return false;
        } catch (error) {

            throw error;
        }
    },

    //==========================add language==============================
    addlanguage: async (request) => {
        try {

            const isExist = await Language_Model.checkLanguage(request.name);

            if (!isExist) {

                const insertData = await Language.create({
                    name: request.name,
                    code: request.code,
                    native_name: (request.native_name !== "" && request.native_name !== undefined) ? request.native_name : null,
                })

                if (insertData) {
                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_add_language_data_success', content: {} }, data: insertData };
                }

            } else {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_existing_language_error', content: {} }, data: [] };
            }

        } catch (error) {
            throw error
        }
    },

    //==========================update Language==============================
    updateLanguage: async (request) => {
        try {
            const languageData = await Language.findOne({ where: { id: request.id, is_deleted: false, is_active: true } });


            if (languageData) {

                const updateObj = {
                    name: request.name,
                    code: request.code,
                    native_name: (request.native_name !== "" && request.native_name !== undefined) ? request.native_name : languageData.native_name,
                }

                if (await Language_Model.checkLanguage(request.name)) {
                    if (languageData.name === request.name) {
                        updateObj.name = languageData.name;
                    } else {
                        return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_existing_language_error', content: {} }, data: [] };
                    }
                }



                await Language.update(updateObj, { where: { id: request.id } });

                const result = await Language_Model.getLanguage({ id: request.id });

                if (result.data) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_language_data_update_success', content: {} },
                        data: result.data[0],
                    };
                }
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error
        }
    },

    //==========================Delete Language==============================
    deleteLanguage: async (request) => {
        try {
            const deleteLanguage = await Language.update({ is_deleted: true }, { where: { id: request.id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keywords_language_data_deleted_success', content: {} },
                data: { deleteLanguage, id: request.id },
            };

        } catch (error) {
            throw error;
        }
    },

    //==========================Change status of language active/blocked==============================
    changelanguageStatus: async (request) => {
        try {
            let message = 'rest_keywords_language_data_active_status_success';

            const languageStatus = await Language.update({ is_active: request.is_active }, { where: { id: request.id, is_deleted: false } });

            if (!request.is_active) {
                message = 'rest_keywords_language_data_blocked_status_success';
            }
            return {
                code: global.SUCCESS,
                message: { keyword: message, content: {} },
                data: { languageStatus, id: request.id },
            };
        } catch (error) {
            throw error
        }
    },

    //==========================get Language details==============================
    getLanguage: async (request) => {
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

            // Get Category data with id
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
            const result = await Language.findAndCountAll({
                where: whereClause,
                attributes: {}, // Specify attributes if needed
                order: _sortingParams,
                ...pagingParams_
            });

            return paginate(result, paging);
        } catch (error) {
            throw error; // Handle the error as per your application's needs
        }
    },

    //==========================get language List==============================
    languageList: async (request) => {
        try {
            const result = await Language_Model.getLanguage(request);

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

module.exports = Language_Model