const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");

const UserAttemptedTestDetails = sequelize.define('tbl_user_attempted_test_details', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  user_id: {
    allowNull: false,
    type: DataTypes.BIGINT
  },
  test_id: {
    allowNull: false,
    type: DataTypes.BIGINT
  },
  question_id: {
    allowNull: false,
    type: DataTypes.BIGINT
  },
  option_id: {
    allowNull: true,
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  is_correct:{
    allowNull:false,
    type:DataTypes.BOOLEAN,
    defaultValue:false
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

module.exports = UserAttemptedTestDetails