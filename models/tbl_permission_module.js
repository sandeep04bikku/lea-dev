const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");

const PermissionModules = sequelize.define('tbl_permission_modules', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  name: {
    allowNull:false,
    type: DataTypes.STRING
  },
  is_view:{
    allowNull:false,
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  is_add:{
    allowNull:false,
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  is_edit:{
    allowNull:false,
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  is_delete:{
    allowNull:false,
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
  is_status:{
    allowNull:false,
    type: DataTypes.BOOLEAN,
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

module.exports = PermissionModules