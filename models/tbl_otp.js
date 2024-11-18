const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");

const OTP = sequelize.define('tbl_otps',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  role: {
    type: DataTypes.ENUM,
    values: ['user', 'admin', 'trainer'],
    defaultValue: 'user'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country_code: {
    type: DataTypes.STRING(8),
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.STRING(16),
    allowNull: true,
  },
  otp:{
    allowNull:false,
    type:DataTypes.STRING
  },
  generate_time:{
    allowNull:false,
    type:DataTypes.DATE,
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
})



module.exports = OTP