const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Category = require('./tbl_category');
const global = require("../config/constants");
const Cart = require('./tbl_cart');
const Course = require('./tbl_course');

const CartDetails = sequelize.define('tbl_cart_details', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  cart_id: {
    allowNull:false,
    type: DataTypes.BIGINT
  },
  course_id: {
    allowNull:false,
    type: DataTypes.BIGINT
  },
  quantity:{
    allowNull:false,
    type: DataTypes.INTEGER,
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

Cart.hasMany(CartDetails, {
  foreignKey: 'cart_id',
  as: 'cart_details'
});

CartDetails.belongsTo(Cart, {
  foreignKey: 'cart_id',
  as: 'cart_details'
});

Course.hasMany(CartDetails, {
  foreignKey: 'course_id',
  as: 'cart_course'
});

CartDetails.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'cart_course'
});

module.exports = CartDetails