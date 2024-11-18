const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const global = require("../config/constants")

const Course = sequelize.define('tbl_courses', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  category_id: {
    allowNull: false,
    type: DataTypes.BIGINT
  },
  language: {
    allowNull: true,
    type: DataTypes.STRING
  },
  type: {
    allowNull: true,
    type: DataTypes.STRING
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  description: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  duration: {
    allowNull: false,
    type: DataTypes.TIME,
    defaultValue: '00:00:00'
  },
  total_lession: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  price: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  avg_review: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total_review: {
    allowNull: false,
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  image: {
    allowNull: false,
    type: DataTypes.STRING,
    get() {
      const image = this.getDataValue('image');
      // Construct the full image URL based on the image filename
      return image ? `${process.env.S3_BASE_URL}${global.COURSE}${image}` : null;
    },
  },
  file: {
    allowNull: true,
    type: DataTypes.STRING,
    get() {
      const file = this.getDataValue('file');
      // Construct the full image URL based on the image filename
      return file ? `${process.env.S3_BASE_URL}${global.COURSE_FILE}${file}` : null;
    },
  },
  validity: {
    allowNull: true,
    type: DataTypes.STRING
  },
  total_purchage: {
    allowNull: false,
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  is_upcoming:{
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: "1-> Upcoming, 0-> On going"
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
  },
// }, {
//   getterMethods: {
//     imageUrl() {
//       return `${process.env.S3_BASE_URL}${global.COURSE}${this.image}`;
//     },
//     fileUrl() {
//       return this.file ? `${process.env.S3_BASE_URL}${global.COURSE_FILE}${this.file}` : null;
//     }
//   }
});



module.exports = Course