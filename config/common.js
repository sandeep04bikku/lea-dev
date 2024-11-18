const GLOBALS = require("./constants");
const moment = require("moment");
const DeviceInfo = require("../models/tbl_device_info");
const axios = require("axios")

var commonFunction = {
    //generate token
    generateToken: async () => {
        try {
            let randtoken = require("rand-token").generator();
            let usersession = randtoken.generate(
                64,
                "0123456798abcdefghijklmnopqrstuvwxyz"
            );
            return usersession;
        } catch (error) {
            console.log("Generate token error", error);
            throw error;
        }

    },

    //update token for user
    checkUpdateToken: async (_id, request) => {

        try {
            let deviceObj = {
                _id: _id,
                role: request.role,
                device_name: request.device_name,
                device_token: request.device_token,
                device_type: request.device_type,
                os_version: request.os_version,
                app_version: request.app_version,
                last_login: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
                token: await commonFunction.generateToken(),

            }

            const isDeviceInfo = await DeviceInfo.findOne({ where: { _id: _id, role: request.role } });

            // console.log(isDeviceInfo);

            if (isDeviceInfo) {
                const updateToken = await DeviceInfo.update(deviceObj, { where: { _id: _id, role: request.role } });
                if (updateToken[0] !== 0) {
                    return updateToken;
                }
                return "";
            } else {
                const createToken = await DeviceInfo.create(deviceObj);
                if (createToken) {
                    return createToken;
                }
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },


    sendEmail: async (subject, toEmail, message) => {
        try {
            let transporter = require("nodemailer").createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_ID,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            let mailOptions = {
                from: process.env.EMAIL_ID,
                to: toEmail,
                subject: subject,
                html: message,
            };

            return await transporter.sendMail(mailOptions);

        } catch (error) {
            console.log("nodemailer Error:", error);
            throw error;
        }

    },

    // Common function to send OTP
    sendSmsOtp: async (mobileNumber) => {
        const apiKey = process.env.TWO_FACTOR_API_KEY;
        const url = `https://2factor.in/API/V1/${apiKey}/SMS/${mobileNumber}/AUTOGEN3/OTP_LoginLEA`;

        try {
            // Making the API call
            const response = await axios.post(url);

            // Checking if the API response is successful
            if (response.data.Status === 'Success') {
                console.log(response.data, 'OTP sent successfully');
                // Returning the session ID (Details) from the response
                return response.data.Details;
            } else {
                console.log('Failed to send OTP:', response.data.Details);
                return null;
            }
        } catch (error) {
            console.error('Error occurred while sending OTP:', error);
            return null;
        }
    },

    // Function to verify OTP
    verifySmsOtp: async (phoneNumber, otp) => {
        const apiKey = process.env.TWO_FACTOR_API_KEY;
        const url = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY3/${phoneNumber}/${otp}`;

        try {
            // Making the API call to verify OTP
            const response = await axios.post(url);

            // Checking if the response status is successful
            if (response.data.Status === 'Success') {
                console.log(response.data,'OTP verified successfully');
                return true;
            } else {
                console.log('Failed to verify OTP:', response.data.Details);
                return false;
            }
        } catch (error) {
            console.error('Error occurred while verifying OTP:', error);
            return false;
        }
    },

    //otp generate
    otp: async () => {
        try {
            const OTPCODE = Math.floor(1000 + Math.random() * 9000);
            return OTPCODE;
        } catch (error) {
            console.log("otp error: ", error);
            throw error;
        }

    },

    //email validation
    validateEmail: async (email) => {
        try {
            const regex =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(email);
        } catch (error) {
            console.log("email regex error: ", error);
            throw error;
        }

    },

    //email validation
    validatePhoneNumber: async (phone_number) => {
        try {
            // console.log(phone_number);
            const regex = /^\+(?:[0-9]\s?){10,14}[0-9]$/
            return regex.test(phone_number);
        } catch (error) {
            console.log("email regex error: ", error);
            throw error;
        }

    },

    generateOrderNumber: async () => {
        try {
            const timestamp = new Date().getTime(); // Get current timestamp
            const random = Math.floor(Math.random() * 10000); // Generate a random number

            // Combine timestamp and random number to create a unique order number
            const orderNumber = `${timestamp}${random}`;
            // console.log(orderNumber);

            return orderNumber;
        } catch (error) {
            console.log("generate order number error: ", error);
            throw error;
        }

    },


};

module.exports = commonFunction;
