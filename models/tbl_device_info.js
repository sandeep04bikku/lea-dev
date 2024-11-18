const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Admin = require('./tbl_admin');
const User = require('./tbl_user');
const Trainer = require('./tbl_trainer');

const DeviceInfo = sequelize.define('tbl_device_infos',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  _id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    index: true
  },
  role: {
    type: DataTypes.ENUM,
    values: ['user', 'admin', 'trainer'],
    defaultValue: 'user'
  },
  token: {
    type: DataTypes.STRING(1024),
    allowNull: true,
    defaultValue:null
  },
  device_token: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue:null
  },
  device_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  device_type: {
    type: DataTypes.ENUM,
    values:['A', 'I', 'W'],
    allowNull: false,
  },
  os_version: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  app_version: {
    type: DataTypes.STRING,
    allowNull:false
  },
  last_login:{
    allowNull:false,
    type:'TIMESTAMP',
    defaultValue:moment().utc().format('YYYY-MM-DD HH:mm:ss')
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

Admin.hasOne(DeviceInfo, {
  foreignKey: '_id',
  as: 'device_info',
});

DeviceInfo.belongsTo(Admin,{
  foreignKey:'_id',
  as: 'device_info',
})

User.hasOne(DeviceInfo, {
  foreignKey: '_id',
  as: 'user_device_info',
});

DeviceInfo.belongsTo(User,{
  foreignKey:'_id',
  as: 'user_device_info',
})

Trainer.hasOne(DeviceInfo, {
  foreignKey: '_id',
  as: 'trainer_device_info',
});

DeviceInfo.belongsTo(Trainer,{
  foreignKey:'_id',
  as: 'trainer_device_info',
})

module.exports = DeviceInfo