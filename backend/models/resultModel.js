const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Result = sequelize.define('Result', {
     id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    results: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    quiz_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = Result;
