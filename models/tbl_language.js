const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const User = require('./tbl_user');

const Language = sequelize.define('tbl_languages', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  code: {
    allowNull: false,
    type: DataTypes.STRING
  },
  native_name: {
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

Language.hasMany(User, {
  foreignKey: 'language_id',
  as: 'user_language'
});

User.belongsTo(Language, {
  foreignKey: 'language_id',
  as: 'user_language'
});

module.exports = Language