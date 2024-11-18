const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Course = require('./tbl_course');

const DiscountCode = sequelize.define('tbl_discount_codes', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  course_id: {
    allowNull: false,
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  code: {
    allowNull: false,
    type: DataTypes.STRING
  },
  percentage: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  description: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  start_date: {
    allowNull: false,
    type: DataTypes.DATE
  },
  expiry_date: {
    allowNull: false,
    type: DataTypes.DATE
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

Course.hasMany(DiscountCode, {
  foreignKey: 'course_id',
  as: 'discount_course'
});

DiscountCode.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'discount_course'
});

module.exports = DiscountCode;