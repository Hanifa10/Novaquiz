const resultModel = require("../models/resultModel");
const quizModel = require('../models/quizModel');
const userModel = require('../models/userModel');
const questionModel = require('../models/questionModel');

const normalizeResult = async (result) => {
    const quiz = await quizModel.findByPk(result.quiz_id, {
        attributes: ['id', 'name', 'lesson_id']
    });

    const total = await questionModel.count({
        where: { quiz_id: result.quiz_id }
    });

    const score = Number(result.results ?? 0);
    const safeTotal = Number(total || 0);

    return {
        ...result.toJSON(),
        id: result.id,
        quizId: result.quiz_id,
        lessonId: quiz?.lesson_id ?? null,
        quizName: quiz?.name ?? 'Quiz',
        score,
        total: safeTotal,
        correctAnswers: score,
        wrongAnswers: Math.max(safeTotal - score, 0),
        datePassage: result.createdAt
    };
};

//ajouter le score pour l'instant une bonne reponse vaut 1 point
const addResult = async (userId, quizId, answers) => {
    const quiz = await quizModel.findByPk(quizId);
    const user = await userModel.findByPk(userId);

    let result = 0;

    if (!quiz) throw new Error("Quiz n'existe pas");
    if (!user) throw new Error("Utilisateur n'existe pas");

    try {
        for (const answer of answers) {
            const question = await questionModel.findByPk(answer.question);
            if (question && answer.userAnswer === question.correct_answer) {
                result++;
            }
        }

        return await resultModel.create({
            user_id: userId,
            quiz_id: quizId,
            results: result
        });
    }
    catch (error) {
        throw new Error("Erreur lors de l'ajout du résultat");
    }
};

const getAllResults = async () => {
    const results = await resultModel.findAll();
    return await Promise.all(results.map(normalizeResult));
};

const getResultById = async (id) => {
    const result = await resultModel.findByPk(id);
    if (!result) throw new Error("Résultat introuvable");
    return await normalizeResult(result);
};

const getResultByQuiz = async (quizId) => {
    try {
        const result = await resultModel.findAll({
            where: { quiz_id: quizId }
        });

        return await Promise.all(result.map(normalizeResult));
    }
    catch (error) {
        throw new Error("Erreur lors de la récupération des résultats");
    }
};

const getAllResultsByUser = async (userId) => {
    try {
        const results = await resultModel.findAll({
            where: { user_id: userId },
            order: [['createdAt', 'DESC']]
        });

        return await Promise.all(results.map(normalizeResult));
    }
    catch (error) {
        throw new Error("Erreur lors de la récupération des résultats");
    }
};

const getResultByQuizByUser = async (quizId, userId) => {
    try {
        const result = await resultModel.findAll({
            where: { user_id: userId, quiz_id: quizId }
        });

        return await Promise.all(result.map(normalizeResult));
    }
    catch (error) {
        throw new Error("Erreur lors de la récupération des résultats");
    }
};

const editResult = async (id, data) => {
    const result = await resultModel.findByPk(id);
    if (!result) throw new Error("Ce résultat n'existe pas");

    try {
        await result.update(data);
        return result;
    }
    catch (error) {
        throw new Error("Erreur lors de la modification du résultat");
    }
};

const deleteResult = async (id) => {
    const result = await resultModel.findByPk(id);
    if (!result) throw new Error("Ce résultat n'existe pas");

    try {
        await result.destroy();
        return true;
    }
    catch (error) {
        throw new Error("Erreur lors de la suppression du résultat");
    }
};

module.exports = {
    addResult,
    getAllResults,
    getResultById,
    getResultByQuiz,
    getAllResultsByUser,
    getResultByQuizByUser,
    editResult,
    deleteResult
};