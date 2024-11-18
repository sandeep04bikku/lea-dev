const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const global = require("../config/constants")

const Admin = sequelize.define('tbl_admins', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  admin_id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:0
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  country_code: {
    type: DataTypes.STRING(8),
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    allowNull: true,
    type: DataTypes.STRING,
    defaultValue: null,
    get() {
      const image = this.getDataValue('image');
      // Construct the full image URL based on the image filename
      return image ? `${process.env.S3_BASE_URL}${global.ADMIN}${image}` : null;
    },
  },
  login_type: {
    type: DataTypes.ENUM,
    values: ['S', 'F', 'A', 'G'],
  },
  role: {
    type: DataTypes.ENUM,
    values: ['admin', 'subadmin'],
    defaultValue: 'admin'
  },
  is_online: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
//       return `${process.env.S3_BASE_URL}${global.ADMIN}${this.image}`;
//     }
//   }
})


module.exports = Admin