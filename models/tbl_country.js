const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const User = require('./tbl_user');

const Country = sequelize.define('tbl_countries', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  code:{
    allowNull:false,
    type:DataTypes.STRING(8)
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  country_code:{
    allowNull:false,
    type:DataTypes.STRING(8)
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

Country.hasMany(User, {
  foreignKey: 'country_id',
  as: 'user_country'
});

User.belongsTo(Country, {
  foreignKey: 'country_id',
  as: 'user_country'
});

module.exports = Country