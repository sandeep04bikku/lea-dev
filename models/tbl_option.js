const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const TestQuestion = require('./tbl_question');

const Options = sequelize.define('tbl_options', {
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
  option:{
    allowNull:false,
    type:DataTypes.TEXT
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

TestQuestion.hasMany(Options, {
  foreignKey: 'question_id',
  as: 'option_details'
});

Options.belongsTo(TestQuestion, {
  foreignKey: 'question_id',
  as: 'option_details'
});

module.exports = Options