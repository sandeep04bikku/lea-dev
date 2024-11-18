const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const PermissionModules = require('./tbl_permission_module');
const Admin = require('./tbl_admin');

const SubadminPermissions = sequelize.define('tbl_subadmin_permissions', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  subadmin_id:{
    allowNull:false,
    type:DataTypes.BIGINT
  },
  permission_module_id: {
    allowNull:false,
    type: DataTypes.BIGINT
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

PermissionModules.hasMany(SubadminPermissions, {
  foreignKey: 'permission_module_id',
  as: 'permission_module'
});

SubadminPermissions.belongsTo(PermissionModules, {
  foreignKey: 'permission_module_id',
  as: 'permission_module'
});

Admin.hasMany(SubadminPermissions, {
  foreignKey: 'subadmin_id',
  as: 'permission'
});

SubadminPermissions.belongsTo(Admin, {
  foreignKey: 'subadmin_id',
  as: 'permission'
});

module.exports = SubadminPermissions