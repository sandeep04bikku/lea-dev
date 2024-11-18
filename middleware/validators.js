const Validator = require("Validator");
const enc_dec_middleware = require("./encriptionDecription");
const global = require("../config/constants");

//server side validation
exports.checkValidationRules = async (request, res, rules, message) => {

    try {
        // console.log(request);
        const v = Validator.make(request, rules, message);
        if (v.fails()) {
            const errors = v.getErrors();
            let error = "";

            for (const key in errors) {
                error = errors[key][0];
                // console.log(error);
                break;
            }
            const response_data = {
                code: global.OPRETION_FAILD,
                message: error,
                data:{}
            };

            let response = "";
            console.log(response);
            if (request.role !== "user") {
                response = await enc_dec_middleware.encryption(response_data);
            } else {
                response = await enc_dec_middleware.encryptionCryptolib(response_data);
            }

            res.status(200);
            res.send(response);

            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.log("Server validation rules error: ", error);
        throw error;
    }
}

exports.checkValidationRulesBatch = async (request, res, rules, message) => {
    try {
        let isValid = true;
        let error = "";

        for (const data of request) {
            const v = Validator.make(data, rules, message);
            if (v.fails()) {
                const errors = v.getErrors();
                for (const key in errors) {
                    error = errors[key][0];
                    isValid = false;
                    break;
                }
            }
            if (!isValid) {
                break;
            }
        }

        if (!isValid) {
            const response_data = {
                code: global.OPRETION_FAILD,
                message: error,
                data:{}
            };
            
            let response = ""
            if (request.role !== "user") {
                response = await enc_dec_middleware.encryption(response_data);
            } else {
                response = await enc_dec_middleware.encryptionCryptolib(response_data);
            }

            res.status(200).send(response);
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.log("Server validation rules error: ", error);
        throw error;
    }
}
