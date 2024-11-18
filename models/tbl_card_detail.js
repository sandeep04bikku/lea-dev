const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");

const CardDetails = sequelize.define('tbl_card_details', {
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
  card_id: {
    allowNull: false,
    type: DataTypes.STRING
  },
  last4: {
    allowNull: false,
    type: DataTypes.STRING
  },
  network: {
    allowNull: false,
    type: DataTypes.STRING
  },
  type: {
    allowNull: false,
    type: DataTypes.STRING
  },
  issuer: {
    allowNull: true,
    type: DataTypes.STRING
  },
  name:{
    allowNull:true,
    type:DataTypes.STRING
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

module.exports = CardDetails