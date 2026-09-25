const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false
    },
    answer_a: {
        type: DataTypes.STRING,
        allowNull: false
    },
    answer_b: {
        type: DataTypes.STRING,
        allowNull: false
    },
    answer_c: {
        type: DataTypes.STRING,
        allowNull: true
    },
    answer_d: {
        type: DataTypes.STRING,
        allowNull: true
    },
    correct_answer: {
        type: DataTypes.CHAR,
        allowNull: false,
    },
    quiz_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
});

module.exports = Question;
