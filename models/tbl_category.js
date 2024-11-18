const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Course = require('./tbl_course');
const global = require("../config/constants")

const Category = sequelize.define('tbl_categories',{
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
  image:{
    allowNull:false,
    type:DataTypes.STRING,
    get() {
      const image = this.getDataValue('image');
      // Construct the full image URL based on the image filename
      return image ? `${process.env.S3_BASE_URL}${global.CATEGORY}${image}` : null;
    },
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
// },{
//   getterMethods: {
//     imageUrl() {
//       return `${process.env.S3_BASE_URL}${global.CATEGORY}${this.image}`;
//     }
//   }
})

Category.hasMany(Course, {
  foreignKey: 'category_id',
  as: 'course_category'
});

Course.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'course_category'
});

module.exports = Category