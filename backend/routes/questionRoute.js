const express = require('express');
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');
const quizModel = require('../models/quizModel');
const questionModel = require('../models/questionModel');
const router = express.Router();

const requireOwnQuestion = async (req, res, next) => {
    try {
        const question = await questionModel.findByPk(req.params.id);
        if (!question) {
            return res.status(404).json({ error: 'Question introuvable' });
        }

        const quiz = await quizModel.findByPk(question.quiz_id);
        if (!quiz || quiz.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas accéder à cette question' });
        }

        req.question = question;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: error.message || 'Accès refusé' });
    }
};

router.get('/', authMiddleware, async (req, res) => {
    try {
        const quizId = req.query.quizId;
        if (!quizId) {
            return res.status(400).json({ error: 'quizId requis' });
        }

        const quiz = await quizModel.findByPk(quizId);
        if (!quiz || quiz.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas voir les questions de ce quiz' });
        }

        const questions = await questionController.getQuestionsByQuiz(quizId);
        return res.status(200).json(questions);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

router.get('/quiz/:quizId', authMiddleware, async (req, res) => {
    try {
        const questions = await questionController.getQuestionsByQuiz(req.params.quizId);
        res.status(200).json(questions);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const question = await questionController.getQuestionById(req.params.id);
        res.status(200).json(question);
    }
    catch (error) {
        res.status(404).json({ "error": error.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer } = req.body;

    if (typeof req.body === 'undefined' || !quiz_id || !question || !answer_a || !answer_b || !correct_answer) {
        return res.status(400).json({ "error": "Aucune donnée reçue ou champs incomplets" });
    }

    try {
        await questionController.addQuestion(quiz_id, question, answer_a, answer_b, answer_c, answer_d, correct_answer);
        res.status(200).json({ "message": "Question ajoutée !" });
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

router.patch('/:id', authMiddleware, requireOwnQuestion, async (req, res) => {
    try {
        const question = await questionController.editQuestion(req.params.id, req.body);
        res.status(200).json(question);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

router.put('/:id', authMiddleware, requireOwnQuestion, async (req, res) => {
    try {
        const question = await questionController.editQuestion(req.params.id, req.body);
        res.status(200).json(question);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

router.delete('/:id', authMiddleware, requireOwnQuestion, async (req, res) => {
    try {
        const result = await questionController.deleteQuestion(req.params.id);
        res.status(200).json({ "message": result ? "Question supprimée" : "Suppression impossible" });
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

module.exports = router;

