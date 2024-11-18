const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Course = require('./tbl_course');
const User = require('./tbl_user');
const globle = require("../config/constants")

const UserCourse = sequelize.define('tbl_user_courses', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  user_id: {
    allowNull: false,
    type: DataTypes.BIGINT,
  },
  course_id: {
    allowNull: false,
    type: DataTypes.BIGINT,
  },
  order_id: {
    allowNull: false,
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  certificate: {
    allowNull: true,
    type: DataTypes.STRING,
    get() {
      const certificate = this.getDataValue('certificate');
      // Construct the full image URL based on the image filename
      return certificate ? `${process.env.S3_BASE_URL}${globle.USER_CERTIFICATE}${certificate}` : null;
    },
  },
  is_completed: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_test_completed: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  purchage_date: {
    allowNull: false,
    type: DataTypes.DATE
  },
  total_watch_lession: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_expired: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: "1-> expired, 0-> Not Expired"
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
//     certificateUrl() {
//       return this.certificate ? `${process.env.S3_BASE_URL}${globle.USER_CERTIFICATE}${this.certificate}` : null;
//     }
//   }
})

Course.hasMany(UserCourse, {
  foreignKey: 'course_id',
  as: 'user_course'
});

UserCourse.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'user_course'
});

User.hasMany(UserCourse, {
  foreignKey: 'user_id',
  as: 'enroll_user'
});

UserCourse.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'enroll_user'
});

module.exports = UserCourse;
