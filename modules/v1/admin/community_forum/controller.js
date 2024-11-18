const community_forum_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");

//=========================add community forum answer=================================
exports.addCommunityForumAnswer = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request._id = req._id;
        request.role = req.role;
        console.log(request);

        const rules = {
            community_forum_id: 'required',
            answer: 'required',
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await community_forum_model.addCommunityForumAnswer(request);
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

//=========================get community forum list=================================
exports.communityForumList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request._id = req._id;
        request.role = req.role;

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
            const { code, message, data } = await community_forum_model.communityForumList(request);
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

//=========================get community forum answer list=================================
exports.communityForumAnswerList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request._id = req._id;
        request.role = req.role;

        const rules = {
            community_forum_id: 'required',
            id: '',
            page: '',
            limit: '',
            sort: ''
        }

        const message = {
            required: req.language.required,
        }

        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await community_forum_model.communityForumAnswerList(request);
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

//=========================update community forum correct answer=================================
exports.updateCorrectAnswer = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request._id = req._id;
        request.role = req.role;
        console.log(request);

        const rules = {
            id: 'required',
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await community_forum_model.updateCorrectAnswer(request);
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

//=========================add blog=================================
exports.addBlog = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request._id = req._id;
        request.role = req.role;

        const rules = {
            category_id: 'required',
            title: 'required',
            description: 'required',
            image: 'required',
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await community_forum_model.addBlog(request);
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

//=========================update blog=================================
exports.updateBlog = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request._id = req._id;
        request.role = req.role;

        const rules = {
            id:'required',
            category_id: 'required',
            title: 'required',
            description: 'required',
            image: 'required',
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await community_forum_model.updateBlog(request);
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

//=========================delete blog=================================
exports.deleteBlog = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        const rules = {
            id: 'required',
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await community_forum_model.deleteBlog(request);
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

//=========================change blog status active/blocked=================================
exports.changeBlogStatus = async (req, res) => {
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
            const { code, message, data } = await community_forum_model.changeBlogStatus(request);
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

//=========================get blog list=================================
exports.blogList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);
        request._id = req._id;
        request.role = req.role;

        const rules = {
            id: '',
            page: '',
            limit: '',
            sort: '',
            search:'',
            filter:''
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await community_forum_model.blogList(request);
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

