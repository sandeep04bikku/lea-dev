'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_course_orders', {
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
      order_id: {
        allowNull:false,
        type: Sequelize.STRING
      },
      razorpay_order_id: {
        allowNull:false,
        type: Sequelize.STRING
      },
      razorpay_payment_id:{
        allowNull:false,
        type:Sequelize.STRING
      },
      razorpay_signature: {
        allowNull: false,
        type: Sequelize.STRING
      },
      currency:{
        allowNull:false,
        type:Sequelize.STRING(8)
      },
      amount:{
        allowNull:false,
        type:Sequelize.DECIMAL(8,2),
        defaultValue:0
      },
      discount_code:{
        allowNull:true,
        type:Sequelize.STRING
      },
      discount:{
        allowNull:true,
        type:Sequelize.DECIMAL(8,2),
        defaultValue:0
      },
      tax:{
        allowNull:true,
        type:Sequelize.DECIMAL(8,2),
        defaultValue:0
      },
      quantity:{
        allowNull:false,
        type:Sequelize.INTEGER,
        defaultValue:0
      },
      payment_method:{
        allowNull:false,
        type:Sequelize.STRING
      },
      upi_id:{
        allowNull:true,
        type:Sequelize.STRING
      },
      upi_transaction_id:{
        allowNull:true,
        type:Sequelize.STRING
      },
      bank_transaction_id:{
        allowNull:true,
        type:Sequelize.STRING
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
    await queryInterface.dropTable('tbl_course_orders');
  }
};