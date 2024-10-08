'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
        reference: {
          model: 'Spots',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: 'Users',
          key: 'id'
        }
      },
      review: {
        type: Sequelize.STRING,
      },
      stars: {
        type: Sequelize.INTEGER(1,5),
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue : Sequelize.literal("CURRENT_TIMESTAMP")
      }
    },options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    await queryInterface.dropTable(options);
  }
};