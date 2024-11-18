const { Sequelize, Op } = require("sequelize");
const common = require("../../../../config/common");
const sequelize = require("../../../../models");
const moment = require("moment");
const global = require("../../../../config/constants");
const email_template = require("../../../../config/template")
const enc_dec = require("../../../../middleware/encriptionDecription");
const User = require("../../../../models/tbl_user");
const DeviceInfo = require("../../../../models/tbl_device_info");
const OTP = require("../../../../models/tbl_otp");
const Language = require("../../../../models/tbl_language");


const Auth_Model = {

    //check unique email
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

    //check unique mobile number
    checkMobile: async (phone_number, country_code) => {
        try {
            const user = await User.findOne({ where: { phone_number, country_code } });
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

    //check old password
    checkOldPassword: async (old_paasword) => {
        try {
            // console.log(old_paasword,"dkfjhkdsa");
            const enc_password = await enc_dec.encryptPlain(old_paasword);
            const isTrue = await User.findOne({ where: { password: enc_password } });
            // console.log(enc_password);
            // console.log(isTrue);
            if (isTrue) {
                return true;
            } else {
                return false
            }
        } catch (error) {
            throw error
        }
    },

    //get user details with user device details
    getUserById: async (id) => {
        try {
            const user = await User.findByPk(id, {
                attributes: {
                    exclude: ['password', 'social_id'],
                },
                include: [
                    {
                        model: DeviceInfo,
                        required: false,
                        attributes: {},
                        as: 'user_device_info',
                        where: {
                            role: 'user'
                        }
                    },
                    {
                        model: Language,
                        required: false,
                        as: 'user_language',
                    },
                ],
            });

            // console.log(user);


            return user;
        } catch (error) {
            throw error;
        }
    },

    signup: async (request) => {
        try {
            const userObj = {
                corporate_profile_id: 0,
                language_id: request.language_id,
                login_type: request.login_type,
                full_name: request.full_name,
                email: (request.email !== "" && request.email !== undefined) ? request.email : null,
                country_code: request.country_code,
                phone_number: request.phone_number,
                password: (request.login_type === 'S') ? await enc_dec.encryptPlain(request.password) : null,
                social_id: (request.login_type !== 'S') ? request.social_id : null,
                role: request.role,
                is_temp_password: false,
                is_term_condition: true,
                step: 1,
                is_mobile_verified: request.is_mobile_verified
            }

            if (!request.is_mobile_verified) {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_phone_verified_error', content: {} }, data: {} };
            }

            if (userObj.email !== null && await Auth_Model.checkEmail(userObj.email)) {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_error', content: {} }, data: {} };
            }

            if (await Auth_Model.checkMobile(userObj.phone_number, userObj.country_code)) {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_mobile_error', content: {} }, data: {} };
            }

            const user = await User.create(userObj);

            if (user && user.id) {
                const token = await common.checkUpdateToken(user.id, request);

                if (token) {
                    await User.update({ is_online: true }, { where: { id: user.id } });

                    const userData = await Auth_Model.getUserById(user.id);
                    if (userData) {
                        return { code: global.SUCCESS, message: { keyword: 'rest_keyword_signup_success', content: {} }, data: userData };
                    }
                }
            }

        } catch (error) {
            throw error
        }
    },

    // login user 
    login: async (request) => {
        try {
            // console.log(request);
            const loginObj = {
                login_type: request.login_type,
                role: request.role,
                is_active: true,
                is_deleted: false
            }

            const email = (request.email !== "" && request.email !== undefined) ? request.email : "";
            const country_code = (request.country_code !== "" && request.country_code !== undefined) ? request.country_code : "";
            const phone_number = (request.phone_number !== "" && request.phone_number !== undefined) ? request.phone_number : "";

            if (!(phone_number && country_code) && !email) {
                console.log(request);
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_check_email_phone_number_error', content: {} }, data: [] };
            }

            if (email !== "" && await common.validateEmail(email)) {
                loginObj.email = email
            } else {
                loginObj.country_code = country_code;
                loginObj.phone_number = phone_number;
            }

            if (request.login_type !== 'S') {
                loginObj.social_id = request.social_id;
            } else {
                loginObj.password = await enc_dec.encryptPlain(request.password);
            }

            if (email && !await Auth_Model.checkEmail(email)) {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_exist_error', content: {} }, data: [] };
            }

            if (country_code && phone_number && !await Auth_Model.checkMobile(phone_number, country_code)) {
                console.log(request);
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_phone_exist_error', content: {} }, data: [] };
            }

            const validUser = await User.findOne({ where: loginObj });

            console.log(validUser);

            if (validUser) {
                let message = "rest_keyword_login_success";

                const token = await common.checkUpdateToken(validUser.id, request);

                if (token) {
                    await User.update({ is_online: true }, { where: { id: validUser.id } });
                    const user_data = await Auth_Model.getUserById(validUser.id);
                    if (user_data) {
                        return { code: global.SUCCESS, message: { keyword: message, content: {} }, data: user_data };
                    }
                }

            } else {
                return { code: global.UNAUTHORIZED_ACCESS, message: { keyword: 'invalid_credential_error', content: {} }, data: [] };
            }

        } catch (error) {
            throw error
        }
    },

    //complete profile
    completeProfile: async (request) => {
        try {
            const profileObj = {
                country_id: (request.country_id !== "" && request.country_id !== undefined) ? request.country_id : null,
                city_id: (request.city_id !== "" && request.city_id !== undefined) ? request.city_id : null,
                image: (request.image !== "" && request.image !== undefined) ? request.image : null,
                dob: (request.dob !== "" && request.dob !== undefined) ? request.dob : null,
                government_certificate: (request.government_certificate !== "" && request.government_certificate !== undefined) ? request.government_certificate : "",
                security_question: (request.security_question !== "" && request.security_question !== undefined) ? request.security_question : null,
                security_answer: (request.security_answer !== "" && request.security_answer !== undefined) ? request.security_answer : null,
                organization: (request.organization !== "" && request.organization !== undefined) ? request.organization : null,
                experience: (request.experience !== "" && request.experience !== undefined) ? request.experience : null,
                step: 2
            }

            await User.update(profileObj, { where: { id: request._id } });

            const user_data = await Auth_Model.getUserById(request._id);
            if (user_data) {
                return { code: global.SUCCESS, message: { keyword: 'rest_keyword_profile_update_success', content: {} }, data: user_data };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error;
        }
    },

    // logout user 
    logout: async (request) => {
        try {
            // console.log(request._id,"model",request.role);
            const updateUserDevice = await DeviceInfo.update({ token: null, device_token: null }, { where: { _id: request._id } });

            const isOffline = await User.update({ is_online: false }, { where: { id: request._id } });

            return { code: global.SUCCESS, message: { keyword: 'rest_keyword_logout_success', content: {} }, data: [] };

        } catch (error) {
            throw error;
        }
    },

    //get admin details
    getUser: async (request) => {
        try {
            // console.log(request);
            const user_data = await Auth_Model.getUserById(request._id, request.role);
            // console.log(admin_data);
            if (user_data) {
                return { code: global.SUCCESS, message: { keyword: 'rest_keyword_data_success', content: {} }, data: user_data };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (request) => {
        console.log(request, "djkhfjdsfhdsjkfhlsdjfkgsdhgjksdgfhl");
        try {
            const existData = await User.findOne({ where: { id: request._id } });

            if (existData) {
                const updateObj = {
                    full_name: request.full_name,
                    email: (request.email !== "" && request.email !== undefined) ? request.email : null,
                    country_code: request.country_code,
                    phone_number: request.phone_number,
                    image: (request.image !== "" && request.image !== undefined) ? request.image : null,
                    dob: (request.dob !== "" && request.dob !== undefined) ? request.dob : null,
                    country_id: (request.country_id !== "" && request.country_id !== undefined) ? request.country_id : null,
                    city_id: (request.city_id !== "" && request.city_id !== undefined) ? request.city_id : null,
                    government_certificate: (request.government_certificate !== "" && request.government_certificate !== undefined) ? request.government_certificate : "",
                    organization: (request.organization !== "" && request.organization !== undefined) ? request.organization : null,
                    experience: (request.experience !== "" && request.experience !== undefined) ? request.experience : null,
                }


                if (await Auth_Model.checkEmail(request.email)) {

                    if (request.email === existData.email) {

                        updateObj.email = existData.email;
                    } else {
                        return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_error', content: {} }, data: [] };
                    }
                }

                if (await Auth_Model.checkMobile(request.phone_number, request.country_code)) {

                    if (request.country_code === existData.country_code && request.phone_number === existData.phone_number) {

                        updateObj.country_code = existData.country_code;
                        updateObj.phone_number = existData.phone_number;
                    } else {
                        return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_mobile_error', content: {} }, data: [] };
                    }
                }

                const update = await User.update(updateObj, { where: { id: request._id } })

                const user_data = await Auth_Model.getUserById(request._id);

                if (user_data) {
                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_profile_update_success', content: {} }, data: user_data };
                }
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error;
        }
    },

    //forget password
    forgetPassword: async (request) => {
        try {

            const otpObj = {
                // otp: await common.otp(),
                otp: 1234,
                generate_time: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
            }

            const findObj = {
                role:request.role
            };

            const email = (request.email !== "" && request.email !== undefined) ? request.email : "";
            const country_code = (request.country_code !== "" && request.country_code !== undefined) ? request.country_code : "";
            const phone_number = (request.phone_number !== "" && request.phone_number !== undefined) ? request.phone_number : "";

            if (!(phone_number && country_code) && !email) {
                console.log(request);
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_check_email_phone_number_error', content: {} }, data: [] };
            }

            const isEmail = await common.validateEmail(email);

            if (isEmail) {
                otpObj.email = email;
                findObj.email = email;
            } else {
                otpObj.country_code = country_code;
                otpObj.phone_number = phone_number;
                findObj.country_code = country_code;
                findObj.phone_number = phone_number;
            }

            if (!email && !Auth_Model.checkEmail(email)) {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_exist_error', content: {} }, data: [] };
            }

            if (!(country_code && phone_number) && !Auth_Model.checkMobile(phone_number, country_code)) {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_phone_exist_error', content: {} }, data: [] };
            }

            console.log(otpObj, "jdhfjdk");

            const existingOTP = await OTP.findOne({
                where: findObj
            });

            console.log(existingOTP, "exist")
            if (existingOTP) {
                await OTP.update(otpObj, {
                    where: findObj
                });

                if (isEmail) {
                    const template = await email_template.forgetPassword(otpObj);
                    const isSend = await common.sendEmail('Forget Password', otpObj.email, template);
                    if (isSend) {
                        return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'email' + ' ' + otpObj.email } }, data: otpObj };
                    }
                } else {

                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'phone number' + ' ' + otpObj.country_code + phone_number } }, data: otpObj };
                }
            } else {
                otpObj.role = request.role;
                const createOtp = await OTP.create(otpObj);

                if (createOtp && createOtp.id) {

                    if (isEmail) {
                        const template = await email_template.forgetPassword(otpObj);
                        const isSend = await common.sendEmail('Forget Password', otpObj.email, template);
                        if (isSend) {
                            return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'email' + ' ' + otpObj.email } }, data: otpObj };
                        }
                    } else {
                        return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'phone number' + ' ' + otpObj.country_code + phone_number } }, data: otpObj };

                    }
                }

            }

            // return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error;
        }
    },

    //resend otp
    resendOtp: async (request) => {
        try {
            const otpObj = {
                // otp: await common.otp(),
                otp: 1234,
                generate_time: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
            }
            const findObj = {
                role: request.role
            };

            const email = (request.email !== "" && request.email !== undefined) ? request.email : "";
            const country_code = (request.country_code !== "" && request.country_code !== undefined) ? request.country_code : "";
            const phone_number = (request.phone_number !== "" && request.phone_number !== undefined) ? request.phone_number : "";

            if (!(phone_number && country_code) && !email) {

                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_check_email_phone_number_error', content: {} }, data: [] };
            }

            const isEmail = await common.validateEmail(email);

            if (isEmail) {
                otpObj.email = email;
                findObj.email = email
            } else {
                otpObj.country_code = country_code;
                otpObj.phone_number = phone_number;
                findObj.country_code = country_code;
                findObj.phone_number = phone_number;
            }

            const existingOTP = await OTP.findOne({
                where: findObj
            });

            if (existingOTP) {
                // findObj.role = request.role

                await OTP.update(otpObj, {
                    where: findObj
                });
            } else {
                otpObj.role = request.role;

                const createOtp = await OTP.create(otpObj);

                if (createOtp && createOtp.id) {
                    console.log("send otp for sigup");
                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'phone number' + ' ' + otpObj.country_code + phone_number } }, data: otpObj };

                }
            }

            if (isEmail && request.is_forget) {
                const template = await email_template.forgetPassword(otpObj);
                const isSend = await common.sendEmail('Forget Password', otpObj.email, template);
                if (isSend) {
                    otpObj.otp = "";
                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'email' + ' ' + otpObj.email } }, data: otpObj };
                }
            } else {
                otpObj.otp = "";
                if (request.is_forget) {
                    console.log("forget");
                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'phone number' + ' ' + otpObj.country_code + phone_number } }, data: otpObj };
                }
                console.log("send resend otp for signup");
                return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'phone number' + ' ' + otpObj.country_code + phone_number } }, data: otpObj };
            }

            // return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error;
        }
    },

    //===============================0tp Verification==================================
    otpVerification: async (request) => {
        try {
            // console.log(request, "Request data for OTP verification");

            const email = (request.email !== "" && request.email !== undefined) ? request.email : "";
            const country_code = (request.country_code !== "" && request.country_code !== undefined) ? request.country_code : "";
            const phone_number = (request.phone_number !== "" && request.phone_number !== undefined) ? request.phone_number : "";

            if (!(phone_number && country_code) && !email) {
                console.log(request);
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_check_email_phone_number_error', content: {} }, data: {} };
            }

            // Calculate 1 minute ago using Moment.js
            const oneMinuteAgo = moment().utc().subtract(1, 'minutes').format('YYYY-MM-DD HH:mm:ss');
            // console.log(oneMinuteAgo, 'One minute ago');

            const isEmail = await common.validateEmail(request.email);
            let findObj = {}

            if (isEmail) {
                findObj.email = email;
            } else {
                findObj.phone_number = phone_number;
                findObj.country_code = country_code;
            }

            console.log(findObj);
            // Verify OTP
            const verifyOtp = await OTP.findOne({
                where: {
                    otp: request.otp,
                    role: request.role,
                    generate_time: { [Op.gte]: oneMinuteAgo }, // Check if generated within the last minute
                    [Op.or]: [
                        { email: email },
                        {
                            phone_number: phone_number,
                            country_code: country_code
                        }
                    ]
                }
            });

            console.log(verifyOtp, "verify");

            if (verifyOtp) {
                findObj.role = request.role;

                if (request.is_forget) {
                    const user = await User.findOne({
                        where: findObj
                    });

                    if (user) {
                        if (isEmail) {
                            await User.update({ is_email_verified: true }, { where: { id: user.id } })
                        } else {
                            await User.update({ is_mobile_verified: true }, { where: { id: user.id } })
                        }

                        console.log(user, "forget password verification");

                        return {
                            code: global.SUCCESS,
                            message: { keyword: 'rest_keyword_email_otp_verify_success', content: {} },
                            data: { id: user.id }
                        };
                    }

                }

                console.log("simple signup verification");
                return {
                    code: global.NO_CONTENT_SUCCESS,
                    message: { keyword: 'rest_keyword_email_otp_verify_success', content: {} },
                    data: {}
                };
            } else {
                // OTP is either invalid or expired
                return {
                    code: global.OPRETION_FAILD,
                    message: { keyword: 'rest_keyword_invalid_or_expired_otp_error', content: {} },
                    data: {}
                };
            }

            // return { code: '0', message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: {} };
        } catch (error) {
            throw error;
        }
    },

    //change password
    createNewPassword: async (request) => {
        try {
            if (request.new_password === request.confirm_password) {

                const password = await enc_dec.encryptPlain(request.new_password);
                const new_password = await User.update({ password: password, is_temp_password: false }, { where: { id: request.id } });

                return { code: global.SUCCESS, message: { keyword: 'rest_keyword_new_password_success', content: {} }, data: new_password };
            } else {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_confirm_password_error', content: {} }, data: [] };
            }

            // return { code: '0', message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: [] };
        } catch (error) {
            throw error;
        }
    },

    changePassword: async (request) => {
        try {
            console.log(request);
            if (await Auth_Model.checkOldPassword(request.current_password)) {
                if (request.new_password === request.confirm_password) {

                    const password = await enc_dec.encryptPlain(request.new_password);
                    const new_password = await User.update({ password: password }, { where: { id: request._id } });

                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_change_password_success', content: {} }, data: new_password };
                } else {
                    return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_confirm_password_error', content: {} }, data: [] };
                }
            } else {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_old_password_error', content: {} }, data: [] };
            }
        } catch (error) {
            throw error;
        }
    },

    changeLanguage: async (request) => {
        try {
            const updateData = await User.update({ language_id: request.language_id }, { where: { id: request._id } });
            return { code: global.SUCCESS, message: { keyword: 'rest_keyword_change_update_language_success', content: {} }, data: updateData };
        } catch (error) {
            throw error
        }
    }

}

module.exports = Auth_Model