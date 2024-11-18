const course_model = require("./model");
const sendResponde = require("../../../../middleware/sendResponse");
const serverValidation = require("../../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../../middleware/encriptionDecription");
const global = require("../../../../config/constants");

//=======================add Course================================
exports.addCourse = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        const rules = {
            category_id: 'required',
            name: 'required',
            description: 'required',
            validity: 'required',
            price: 'required',
            image: 'required',
            file: 'required',
            language: 'required'
        }

        const message = {
            required: req.language.required,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await course_model.addCourse(request);
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

//=============================update Course data================================
exports.updateCourse = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        const rules = {
            id: 'required',
            category_id: 'required',
            name: 'required',
            description: 'required',
            validity: 'required',
            price: 'required',
            image: '',
            file: ''
        }

        const message = {
            required: req.language.required,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await course_model.updateCourse(request);
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

//===========================Delete Course data====================================
exports.deleteCourse = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        const rules = {
            id: 'required',
        }

        const message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await course_model.deleteCourse(request);
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

//==========================Change Course status active/blocked==================================
exports.changeCourseStatus = async (req, res) => {
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
            const { code, message, data } = await course_model.changeCourseStatus(request);
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

//========================get course list==============================================
exports.courseList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)
        request._id = req._id;
        request.role = req.role;

        rules = {
            id: '',
            language: "",
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
            const { code, message, data } = await course_model.CourseList(request);
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

//=======================add Multiple lession================================
exports.addLession = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        console.log(request);

        rules = {
            course_id: 'required',
            lession_data: 'required',
        }

        data_rules = {
            title: 'required',
            video: 'required',
            duration: 'required',
            file: ''
        }

        message = {
            required: req.language.required,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            if (await serverValidation.checkValidationRulesBatch(request.lession_data, res, data_rules, message)) {
                const { code, message, data } = await course_model.addLession(request);
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

//=============================update Lession data================================
exports.updateLession = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)
        // console.log(request);

        rules = {
            id: 'required',
            course_id: 'required',
            title: 'required',
            video: '',
            duration: 'required',
        }

        message = {
            required: req.language.required,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await course_model.updateLession(request);
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

//===========================Delete lession data====================================
exports.deleteLession = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        rules = {
            id: 'required',
            course_id: 'required'
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await course_model.deleteLession(request);
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

//===========================Delete lession data====================================
exports.deleteBulkLession = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        rules = {
            course_id: 'required',
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await course_model.deleteBulkLession(request);
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
exports.changeLessionStatus = async (req, res) => {
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
            const { code, message, data } = await course_model.changeLessionStatus(request);
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

//========================get lession list==============================================
exports.lessionList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        rules = {
            course_id: 'required',
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

        const response = await enc_dec_middleware.encryption(response_data);
        console.log("hello");

        res.status(500);
        res.send(response);
    }
};

//========================get enroll course user list==============================================
exports.enrollCourseUserList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)

        rules = {
            course_id: 'required',
            limit: '',
            page: '',
            sort: ''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await course_model.enrollCourseUserList(request);
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

//========================get enroll course user list==============================================
exports.courseReviewList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)
        request.role = req.role

        rules = {
            course_id: '',
            limit: '',
            page: '',
            sort: ''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await course_model.courseReviewList(request);
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

//=======================assign course to trainer================================
exports.assignCourse = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req);

        console.log(request);

        rules = {
            course_id: 'required',
            trainer_id: 'required',
        }


        message = {
            required: req.language.required,
            min: req.language.min,
            in: req.language.in,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {

            const { code, message, data } = await course_model.assignCourse(request);
            await sendResponde.send_response(req, res, code, message, data);

        }

    } catch (error) {
        console.error(error, "assign course");
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryption(response_data);

        res.status(500);
        res.send(response);
    }
};

//========================get course list==============================================
exports.trainerAssignCourseList = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryption(req)
        request._id = req._id;
        request.role = req.role;

        rules = {
            id: '',
            language: "",
            filter: '',
            search: '',
            limit: '',
            page: '',
            sort: ''
        }

        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await course_model.trainerAssignCourseList(request);
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

