const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Lession = require('./tbl_lession');

const UserLessionDetails = sequelize.define('tbl_user_lession_details', {
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
  course_id: {
    allowNull:false,
    type: DataTypes.BIGINT
  },
  lession_id:{
    allowNull:false,
    type:DataTypes.BIGINT
  },
  start_time:{
    allowNull:false,
    type:DataTypes.TIME
  },
  pause_time:{
    allowNull:false,
    type:DataTypes.TIME
  },
  is_completed:{
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

Lession.hasOne(UserLessionDetails, {
  foreignKey: 'lession_id',
  as: 'user_lession'
});

UserLessionDetails.belongsTo(Lession, {
  foreignKey: 'lession_id',
  as: 'user_lession'
});

module.exports = UserLessionDetails