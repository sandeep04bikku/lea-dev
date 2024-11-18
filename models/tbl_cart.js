const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Category = require('./tbl_category');
const global = require("../config/constants")

const Cart = sequelize.define('tbl_carts', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  user_id: {
    allowNull:false,
    type: DataTypes.BIGINT,
  },
  discount:{
    allowNull:false,
    type:DataTypes.DECIMAL(8,2),
    defaultValue:0
  },
  tax:{
    allowNull:false,
    type:DataTypes.DECIMAL(8,2),
    defaultValue:0
  },
  quantity:{
    allowNull:false,
    type:DataTypes.INTEGER,
    defaultValue:0
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

module.exports = Cart