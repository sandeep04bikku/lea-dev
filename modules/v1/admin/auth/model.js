const { Sequelize, Op } = require("sequelize");
const common = require("../../../../config/common");
const sequelize = require("../../../../models");
const moment = require("moment");
const global = require("../../../../config/constants");
const email_template = require("../../../../config/template")
const enc_dec = require("../../../../middleware/encriptionDecription");
const Admin = require("../../../../models/tbl_admin");
const DeviceInfo = require("../../../../models/tbl_device_info");
const OTP = require("../../../../models/tbl_otp");
const SubadminPermissions = require("../../../../models/tbl_subadmin_permission");
const PermissionModules = require("../../../../models/tbl_permission_module");

const Auth_Model = {

    //check unique email
    checkEmail: async (email) => {
        try {
            const admin = await Admin.findOne({ where: { email } });

            return admin !== null;
        } catch (error) {

            console.error('Error retrieving admin by email:', error.message, error.stack);
            throw new Error('Failed to check email uniqueness due to a database error.');
        }
    },

    //check unique mobile number
    checkMobile: async (phone_number, country_code) => {
        try {
            const admin = await Admin.findOne({ where: { phone_number, country_code } });

            return admin !== null;
        } catch (error) {

            console.error('Error retrieving admin by email:', error.message, error.stack);
            throw new Error('Failed to check phone number uniqueness due to a database error.');
        }
    },

    //check old password
    checkOldPassword: async (old_paasword) => {
        try {
            // console.log(old_paasword,"dkfjhkdsa");
            const enc_password = await enc_dec.encryptPlain(old_paasword);
            const isTrue = await Admin.findOne({ where: { password: enc_password } });

            return isTrue !== null
        } catch (error) {
            console.error('Error retrieving admin by email:', error.message, error.stack);
            throw new Error('Failed to check phone number uniqueness due to a database error.');
        }
    },

    //get user details with user device details
    getAdminById: async (user_id) => {
        try {
            const user = await Admin.findByPk(user_id, {
                attributes: [
                    ['id', 'admin_id'],
                    'full_name',
                    'email',
                    'country_code',
                    'phone_number',
                    'image',
                    'role',
                    'is_online',
                    [sequelize.col('device_info.token'), 'token'],
                    [sequelize.col('device_info.device_token'), 'device_token'],
                    [sequelize.col('device_info.device_name'), 'device_name'],
                    [sequelize.col('device_info.device_type'), 'device_type'],
                    [sequelize.col('device_info.os_version'), 'os_version'],
                    [sequelize.col('device_info.app_version'), 'app_version'],
                    [sequelize.col('device_info.last_login'), 'last_login'],
                ],
                include: [
                    {
                        model: DeviceInfo,
                        attributes: [],
                        as: 'device_info',
                        where: { role: 'admin' }
                    },
                    {
                        model: SubadminPermissions,
                        as: 'permission',
                        // required:false,
                        include: [
                            {
                                model: PermissionModules,
                                as: 'permission_module'
                            }
                        ]
                    }
                ]
            });

            return user;
        } catch (error) {
            console.error('get admin:', error.message, error.stack);
            throw new Error('get admin');
        }
    },

    // login user 
    login: async (request) => {
        try {
            // console.log(request);
            const loginObj = {
                email: request.email,
                password: await enc_dec.encryptPlain(request.password),
                login_type: request.login_type,
                // role:request.role,
                is_active: true,
            }

            const isValidEmail = await Auth_Model.checkEmail(request.email);

            if (isValidEmail) {
                const loginUser = await Admin.findOne({ where: loginObj });

                // console.log(loginUser);

                if (loginUser) {
                    if (loginUser.is_deleted) {
                        return { code: global.UNAUTHORIZED_ACCESS, message: { keyword: 'invalid_credential_error', content: {} }, data: [] };
                    }

                    let message = "rest_keyword_login_success";
                    request.role = 'admin';

                    const token = await common.checkUpdateToken(loginUser.id, request);

                    if (token) {
                        await Admin.update({ is_online: true }, { where: { id: loginUser.id } });
                        const admin_details = await Auth_Model.getAdminById(loginUser.id);
                        if (admin_details) {
                            return { code: global.SUCCESS, message: { keyword: message, content: {} }, data: admin_details };
                        }
                    }

                } else {
                    return { code: global.UNAUTHORIZED_ACCESS, message: { keyword: 'invalid_credential_error', content: {} }, data: [] };
                }
            } else {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_exist_error', content: {} }, data: [] };
            }


            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            console.error('login error:', error.message, error.stack);
            throw new Error('admin login error');
        }
    },

    // logout user 
    logout: async (request) => {
        try {

            // console.log(request._id,"model",request.role);
            await DeviceInfo.update({ token: null, device_token: null }, { where: { _id: request._id, role: request.role } });

            await Admin.update({ is_online: false }, { where: { id: request._id } });

            return { code: global.SUCCESS, message: { keyword: 'rest_keyword_logout_success', content: {} }, data: {} };

        } catch (error) {
            console.error('logout error by admin:', error.message, error.stack);
            throw new Error('logout error');
        }
    },

    //get admin details
    getAdmin: async (request) => {
        try {
            // console.log(request);
            const admin_data = await Auth_Model.getAdminById(request._id, request.role);
            // console.log(admin_data);
            if (admin_data) {
                return { code: global.SUCCESS, message: { keyword: 'rest_keyword_data_success', content: {} }, data: admin_data };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            console.error('get admin details error', error.message, error.stack);
            throw new Error('get admin details error.');
        }
    },

    //forget password
    forgetPassword: async (request) => {
        try {
            const otpObj = {
                otp: await common.otp(),
                generate_time: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
            }

            // console.log(request);

            if (await Auth_Model.checkEmail(request.email)) {
                const existingOTP = await OTP.findOne({
                    where: { email: request.email, role: 'admin' }
                });

                // console.log(existingOTP);

                if (existingOTP) {
                    await OTP.update(otpObj, {
                        where: {
                            email: request.email,
                            role: 'admin'
                        }
                    });

                    otpObj.email = request.email;

                    const template = await email_template.forgetPassword(otpObj);
                    const isSend = await common.sendEmail('Forget Password', otpObj.email, template);
                    if (isSend) {
                        return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'email' + ' ' + otpObj.email } }, data: otpObj };
                    }

                } else {
                    otpObj.email = request.email;
                    otpObj.role = 'admin';
                    const createOtp = await OTP.create(otpObj);

                    if (createOtp && createOtp.id) {

                        const template = await email_template.forgetPassword(otpObj);
                        const isSend = await common.sendEmail('Forget Password', otpObj.email, template);
                        if (isSend) {
                            return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'email' + ' ' + otpObj.email } }, data: otpObj };
                        }
                    }

                }
            } else {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_exist_error', content: {} }, data: [] };
            }



            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            console.error('Forget password error', error.message, error.stack);
            throw new Error('Forget password error.');
        }
    },

    //resend otp
    resendOtp: async (request) => {
        try {
            const otpObj = {
                otp: await common.otp(),
                generate_time: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
            }

            await OTP.update(otpObj, {
                where: {
                    email: request.email,
                    role: 'admin'
                }
            });

            otpObj.email = request.email;

            const template = await email_template.forgetPassword(otpObj);
            const isSend = await common.sendEmail('Forget Password', otpObj.email, template);
            if (isSend) {
                return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'email' + ' ' + otpObj.email } }, data: otpObj };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            console.error('resend otp error:', error.message, error.stack);
            throw new Error('resend otp error.');
        }
    },

    //===============================0tp Verification==================================
    otpVerification: async (request) => {
        try {
            console.log(request, "Request data for OTP verification");

            // Calculate 1 minute ago using Moment.js
            const oneMinuteAgo = moment().utc().subtract(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');
            console.log(oneMinuteAgo, 'One minute ago');

            // Verify OTP
            const verifyOtp = await OTP.findOne({
                where: {
                    email: request.email,
                    otp: request.otp,
                    role: 'admin',
                    generate_time: { [Op.gte]: oneMinuteAgo } // Check if generated within the last minute
                }
            });

            // console.log(verifyOtp, "Verify OTP result");

            if (verifyOtp) {
                const admin = await Admin.findOne({ where: { email: verifyOtp.email } })
                return {
                    code: global.SUCCESS,
                    message: { keyword: 'rest_keyword_email_otp_verify_success', content: {} },
                    data: { id: admin.id }
                };
            } else {
                // OTP is either invalid or expired
                return {
                    code: global.OPRETION_FAILD,
                    message: { keyword: 'rest_keyword_email_otp_verify_error', content: {} },
                    data: {}
                };
            }
        } catch (error) {
            console.error('Verify otp error:', error.message, error.stack);
            throw new Error('Verify otp error.');
        }
    },

    //change password
    createNewPassword: async (request) => {
        try {
            if (request.new_password === request.confirm_password) {

                const password = await enc_dec.encryptPlain(request.new_password);
                const new_password = await Admin.update({ password: password }, { where: { id: request.id } });

                return { code: global.SUCCESS, message: { keyword: 'rest_keyword_new_password_success', content: {} }, data: new_password };
            } else {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_confirm_password_error', content: {} }, data: [] };
            }

            // return { code: '0', message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            console.error('Create password error:', error.message, error.stack);
            throw new Error('Create password error');
        }
    },

    changePassword: async (request) => {
        try {
            // console.log(request);
            if (await Auth_Model.checkOldPassword(request.old_password)) {
                if (request.new_password === request.confirm_password) {

                    const password = await enc_dec.encryptPlain(request.new_password);
                    const new_password = await Admin.update({ password: password }, { where: { id: request.admin_id } });

                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_change_password_success', content: {} }, data: new_password };
                } else {
                    return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_confirm_password_error', content: {} }, data: [] };
                }
            } else {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_old_password_error', content: {} }, data: [] };
            }
        } catch (error) {
            console.error('Change password error:', error.message, error.stack);
            throw new Error('Change password error.');
        }
    }

}

module.exports = Auth_Model