const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const global = require("../config/constants")

const Trainer = sequelize.define('tbl_trainers', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  country_code: {
    type: DataTypes.STRING(8),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    allowNull: true,
    type: DataTypes.STRING,
    defaultValue: null,
    get() {
      const image = this.getDataValue('image');
      // Construct the full image URL based on the image filename
      return image ? `${process.env.S3_BASE_URL}${global.TRAINER}${image}` : null;
    },
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  login_type: {
    type: DataTypes.ENUM,
    values: ['S'],
  },
  role: {
    type: DataTypes.ENUM,
    values: ['trainer'],
    defaultValue: 'trainer'
  },
  total_review: {
    allowNull: false,
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  avg_review: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
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
  // }, {
  //   getterMethods: {
  //     imageUrl() {
  //       console.log('Image field value:', this.image);
  //       return `${process.env.S3_BASE_URL}${global.TRAINER}${this.image}`;
  //     },
  //   }
})


module.exports = Trainer