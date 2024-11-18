const discouny_code_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");

//=========================add category=================================
exports.addDiscountCode = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)
        request.role = req.role;

        rules = {
            course_id: 'required',
            name: 'required',
            code: 'required',
            percentage: 'required',
            description: 'required',
            start_date: 'required',
            expiry_date: 'required'
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await discouny_code_model.addDiscountCode(request);
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

//=========================update category=================================
exports.updateDiscountCode = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)
        request.role = req.role;
        // console.log(request);

        rules = {
            id: 'required',
            course_id: 'required',
            name: 'required',
            code: 'required',
            percentage: 'required',
            description: 'required',
            start_date: 'required',
            expiry_date: 'required'
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await discouny_code_model.updateDiscountCode(request);
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

//=========================delete category=================================
exports.deleteDiscountCode = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)
        request.role = req.role;

        console.log(request);

        rules = {
            id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await discouny_code_model.deleteDiscountCode(request);
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

//=========================change category status active/blocked=================================
exports.changDiscountCodeStatus = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request.role = req.role;

        rules = {
            id: 'required',
            is_active: 'required'
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await discouny_code_model.changeDiscountCoderStatus(request);
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

//=========================get category list=================================
exports.discountCodeList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request.role = req.role;

        rules = {
            id: '',
            filter: '',
            search: '',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await discouny_code_model.discountCodeList(request);
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

//=========================get Discount usage by trainee list=================================
exports.discountUsage = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request.role = req.role;

        rules = {
            discount_code_id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await discouny_code_model.discountUsageList(request);
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