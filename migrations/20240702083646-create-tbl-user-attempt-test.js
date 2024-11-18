'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_user_attempt_tests', {
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
      course_id:{
        allowNull:false,
        type:Sequelize.BIGINT
      },
      test_id:{
        allowNull:false,
        type:Sequelize.BIGINT
      },
      answers:{
        allowNull:true,
        type:Sequelize.TEXT
      },
      total_question_skip:{
        allowNull:false,
        type:Sequelize.BIGINT,
        defaultValue:0
      },
      total_question_attempt:{
        allowNull:false,
        type:Sequelize.BIGINT,
        defaultValue:0
      },
      correct_answer:{
        allowNull:false,
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      wrong_answer:{
        allowNull:false,
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      is_completed:{
        allowNull:false,
        type:Sequelize.BOOLEAN,
        defaultValue:false
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
    await queryInterface.dropTable('tbl_user_attempt_tests');
  }
};