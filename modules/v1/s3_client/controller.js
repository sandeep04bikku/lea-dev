const s3_client_model = require("./model");
const sendResponde = require("../../../middleware/sendResponse");
const serverValidation = require("../../../middleware/validators");
const { t } = require("localizify");
const enc_dec_middleware = require("../../../middleware/encriptionDecription");
const global = require("../../../config/constants");

//=========================add category=================================
exports.imageUpload = async (req, res) => {
    try {
        const request = await enc_dec_middleware.decryptionCrptolib(req.body);
        request.role = req.role;
        request._id = req._id

        // rules = {
        //     bucket_folder_name: 'required',
        //     file_type: 'required',
        // }

        rules = {
            image_folders: 'required',
        }


        message = {
            required: req.language.required,
        }
        if (await serverValidation.checkValidationRules(request, res, rules, message)) {
            const { code, message, data } = await s3_client_model.imageUpload(request);
            await sendResponde.send_response(req, res, code, message, data);

        }

    } catch (error) {
        console.error(error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryptionCryptolib(response_data);;

        res.status(500);
        res.send(response);
    }
};