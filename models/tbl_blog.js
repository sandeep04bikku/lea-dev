const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Category = require('./tbl_category');
const global = require("../config/constants")

const Blogs = sequelize.define('tbl_blogs', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  category_id: {
    allowNull: false,
    type: DataTypes.BIGINT
  },
  title: {
    allowNull: false,
    type: DataTypes.STRING
  },
  description: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  image: {
    allowNull: true,
    type: DataTypes.STRING,
    get() {
      const image = this.getDataValue('image');
      // Construct the full image URL based on the image filename
      return image ? `${process.env.S3_BASE_URL}${global.BLOG_IMAGE}${image}` : null;
    },
  },
  blog_date: {
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
// },{
//   getterMethods: {
//     imageUrl() {
//       return `${process.env.S3_BASE_URL}${global.BLOG_IMAGE}${this.image}`;
//     }
//   }
})

Category.hasMany(Blogs, {
  foreignKey: 'category_id',
  as: 'blog_category'
});

Blogs.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'blog_category'
});

module.exports = Blogs