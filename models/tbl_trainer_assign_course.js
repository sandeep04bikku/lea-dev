const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const moment = require("moment");
const Course = require('./tbl_course');
const Trainer = require('./tbl_trainer');

const TrainerAssignCourse = sequelize.define('tbl_trainer_assign_courses', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  trainer_id: {
    allowNull:false,
    type: DataTypes.BIGINT
  },
  course_id: {
    allowNull:false,
    type: DataTypes.BIGINT
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

Course.hasMany(TrainerAssignCourse, {
  foreignKey: 'course_id',
  as: 'assign_trainer'
});

TrainerAssignCourse.belongsTo(Course, {
  foreignKey: 'course_id',
  as: 'assign_trainer'
});

Trainer.hasMany(TrainerAssignCourse, {
  foreignKey: 'trainer_id',
  as: 'trainer_details'
});

TrainerAssignCourse.belongsTo(Trainer, {
  foreignKey: 'trainer_id',
  as: 'trainer_details'
});

module.exports = TrainerAssignCourse;