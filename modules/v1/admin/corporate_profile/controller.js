const corporate_profile_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");

//=========================add corporate profile=================================
exports.addCorporateProfile = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        const rules = {
            full_name: 'required',
            email: 'required|email',
            country_code: 'required',
            phone_number: 'required',
            image: 'required',
            course_id: 'required',
            price: 'required'
        }

        const message = {
            required: req.language.required,
            email: req.language.email,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await corporate_profile_model.addCorporateProfile(request);
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

//=========================delete corporate profile=================================
exports.deleteCorporateProfile = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        const rules = {
            id: 'required',
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await corporate_profile_model.deleteCorporateProfile(request);
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

//=========================change corporate profile status active/blocked=================================
exports.changeCorporateprofileStatus = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        const rules = {
            id: 'required',
            is_active: 'required'
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await corporate_profile_model.changeCorporateProfileStatus(request);
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
//=========================get corporate profile list=================================
exports.corporateProfileList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        const rules = {
            id: '',
            filter: '',
            search: '',
            page: '',
            limit: '',
            sort: '',
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await corporate_profile_model.corporateProfileList(request);
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

//=========================add corporate profile=================================
exports.courseAssignToUser = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        const rules = {
            user_id: 'required',
            course_id: 'required',
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await corporate_profile_model.assignCourseToUser(request);
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

