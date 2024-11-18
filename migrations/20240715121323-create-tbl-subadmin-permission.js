'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_subadmin_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      subadmin_id:{
        allowNull:false,
        type:Sequelize.BIGINT
      },
      permission_module_id: {
        allowNull:false,
        type: Sequelize.BIGINT
      },
      is_view:{
        allowNull:false,
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      is_add:{
        allowNull:false,
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      is_edit:{
        allowNull:false,
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      is_delete:{
        allowNull:false,
        type: Sequelize.BOOLEAN,
        defaultValue:false
      },
      is_status:{
        allowNull:false,
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('tbl_suadmin_permissions');
  }
};