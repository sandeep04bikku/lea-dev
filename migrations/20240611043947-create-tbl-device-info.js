'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_device_infos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      _id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        index: true // Add index to userId
      },
      role: {
        type: Sequelize.ENUM('user','admin', 'trainer'),
        defaultValue: 'user'
      },
      token: {
        allowNull: true,
        type: Sequelize.STRING(1024)
      },
      device_token: {
        allowNull: true,
        type: Sequelize.STRING
      },
      device_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      device_type: {
        allowNull: false,
        type: Sequelize.ENUM('A', 'I', 'W'),
        comment: "A-> Android, I-> IOS, W-> Website"
      },
      os_version: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      app_version: {
        allowNull: false,
        type: Sequelize.STRING
      },
      last_login: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
    await queryInterface.dropTable('tbl_device_infos');
  }
};