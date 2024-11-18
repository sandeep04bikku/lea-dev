const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const User = require('./tbl_user');
const Course = require('./tbl_course');
const Test = require('./tbl_test');

const UserAttemptTest = sequelize.define('tbl_user_attempt_tests', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  user_id: {
    allowNull:false,
    type: DataTypes.BIGINT
  },
  course_id:{
    allowNull:false,
    type:DataTypes.BIGINT
  },
  test_id:{
    allowNull:false,
    type:DataTypes.BIGINT
  },
  answers:{
    allowNull:true,
    type:DataTypes.TEXT
  },
  total_question_skip:{
    allowNull:false,
    type:DataTypes.BIGINT,
    defaultValue:0
  },
  total_question_attempt:{
    allowNull:false,
    type:DataTypes.BIGINT,
    defaultValue:0
  },
  correct_answer:{
    allowNull:false,
    type:DataTypes.INTEGER,
    defaultValue:0
  },
  wrong_answer:{
    allowNull:false,
    type:DataTypes.INTEGER,
    defaultValue:0
  },
  is_completed:{
    allowNull:false,
    type:DataTypes.BOOLEAN,
    defaultValue:false
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

User.hasMany(UserAttemptTest, {
  foreignKey: 'user_id',
  as: 'attempted_user'
});

UserAttemptTest.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'attempted_user'
});

Course.hasMany(UserAttemptTest, {
  foreignKey: 'course_id',
  as: 'attempted_Course'
});

UserAttemptTest.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'attempted_Course'
});

Test.hasMany(UserAttemptTest, {
  foreignKey: 'test_id',
  as: 'test_details'
});

UserAttemptTest.belongsTo(Test, {
  foreignKey: 'test_id',
  as: 'test_details'
});

module.exports = UserAttemptTest