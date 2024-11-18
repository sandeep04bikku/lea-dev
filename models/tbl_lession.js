const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Course = require('./tbl_course');
const global = require("../config/constants")

const Lession = sequelize.define('tbl_lessions', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  course_id: {
    allowNull: false,
    type: DataTypes.BIGINT
  },
  language: {
    allowNull: true,
    type: DataTypes.STRING
  },
  title: {
    allowNull: false,
    type: DataTypes.STRING
  },
  video: {
    allowNull: false,
    type: DataTypes.STRING,
    get() {
      const video = this.getDataValue('video');
      // Construct the full image URL based on the image filename
      return video ? `${process.env.S3_BASE_URL}${global.LESSION_VIDEO}${video}` : null;
    },
  },
  duration: {
    allowNull: false,
    type: DataTypes.TIME
  },
  file:{
    allowNull: true,
    type: DataTypes.STRING,
    get() {
      const file = this.getDataValue('file');
      // Construct the full image URL based on the image filename
      return file ? `${process.env.S3_BASE_URL}${global.LESSION_FILE}${file}` : null;
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
//     videoUrl() {
//       return `${process.env.S3_BASE_URL}${global.LESSION_VIDEO}${this.video}`;
//     },
//     fileUrl() {
//       return this.file ? `${process.env.S3_BASE_URL}${global.LESSION_FILE}${this.file}` : null;
//     }
//   }
})

Course.hasMany(Lession, {
  foreignKey: 'course_id',
  as: 'course_lession'
});

Lession.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'course_lession'
});

module.exports = Lession