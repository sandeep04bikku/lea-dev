const subadmin_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");

//=========================add sub admin=================================
exports.addSubAdmin = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)
        request._id = req._id
        request.role = req.role

        rules = {
            full_name: 'required',
            email: 'required|email',
            country_code: 'required',
            phone_number: 'required',
            password: 'required|min:8',
            image: 'required'
        }

        message = {
            required: req.language.required,
            email: req.language.email,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await subadmin_model.addSubAdmin(request);
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

//=========================update subadmin=================================
exports.updateSubAdmin = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)
        request._id = req._id
        request.role = req.role

        rules = {
            full_name: 'required',
            email: 'required|email',
            country_code: 'required',
            phone_number: 'required',
            image: ''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await subadmin_model.updateSubadmin(request);
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

//=========================delete subadmin=================================
exports.deleteSubadmin = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)
        request._id = req._id
        request.role = req.role

        rules = {
            id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await subadmin_model.deleteSubAdmin(request);
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

//=========================change subadmin status active/blocked=================================
exports.changeSubadminStatus = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)
        request._id = req._id
        request.role = req.role

        rules = {
            id: 'required',
            is_active: 'required'
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await subadmin_model.changeSubAdminStatus(request);
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

//=========================get subadmin list=================================
exports.subadminList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request._id = req._id
        request.role = req.role

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
            const { code, message, data } = await subadmin_model.subAdminList(request);
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

//=========================get permission module list=================================
exports.permissionModuleList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request._id = req._id
        request.role = req.role
        
        rules = {
            
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await subadmin_model.permissionModuleList(request);
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

//=========================get subadmin permission list by subadmin id=================================
exports.subadminPermissionList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request._id = req._id
        request.role = req.role
        
        rules = {
            subadmin_id:'required'
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await subadmin_model.subAdminPermissionList(request);
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

//=========================add subadmin permission=================================
exports.addPermission = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request._id = req._id
        request.role = req.role
        
        rules = {
            subadmin_id:'required',
            permissions:'required'
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await subadmin_model.addPermission(request);
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

//=========================update subadmin permission=================================
exports.updatePermission = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request._id = req._id
        request.role = req.role
        
        rules = {
            subadmin_id:'required',
            permissions:'required'
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await subadmin_model.updatePermission(request);
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