const questionModel = require("../models/questionModel");
const quizModel = require('../models/quizModel');

const addQuestion = async (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer) => {

    const quiz = await quizModel.findByPk(quiz_id);

    if (!quiz) {
        throw new Error("Ce quiz n'existe pas");
    }

    return await questionModel.create({
        quiz_id,
        question,
        answer_a,
        answer_b,
        answer_c,
        answer_d,
        correct_answer
    });
};

const getAllQuestions = async () => {
    return await questionModel.findAll();
};

const getQuestionById = async (id) => {
    const question = await questionModel.findByPk(id);
    if (!question) throw new Error("Cette question n'existe pas");
    return question;
};

const getQuestionsByQuiz = async (quizId) => {

    const questions = await questionModel.findAll({
        where: { quiz_id: quizId }
    });

    return questions;
};

const editQuestion = async (id, data) => {

    const question = await questionModel.findByPk(id);

    if (!question) {
        throw new Error("Cette question n'existe pas");
    }
    try {
        await question.update(data);

        return question;
    }
    catch (error) {
        throw new Error("Erreur lors de la modification de la question");
    }
};

const deleteQuestion = async (id) => {

    const question = await questionModel.findByPk(id);

    if (!question) {
        throw new Error("Cette question n'existe pas");
    }
    try {
        await question.destroy();
        return true;
    }
    catch (error) {
        throw new Error("Erreur lors de la suppression de la question");
    }
};

module.exports = {
    addQuestion,
    getAllQuestions,
    getQuestionById,
    getQuestionsByQuiz,
    editQuestion,
    deleteQuestion
};