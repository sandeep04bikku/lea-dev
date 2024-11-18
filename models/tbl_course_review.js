const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const User = require('./tbl_user');

const CourseReview = sequelize.define('tbl_course_reviews', {
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
  user_id:{
    allowNull:false,
    type:DataTypes.BIGINT
  },
  rating: {
    allowNull:false,
    type: DataTypes.INTEGER
  },
  review:{
    allowNull:true,
    type:DataTypes.TEXT,
  },
  review_date: {
    allowNull: false,
    type: DataTypes.DATE,
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

User.hasMany(CourseReview, {
  foreignKey: 'user_id',
  as: 'user_course_review'
});

CourseReview.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user_course_review'
});

module.exports = CourseReview