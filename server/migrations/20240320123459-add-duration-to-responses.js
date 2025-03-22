const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
      return queryInterface.addColumn('Responses', 'duration', {
        type: DataTypes.INTEGER, // в секундах
        allowNull: true,
      });
    },
  
    down: async ({ context: queryInterface }) => {
      return queryInterface.removeColumn('Responses', 'duration');
    },
  };