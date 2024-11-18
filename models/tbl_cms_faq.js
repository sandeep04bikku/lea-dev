const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const State = require('./tbl_state');

const FAQ = sequelize.define('tbl_cms_faqs', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
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

module.exports = FAQ