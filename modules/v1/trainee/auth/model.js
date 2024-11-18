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
const ContactUs = require("../../../../models/tbl_cms_contact_us");
const Country = require("../../../../models/tbl_country");
const City = require("../../../../models/tbl_city");


const Auth_Model = {

    //check unique email
    checkEmail: async (email) => {
        try {
            const user = await User.findOne({ where: { email } });

            return user !== null;
        } catch (error) {
            console.error('Error retrieving user by email:', error.message, error.stack);

            throw new Error('Failed to check email uniqueness due to a database error.');
        }
    },

    //check unique mobile number
    checkMobile: async (phone_number, country_code) => {
        try {
            const user = await User.findOne({ where: { phone_number, country_code } });

            console.log(user, "user");


            return user !== null;
        } catch (error) {
            console.error('Error retrieving user by email:', error.message, error.stack);

            throw new Error('Failed to check phone number uniqueness due to a database error.');
        }
    },

    //check old password
    checkOldPassword: async (old_paasword) => {
        try {
            // console.log(old_paasword,"dkfjhkdsa");
            const enc_password = await enc_dec.encryptPlain(old_paasword);
            const isTrue = await User.findOne({ where: { password: enc_password } });

            return isTrue !== null;
        } catch (error) {
            console.error('Check old password:', error.message, error.stack);

            throw new Error('check old password');
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
                    {
                        model: Country,
                        required: false,
                        as: 'user_country',
                    },
                    {
                        model: City,
                        required: false,
                        as: 'user_city',
                    },
                ],
            });

            return user;
        } catch (error) {
            console.error('Get User Details:', error.message, error.stack);

            throw new Error('Get user details');
        }
    },

    signup: async (request) => {
        try {
            const userObj = {
                corporate_profile_id: 0,
                language_id: request.language_id,
                login_type: request.login_type,
                full_name: request.full_name,
                email: (request.email !== "" && request.email !== undefined && request.email !== null) ? request.email : null,
                country_code: request.country_code,
                phone_number: request.phone_number,
                password: (request.login_type === 'S') ? await enc_dec.encryptPlain(request.password) : null,
                social_id: (request.login_type !== 'S') ? request.social_id : null,
                role: request.role,
                is_temp_password: false,
                is_term_condition: true,
                step: 1,
                is_mobile_verified: true
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
            console.error('Signup User:', error.message, error.stack);

            throw new Error('Sign up user');
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
            }

            const email = (request.email !== "" && request.email !== undefined && request.email !== null) ? request.email : "";
            const country_code = (request.country_code !== "" && request.country_code !== undefined && request.country_code !== null) ? request.country_code : "";
            const phone_number = (request.phone_number !== "" && request.phone_number !== undefined && request.phone_number !== null) ? request.phone_number : "";

            if (!(phone_number && country_code) && !email) {
                console.log(request);
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_check_email_phone_number_error', content: {} }, data: {} };
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
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_exist_error', content: {} }, data: {} };
            }

            if (country_code && phone_number && !await Auth_Model.checkMobile(phone_number, country_code)) {
                console.log(request);
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_phone_exist_error', content: {} }, data: {} };
            }

            const validUser = await User.findOne({ where: loginObj });

            console.log(validUser, "login data");

            if (validUser) {
                console.log(validUser.is_deleted, "isdelted");

                if (validUser.is_deleted) {
                    return { code: global.UNAUTHORIZED_ACCESS, message: { keyword: 'rest_keywords_unique_user_exist_error', content: {} }, data: {} };
                }

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
                return { code: global.UNAUTHORIZED_ACCESS, message: { keyword: 'invalid_credential_error', content: {} }, data: {} };
            }

        } catch (error) {
            console.error('Login User:', error.message, error.stack);

            throw new Error('Login user');
        }
    },

    //complete profile
    completeProfile: async (request) => {
        try {
            const profileObj = {
                country_id: (request.country_id !== "" && request.country_id !== undefined && request.country_id !== null) ? request.country_id : null,
                city_id: (request.city_id !== "" && request.city_id !== undefined && request.city_id !== null) ? request.city_id : null,
                image: (request.image !== "" && request.image !== undefined && request.image !== null) ? request.image : null,
                dob: (request.dob !== "" && request.dob !== undefined && request.dob !== null) ? request.dob : null,
                government_certificate: (request.government_certificate !== "" && request.government_certificate !== undefined && request.government_certificate !== null) ? request.government_certificate : "",
                security_question: (request.security_question !== "" && request.security_question !== undefined && request.security_question !== null) ? request.security_question : null,
                security_answer: (request.security_answer !== "" && request.security_answer !== undefined && request.security_answer !== null) ? request.security_answer : null,
                organization: (request.organization !== "" && request.organization !== undefined && request.organization !== null) ? request.organization : null,
                experience: (request.experience !== "" && request.experience !== undefined && request.experience !== null) ? request.experience : null,
                step: 2
            }

            await User.update(profileObj, { where: { id: request._id } });

            const user_data = await Auth_Model.getUserById(request._id);
            if (user_data) {
                return { code: global.SUCCESS, message: { keyword: 'rest_keyword_profile_update_success', content: {} }, data: user_data };
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: {} };
        } catch (error) {
            console.error('Complete profile:', error.message, error.stack);

            throw new Error('Complete Profile');
        }
    },

    // logout user 
    logout: async (request) => {
        try {
            // console.log(request._id,"model",request.role);
            await DeviceInfo.update({ token: null, device_token: null }, { where: { _id: request._id } });

            await User.update({ is_online: false }, { where: { id: request._id } });

            return { code: global.SUCCESS, message: { keyword: 'rest_keyword_logout_success', content: {} }, data: {} };

        } catch (error) {
            console.error('Logout user:', error.message, error.stack);

            throw new Error('Logout user');
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

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: {} };
        } catch (error) {
            console.error('get User data:', error.message, error.stack);

            throw new Error('Get user data');
        }
    },

    updateUser: async (request) => {
        console.log(request, "update user request");
        try {
            const existData = await User.findOne({ where: { id: request._id } });

            console.log(existData, "exist data");


            if (existData) {
                const updateObj = {
                    full_name: request.full_name,
                    email: (request.email !== "" && request.email !== undefined) ? request.email : null,
                    country_code: request.country_code,
                    phone_number: request.phone_number,
                    dob: (request.dob !== "" && request.dob !== undefined) ? request.dob : existData.dob,
                    country_id: (request.country_id !== "" && request.country_id !== undefined) ? request.country_id : existData.country_id,
                    city_id: (request.city_id !== "" && request.city_id !== undefined) ? request.city_id : existData.city_id,
                    organization: (request.organization !== "" && request.organization !== undefined) ? request.organization : existData.organization,
                    experience: (request.experience !== "" && request.experience !== undefined) ? request.experience : existData.experience,
                }

                if (request.image !== "" && request.image !== undefined) {
                    updateObj.image = request.image
                }

                if (request.government_certificate !== "" && request.government_certificate !== undefined) {
                    updateObj.government_certificate = request.government_certificate
                }



                if (await Auth_Model.checkEmail(request.email)) {

                    if (request.email === existData.email) {

                        updateObj.email = existData.email;
                    } else {
                        return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_error', content: {} }, data: {} };
                    }
                }

                if (await Auth_Model.checkMobile(request.phone_number, request.country_code)) {

                    if (request.country_code === existData.country_code && request.phone_number === existData.phone_number) {

                        updateObj.country_code = existData.country_code;
                        updateObj.phone_number = existData.phone_number;
                    } else {
                        return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_mobile_error', content: {} }, data: {} };
                    }
                }

                await User.update(updateObj, { where: { id: request._id } })

                const user_data = await Auth_Model.getUserById(request._id);

                if (user_data) {
                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_profile_update_success', content: {} }, data: user_data };
                }
            }

            return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: {} };
        } catch (error) {
            console.error('Update user:', error.message, error.stack);

            throw new Error('Update user');
        }
    },

    //forget password
    forgetPassword: async (request) => {
        try {
            console.log(request, "request data for forget password");

            const otpObj = {
                // otp: await common.otp(),
                otp: 1234,
                generate_time: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
            }

            const findObj = {
                role: request.role
            };

            const email = (request.email !== "" && request.email !== undefined && request.email !== null) ? request.email : "";
            const country_code = (request.country_code !== "" && request.country_code !== undefined && request.country_code !== null) ? request.country_code : "";
            const phone_number = (request.phone_number !== "" && request.phone_number !== undefined && request.phone_number !== null) ? request.phone_number : "";

            if (!(phone_number && country_code) && !email) {
                console.log(request, "exist mobile");
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_check_email_phone_number_error', content: {} }, data: {} };
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

            console.log(await Auth_Model.checkEmail(email), "check existing mobile");


            // Check if the email exists
            if (email && !await Auth_Model.checkEmail(email)) {
                console.log("exist email");

                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_email_exist_error', content: {} }, data: {} };
            }

            // Check if the phone number exists
            if ((country_code && phone_number) && !await Auth_Model.checkMobile(phone_number, country_code)) {
                console.log("exist phone");
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_unique_phone_exist_error', content: {} }, data: {} };
            }

            console.log(findObj, "otp obj");

            const validUser = await User.findOne({ where: findObj });

            // console.log(validUser, "valid user");

            if (validUser && !validUser.is_deleted) {
                console.log("this is valid user");
                const existingOTP = await OTP.findOne({
                    where: findObj
                });

                if (!isEmail) {

                    const mobile_number = `+${country_code + phone_number}`

                    const session_id = await common.sendSmsOtp(mobile_number);

                    console.log(session_id, "session Id");
                    if (session_id) {
                        otpObj.otp = session_id;

                        if (existingOTP) {
                            await OTP.update(otpObj, {
                                where: findObj
                            });

                            return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'phone number' } }, data: { session_id, country_code, phone_number } };
                        }

                        const createOtp = await OTP.create(otpObj);

                        if (createOtp && createOtp.id) {
                            return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'phone number' } }, data: { session_id, country_code, phone_number } };
                        }
                    }
                } else {

                    if (existingOTP) {

                        await OTP.update(otpObj, {
                            where: findObj
                        });

                        const template = await email_template.forgetPassword(otpObj);
                        const isSend = await common.sendEmail('Forget Password', otpObj.email, template);

                        if (isSend) {
                            otpObj.otp = "";
                            return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'email' } }, data: { session_id: "abc123", email } };
                        }
                    } else {

                        otpObj.role = request.role;
                        const createOtp = await OTP.create(otpObj);

                        if (createOtp && createOtp.id) {
                            const template = await email_template.forgetPassword(otpObj);
                            const isSend = await common.sendEmail('Forget Password', otpObj.email, template);
                            if (isSend) {
                                otpObj.otp = "";
                                return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'email' } }, data: { session_id: "abc123", email } };
                            }
                        }
                    }
                }
            } else {
                console.log("this is deleted user");
                return { code: global.UNAUTHORIZED_ACCESS, message: { keyword: 'rest_keywords_unique_user_exist_error', content: {} }, data: {} };
            }

            // return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: {} };
        } catch (error) {
            console.error('Forget Password:', error.message, error.stack);

            throw new Error('Forget Password');
        }
    },

    //resend otp
    resendOtp: async (request) => {
        try {
            console.log(request, "request")
            const otpObj = {
                // otp: await common.otp(),
                otp: "1234",
                generate_time: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
            }
            const findObj = {
                role: request.role
            };

            const email = (request.email !== "" && request.email !== undefined && request.email !== null) ? request.email : "";
            const country_code = (request.country_code !== "" && request.country_code !== undefined && request.country_code !== null) ? request.country_code : "";
            const phone_number = (request.phone_number !== "" && request.phone_number !== undefined && request.phone_number !== null) ? request.phone_number : "";

            if (!(phone_number && country_code) && !email) {

                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_check_email_phone_number_error', content: {} }, data: {} };
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

            if (!isEmail) {

                const mobile_number = `+${country_code + phone_number}`

                const session_id = await common.sendSmsOtp(mobile_number);

                console.log(session_id, "session Id");
                if (session_id) {
                    otpObj.otp = session_id;
                    if (existingOTP) {

                        await OTP.update(otpObj, {
                            where: findObj
                        });

                        return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'phone number' } }, data: { session_id, country_code, phone_number } };

                    }

                    const createOtp = await OTP.create(otpObj);

                    if (createOtp && createOtp.id) {
                        return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'phone number' } }, data: { session_id, country_code, phone_number } };

                    }
                }

            } else {

                if (existingOTP) {

                    await OTP.update(otpObj, {
                        where: findObj
                    });
                }

                let template = await email_template.emailVerification(otpObj);
                let msg = "Signup"
                if (request.is_forget) {
                    template = await email_template.forgetPassword(otpObj);
                    msg = "Forget Password"
                }

                const isSend = await common.sendEmail(msg, otpObj.email, template);

                if (isSend) {
                    otpObj.otp = "";
                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'email' } }, data: { session_id: "abc123", email } };
                }
            }





            // if (existingOTP) {
            //     // findObj.role = request.role

            //     await OTP.update(otpObj, {
            //         where: findObj
            //     });
            // } else {
            //     otpObj.role = request.role;

            //     const createOtp = await OTP.create(otpObj);

            //     if (createOtp && createOtp.id) {
            //         console.log("send otp for sigup");
            //         otpObj.otp = "";
            //         return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'phone number' + ' ' + otpObj.country_code + phone_number } }, data: otpObj };

            //     }
            // }

            // if (isEmail && request.is_forget) {
            //     const template = await email_template.forgetPassword(otpObj);
            //     const isSend = await common.sendEmail('Forget Password', otpObj.email, template);
            //     if (isSend) {
            //         otpObj.otp = "";
            //         return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'email' + ' ' + otpObj.email } }, data: otpObj };
            //     }
            // } else {
            //     otpObj.otp = "";
            //     if (request.is_forget) {
            //         console.log("forget");
            //         return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'phone number' + ' ' + otpObj.country_code + phone_number } }, data: otpObj };
            //     }
            //     console.log("send resend otp for signup");
            //     return { code: global.SUCCESS, message: { keyword: 'rest_keyword_email_otp_success', content: { email: 'phone number' + ' ' + otpObj.country_code + phone_number } }, data: otpObj };
            // }

            // return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: {} };
        } catch (error) {
            console.error('Send/Resend otp:', error.message, error.stack);

            throw new Error('Send/Resend otp');
        }
    },

    //===============================0tp Verification==================================
    otpVerification: async (request) => {
        try {
            console.log(request, "Request data for OTP verification");

            const email = (request.email !== "" && request.email !== undefined && request.email !== null) ? request.email : "";
            const country_code = (request.country_code !== "" && request.country_code !== undefined && request.country_code !== null) ? request.country_code : "";
            const phone_number = (request.phone_number !== "" && request.phone_number !== undefined && request.phone_numberemail !== null) ? request.phone_number : "";

            if (!(phone_number && country_code) && !email) {
                console.log(request);
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keywords_check_email_phone_number_error', content: {} }, data: {} };
            }

            // Calculate 1 minute ago using Moment.js
            const oneMinuteAgo = moment().utc().subtract(3, 'minutes').format('YYYY-MM-DD HH:mm:ss');
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

            if (!isEmail) {
                const mobile_number = `+${country_code + phone_number}`;
                const otp = request.otp;
                const verifyOtp2Factor = await common.verifySmsOtp(mobile_number, otp);
                const verifyOtp = await OTP.findOne({
                    where: {
                        otp: request.session_id,
                        role: request.role,
                        generate_time: { [Op.gte]: oneMinuteAgo },
                        country_code: country_code,
                        phone_number: phone_number
                    }
                });

                console.log(verifyOtp, "verify res");


                if (verifyOtp && verifyOtp2Factor) {
                    findObj.role = request.role;
                    if (request.is_forget) {
                        const user = await User.findOne({
                            where: findObj
                        });

                        if (user) {
                            await User.update({ is_mobile_verified: true }, { where: { id: user.id } });

                            console.log(user.id, "forget password verification");

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
                }

                // OTP is either invalid or expired
                return {
                    code: global.OPRETION_FAILD,
                    message: { keyword: 'rest_keyword_invalid_or_expired_otp_error', content: {} },
                    data: {}
                };
            } else {
                const verifyOtp = await OTP.findOne({
                    where: {
                        otp: request.otp,
                        role: request.role,
                        generate_time: { [Op.gte]: oneMinuteAgo },
                        email: email
                    }
                });

                if (verifyOtp) {
                    findObj.role = request.role;

                    if (request.is_forget) {
                        const user = await User.findOne({
                            where: findObj
                        });

                        if (user) {
                            await User.update({ is_email_verified: true }, { where: { id: user.id } });
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
                }

                // OTP is either invalid or expired
                return {
                    code: global.OPRETION_FAILD,
                    message: { keyword: 'rest_keyword_invalid_or_expired_otp_error', content: {} },
                    data: {}
                };
            }

            // // Verify OTP
            // const verifyOtp = await OTP.findOne({
            //     where: {
            //         otp: request.otp,
            //         role: request.role,
            //         generate_time: { [Op.gte]: oneMinuteAgo }, // Check if generated within the last minute
            //         [Op.or]: [
            //             { email: email },
            //             {
            //                 phone_number: phone_number,
            //                 country_code: country_code
            //             }
            //         ]
            //     }
            // });

            // console.log(verifyOtp, "verify");

            // if (verifyOtp) {
            //     findObj.role = request.role;

            //     if (request.is_forget) {
            //         const user = await User.findOne({
            //             where: findObj
            //         });

            //         if (user) {
            //             if (isEmail) {
            //                 await User.update({ is_email_verified: true }, { where: { id: user.id } })
            //             } else {
            //                 await User.update({ is_mobile_verified: true }, { where: { id: user.id } })
            //             }

            //             console.log(user, "forget password verification");

            //             return {
            //                 code: global.SUCCESS,
            //                 message: { keyword: 'rest_keyword_email_otp_verify_success', content: {} },
            //                 data: { id: user.id }
            //             };
            //         }

            //     }

            //     console.log("simple signup verification");
            //     return {
            //         code: global.NO_CONTENT_SUCCESS,
            //         message: { keyword: 'rest_keyword_email_otp_verify_success', content: {} },
            //         data: {}
            //     };
            // } else {
            //     // OTP is either invalid or expired
            //     return {
            //         code: global.OPRETION_FAILD,
            //         message: { keyword: 'rest_keyword_invalid_or_expired_otp_error', content: {} },
            //         data: {}
            //     };
            // }

            // return { code: '0', message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: {} };
        } catch (error) {
            console.error('Otp verification:', error.message, error.stack);

            throw new Error('Otp verification');
        }
    },

    //change password
    createNewPassword: async (request) => {
        try {
            if (request.new_password === request.confirm_password) {

                const password = await enc_dec.encryptPlain(request.new_password);
                const new_password = await User.update({ password: password, is_temp_password: false }, { where: { id: request.id } });

                return { code: global.SUCCESS, message: { keyword: 'rest_keyword_new_password_success', content: {} }, data: {} };
            } else {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_confirm_password_error', content: {} }, data: {} };
            }

            // return { code: '0', message: { keyword: 'rest_keyword_somthing_went_wrong', content: {} }, data: {} };
        } catch (error) {
            console.error('Create Password:', error.message, error.stack);

            throw new Error('Create Password');
        }
    },

    changePassword: async (request) => {
        try {
            console.log(request);
            if (await Auth_Model.checkOldPassword(request.current_password)) {
                if (request.new_password === request.confirm_password) {

                    const password = await enc_dec.encryptPlain(request.new_password);
                    const new_password = await User.update({ password: password }, { where: { id: request._id } });

                    return { code: global.SUCCESS, message: { keyword: 'rest_keyword_change_password_success', content: {} }, data: {} };
                } else {
                    return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_confirm_password_error', content: {} }, data: {} };
                }
            } else {
                return { code: global.OPRETION_FAILD, message: { keyword: 'rest_keyword_old_password_error', content: {} }, data: {} };
            }
        } catch (error) {
            console.error('Change Password:', error.message, error.stack);

            throw new Error('Change Password');
        }
    },

    changeLanguage: async (request) => {
        try {
            const updateData = await User.update({ language_id: request.language_id }, { where: { id: request._id } });
            return { code: global.SUCCESS, message: { keyword: 'rest_keyword_change_update_language_success', content: {} }, data: {} };
        } catch (error) {
            console.error('Change langauge:', error.message, error.stack);

            throw new Error('Change Language');
        }
    },


    //==========================Delete single user==============================
    deleteUser: async (request) => {
        console.log(request);

        try {
            await User.update({ is_deleted: true }, { where: { id: request._id } });

            return {
                code: global.SUCCESS,
                message: { keyword: 'rest_keyword_account_deleted_success', content: {} },
                data: {},
            };

        } catch (error) {
           console.error('Delete User:', error.message, error.stack);

            throw new Error('Delete user'); 
        }
    },

    //==========================add contact us==============================
    addContactUs: async (request) => {
        try {
            // Prepare the data to be inserted
            const contactData = {
                first_name: request.first_name,
                last_name: request.last_name,
                email: request.email,
                subject: request.subject,
                description: request.description || null,
            };

            // Insert the data into the ContactUs table
            const insertData = await ContactUs.create(contactData);

            if (insertData && insertData.id) {
                return {
                    code: global.SUCCESS,
                    message: {
                        keyword: 'rest_keyword_contact_us_success',
                        content: {},
                    },
                    data: {},
                };
            }
        } catch (error) {
            console.error('Add Contact Us:', error.message, error.stack);

            throw new Error('Add Contact Us');
        }
    }

}

module.exports = Auth_Model