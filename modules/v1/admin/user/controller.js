const user_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");


//=======================add single user================================
exports.addUser = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request.role = req.role;
        // console.log(request);

        rules = {
            corporate_profile_id: 'required',
            full_name: 'required',
            email: 'required|email',
            country_code: 'required',
            phone_number: 'required',
            password: 'required|min:8',
            country_id: '',
            city_id: '',
            image: '',
            dob: '',
            government_certificate: '',
            security_question: '',
            organization: '',
            experience: ''

        }

        message = {
            required: req.language.required,
            email: req.language.email,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await user_model.addUser(request);
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

//==========================add bulk user==============================
exports.addBulkUsers = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        rules = {
            users_data: 'required',
            corporate_profile_id: 'required',
        }

        bulkDatarules = {
            full_name: 'required',
            email: 'required|email',
            country_code: 'required',
            phone_number: 'required',
            password: 'required|min:8',
        }

        message = {
            required: req.language.required,
            email: req.language.email,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            if (await serverValidation.checkValidationRulesBatch(request.users_data, res, bulkDatarules, message)) {
                const { code, message, data } = await user_model.addBulkUsers(request);
                await sendResponde.send_response(req, res, code, message, data);
            }


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


//=============================update user data================================
exports.updateUser = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        rules = {
            id: 'required',
            email: 'required|email',
            country_code: 'required',
            phone_number: 'required',
            country_id: '',
            city_id: '',
            full_name: 'required',
            image: '',
            dob: '',
            government_certificate: '',
            security_question: '',
            security_answer: '',
            organization: '',
            experience: ''
        }

        message = {
            required: req.language.required,
            email: req.language.email,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await user_model.updateUser(request);
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

//===========================Delete user data====================================
exports.deleteUser = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        rules = {
            id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await user_model.deleteUser(request);
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

//==========================Change user status active/blocked==================================
exports.changeUserStatus = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        rules = {
            id: 'required',
            is_active: 'required'
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await user_model.changeUserStatus(request);
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

//========================get user list==============================================
exports.userList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        rules = {
            id: '',
            filter: '',
            search: '',
            sort: '',
            page: '',
            limit: ''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await user_model.userList(request);
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

