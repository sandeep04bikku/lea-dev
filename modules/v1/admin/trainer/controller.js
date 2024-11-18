const trainer_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");

//======================add single trainer===============================
exports.addSingleTrainer = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        rules = {
            full_name: 'required',
            email: 'required|email',
            country_code: 'required',
            phone_number: 'required',
            password: 'required|min:8',
            education_data: 'required',
            certification_data: 'required'
        }

        educationRule = {
            name: 'required',
            marks_in_percentage: 'required',
            university: 'required',
            certificate_image: 'required'
        }

        certificationRule = {
            name: 'required',
            institution: 'required',
            certificate_image: 'required'
        }

        message = {
            required: req.language.required,
            email: req.language.email,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            if (await serverValidation.checkValidationRulesBatch(request.education_data, res, educationRule, message)) {
                if (await serverValidation.checkValidationRulesBatch(request.certification_data, res, certificationRule, message)) {
                    const { code, message, data } = await trainer_model.addSingleTrainer(request);
                    await sendResponde.send_response(req, res, code, message, data);
                }
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

//====================================add bulk trainer=================================
exports.addBulktrainers = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        console.log(request,"request data for bulk trainer data");
        

        rules = {
            trainers_data: 'required',
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
            if (await serverValidation.checkValidationRulesBatch(request.trainers_data, res, bulkDatarules, message)) {
                const { code, message, data } = await trainer_model.AddBulkTrainer(request);
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


//=================================update trainer data======================================
exports.updateTrainer = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        console.log(request);

        rules = {
            id: 'required',
            full_name: 'required',
            email: 'required',
            country_code: 'required',
            phone_number: 'required',
            image: '',
            education_data: 'required',
            certification_data: 'required'
        }

        message = {
            required: req.language.required,
            email: req.language.email,
            min: req.language.min,
            in: req.language.in,
        }
        
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await trainer_model.updateTrainer(request);
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

//================================Delete trainer data====================================
exports.deleteTrainer = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        rules = {
            id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {

            const { code, message, data } = await trainer_model.deleteTrainer(request);
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

//=============================Change trainer status active/blocked===============================
exports.changeTrainerStatus = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        rules = {
            id: 'required',
            is_active: 'required'
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await trainer_model.changeTrainerStatus(request);
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

//============================get Trainer list==========================================
exports.trainerList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        rules = {
            trainer_id: '',
            filter_value: '',
            search_query: '',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await trainer_model.trainerList(request);
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

//============================get Trainer list==========================================
exports.trainerReviewList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request.role = req.role

        rules = {
            trainer_id: '',
            page:'',
            limit:''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await trainer_model.trainerReviewList(request);
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

