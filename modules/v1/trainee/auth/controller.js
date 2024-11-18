const auth_model = require("./model");
const dashboard_model = require("../../admin/dashboard/model");
const language_model = require("../../admin/language/model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");


//login
exports.signup = async (req, res) => {
    try {

        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        console.log(request);

        rules = {
            language_id: 'required',
            login_type: 'required',
            full_name: 'required',
            email: '',
            country_code: 'required',
            phone_number: 'required',
            password: 'required_if:login_type,S',
            social_id: 'required_if:login_type,A,F,G',
            device_name: 'required',
            device_token: 'required',
            device_type: 'required',
            os_version: 'required',
            app_version: 'required',
        }

        message = {
            required: req.language.required,
            email: req.language.email,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await auth_model.signup(request);
            await sendResponde.send_response(req, res, code, message, data);

        }

    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};

//login
exports.login = async (req, res) => {
    try {
        // console.log(req.body,"controller");
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request.role = req.role;
        // console.log(request);

        rules = {
            login_type: 'required',
            email: '',
            country_code: '',
            phone_number: '',
            password: 'required_if:login_type,S',
            social_id: 'required_if:login_type,A,F,G',
            device_name: 'required',
            device_token: 'required',
            device_type: 'required',
            os_version: 'required',
            app_version: 'required',
        }

        message = {
            required: req.language.required,
            email: req.language.email,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await auth_model.login(request);
            await sendResponde.send_response(req, res, code, message, data);

        }

    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};

//complete profile
exports.completeProfile = async (req, res) => {
    try {
        // console.log(req.body,"controller");
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request.role = req.role;
        request._id = req._id
        // console.log(request);

        rules = {
            image: '',
            dob: '',
            country_id: '',
            city_id: '',
            government_certificate: '',
            security_question: '',
            security_answer: '',
            organization: '',
            experience: '',
        }

        message = {
            required: req.language.required,
            email: req.language.email,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await auth_model.completeProfile(request);
            await sendResponde.send_response(req, res, code, message, data);

        }

    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};

//logout
exports.logout = async (req, res) => {
    try {
        // const request = await enc_dec_middleware.decryption(req)
        // request.admin_id = req.admin_id
        const { code, message, data } = await auth_model.logout(req);
        await sendResponde.send_response(req, res, code, message, data);

    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};

//get user
exports.getUser = async (req, res) => {
    try {

        const { code, message, data } = await auth_model.getUser(req);
        await sendResponde.send_response(req, res, code, message, data);

    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);

        res.status(500);
        res.send(response);
    }
};

//complete profile
exports.updateUser = async (req, res) => {
    try {
        // console.log(req.body,"controller");
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request.role = req.role;
        request._id = req._id
        // console.log(request);

        rules = {
            full_name: 'required',
            email: '',
            country_code: 'required',
            phone_number: 'required',
            image: '',
            dob: '',
            country_id: '',
            city_id: '',
            government_certificate: '',
            organization: '',
            experience: '',
        }

        message = {
            required: req.language.required,
            email: req.language.email,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await auth_model.updateUser(request);
            await sendResponde.send_response(req, res, code, message, data);

        }

    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};


//========================forget password===============================
exports.forgetPassword = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role

        console.log(request);

        rules = {
            email: '',
            phone_number: '',
            country_code: ''
        }

        message = {
            required: req.language.required,
            email: req.language.email,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await auth_model.forgetPassword(request);
            await sendResponde.send_response(req, res, code, message, data);

        }

    } catch (error) {
        console.log("controller error");
        console.error(error);
        const response_data = {
            code: "0",
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};

//========================Resend Otp===============================
exports.resendOtp = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role
        // console.log(request);

        rules = {
            is_forget: 'required',
            email: '',
            phone_number: '',
            country_code: ''
        }

        message = {
            required: req.language.required,
            email: req.language.email,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await auth_model.resendOtp(request);
            await sendResponde.send_response(req, res, code, message, data);

        }

    } catch (error) {
        console.log("controller error");
        console.error(error);
        const response_data = {
            code: "0",
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};

//verify otp to email 
exports.verifyOtp = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;

        rules = {
            email: '',
            phone_number: '',
            country_code: '',
            otp: 'required',
            session_id:'required',
            is_forget: 'required',
        }

        message = {
            required: req.language.required,
            required_if: req.language.required_if,
            email: req.language.email,
        }

        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await auth_model.otpVerification(request);
            await sendResponde.send_response(req, res, code, message, data);
        }
    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
}

//====================create new password========================
exports.createNewPassword = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role

        rules = {
            id: 'required',
            new_password: 'required|min:8',
            confirm_password: 'required|min:8',
        }

        message = {
            required: req.language.required,
            required_if: req.language.required_if,
            min: req.language.min,
        }

        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await auth_model.createNewPassword(request);
            await sendResponde.send_response(req, res, code, message, data);
        }
    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
}

//================= change password ======================
exports.changePassword = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id;
        rules = {
            current_password: 'required',
            new_password: 'required|min:8',
            confirm_password: 'required|min:8',
        }

        message = {
            required: req.language.required,
            required_if: req.language.required_if,
            min: req.language.min,
        }

        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await auth_model.changePassword(request);
            await sendResponde.send_response(req, res, code, message, data);
        }
    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
}

//================= change language ======================
exports.changeLanguage = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id;
        rules = {
            language_id: 'required',
        }

        message = {
            required: req.language.required,
        }

        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await auth_model.changeLanguage(request);
            await sendResponde.send_response(req, res, code, message, data);
        }
    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);

        res.status(500);
        res.send(response);
    }
}

//================= language list ======================
exports.languageList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id;

        rules = {
            id: '',
            filter: '',
            search: '',
            page: '',
            limit: '',
            sort: ''
        }

        message = {
            required: req.language.required,
        }

        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await language_model.languageList(request);
            await sendResponde.send_response(req, res, code, message, data);
        }
    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);

        res.status(500);
        res.send(response);
    }
}

//=========================get country list=================================
exports.countryList = async (req, res) => {
    try {
        
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id;

        rules = {
            id: '',
            page:'',
            limit:'',
            sort:''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await dashboard_model.countryList(request);
            await sendResponde.send_response(req, res, code, message, data);

        }

    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);

        res.status(500);
        res.send(response);
    }
};

//=========================get city list=================================
exports.cityList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id;

        rules = {
            country_id:'required',
            id: '',
            page:'',
            limit:'',
            sort:''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await dashboard_model.cityList(request);
            await sendResponde.send_response(req, res, code, message, data);

        }

    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);

        res.status(500);
        res.send(response);
    }
}

//===========================Delete user data====================================
exports.deleteUser = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id;

        rules = {
        
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await auth_model.deleteUser(request);
            await sendResponde.send_response(req, res, code, message, data);

        }

    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);

        res.status(500);
        res.send(response);
    }
};

//=========================add contact us=================================
exports.addContactUs = async (req, res) => {
    try {
        // console.log(req.body,"controller");
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id;

        rules = {
            first_name: 'required',
            last_name: 'required',
            email: 'required|email',
            subject: 'required',
            description: 'required',
        }

        message = {
            required: req.language.required,
            email: req.language.email,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await auth_model.addContactUs(request);
            await sendResponde.send_response(req, res, code, message, data);

        }

    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);

        res.status(500);
        res.send(response);
    }
};

