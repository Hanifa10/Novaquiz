const quizService = require("../services/quizService");

const addQuiz = async (name, lessonId, userId) => {
    try {
        return await quizService.addQuiz(name, lessonId, userId);
    }
    catch (error) {
        throw new Error("Il est impossible d'ajouter ce quiz");
    }
};

const getAllQuizzes = async () => {
    try {
        return await quizService.getAllQuizzes();
    }
    catch (error) {
        throw new Error("Il est impossible d'afficher tous les quiz");
    }
}

const getQuizzesByUser = async (userId) => {
    if (!userId) throw new Error("Id manquant");

    try {
        return await quizService.getQuizzesByUser(userId);
    }
    catch (error) {
        throw new Error("Il est impossible d'afficher vos quiz");
    }
}

const getQuizByLesson = async (id) => {
    try {
        return await quizService.getQuizByLesson(id);
    }
    catch (error) {
        throw new Error("Il est impossible d'afficher le quiz du cours");
    }
};

const getQuizById = async (id) => {
    try {
        return await quizService.getQuizById(id);
    }
    catch (error) {
        throw new Error("Il est impossible d'afficher ce quiz");
    }
};

const editQuiz = async (id, data) => {
    if (!id) throw new Error("Id manquant");

    try {
        return await quizService.editQuiz(id, data);
    }
    catch (error) {
        throw new Error("Il est impossible de modifier ce quiz");
    }
}

const deleteQuiz = async (id) => {
    try {
        return await quizService.deleteQuiz(id);
    }
    catch (error) {
        throw new Error("Il est impossible de supprimer ce quiz");
    }
};

module.exports = {
    addQuiz,
    getAllQuizzes,
    getQuizzesByUser,
    getQuizByLesson,
    getQuizById,
    editQuiz,
    deleteQuiz
};