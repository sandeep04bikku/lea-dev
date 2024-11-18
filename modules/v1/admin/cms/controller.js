const cms_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");


//=========================add/update cms=================================
exports.addUpdateCms = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request.role = req.role;

        const rules = {
            tag_name: 'required',
            title: 'required',
            content: 'required'
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await cms_model.addUpdateCMS(request);
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

//=========================cms list=================================
exports.cmsList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request.role = req.role;

        const rules = {

        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await cms_model.cmsList(request);
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

//=========================delete cms all/single page=================================
exports.deleteCms = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        const rules = {
            id: '',
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await cms_model.deleteCms(request);
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

//=========================add/update FAQ=================================
exports.addUpdateFaq = async (req, res) => {
    try {
        // console.log(req.body,"controller");
        const request = await enc_dec_middleware.decryption(req);
        request.role = req.role;

        const rules = {
            id: '',
            question: 'required',
            answer: 'required'
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await cms_model.addUpdateFAQ(request);
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

//=========================faq list=================================
exports.faqList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        const rules = {
            id: '',
            page: '',
            limit: '',
            sort: ''
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await cms_model.faqList(request);
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

//=========================contact us list=================================
exports.contactUsList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        const rules = {
            id: '',
            page: '',
            limit: '',
            sort: ''
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await cms_model.contactUsList(request);
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



