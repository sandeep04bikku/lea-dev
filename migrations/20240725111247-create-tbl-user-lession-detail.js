'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_user_lession_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      user_id: {
        allowNull:false,
        type: Sequelize.BIGINT
      },
      course_id: {
        allowNull:false,
        type: Sequelize.BIGINT
      },
      lession_id:{
        allowNull:false,
        type:Sequelize.BIGINT
      },
      start_time:{
        allowNull:false,
        type:Sequelize.TIME
      },
      pause_time:{
        allowNull:false,
        type:Sequelize.TIME
      },
      is_completed:{
        allowNull:false,
        type:Sequelize.BOOLEAN,
        defaultValue:false
      },
      createdAt: {
        allowNull: false,
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        field: "updated_at"
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_user_lession_details');
  }
};