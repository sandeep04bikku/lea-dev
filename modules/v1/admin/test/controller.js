const test_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");

//=======================add Test================================
exports.addTest = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        rules = {
            course_id: 'required',
            name: 'required',
            time_limit: 'required',
            instructions: 'required',
        }

        message = {
            required: req.language.required,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await test_model.addTest(request);
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

//=============================update Test data================================
exports.updateTest = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        rules = {
            id: 'required',
            course_id: 'required',
            name: 'required',
            time_limit: 'required',
            instructions: 'required',
        }

        message = {
            required: req.language.required,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await test_model.updateTest(request);
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

//===========================Delete Test data====================================
exports.deleteTest = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        rules = {
            id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await test_model.deleteTest(request);
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

//==========================Change Test status active/blocked==================================
exports.changeTestStatus = async (req, res) => {
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
            const { code, message, data } = await test_model.changeTestStatus(request);
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

//========================get Test list==============================================
exports.testList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        rules = {
            id: '',
            filter_value: '',
            search_query: '',
            limit: '',
            page: '',
            sort: ''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await test_model.testList(request);
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

//=======================add Single Question================================
exports.addSingleQuestion = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        rules = {
            test_id: 'required',
            question: 'required',
            options: 'required',
            answer: 'required',
            marks_per_question: 'required',
        }

        message = {
            required: req.language.required,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {

            const { code, message, data } = await test_model.addSingleQuestion(request);
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

//=======================add Multiple Question================================
exports.addBulkQuestion = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        console.log(request);
        

        rules = {
            test_id: 'required',
            question_data: 'required',
        }

        data_rules = {
            question: 'required',
            options: 'required',
            answer: 'required',
            marks_per_question: 'required',
        }

        message = {
            required: req.language.required,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            if (await serverValidation.checkValidationRulesBatch(request.question_data, res, data_rules, message)) {
                const { code, message, data } = await test_model.addBulkQuestion(request);
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

//=============================update Question data================================
exports.updateQuestion = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        rules = {
            id: 'required',
            question: 'required',
            options: 'required',
            answer: 'required',
            marks_per_question: 'required',
        }

        message = {
            required: req.language.required,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await test_model.updateQuestion(request);
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

//===========================Delete Question data====================================
exports.deleteQuestion = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        rules = {
            id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await test_model.deleteQuestion(request);
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

//===========================Delete bulk Question data====================================
exports.deleteBulkQuestion = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        rules = {
            test_id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await test_model.deleteBulkQuestion(request);
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

//==========================Change Lession status active/blocked==================================
exports.changeQuestionStatus = async (req, res) => {
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
            const { code, message, data } = await test_model.changeQuestionStatus(request);
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

//========================get Test Question list==============================================
exports.testQuestionList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        rules = {
            id: '',
            limit: '',
            page: '',
            sort: ''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await test_model.testQuestionList(request);
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

exports.testAttempteduserList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        rules = {
            id: '',
            test_id:'required',
            limit: '',
            page: '',
            sort: ''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await test_model.testAttemptedUserList(request);
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

