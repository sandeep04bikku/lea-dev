const dashboard_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");


//login
exports.AdminDashboard = async (req, res) => {
    try {
        // console.log(req.body,"controller");
        const request = await enc_dec_middleware.decryption(req)
 

        rules = {
          
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await dashboard_model.adminDashboard(request);
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

//=========================get country list=================================
exports.countryList = async (req, res) => {
    try {
        
        const request = await enc_dec_middleware.decryption(req);

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

        const response = await enc_dec_middleware.encryption(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};

//=========================get category list=================================
exports.cityList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

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

        const response = await enc_dec_middleware.encryption(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
}

