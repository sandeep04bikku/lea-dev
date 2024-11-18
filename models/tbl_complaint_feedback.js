const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const global = require('../config/constants')

const ComplaintFeedBack = sequelize.define('tbl_complaint_feedbacks', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  full_name: {
    allowNull:false,
    type: DataTypes.STRING
  },
  country_code:{
    allowNull:false,
    type: DataTypes.STRING(8)
  },
  phone_number:{
    allowNull:false,
    type: DataTypes.STRING(16)
  },
  description:{
    allowNull:false,
    type: DataTypes.TEXT
  },
  image:{
    allowNull:false,
    type:DataTypes.STRING,
    get() {
      const image = this.getDataValue('image');
      // Construct the full image URL based on the image filename
      return image ? `${process.env.S3_BASE_URL}${global.COMPLAINT_FEEDBACK}${image}` : null;
    },
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
})


module.exports = ComplaintFeedBack