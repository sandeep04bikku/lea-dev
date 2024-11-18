'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      category_id: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      language: {
        allowNull: true,
        type: Sequelize.STRING
      },
      type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      duration: {
        allowNull: false,
        type: Sequelize.TIME,
        defaultValue: '00:00:00'
      },
      total_lession: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      price: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      avg_review: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      total_review: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      image: {
        allowNull: false,
        type: Sequelize.STRING
      },
      file: {
        allowNull: true,
        type: Sequelize.STRING
      },
      validity: {
        allowNull: true,
        type: Sequelize.STRING
      },
      total_purchage: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      is_upcoming: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        comment: "1-> Upcoming, 0-> On going"
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
    await queryInterface.dropTable('tbl_courses');
  }
};