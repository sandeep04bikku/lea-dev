const { Sequelize, Op } = require("sequelize");
const { t } = require("localizify");
const common = require("../../../../config/common");
const sequelize = require("../../../../models");
const moment = require("moment");
const _ = require('lodash');
const email_template = require("../../../../config/template")
const enc_dec = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants")
const User = require("../../../../models/tbl_user");
const DeviceInfo = require("../../../../models/tbl_device_info");
const { sortingParams, pagingParams, paginate } = require("../../../../helper/helper");
const Country = require("../../../../models/tbl_country");
const Language = require("../../../../models/tbl_language");
const City = require("../../../../models/tbl_city");


const User_Model = {

    //==================check unique email=================================
    checkEmail: async (email) => {
        try {
            const user = await User.findOne({ where: { email } });
            if (user) {
                return true;
            } else {
                return false
            }

        } catch (error) {
            // console.error('Error retrieving user by email:', error);
            throw error;
        }
    },

    //=============================check unique mobile number=====================================
    checkMobile: async (phone_number, country_code) => {
        try {
            const user = await User.findOne({ where: { phone_number, country_code } });
            if (user) {
                return true;
            } else {
                return false
            }

        } catch (error) {
            throw error;
        }
    },

    //==========================common function to add single user==============================
    addSingleUser: async (request) => {
        try {
            const userObj = {
                login_type: 'S',
                corporate_profile_id: request.corporate_profile_id,
                full_name: request.full_name,
                email: request.email,
                country_code: request.country_code,
                phone_number: request.phone_number,
                password: await enc_dec.encryptPlain(request.password),
                country_id: (request.country_id !== "" && request.country_id !== undefined) ? request.country_id : null,
                city_id: (request.city_id !== "" && request.city_id !== undefined) ? request.city_id : null,
                image: (request.image !== "" && request.image !== undefined) ? request.image : null,
                dob: (request.dob !== "" && request.dob !== undefined) ? request.dob : null,
                government_certificate: (request.government_certificate !== "" && request.government_certificate !== undefined) ? request.government_certificate : null,
                security_question: (request.security_question !== "" && request.security_question !== undefined) ? request.security_question : null,
                security_answer: (request.security_answer !== "" && request.security_answer !== undefined) ? request.security_answer : null,
                organization: (request.organization !== "" && request.organization !== undefined) ? request.organization : null,
                experience: (request.experience !== "" && request.experience !== undefined) ? request.experience : null,
                is_term_condition: true,
                role: 'user',
                step: 1,
                is_temp_password: true
            }

            const userData = await User.create(userObj);

            if (userData && userData.id) {

                const template = await email_template.userLoginCredential(userData.country_code + userData.phone_number, request.password);
                const isSend = await common.sendEmail("Login Credential", userData.email, template);
                if (isSend) {
                    // Fetch the trainer data again to exclude the password field
                    const createdUser = await User.findByPk(userData.id, {
                        attributes: { exclude: ['password'] }
                    });

                    return createdUser;
                }

            }

            return;

        } catch (error) {
            throw error;
        }
    },

    //==========================add single user==============================
    addUser: async (request) => {
        try {
            const isEmailExisting = await User_Model.checkEmail(request.email);
            const isMobleExisting = await User_Model.checkMobile(request.phone_number, request.country_code,)

            if (!isEmailExisting) {
                if (!isMobleExisting) {

                    const userData = await User_Model.addSingleUser(request);

                    if (userData) {
                        return { code: global.SUCCESS, message: { keyword: 'rest_keyword_add_user_data_success', content: {} }, data: userData };
                    }

                } else {
                    return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_mobile_error', content: {} }, data: [] };
                }
            } else {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_error', content: {} }, data: [] };
            }

        } catch (error) {
            throw error
        }
    },

    //==========================add Bulk users==============================
    addBulkUsers: async (requests) => {
        try {
            // console.log(requests);
            const successfulInsertions = [];
            const errors = [];

            for (const request of requests.users_data) {
                const isEmailExisting = await User_Model.checkEmail(request.email);
                const isMobileExisting = await User_Model.checkMobile(request.phone_number, request.country_code);

                if (!isEmailExisting && !isMobileExisting) {
                    request.corporate_profile_id = requests.corporate_profile_id;
                    const userData = await User_Model.addSingleUser(request);
                    if (userData) {
                        successfulInsertions.push(userData);
                    }
                } else {
                    if (isEmailExisting) {
                        errors.push({ request, error: t('rest_keywords_unique_email_error') });
                    }
                    if (isMobileExisting) {
                        errors.push({ request, error: t('rest_keywords_unique_mobile_error') });
                    }
                }

            }

            if (successfulInsertions.length > 0) {
                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_add_user_data_success', content: {} },
                    data: { successfulInsertions, errors },
                    // errors: errors
                };
            } else {
                return {
                    code: global.OPRETION_FAILD,
                    message: { keyword: 'rest_keywords_no_valid_data', content: {} },
                    data: errors,
                    // errors: errors
                };
            }
        } catch (error) {
            throw error;
        }
    },

    //==========================update single user==============================
    updateUser: async (request) => {
        try {
            const userData = await User.findOne({ where: { id: request.id, is_deleted: false, is_active: true } });

            if (userData) {

                const updateObj = {
                    email: request.email,
                    country_code: request.country_code,
                    phone_number: request.phone_number,
                    country_id: (request.country_id !== "" && request.country_id !== undefined) ? request.country_id : userData.country_id,
                    city_id: (request.city_id !== "" && request.city_id !== undefined) ? request.city_id : userData.city_id,
                    full_name: request.full_name,
                    dob: (request.dob !== "" && request.dob !== undefined) ? request.dob : userData.dob,
                    security_question: (request.security_question !== "" && request.security_question !== undefined) ? request.security_question : userData.security_question,
                    security_answer: (request.security_answer !== "" && request.security_answer !== undefined) ? request.security_answer : userData.security_answer,
                    organization: (request.organization !== "" && request.organization !== undefined) ? request.organization : userData.organization,
                    experience: (request.experience !== "" && request.experience !== undefined) ? request.experience : userData.experience
                }

                if (request.image !== "" && request.image !== undefined) {
                    updateObj.image = request.image
                }

                if (request.government_certificate !== "" && request.government_certificate !== undefined) {
                    updateObj.government_certificate = request.government_certificate
                }

                if (await User_Model.checkEmail(request.email)) {

                    if (request.email === userData.email) {

                        updateObj.email = userData.email;
                    } else {
                        return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_error', content: {} }, data: [] };
                    }
                }

                if (await User_Model.checkMobile(request.phone_number, request.country_code)) {

                    if (request.country_code === userData.country_code && request.phone_number === userData.phone_number) {

                        updateObj.country_code = userData.country_code;
                        updateObj.phone_number = userData.phone_number;
                    } else {
                        return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_mobile_error', content: {} }, data: [] };
                    }
                }

                // console.log(updateObj);
                await User.update(updateObj, { where: { id: request.id, is_deleted: false, is_active: true } });

                const result = await User_Model.getUser({ id: request.id });

                // console.log(rows);

                if (result.data.length > 0) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_user_data_update_success', content: {} },
                        data: result.data[0],
                    };
                }
            }


            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error
        }
    },

    //==========================Delete single user==============================
    deleteUser: async (request) => {
        try {
            const deleteUser = await User.update({ is_deleted: true }, { where: { id: request.id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keywords_user_data_deleted_success', content: {} },
                data: {deleteUser,id:request.id},
            };

        } catch (error) {
            throw error;
        }
    },

    //==========================Change status of single user==============================
    changeUserStatus: async (request) => {
        try {
            let message = 'rest_keywords_user_data_active_status_success';

            const userStatus = await User.update({ is_active: request.is_active }, { where: { id: request.id, is_deleted: false } });

            if (!request.is_active) {
                message = 'rest_keywords_user_data_blocked_status_success';
            }
            return {
                code: global.SUCCESS,
                message: { keyword: message, content: userStatus },
                data: {userStatus,id:request.id},
            };
        } catch (error) {
            throw error
        }
    },

    getUser: async (request) => {
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

            if (request.corporate_profile_id) {
                whereClause.corporate_profile_id = request.corporate_profile_id;
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
                    { email: { [Op.like]: `%${search_query}%` } },
                    { full_name: { [Op.like]: `%${search_query}%` } },
                    sequelize.literal(`CONCAT(country_code, phone_number) LIKE '%${search_query}%'`)
                ];
            }


            const result = await User.findAndCountAll({
                where: whereClause,
                attributes: {
                    exclude: ['password', 'social_id'],
                },
                include: [
                    {
                        model: DeviceInfo,
                        required: false,
                        attributes: {
                            exclude: ['token', 'device_token']
                        },
                        as: 'user_device_info',
                        where: {
                            role: 'user'
                        }
                    },
                    {
                        model:Language,
                        as:'user_language'
                    },
                    {
                        model:Country,
                        as:'user_country'
                    },
                    {
                        model:City,
                        as:'user_city'
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

    userList: async (request) => {
        try {
            const result = await User_Model.getUser(request);

            // console.log(result.data);
            result.url = "https://lea-training.s3.amazonaws.com/user_profile_image/"
            

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

module.exports = User_Model