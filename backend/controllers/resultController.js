const resultService = require('../services/resultService');

const addResult = async (userId, quizId, answers) => {
    if (!userId || !quizId || !answers) throw new Error ("infos manquant");

    try {
        return await resultService.addResult(userId, quizId, answers);
    }
    catch(error) {
        throw new Error ("Il est impossible d'ajouter ce résultat");
    }
}

const getAllResults = async () => {
    try {
        return await resultService.getAllResults();
    }
    catch(error) {
        throw new Error ("Il est impossible d'afficher les résultats");
    }
}

const getResultById = async (id) => {
    if (!id) throw new Error ("Id manquant");

    try {
        return await resultService.getResultById(id);
    }
    catch(error) {
        throw new Error ("Il est impossible d'afficher ce résultat");
    }
}

const getResultByQuiz = async (quizId) => {
    try {
        return await resultService.getResultByQuiz(quizId);
    }
    catch(error) {
        throw new Error ("Il est impossible d'afficher les résultats du quiz");
    }
}

const getAllResultsByUser = async (id) => {
    if (!id) throw new Error ("Id manquant");

    try {
        return await resultService.getAllResultsByUser(id);
    }
    catch(error) {
        throw new Error ("Il est impossible d'afficher les résultats de cet utilisateur");
    }
}

const getResultByQuizByUser = async (quizId, userId) => {
    if (!quizId || !userId) throw new Error ("Id manquant");

    try {
        return await resultService.getResultByQuizByUser(quizId, userId);
    }
    catch(error) {
        throw new Error ("Il est impossible d'afficher les résultats de ce quiz pour cet utilisateur");
    }
}

const editResult = async (id, data) => {
    if (!id) throw new Error ("Id manquant");

    try {
        return await resultService.editResult(id, data);
    }
    catch(error) {
        throw new Error ("Il est impossible de modifier ce résultat");
    }
}

const deleteResult = async (id) => {
    if (!id) throw new Error ("Id manquant");

    try {
        return await resultService.deleteResult(id);
    }
    catch(error) {
        throw new Error ("Il est impossible de supprimer ce résultat");
    }
}

module.exports = {
    addResult,
    getAllResults,
    getResultById,
    getResultByQuiz,
    getAllResultsByUser,
    getResultByQuizByUser,
    editResult,
    deleteResult
}