const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const global = require("../config/constants")

const User = sequelize.define('tbl_users', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  language_id:{
    allowNull:false,
    type:DataTypes.BIGINT,
    defaultValue:0
  },
  corporate_profile_id: {
    allowNull: false,
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  social_id: {
    allowNull: true,
    type: DataTypes.STRING
  },
  country_id: {
    allowNull: true,
    type: DataTypes.BIGINT,
  },
  city_id: {
    allowNull: true,
    type: DataTypes.BIGINT,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_temp_password: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: "0-> No, 1-> Yes"
  },
  image: {
    allowNull: true,
    type: DataTypes.STRING,
    defaultValue: null,
    get() {
      const image = this.getDataValue('image');
      // Construct the full image URL based on the image filename
      return image ? `${process.env.S3_BASE_URL}${global.USER_FOLDER}${image}` : null;
    },
    // set(value) {
    //   // You can add custom logic here if needed, for example, to sanitize the filename
    //   this.setDataValue('image', value);
    // }
  },
  login_type: {
    type: DataTypes.ENUM('S', 'F', 'A', 'G'),
  },
  role: {
    type: DataTypes.ENUM('user', 'other'),
    defaultValue: 'user'
  },
  dob: {
    allowNull: true,
    type: DataTypes.DATEONLY,
  },
  government_certificate: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const government_certificate = this.getDataValue('government_certificate');
      // Construct the full government certificate URL based on the certificate filename
      return government_certificate ? `${process.env.S3_BASE_URL}${global.USER_GOVT_CERTIFICATE}${government_certificate}` : null;
    }
  },
  security_question: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  security_answer:{
    allowNull:true,
    type:DataTypes.STRING
  },
  organization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_term_condition: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: "0-> Not Selected, 1-> Accept"
  },
  is_email_verified:{
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: "0-> Not Verify, 1-> Verified"
  },
  is_mobile_verified:{
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: "0-> Not Verify, 1-> Verified"
  },
  step: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  is_online: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_deleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    type: 'TIMESTAMP',
    defaultValue: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
    allowNull: false,
    field: "created_at"
  },
  updatedAt: {
    type: 'TIMESTAMP',
    defaultValue: moment().utc().format('YYYY-MM-DD HH:mm:ss'),
    allowNull: false,
    field: "updated_at"
  }
});

module.exports = User;