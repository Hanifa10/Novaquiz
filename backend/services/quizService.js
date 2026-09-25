const quizModel = require('../models/quizModel');
const lessonModel = require('../models/lessonModel');
const questionModel = require('../models/questionModel');

const addQuiz = async (name, lessonId, userId) => {
    const lesson = await lessonModel.findByPk(lessonId);

    if (!lesson) {
        throw new Error("La leçon est introuvable");
    }

    if (lesson.user_id && lesson.user_id !== userId) {
        throw new Error("Vous ne pouvez pas ajouter un quiz à ce cours");
    }

    const quizExist = await quizModel.findOne({
        where: { lesson_id: lessonId }
    });

    if (quizExist) {
        throw new Error("Ce quiz existe déjà");
    }

    try {
        return await quizModel.create({
            name: name,
            lesson_id: lessonId,
            user_id: userId
        });
    }
    catch (error) {
        throw new Error("Erreur lors de la création du quiz");
    }
}

const getAllQuizzes = async () => {
    try {
        const quizzes = await quizModel.findAll();
        return quizzes;
    }
    catch (error) {
        throw new Error("Erreur lors de la récupération des quiz");
    }
}

const getQuizzesByUser = async (userId) => {
    try {
        return await quizModel.findAll({ where: { user_id: userId } });
    }
    catch (error) {
        throw new Error("Erreur lors de la récupération des quiz de l'utilisateur");
    }
}

const getQuizById = async (id) => {
    try {
        const quiz = await quizModel.findByPk(id, {
            include: [questionModel]
        });
        return quiz;
    }
    catch (error) {
        throw new Error("Erreur lors de la récupération du quiz");
    }
}

const getQuizByLesson = async (lessonId) => {
    try {
        const quiz = await quizModel.findOne({
            where: { lesson_id: lessonId },
            include: [questionModel]
        });
        return quiz;
    }
    catch (error) {
        throw new Error("Erreur lors de la récupération du quiz");
    }
};

const editQuiz = async (id, data) => {
    const quiz = await quizModel.findByPk(id);
    if (!quiz) throw new Error("Ce quiz n'existe pas");

    try {
        await quiz.update(data);
        return quiz;
    }
    catch (error) {
        throw new Error("Erreur lors de la modification du quiz");
    }
}

const deleteQuiz = async (id) => {
    const quiz = await quizModel.findByPk(id);
    if (!quiz) throw new Error("Quiz n'existe pas");

    try {
        await quiz.destroy();
        return true;
    }
    catch (error) {
        throw new Error("Erreur lors de la suppression du quiz");
    }
}

module.exports = {
    addQuiz,
    getAllQuizzes,
    getQuizzesByUser,
    getQuizById,
    getQuizByLesson,
    editQuiz,
    deleteQuiz
};
