const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const State = require('./tbl_state');
const User = require('./tbl_user');

const City = sequelize.define('tbl_cities', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  state_id: {
    allowNull: false,
    type: DataTypes.BIGINT
  },
  name: {
    allowNull: false,
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

// State model
State.hasMany(City, {
  foreignKey: 'state_id',
  as: 'cities'
});

// City model
City.belongsTo(State, {
  foreignKey: 'state_id',
  as: 'cities'
});

City.hasMany(User, {
  foreignKey: 'city_id',
  as: 'user_city'
});

User.belongsTo(City, {
  foreignKey: 'city_id',
  as: 'user_city'
});

module.exports = City