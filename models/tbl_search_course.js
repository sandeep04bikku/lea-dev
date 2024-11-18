const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Course = require('./tbl_course');

const SearchCourse = sequelize.define('tbl_search_courses', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  course_id: {
    allowNull:false,
    type: DataTypes.BIGINT
  },
  user_id:{
    allowNull:false,
    type:DataTypes.BIGINT
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

Course.hasMany(SearchCourse, {
  foreignKey: 'course_id',
  as: 'recommende_course'
});

SearchCourse.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'recommende_course'
});

module.exports = SearchCourse;