const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Test = require('./tbl_test');

const TestQuestion = sequelize.define('tbl_questions', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  test_id: {
    allowNull:false,
    type: DataTypes.BIGINT
  },
  question:{
    allowNull:false,
    type:DataTypes.TEXT
  },
  answer:{
    allowNull:false,
    type:DataTypes.TEXT
  },
  marks_per_question:{
    allowNull:false,
    type:DataTypes.INTEGER
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

Test.hasMany(TestQuestion, {
  foreignKey: 'test_id',
  as: 'test_questions'
});

TestQuestion.belongsTo(Test, {
  foreignKey: 'test_id',
  as: 'test_questions'
});

module.exports = TestQuestion;