'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      language_id:{
        allowNull:false,
        type:Sequelize.BIGINT,
        defaultValue:0
      },
      corporate_profile_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: 0
      },
      social_id: {
        allowNull: true,
        type: Sequelize.STRING
      },
      country_id: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      city_id: {
        allowNull: true,
        type: Sequelize.BIGINT
      },
      full_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING
      },
      country_code: {
        allowNull: false,
        type: Sequelize.STRING(8)
      },
      phone_number: {
        allowNull: false,
        type: Sequelize.STRING(16)
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING
      },
      is_temp_password: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: "0-> No, 1-> Yes"
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      login_type: {
        type: Sequelize.ENUM('S', 'F', 'A', 'G'),
        comment: "S-> Simple Login, F-> Facebook, G-> Google , A-> Apple"
      },
      role: {
        type: Sequelize.ENUM('user'),
        defaultValue: 'user'
      },
      dob: {
        allowNull: true,
        type: Sequelize.DATEONLY
      },
      government_certificate: {
        allowNull: true,
        type: Sequelize.STRING
      },
      security_question: {
        allowNull: true,
        type: Sequelize.STRING
      },
      security_answer: {
        allowNull: true,
        type: Sequelize.STRING
      },
      organization: {
        allowNull: true,
        type: Sequelize.STRING
      },
      experience: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      is_term_condition: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: "0-> Not Selected, 1-> Accept"
      },
      is_email_verified:{
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: "0-> Not Verify, 1-> Verified"
      },
      is_mobile_verified:{
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: "0-> Not Verify, 1-> Verified"
      },
      step: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_online: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: "1-> Online, 0-> Offline"
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
    await queryInterface.dropTable('tbl_users');
  }
};