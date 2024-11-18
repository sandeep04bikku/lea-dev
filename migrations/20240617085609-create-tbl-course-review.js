'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_course_reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      course_id: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      rating: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      review: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      review_date: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('tbl_course_reviews');
  }
};