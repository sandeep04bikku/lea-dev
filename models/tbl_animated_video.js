const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const DiscountCode = require('./tbl_discount_code');
const Category = require('./tbl_category');
const global = require("../config/constants")

const AnimatedVideo = sequelize.define('tbl_animated_videos', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  category_id: {
    allowNull:false,
    type: DataTypes.BIGINT,
    defaultValue:0
  },
  discount_code_id: {
    allowNull:false,
    type: DataTypes.BIGINT,
    defaultValue:0
  },
  title:{
    allowNull:false,
    type:DataTypes.STRING
  },
  video_file:{
    allowNull:false,
    type:DataTypes.STRING,
    get() {
      const video_file = this.getDataValue('video_file');
      // Construct the full image URL based on the image filename
      return video_file ? `${process.env.S3_BASE_URL}${global.ANIMATED_VIDEO}${video_file}` : null;
    },
  },
  duration:{
    allowNull:false,
    type:DataTypes.TIME
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
//     videoUrl() {
//       return `${process.env.S3_BASE_URL}${global.ANIMATED_VIDEO}${this.video_file}`;
//     }
//   }
})

Category.hasMany(AnimatedVideo, {
  foreignKey: 'category_id',
  as: 'animated_video_category'
});

AnimatedVideo.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'animated_video_category'
});

DiscountCode.hasMany(AnimatedVideo, {
  foreignKey: 'discount_code_id',
  as: 'animated_video_discount'
});

AnimatedVideo.belongsTo(DiscountCode, {
  foreignKey: 'discount_code_id',
  as: 'animated_video_discount'
});

module.exports = AnimatedVideo