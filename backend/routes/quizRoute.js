const express = require('express');
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middlewares/authMiddleware');
const questionModel = require('../models/questionModel');
const quizModel = require('../models/quizModel');
const lessonModel = require('../models/lessonModel');
const router = express.Router();

const requireOwnQuiz = async (req, res, next) => {
    try {
        const quiz = await quizModel.findByPk(req.params.id);
        if (!quiz || quiz.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas accéder à ce quiz' });
        }
        req.quiz = quiz;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: error.message || 'Accès refusé' });
    }
};

const requireOwnQuizFromLesson = async (req, res, next) => {
    try {
        const quiz = await quizModel.findByPk(req.params.id);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz introuvable' });
        }

        const lesson = await lessonModel.findByPk(quiz.lesson_id);
        if (!lesson || lesson.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas modifier ce quiz' });
        }

        req.quiz = quiz;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: error.message || 'Accès refusé' });
    }
};

// GET toutes les quiz
router.get('/', authMiddleware, async (req, res) => {
    try {
        const quizzes = await quizController.getQuizzesByUser(req.user.id);
        res.status(200).json(quizzes);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// POST créer quiz
router.post('/', authMiddleware, async (req, res) => {
    const { name, lessonId } = req.body;
    const finalLessonId = lessonId;

    if (typeof req.body === 'undefined' || !name || !finalLessonId) {
        return res.status(400).json({ "error": "Aucune donnée reçue ou champs incomplets" });
    }

    try {
        const lesson = await lessonModel.findByPk(finalLessonId);
        if (!lesson || lesson.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas créer un quiz pour ce cours' });
        }

        const quiz = await quizController.addQuiz(name, finalLessonId, req.user.id);
        res.status(201).json(quiz);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// GET quiz par lesson (route spécifique AVANT :id)
router.get('/lesson/:lessonId', authMiddleware, async (req, res) => {
    try {
        const lesson = await lessonModel.findByPk(req.params.lessonId);
        if (!lesson || lesson.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas voir ce quiz' });
        }

        const quiz = await quizController.getQuizByLesson(req.params.lessonId);
        res.status(200).json(quiz);
    }
    catch (error) {
        res.status(404).json({ "error": error.message });
    }
});

// GET questions d'un quiz (route spécifique AVANT :id)
router.get('/:id/questions', authMiddleware, async (req, res) => {
    try {
        const quiz = await quizModel.findByPk(req.params.id);
        if (!quiz || quiz.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas voir les questions de ce quiz' });
        }

        const questions = await questionModel.findAll({ where: { quiz_id: req.params.id } });
        res.status(200).json(questions);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// POST ajouter question au quiz
router.post('/:id/questions', authMiddleware, requireOwnQuizFromLesson, async (req, res) => {
    const { question, answer_a, answer_b, answer_c, answer_d, correct_answer } = req.body;

    if (!question || !answer_a || !answer_b || !correct_answer) {
        return res.status(400).json({ "error": "Question ou réponses incomplètes" });
    }

    try {
        const created = await questionModel.create({
            quiz_id: req.params.id,
            question,
            answer_a,
            answer_b,
            answer_c,
            answer_d,
            correct_answer
        });
        res.status(200).json(created);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// POST répondre à une question (validation immédiate)
router.post('/:id/answer', authMiddleware, async (req, res) => {
    const { questionId, answerId } = req.body;
    
    if (!questionId || !answerId) {
        return res.status(400).json({ "error": "questionId et answerId sont requis" });
    }
    
    try {
        const question = await questionModel.findByPk(questionId);
        
        if (!question) {
            return res.status(404).json({ "error": "Question non trouvée" });
        }
        
        const correct = answerId === question.correct_answer;
        
        res.status(200).json({
            correct,
            rightAnswerId: question.correct_answer,
            message: correct ? 'Bonne réponse !' : 'Mauvaise réponse'
        });
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// PATCH modifier quiz
router.patch('/:id', authMiddleware, requireOwnQuiz, async (req, res) => {
    try {
        const quiz = await quizController.editQuiz(req.params.id, req.body);
        res.status(200).json(quiz);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// PUT modifier quiz (alias)
router.put('/:id', authMiddleware, requireOwnQuiz, async (req, res) => {
    try {
        const quiz = await quizController.editQuiz(req.params.id, req.body);
        res.status(200).json(quiz);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// DELETE supprimer quiz
router.delete('/:id', authMiddleware, requireOwnQuiz, async (req, res) => {
    try {
        const result = await quizController.deleteQuiz(req.params.id);
        res.status(200).json({ "message": result ? "Quiz supprimé" : "Suppression impossible" });
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// GET quiz par ID (route générique EN DERNIER)
router.get('/:id', authMiddleware, requireOwnQuiz, async (req, res) => {
    try {
        const quiz = await quizController.getQuizById(req.params.id);
        res.status(200).json(quiz);
    }
    catch (error) {
        res.status(404).json({ "error": error.message });
    }
});

module.exports = router;