const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Trainer = require('./tbl_trainer');
const global = require("../config/constants")

const TrainerCertification = sequelize.define('tbl_trainer_certifications', {
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
  name: {
    allowNull:false,
    type: DataTypes.STRING
  },
  institution: {
    allowNull:false,
    type: DataTypes.STRING
  },
  certificate_image: {
    allowNull:false,
    type: DataTypes.STRING,
    get() {
      const certificate_image = this.getDataValue('certificate_image');
      // Construct the full image URL based on the image filename
      return certificate_image ? `${process.env.S3_BASE_URL}${global.TRAINER_CERTIFICATION_CERTIFICATE}${certificate_image}` : null;
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
//     certificateUrl() {
//       console.log('Image field value:', this.image);
//       return `${process.env.S3_BASE_URL}${global.TRAINER_CERTIFICATION_CERTIFICATE}${this.certificate_image}`;
//     },
//   }
})

// Define associations if needed
Trainer.hasMany(TrainerCertification, {
  foreignKey: 'trainer_id',
  as: 'trainer_certification'
});

TrainerCertification.belongsTo(Trainer, {
  foreignKey: 'trainer_id',
  as: 'trainer_certification'
});

module.exports = TrainerCertification