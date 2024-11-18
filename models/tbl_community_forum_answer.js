const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const CommunityForum = require('./tbl_community_forum');
const Admin = require('./tbl_admin');
const Trainer = require('./tbl_trainer');
const User = require('./tbl_user');

const CommunityForumAnswer = sequelize.define('tbl_community_forum_answers', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  community_forum_id: {
    allowNull: false,
    type: DataTypes.BIGINT
  },
  _id: {
    allowNull: false,
    type: DataTypes.BIGINT
  },
  role: {
    allowNull: false,
    type: DataTypes.ENUM('admin', 'trainer', 'user'),
  },
  answer: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  is_correct: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  answer_time: {
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

CommunityForum.hasMany(CommunityForumAnswer, {
  foreignKey: 'community_forum_id',
  as: 'community_forum_answer'
});

CommunityForumAnswer.belongsTo(CommunityForum, {
  foreignKey: 'community_forum_id',
  as: 'community_forum_answer'
});

Admin.hasMany(CommunityForumAnswer, {
  foreignKey: '_id',
  as: 'admin_answer'
});

CommunityForumAnswer.belongsTo(Admin, {
  foreignKey: '_id',
  as: 'admin_answer'
});

Trainer.hasMany(CommunityForumAnswer, {
  foreignKey: '_id',
  as: 'admin_answer'
});

CommunityForumAnswer.belongsTo(Trainer, {
  foreignKey: '_id',
  as: 'trainer_answer'
});

User.hasMany(CommunityForumAnswer, {
  foreignKey: '_id',
  as: 'user_answer'
});

CommunityForumAnswer.belongsTo(User, {
  foreignKey: '_id',
  as: 'user_answer'
});

module.exports = CommunityForumAnswer