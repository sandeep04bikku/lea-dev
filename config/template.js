const GLOBALS = require('./constants');

// ===============================sms template for send email================================

// Forget Password OTP SMS template
exports.forgetPasswordSms = async () => {

    const template = `Hey! Your OTP code is {{OTP}}. Please do not share it with anyone.`;

    return template;
}

// Sign up verify OTP SMS template
exports.signupPhoneVerifySms = async () => {

    const template = `Hey! Your OTP code is {{OTP}}. Please do not share it with anyone.`;

    return template;

}

// ===============================email template for send email================================

// Verify Email mail template - Done
exports.verifyEmail = async (result) => {

    const template = `<h1>Hey! Your otp code is ${result.otp}</h1>`;
    return template;
}

// Verify Email mail template - Done
exports.forgetPassword = async (result) => {

    const template = `<h1>Hey! Your otp code is ${result.otp}</h1>`;

    return template;
}

exports.emailVerification = async (result) => {

    const template = `<h1>Hey! Your otp code is ${result.otp}</h1>`;

    return template;
}

// send login credential to trainer 
exports.trainerLoginCredential = async (email, password) => {

    const template = `<div><h1>Hey! Your login credential for lia.traning</h1><br></br><p>Email: ${email}</p><p>Password: ${password}</p></div>`;
    return template;
}

// send login credential to trainer 
exports.subAdminLoginCredential = async (email, password) => {

    const template = `<div><h1>Hey! Your login credential for lia.traning</h1><br></br><p>Email: ${email}</p><p>Password: ${password}</p></div>`;
    return template;
}

// send login credential to user
exports.userLoginCredential = async (phone_number, password) => {

    const template = `<div><h1>Hey! Your login credential for lia.traning</h1><br></br><p>Phone Number: ${phone_number}</p><p>Password: ${password}</p></div>`;
    return template;
}

// htmlTemplates for test certificate
exports.testCertificateHTML = async () => {

    return `
  <html>
    <body>
      <h1>You have successfully completed your test</h1>
    </body>
  </html>
`;
}

