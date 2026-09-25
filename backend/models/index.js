const sequelize = require('../config/database');
const User = require('./userModel');
const Lesson = require('./lessonModel');
const Quiz = require('./quizModel');
const Question = require('./questionModel');
const Result = require('./resultModel');

// un user plusieurs leçons (auteur)
User.hasMany(Lesson, { foreignKey: "user_id", onDelete: "CASCADE" });
Lesson.belongsTo(User, { foreignKey: "user_id" });

// un user plusieurs quiz (auteur)
User.hasMany(Quiz, { foreignKey: "user_id", onDelete: "CASCADE" });
Quiz.belongsTo(User, { foreignKey: "user_id" });

// contrainte un cours un quiz 
Lesson.hasOne(Quiz, {foreignKey: { name: "lesson_id", unique: true }, onDelete: "CASCADE"});
Quiz.belongsTo(Lesson, { foreignKey: "lesson_id" });

// un quiz plusieur questions
Quiz.hasMany(Question, { foreignKey: "quiz_id", onDelete: "CASCADE" });
Question.belongsTo(Quiz, { foreignKey: "quiz_id" });

// un user plusieurs resultats
User.hasMany(Result, { foreignKey: "user_id", onDelete: "CASCADE" });
Result.belongsTo(User, { foreignKey: "user_id" });

// un quiz plusieurs resultats
Quiz.hasMany(Result, { foreignKey: "quiz_id", onDelete: "CASCADE" });
Result.belongsTo(Quiz, { foreignKey: "quiz_id" });

module.exports = {
    sequelize,
    User,
    Lesson,
    Quiz,
    Question,
    Result
};
