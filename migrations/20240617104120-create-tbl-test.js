'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_tests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      course_id:{
        allowNull:false,
        type:Sequelize.BIGINT
      },
      name: {
        allowNull:false,
        type: Sequelize.STRING,
      },
      time_limit:{
        allowNull:false,
        type:Sequelize.TIME
      },
      total_marks:{
        allowNull:false,
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      instructions:{
        allowNull:false,
        type: Sequelize.JSON,
      },
      total_question:{
        allowNull:false,
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      is_deleted: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: "0-> Not Deleted, 1-> Deleted"
      },
      is_active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: "1-> Active,0-> Inactive"
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
    await queryInterface.dropTable('tbl_tests');
  }
};