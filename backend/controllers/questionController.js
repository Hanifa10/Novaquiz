const questionService = require("../services/questionService");

const addQuestion = async (quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer) => {
    try {
        return await questionService.addQuestion(quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer);
    }
    catch (error) {
        throw new Error("Il est impossible d'ajouter cette question");
    }
};

const getAllQuestions = async () => {
    try {
        return await questionService.getAllQuestions();
    }
    catch (error) {
        throw new Error("Il est impossible d'afficher les questions");
    }
};

const getQuestionById = async (id) => {
    try {
        return await questionService.getQuestionById(id);
    }
    catch (error) {
        throw new Error("Il est impossible d'afficher cette question");
    }
}

const getQuestionsByQuiz = async (id) => {
    try {
        return await questionService.getQuestionsByQuiz(id);
    }
    catch (error) {
        throw new Error("Il est impossible d'afficher les questions de ce quiz");
    }
};

const editQuestion = async (id, data) => {
    try {
        return await questionService.editQuestion(id, data);
    }
    catch (error) {
        throw new Error("Il est impossible de modifier cette question");
    }
};

const deleteQuestion = async (id) => {
    try {
        return await questionService.deleteQuestion(id);
    }
    catch (error) {
        throw new Error("Il est impossible de supprimer cette question");
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