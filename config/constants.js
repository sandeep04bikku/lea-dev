const GLOBALS = {
  APP_NAME: 'Lea.Training',
  API_KEY: process.env.API_KEY,
  // BASE_URL:'http://localhost:3031/api/',
  // BASE_URL_WITHOUT_API: 'http://localhost:3031/api/v1/auth/',
  PORT_BASE_URL: 'http://localhost:3031/',
  BASE_URL_WITHOUT_PORT: process.env.BASE_URL_WITHOUT_PORT,
  LOGO: 'app_icon.png',
  ARROW_IMAGE: 'arrow-right.gif',
  KEY: process.env.KEY,
  IV: process.env.IV,
  //bucket url and folder details
  USER_FOLDER:'user_profile_image/',
  USER_CERTIFICATE:'user_test_certificate/',
  ADMIN:'admin/',
  CATEGORY:'category/',
  COURSE:'course/',
  COURSE_FILE:'course_file/',
  TRAINER:'trainer/',
  LESSION_VIDEO:'lession_video/',
  LESSION_FILE:'lession_file/',
  ANIMATED_VIDEO:'animated_video/',
  BLOG_IMAGE:'blog_image/',
  CORPORATE_PROFILE:'corporate_profile/',
  USER_GOVT_CERTIFICATE:'user_government_certificate/',
  TRAINER_EDU_CERTIFICATE:'trainer_education_certificate/',
  TRAINER_CERTIFICATION_CERTIFICATE:'trainer_certification_certificate/',
  COMPLAINT_FEEDBACK:'complaint_feedback',
  

  API_PASSWORD: process.env.API_PASSWORD,

  //============================================status code start==================================================
  // OPRETION_FAILD: 400,
  OPRETION_FAILD: 400,
  SUCCESS: 200,
  NO_CONTENT_SUCCESS: 204,
  UNAUTHORIZED_ACCESS: 401,
  INTERNAL_ERROR: 500,
  NO_DATA_FOUND: 404,
  EXIST_ERROR: 409
  //============================================status code end==================================================
};

module.exports = GLOBALS;