const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");

const CourseOrder = sequelize.define('tbl_course_orders', {
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
  order_id: {
    allowNull: false,
    type: DataTypes.STRING
  },
  razorpay_order_id: {
    allowNull: false,
    type: DataTypes.STRING
  },
  razorpay_payment_id: {
    allowNull: false,
    type: DataTypes.STRING
  },
  razorpay_signature: {
    allowNull: false,
    type: DataTypes.STRING
  },
  currency: {
    allowNull: false,
    type: DataTypes.STRING(8)
  },
  amount: {
    allowNull: false,
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0
  },
  discount_code: {
    allowNull: true,
    type: DataTypes.STRING
  },
  discount: {
    allowNull: true,
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0
  },
  tax: {
    allowNull: true,
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0
  },
  quantity:{
    allowNull:false,
    type:DataTypes.INTEGER,
    defaultValue:0
  },
  payment_method: {
    allowNull: false,
    type: DataTypes.STRING
  },
  upi_id: {
    allowNull: true,
    type: DataTypes.STRING
  },
  upi_transaction_id: {
    allowNull: true,
    type: DataTypes.STRING
  },
  bank_transaction_id: {
    allowNull: true,
    type: DataTypes.STRING
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

module.exports = CourseOrder
