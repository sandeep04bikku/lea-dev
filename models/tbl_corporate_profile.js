const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const global = require("../config/constants")

const CorporateProfile = sequelize.define('tbl_corporate_profiles', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
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
  image: {
    allowNull: true,
    type: DataTypes.STRING,
    defaultValue: null,
    get() {
      const image = this.getDataValue('image');
      // Construct the full image URL based on the image filename
      return image ? `${process.env.S3_BASE_URL}${global.CORPORATE_PROFILE}${image}` : null;
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
// },{
//   getterMethods: {
//     imageUrl() {
//       return `${process.env.S3_BASE_URL}${global.CORPORATE_PROFILE}${this.image}`;
//     }
//   }
});

module.exports = CorporateProfile;