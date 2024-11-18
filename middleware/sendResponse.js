const Validator = require("Validator");
const { default: localizify } = require("localizify");
const { t } = require("localizify");
const enc_dec_middleware = require("./encriptionDecription");


const SendResponse = {

    //sending respponse to the server
    send_response: async (req, res, code, message, data) => {

        try {
            const translated_message = await SendResponse.getMessage(message);

            const response_data = {
                code: code,
                message: translated_message,
                data: data,
            };
            
            let response = ""
            if (req.role !== "user") {
                response = await enc_dec_middleware.encryption(response_data);
            } else {
                response = await enc_dec_middleware.encryptionCryptolib(response_data);
            }


            res.status(200);
            res.send(response);
        } catch (error) {
            console.log("Send response error: ", error);
            throw error;
        }


    },

    // send trastlated message
    getMessage: async (message) => {
        try {
            return (t(message.keyword, message.content))
        } catch (error) {
            console.log("get message error: ", error);
            throw error;
        }

    },

}

module.exports = SendResponse;