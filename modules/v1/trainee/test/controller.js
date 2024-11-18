const test_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");


//=========================get category list=================================
exports.randomTestList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id;

        rules = {
            course_id: 'required',
            language: ''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await test_model.randomTestList(request);
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

//=========================attempted test by user=================================
exports.userAttemptedTest = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id;

        rules = {
            course_id:'required',
            test_id: 'required',
            user_test_data:'required'
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await test_model.addUserAttemptedTest(request);
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

//=========================attempted test details by user=================================
exports.getAttemptedTestDetails = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id;

        rules = {
            test_id: '',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await test_model.getAttemptedTestDetails(request);
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

//=========================Download Cerificate by user=================================
exports.downloadCertificate = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id;

        rules = {
            course_id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await test_model.downloadCertificate(request);
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

//=========================user attempted test count=================================
exports.userAttemptedTestCount = async (req, res) => {
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
            const { code, message, data } = await test_model.userAttemptedTestCount(request);
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

//=========================pdf generate demo=================================
exports.pdfGenerate = async (req, res) => {
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
            const { code, message, data } = await test_model.pdfGenerate(request);
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