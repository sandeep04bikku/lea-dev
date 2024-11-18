const auth_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants")


//=====================encryption=======================
exports.encryption = async (req, res) => {
    await enc_dec_middleware.encryptiondemo(req.body, res);
}

//=====================decryption=======================
exports.decryption = async (req, res) => {
    await enc_dec_middleware.decryptiondemo(req.body, res);
}


//login
exports.login = async (req, res) => {
    try {
    
        const request = await enc_dec_middleware.decryption(req)
        request.role = req.role;

        const rules = {
            email: 'required|email',
            password: 'required|min:8',
            login_type: 'required',
            device_name: 'required',
            device_token: 'required',
            device_type: 'required',
            os_version: 'required',
            app_version: 'required',
        }

        const message = {
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

        const response = await enc_dec_middleware.encryption(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};

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

        const response = await enc_dec_middleware.encryption(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};

exports.getAdmin = async (req, res) => {
    try {
        // const request = await enc_dec_middleware.decryption(req)
        // request.admin_id = req.admin_id
        const { code, message, data } = await auth_model.getAdmin(req);
        await sendResponde.send_response(req, res, code, message, data);

    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryption(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};


//========================forget password===============================
exports.forgetPassword = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        // console.log(request);

        const rules = {
            email: 'required|email',
        }

        const message = {
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
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryption(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};

//========================Resend Otp===============================
exports.resendOtp = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        // console.log(request);

        const rules = {
            email: 'required|email',
        }

        const message = {
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
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryption(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};

//verify otp to email 
exports.verifyOtp = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        const rules = {
            email: 'required|email',
            otp: 'required',
        }

        const message = {
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

        const response = await enc_dec_middleware.encryption(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
}

//====================create new password========================
exports.createNewPassword = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        const rules = {
            id: 'required',
            new_password: 'required|min:8',
            confirm_password: 'required|min:8',
        }

        const message = {
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

        const response = await enc_dec_middleware.encryption(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
}

//================= change password ======================
exports.changePassword = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        // console.log(request);
        request.admin_id = req._id;
        const rules = {
            old_password: 'required',
            new_password: 'required|min:8',
            confirm_password: 'required|min:8',
        }

        const message = {
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

        const response = await enc_dec_middleware.encryption(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
}

