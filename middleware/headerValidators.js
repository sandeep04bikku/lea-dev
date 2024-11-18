const { default: localizify } = require("localizify");
const { t } = require("localizify");
const en = require("../language/en");
const global = require("../config/constants")
const cryptolib = require("cryptlib");
const shaKey = cryptolib.getHashSha256(process.env.KEY, 32);
const enc_dec_middleware = require("./encriptionDecription");
const DeviceInfo = require("../models/tbl_device_info");


const bypassMethods = new Array('login-admin', 'decryption_demo', 'encryption_demo', 'forget-password', 'resend-otp', 'verify-otp', 'create-new-password', 'signup-user', 'login-user', 'login-trainer', 'cms-list');
const apiKeyBypassMethods = new Array('decryption_demo', 'encryption_demo');
const validHeaderTypes = ["admin", "trainer", "user"]; // Replace with your actual valid types

// translate message and set language
exports.extractHeaderLanguage = async (req, res, next) => {

    try {

        const supportedLanguages = ['en'];

        const headerlang = (req.headers['accept-language'] != undefined && req.headers['accept-language'] != "") ? req.headers['accept-language'] : 'en';

        // Validate if the requested language is supported, fallback to 'en' if not supported
        const selectedLanguage = supportedLanguages.includes(headerlang) ? headerlang : 'en';

        let translations = {
            'en': en,
        };

        req.lang = selectedLanguage;
        // console.log(headerlang,"headderlang");
        localizify
            .add('en', en)
            .setLocale(req.lang);

        req.language = (selectedLanguage == 'en') ? en : translations[headerlang]
        // console.log(req.lang,"lang");

        next()
    } catch (error) {
        console.log("Header language: ", error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        const response = await enc_dec_middleware.encryption(response_data);

        res.status(500);
        res.send(response);
    }

}

//validate api key
exports.validateApiKey = async (req, res, next) => {
    try {
        const api_key = (req.headers['api-key'] != undefined && req.headers['api-key'] != "") ? req.headers['api-key'] : '';
        const path_data = req.path.split("/")

        if (apiKeyBypassMethods.indexOf(path_data[5]) === -1) {
            // console.log(api_key);
            if (api_key != "") {

                let dec_apiKey = "";

                if (req.role !== "user") {
                    dec_apiKey = await enc_dec_middleware.decryptPlain(api_key)
                } else {
                    dec_apiKey = cryptolib.decrypt(api_key, shaKey, process.env.IV);
                }

                // console.log(dec_apiKey);
                // console.log(process.env.API_KEY);
                // console.log(dec_apiKey === process.env.API_KEY);

                if (dec_apiKey != "" && dec_apiKey == process.env.API_KEY) {
                    next();
                } else {
                    const response_data = {
                        code: global.UNAUTHORIZED_ACCESS,
                        message: t("header_key_value_incorrect")
                    }

                    let response = "";
                    if (req.role !== "user") {
                        response = await enc_dec_middleware.encryption(response_data);
                    } else {
                        response = await enc_dec_middleware.encryptionCryptolib(response_data);
                    }

                    res.status(401);
                    res.send(response);

                }

            } else {
                const response_data = {
                    code: global.UNAUTHORIZED_ACCESS,
                    message: t("header_key_value_incorrect")
                }

                let response = "";
                if (req.role !== "user") {
                    response = await enc_dec_middleware.encryption(response_data);
                } else {
                    response = await enc_dec_middleware.encryptionCryptolib(response_data);
                }

                res.status(401);
                res.send(response);

            }
        } else {
            next();
        }

    } catch (error) {
        console.log("api key error: ", error);
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        let response = "";
        if (req.role !== "user") {
            response = await enc_dec_middleware.encryption(response_data);
        } else {
            response = await enc_dec_middleware.encryptionCryptolib(response_data);
        }



        res.status(500);
        res.send(response);
    }
}


//header token validation for user
exports.validateHeaderToken = async (req, res, next) => {
    try {
        const headerToken = (req.headers['token'] != undefined && req.headers['token'] != "") ? req.headers['token'] : "";
        const headerType = (req.headers['type'] != undefined && req.headers['type'] != "") ? req.headers['type'] : "";

        const path_data = req.path.split("/")
        // console.log(path_data);
        if (bypassMethods.indexOf(path_data[5]) === -1) {
            if (headerToken != "") {

                let dec_token = "";

                if (headerType === "admin" || headerType === "trainer") {

                    dec_token = await enc_dec_middleware.decryptPlain(headerToken);

                } else if (headerType === "user") {

                    dec_token = cryptolib.decrypt(headerToken, shaKey, process.env.IV);
                }

                // console.log(dec_token);
                if (dec_token !== undefined && dec_token !== "" && headerType !== "") {

                    // console.log(headerType,"------",headerToken);

                    req.role = headerType;

                    const isTokenExist = await DeviceInfo.findOne({ where: { token: dec_token, role: headerType } });
                    if (isTokenExist) {
                        req._id = isTokenExist._id;
                        next();
                    } else {
                        let response_data = {
                            code: global.UNAUTHORIZED_ACCESS,
                            message: t("header_authorization_token_error")
                        }

                        let response = "";
                        if (req.role !== "user") {
                            response = await enc_dec_middleware.encryption(response_data);
                        } else {
                            response = await enc_dec_middleware.encryptionCryptolib(response_data);
                        }

                        res.status(401);
                        res.send(response);
                    }

                } else {
                    let response_data = {
                        code: global.UNAUTHORIZED_ACCESS,
                        message: t("header_authorization_token_error")
                    }

                    let response = "";
                    if (req.role !== "user") {
                        response = await enc_dec_middleware.encryption(response_data);
                    } else {
                        response = await enc_dec_middleware.encryptionCryptolib(response_data);
                    }

                    res.status(401);
                    res.send(response);

                }

            } else {
               let response_data = {
                    code: global.UNAUTHORIZED_ACCESS,
                    message: t("header_authorization_token_error")
                }

                let response = "";
                if (req.role !== "user") {
                    response = await enc_dec_middleware.encryption(response_data);
                } else {
                    response = await enc_dec_middleware.encryptionCryptolib(response_data);
                }

                res.status(401);
                res.send(response);

            }
        } else {
            next();
        }
    } catch (error) {
        console.log("Header token error: ", error);
        let response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        }

        let response = "";
        if (req.role !== "user") {
            response = await enc_dec_middleware.encryption(response_data);
        } else {
            response = await enc_dec_middleware.encryptionCryptolib(response_data);
        }

        res.status(500);
        res.send(response);
    }

}

exports.validateHeaderType = async (req, res, next) => {
    try {

        const headerType = (req.headers['type'] !== undefined && req.headers['type'] !== "") ? req.headers['type'] : "";

        // console.log(validHeaderTypes.includes(headerType));
        if (headerType !== "" && validHeaderTypes.includes(headerType)) {
            req.role = headerType;
            next();
        } else {
            const response_data = {
                code: global.UNAUTHORIZED_ACCESS,
                message: t("header_authorization_type_error")
            };

            let response = "";
            if (req.role !== "user") {
                response = await enc_dec_middleware.encryption(response_data);
            } else {
                response = await enc_dec_middleware.encryptionCryptolib(response_data);
            }

            res.status(401).send(response);
        }
    } catch (error) {
        const response_data = {
            code: global.INTERNAL_ERROR,
            message: t('rest_keyword_somthing_went_wrong')
        };

        let response = "";
        if (req.role !== "user") {
            response = await enc_dec_middleware.encryption(response_data);
        } else {
            response = await enc_dec_middleware.encryptionCryptolib(response_data);
        }

        res.status(500).send(response);
    }
};