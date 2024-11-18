const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const CorporateProfile = require('./tbl_corporate_profile');
const Course = require('./tbl_course');

const CorporateProfileCourse = sequelize.define('tbl_corporate_profile_courses', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  corporate_profile_id: {
    allowNull: false,
    type: DataTypes.BIGINT
  },
  course_id: {
    allowNull: false,
    type: DataTypes.BIGINT
  },
  price: {
    allowNull: true,
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
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

CorporateProfile.hasMany(CorporateProfileCourse, {
  foreignKey: 'corporate_profile_id',
  as: 'corporate_profile_course'
});

CorporateProfileCourse.belongsTo(CorporateProfile, {
  foreignKey: 'corporate_profile_id',
  as: 'corporate_profile_course'
});

Course.hasMany(CorporateProfileCourse, {
  foreignKey: 'corporate_profile_id',
  as: 'course_selection'
});

CorporateProfileCourse.belongsTo(Course, {
  foreignKey: 'corporate_profile_id',
  as: 'course_selection'
});

module.exports = CorporateProfileCourse;