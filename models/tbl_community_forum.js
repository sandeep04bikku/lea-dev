const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const User = require('./tbl_user');

const CommunityForum = sequelize.define('tbl_community_forums', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  user_id: {
    allowNull: false,
    type: DataTypes.BIGINT,
  },
  query: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  query_time: {
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

User.hasMany(CommunityForum, {
  foreignKey: 'user_id',
  as: 'query_user'
});

CommunityForum.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'query_user'
});

module.exports = CommunityForum