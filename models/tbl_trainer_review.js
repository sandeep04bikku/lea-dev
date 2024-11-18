const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const User = require('./tbl_user');

const TrainerReview = sequelize.define('tbl_trainer_reviews', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  trainer_id: {
    allowNull: false,
    type: DataTypes.BIGINT
  },
  user_id:{
    allowNull:false,
    type:DataTypes.BIGINT
  },
  rating: {
    allowNull:false,
    type: DataTypes.INTEGER
  },
  review:{
    allowNull:true,
    type:DataTypes.TEXT,
  },
  review_date: {
    allowNull: false,
    type: DataTypes.DATE,
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

User.hasMany(TrainerReview, {
  foreignKey: 'user_id',
  as: 'user_trainer_review'
});

TrainerReview.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user_trainer_review'
});

module.exports = TrainerReview