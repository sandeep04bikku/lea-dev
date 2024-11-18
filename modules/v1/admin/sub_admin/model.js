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
const Admin = require("../../../../models/tbl_admin");
const DeviceInfo = require("../../../../models/tbl_device_info");
const PermissionModules = require("../../../../models/tbl_permission_module");
const SubadminPermissions = require("../../../../models/tbl_subadmin_permission");



const Sub_Admin_Model = {


    //check unique email
    checkEmail: async (email) => {
        try {
            const admin = await Admin.findOne({ where: { email } });
            if (admin) {
                return true;
            } else {
                return false
            }

        } catch (error) {
            // console.error('Error retrieving user by email:', error);
            throw error;
        }
    },

    //check unique mobile number
    checkMobile: async (phone_number, country_code) => {
        try {
            const admin = await Admin.findOne({ where: { phone_number, country_code } });
            if (admin) {
                return true;
            } else {
                return false
            }

        } catch (error) {
            // console.error('Error retrieving user by email:', error);
            throw error;
        }
    },

    //==========================add Sub Admin profile==============================
    addSubAdmin: async (request) => {
        try {

            const insertObj = {
                admin_id: request._id,
                full_name: request.full_name,
                email: request.email,
                country_code: request.country_code,
                phone_number: request.phone_number,
                password: await enc_dec.encryptPlain(request.password),
                image: request.image,
                role: 'subadmin',
                login_type: 'S'
            }

            if (await Sub_Admin_Model.checkEmail(request.email)) {

                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_error', content: {} }, data: [] };
            }

            if (await Sub_Admin_Model.checkMobile(request.phone_number, request.country_code)) {

                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_mobile_error', content: {} }, data: [] };
            }

            const insertData = await Admin.create(insertObj);

            if (insertData && insertData.id) {
                const template = await email_template.subAdminLoginCredential(insertData.email, request.password);
                const isSend = await common.sendEmail("Login Credential", insertData.email, template);

                if (isSend) {
                    const result = await Sub_Admin_Model.getSubAdmin({ id: insertData.id });

                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_add_sub_admin_data_success', content: {} }, data: result.data[0] };
                }
            }

        } catch (error) {
            throw error
        }
    },

    //==========================Update Subadmin Details==============================
    updateSubadmin: async (request) => {
        try {

            const subAdminData = await Admin.findOne({ where: { id: request.id, is_deleted: false, is_active: true } });

            if (subAdminData) {

                const updateObj = {
                    full_name: request.full_name,
                    email: request.email,
                    country_code: request.country_code,
                    phone_number: request.phone_number,
                }

                if (request.image !== "" && request.image !== undefined) {
                    updateObj.image = request.image;
                }

                if (await Sub_Admin_Model.checkEmail(request.email)) {

                    if (request.email === subAdminData.email) {

                        updateObj.email = subAdminData.email;
                    } else {
                        return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_error', content: {} }, data: [] };
                    }
                }

                if (await Sub_Admin_Model.checkMobile(request.phone_number, request.country_code)) {

                    if (request.country_code === subAdminData.country_code && request.phone_number === subAdminData.phone_number) {

                        updateObj.country_code = subAdminData.country_code;
                        updateObj.phone_number = subAdminData.phone_number;
                    } else {
                        return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_mobile_error', content: {} }, data: [] };
                    }
                }

                await Admin.update(updateObj, { where: { id: request.id } });

                const result = await Sub_Admin_Model.getSubAdmin({ id: request.id });

                if (result.data) {
                    return {
                        code: global.SUCCESS,
                        message: { keyword: 'rest_keywords_sub_admin_data_update_success', content: {} },
                        data: result.data[0],
                    };
                }


            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error;
        }
    },


    //==========================Delete SubAdmin profile==============================
    deleteSubAdmin: async (request) => {
        try {
            const deleteData = await Admin.update({ is_deleted: true }, { where: { id: request.id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keyword_delete_sub_admin_data_success', content: {} },
                data: { deleteData, id: request.id },
            };

        } catch (error) {
            throw error;
        }
    },

    //==========================Change status of SubAdmin profile active/blocked==============================
    changeSubAdminStatus: async (request) => {
        try {
            let message = 'rest_keywords_sub_admin_data_active_status_success';

            const changeStatus = await Admin.update({ is_active: request.is_active }, { where: { id: request.id, is_deleted: false } });

            if (!request.is_active) {
                message = 'rest_keywords_sub_admin_data_blocked_status_success';
            }
            return {
                code: global.SUCCESS,
                message: { keyword: message, content: {} },
                data: { changeStatus, id: request.id },
            };
        } catch (error) {
            throw error
        }
    },

    //==========================common function for subadmin details==============================
    getSubAdmin: async (request) => {
        try {
            // console.log(request);
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
                admin_id: { [Op.ne]: 0 }
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

            const result = await Admin.findAndCountAll({
                where: whereClause,
                attributes: {},
                include: [
                    {
                        model: DeviceInfo,
                        attributes: {
                            exclude: ['token', 'device_token']
                        },
                        as: 'device_info',
                        required: false,
                        where: {
                            role: 'admin'
                        }
                    }
                ],
                order: _sortingParams,
                ...pagingParams_
            });

            // // Map result to include certificateUrl
            // const resultWithUrls = result.rows.map(subAdmin => ({
            //     ...subAdmin.toJSON(),
            //     imageUrl: subAdmin.imageUrl,
            //     // trainerImageUrl:userCourse.assign_trainer.trainer_details.imageUrl
            // }));

            // return paginate({ ...result, rows: resultWithUrls }, paging);
            return paginate(result, paging);
        } catch (error) {
            throw error; // Handle the error as per your application's needs
        }
    },

    //==========================get subadmin List==============================
    subAdminList: async (request) => {
        try {
            const result = await Sub_Admin_Model.getSubAdmin(request);

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

    //==========================get permission module list==============================
    permissionModuleList: async (request) => {
        try {

            const whereClause = {
                is_deleted: false,
            };

            const result = await PermissionModules.findAll({
                where: whereClause,
                attributes: {},
            });

            if (result) {
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
            throw error;
        }
    },

    //==========================subadmin permission list==============================
    subAdminPermissionList: async (request) => {
        try {

            const whereClause = {
                is_deleted: false, // Default condition
                is_active: true,
                subadmin_id: request.subadmin_id
            };



            const result = await SubadminPermissions.findAll({
                where: whereClause,
                attributes: {},
                include: [
                    {
                        model: PermissionModules,
                        as: 'permission_module',
                        attributes: ['id', 'name']
                    }
                ],

            });

            if (result) {
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
            throw error; // Handle the error as per your application's needs
        }
    },

    //==========================add/update permission==============================
    addUpdatePermission: async (request) => {
        try {
            // Fetch existing permissions for the subadmin
            const existingPermissions = await SubadminPermissions.findAll({
                where: {
                    subadmin_id: request.subadmin_id,
                    is_deleted: false,
                    is_active: true
                }
            });

            const bulkOperations = request.permissions.map(async (permission) => {
                // Check if the permission already exists
                const existingPermission = existingPermissions.find(p => p.permission_module_id === permission.permission_module_id);

                if (existingPermission) {
                    // Update existing permission
                    return await SubadminPermissions.update({
                        is_view: permission.is_view,
                        is_add: permission.is_add,
                        is_edit: permission.is_edit,
                        is_delete: permission.is_delete,
                        is_status: permission.is_status
                    }, {
                        where: {
                            subadmin_id: request.subadmin_id,
                            permission_module_id: permission.permission_module_id
                        }
                    });
                } else {
                    // Create new permission
                    return await SubadminPermissions.create({
                        subadmin_id: request.subadmin_id,
                        permission_module_id: permission.permission_module_id,
                        is_view: permission.is_view,
                        is_add: permission.is_add,
                        is_edit: permission.is_edit,
                        is_delete: permission.is_delete,
                        is_status: permission.is_status
                    });
                }
            });

            // Execute all operations in parallel
            const results = await Promise.all(bulkOperations);

            return results;

        } catch (error) {
            throw error;
        }
    },

    //==========================add permission==============================
    addPermission: async (request) => {
        try {
            const result = await Sub_Admin_Model.addUpdatePermission(request);

            if (result) {
                return { code: global.SUCCESS, message: { keyword: 'rest_keyword_add_sub_admin_permission_success', content: {} }, data: result };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error;
        }
    },

    //==========================update permission==============================
    updatePermission: async (request) => {
        try {
            const result = await Sub_Admin_Model.addUpdatePermission(request);

            if (result) {
                return { code: global.SUCCESS, message: { keyword: 'rest_keywords_sub_admin_permission_update_success', content: {} }, data: result };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error;
        }
    },


}

module.exports = Sub_Admin_Model