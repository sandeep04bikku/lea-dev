const { Sequelize, Op } = require("sequelize");
const { t } = require("localizify");
const sequelize = require("../../../../models");
const moment = require("moment");
const _ = require('lodash');
const global = require("../../../../config/constants");
const { sortingParams, pagingParams, paginate } = require("../../../../helper/helper");
const CorporateProfile = require("../../../../models/tbl_corporate_profile");
const Course = require("../../../../models/tbl_course");
const CorporateProfileCourse = require("../../../../models/tbl_corporate_profile_course");
const UserCourse = require("../../../../models/tbl_user_course");


const Corporate_Profile_Model = {

    //check unique email
    checkEmail: async (email) => {
        try {
            const admin = await CorporateProfile.findOne({ where: { email } });

            return admin !== null;
        } catch (error) {
            console.error('corporate profile:- ', 'check unique email:', error.message, error.stack);
            throw new Error('check unique email error.');
        }
    },

    //check unique mobile number
    checkMobile: async (phone_number, country_code) => {
        try {
            const admin = await CorporateProfile.findOne({ where: { phone_number, country_code } });

            return admin !== null
        } catch (error) {
            console.error('corporate profile:- ', 'check unique phone number:', error.message, error.stack);
            throw new Error('check unique phone number error.');
        }
    },

    //==========================add Corporate profile==============================
    addCorporateProfile: async (request) => {
        try {

            const insertObj = {
                full_name: request.full_name,
                email: request.email,
                country_code: request.country_code,
                phone_number: request.phone_number,
                image: request.image,
            }

            if (await Corporate_Profile_Model.checkEmail(request.email)) {

                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_error', content: {} }, data: [] };
            }

            if (await Corporate_Profile_Model.checkMobile(request.phone_number, request.country_code)) {

                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_mobile_error', content: {} }, data: [] };
            }

            const insertData = await CorporateProfile.create(insertObj);

            if (insertData && insertData.id) {
                const insertCourse = await CorporateProfileCourse.create({
                    corporate_profile_id: insertData.id,
                    course_id: request.course_id,
                    price: request.price

                })
                if (insertCourse && insertCourse.id) {
                    const result = await Corporate_Profile_Model.getCorporateProfile({ id: insertData.id })

                    if (result) {
                        return { code: global.SUCCESS, message: { keyword: 'rest_keyword_add_corporate_profile_data_success', content: {} }, data: result };

                    }
                }
            }



        } catch (error) {
            console.error('corporate profile:- ','add corporate profile:', error.message, error.stack);
            throw new Error('add corporate profile error.');
        }
    },

    //==========================Delete Corporate profile==============================
    deleteCorporateProfile: async (request) => {
        try {
            const deleteProfile = await CorporateProfile.update({ is_deleted: true }, { where: { id: request.id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keyword_delete_corporate_profile_data_success', content: {} },
                data: { deleteProfile, id: request.id },
            };

        } catch (error) {
            console.error('corporate profile:- ','delete corporate profile:', error.message, error.stack);
            throw new Error('delete corporate profile error.');
        }
    },

    //==========================Change status of corporate profile active/blocked==============================
    changeCorporateProfileStatus: async (request) => {
        try {
            let message = 'rest_keywords_corporate_profile_data_active_status_success';

            const profileStatus = await CorporateProfile.update({ is_active: request.is_active }, { where: { id: request.id, is_deleted: false } });

            if (!request.is_active) {
                message = 'rest_keywords_corporate_profile_data_blocked_status_success';
            }
            return {
                code: global.SUCCESS,
                message: { keyword: message, content: {} },
                data: { profileStatus, id: request.id },
            };
        } catch (error) {
            console.error('corporate profile:- ','change corporate profile status:', error.message, error.stack);
            throw new Error('change corporate profile status error.');
        }
    },

    //==========================get corporate profile details==============================
    getCorporateProfile: async (request) => {
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
                whereClause.full_name = { [Op.like]: `%${search_query}%` };
            }

            const result = await CorporateProfile.findAndCountAll({
                where: whereClause,
                attributes: {},
                include: [
                    {
                        model: CorporateProfileCourse,
                        as: 'corporate_profile_course',
                        include: [
                            {
                                model: Course,
                                as: 'course_selection'
                            }
                        ]
                    }
                ],
                order: _sortingParams,
                ...pagingParams_
            });

            return paginate(result, paging);
        } catch (error) {
            console.error('corporate profile:- ','get corporate profile:', error.message, error.stack);
            throw new Error('get corporate profile error.');
        }
    },

    //==========================get corporate profile List==============================
    corporateProfileList: async (request) => {
        try {
            const result = await Corporate_Profile_Model.getCorporateProfile(request);

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
            console.error('corporate profile:- ','corporate profile list:', error.message, error.stack);
            throw new Error('corporate profile list error.');
        }
    },

    assignCourseToUser: async (request) => {
        try {

            const existingCourse = await UserCourse.findOne({ where: { user_id: request.user_id, course_id: request.course_id } });

            if (!existingCourse) {
                const insertData = await UserCourse.create({
                    user_id: request.user_id,
                    course_id: request.course_id,
                    purchage_date: moment().utc().format('YYYY-MM-DD HH:mm:ss')
                })

                if (insertData && insertData.id) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_assign_course_to_user_success', content: {} },
                        data: insertData,
                    };
                }
            } else {
                return {
                    code: global.OPRETION_FAILD,
                    message: { keyword: 'rest_keywords_assign_course_to_user_exist_error', content: {} },
                    data: {},
                };
            }

        } catch (error) {
            console.error('corporate profile:- ','assign course to user:', error.message, error.stack);
            throw new Error('assign course to user error.');
        }
    }

}

module.exports = Corporate_Profile_Model