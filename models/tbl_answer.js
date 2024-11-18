const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const TestQuestion = require('./tbl_question');

const Answers = sequelize.define('tbl_answers', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  question_id: {
    allowNull:false,
    type: DataTypes.BIGINT
  },
  answer:{
    allowNull:false,
    type:DataTypes.STRING
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

TestQuestion.hasMany(Answers, {
  foreignKey: 'question_id',
  as: 'answers_details'
});

Answers.belongsTo(TestQuestion, {
  foreignKey: 'question_id',
  as: 'answers_details'
});

module.exports = Answers