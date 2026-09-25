const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
     id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    lesson_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = Quiz;
