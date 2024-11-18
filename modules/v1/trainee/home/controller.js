const home_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");
const category_model = require("../../admin/category/model");
const course_model = require("../../admin/course/model")


//=========================get category list=================================
exports.categoryList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id;

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
            const { code, message, data } = await category_model.categoryList(request);
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

//=========================get course list=================================
exports.courseList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request._id = req._id;
        request.role = req.role;

        rules = {
            language: 'required',
            id: '',
            category_id: '',
            filter: '',
            search: '',
            limit: '',
            page: '',
            sort: '',
            min_price: '',
            max_price: '',
            min_review: '',
            max_review: ''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await course_model.CourseList(request);
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

//=========================get course list=================================
exports.myCourseList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request.role = req.role;
        request._id = req._id;

        rules = {
            course_id: '',
            limit: '',
            page: '',
            sort: '',
            is_upcoming: '',
            is_completed: '',
            is_random_test:'required'
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await home_model.myCourseList(request);
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

//========================get lession list==============================================
exports.lessionList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request.role = req.role;
        request._id = req._id;

        rules = {
            course_id: 'required',
            language: 'required',
            id: '',
            limit: '',
            page: '',
            sort: ''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await course_model.lessionList(request);
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

//========================Add/Delete in/From favorite list==============================================
exports.addDeleteFavoriteCourse = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request.role = req.role
        request._id = req._id

        rules = {
            course_id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await home_model.addDeleteFavoriteCourse(request);
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

//=========================get favorite list=================================
exports.myFavoriteCourseList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id;

        rules = {
            limit: '',
            page: '',
            sort: '',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await home_model.myFavoriteCourseList(request);
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

//========================Add review rating of course==============================================
exports.addCourseReview = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request.role = req.role
        request._id = req._id

        rules = {
            course_id: 'required',
            rating: 'required',
            review: ''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await home_model.addCourseReview(request);
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

//========================get course review list==============================================
exports.courseReviewList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request.role = req.role
        request._id = req._id

        rules = {
            course_id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await home_model.courseReviewList(request);
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

//========================Add review rating of Trainer==============================================
exports.addTrainerReview = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request.role = req.role
        request._id = req._id

        rules = {
            trainer_id: 'required',
            rating: 'required',
            review: ''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await home_model.addTrainerReview(request);
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

//========================get trainer review list==============================================
exports.trainerReviewList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request.role = req.role
        request._id = req._id

        rules = {
            trainer_id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await home_model.trainerReviewList(request);
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

//========================add search data==============================================
exports.addSearchData = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request.role = req.role
        request._id = req._id

        rules = {
            course_id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await home_model.addSearchData(request);
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

//=========================get course list=================================
exports.recommendedCourseList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request._id = req._id;
        request.role = req.role;

        rules = {
            language: 'required',
            course_id: '',
            limit: '',
            page: '',
            sort: '',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await home_model.recommendedCourseList(request);
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

//========================Add user lession details==============================================
exports.addUserLessionDetails = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request.role = req.role
        request._id = req._id

        rules = {
            course_id: 'required',
            lession_id: 'required',
            start_time: 'required',
            pause_time: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await home_model.addUserLessionDetails(request);
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

//========================Add complaint feedback==============================================
exports.addComplaintFeedback = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body)
        request.role = req.role
        request._id = req._id

        rules = {
            full_name: 'required',
            country_code:'required',
            phone_number: 'required',
            description: 'required',
            image: 'required'
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await home_model.addComplaintFeedback(request);
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