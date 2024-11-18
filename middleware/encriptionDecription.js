const cryptolib = require("cryptlib");
const shaKey = cryptolib.getHashSha256(process.env.KEY, 32);

const CryptoJS = require("crypto-js");
const SECRET = CryptoJS.enc.Utf8.parse(process.env.KEY);
const IV = CryptoJS.enc.Utf8.parse(process.env.IV);

//decryption
exports.decryption = async (req) => {
    try {
        if (req.body != undefined && Object.keys(req.body).length !== 0) {
            let request = JSON.parse(CryptoJS.AES.decrypt(req.body, SECRET, { iv: IV }).toString(CryptoJS.enc.Utf8))

            return request;
        }
        else {
            return {}
        }
    } catch (error) {
        console.error('Decryption error:', error.message, error.stack);

        throw new Error('Decryption error');
    }

}

//encryption
exports.encryption = async (data) => {
    try {
        // console.log(response_data,"dec");
        return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET, { iv: IV }).toString();
    } catch (error) {
        console.error('Encryption error:', error.message, error.stack);

        throw new Error('Encryption error');
    }
}

//encrypt plain data
exports.encryptPlain = async (data) => {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET, { iv: IV }).toString();
    } catch (e) {
        return '';
    }
}

//decrypt plain data
exports.decryptPlain = async (data) => {
    try {
        // console.log(data,"data");
        return JSON.parse(CryptoJS.AES.decrypt(data, SECRET, { iv: IV }).toString(CryptoJS.enc.Utf8));
    } catch (error) {

        return CryptoJS.AES.decrypt(data, SECRET, { iv: IV }).toString(CryptoJS.enc.Utf8);
    }
}


// -------------------------------------------------------- EncDec in apicall --------------------------------------------------------
exports.encryptiondemo = async (req, res) => {
    try {

        let data = await this.isJson(req);

        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET, { iv: IV }).toString();
        res.json(encryptedData);
    } catch (error) {
        console.error('Encryption Demo error:', error.message, error.stack);

        throw new Error('Encryption demo error');
    }
}

exports.decryptiondemo = async (req, res) => {
    try {
        // console.log(req,"req");
        const decryptedData = JSON.parse(CryptoJS.AES.decrypt(req, SECRET, { iv: IV }).toString(CryptoJS.enc.Utf8));
        // console.log(decryptedData,"dec");
        let data = await this.isJson(decryptedData);
        res.json(data);
    } catch (error) {
        console.error('Decryption demo error:', error.message, error.stack);

        throw new Error('Decryption demo error');
    }

}

// check req data is json or string
exports.isJson = async (req) => {
    try {
        const parsedObject = JSON.parse(req);
        return parsedObject;
        // return parsedObject;
    } catch (error) {

        return req;
    }

}

// ===================================crptolib enc-dec===================================================
//decryption
exports.decryptionCrptolib = async (encrypted_text) => {
    try {
        console.log(encrypted_text, "2");
        if (encrypted_text != undefined && Object.keys(encrypted_text).length != 0) {
            let request = JSON.parse(cryptolib.decrypt(encrypted_text, shaKey, process.env.IV));
            return request;

        } else {
            return {}
        }
    } catch (error) {
        console.error('Decryption cryptolib error:', error.message, error.stack);

        throw new Error('Decryption cryptolib error');
    }

}

//encryptions
exports.encryptionCryptolib = async (response_data) => {
    try {
        // console.log(response_data,"dec");
        if (response_data != undefined && Object.keys(response_data).length != 0) {

            let response = cryptolib.encrypt(JSON.stringify(response_data), shaKey, process.env.IV);
            return response;

        } else {
            return {}
        }
    } catch (error) {
        console.error('Encryption cryptolib error:', error.message, error.stack);

        throw new Error('Encryption cryptolib error');
    }
}

