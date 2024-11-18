const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Course = require('./tbl_course');

const Test = sequelize.define('tbl_tests', {
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
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  time_limit: {
    allowNull: false,
    type: DataTypes.TIME
  },
  total_marks: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  instructions: {
    allowNull: false,
    type: DataTypes.JSON, // JSON field to store the array of objects
  },
  total_question: {
    allowNull: false,
    type: DataTypes.INTEGER,
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
})

Course.hasMany(Test, {
  foreignKey: 'course_id',
  as: 'test_course'
});

Test.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'test_course'
});

module.exports = Test;