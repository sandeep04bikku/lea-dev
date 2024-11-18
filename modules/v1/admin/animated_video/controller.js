const animated_video_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");

//=========================add animated video=================================
exports.addAnimatedVideo = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        const rules = {
            category_id: '',
            discount_code_id: '',
            title: 'required',
            video_file: 'required',
            duration: 'required'
        }

        const message = {
            required: req.language.required,
        }

        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await animated_video_model.addAnimatedVideo(request);
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

//=========================update animated video=================================
exports.updateAnimatedVideo = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        const rules = {
            id: 'required',
            category_id: '',
            discount_code_id: '',
            title: 'required',
            video_file: 'required',
            duration: 'required'
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await animated_video_model.updateAnimatedVideo(request);
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

//=========================delete Animated video=================================
exports.deleteAnimatedVideo = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        const rules = {
            id: 'required',
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await animated_video_model.deleteAnimatedVideo(request);
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

//=========================change animated video status active/blocked=================================
exports.changeAnimatedVideoStatus = async (req, res) => {
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
            const { code, message, data } = await animated_video_model.changeAnimatedVideoStatus(request);
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

//=========================get Animated video list=================================
exports.animatedVideoList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        const rules = {
            id: '',
            filter: '',
            search: '',
            limit: '',
            page: '',
            sort: ''
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await animated_video_model.anmatedVideoList(request);
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

