const express = require('express');
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const requireOwnLesson = async (req, res, next) => {
    try {
        const lesson = await lessonController.getLessonById(req.params.id);
        if (!lesson || lesson.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas accéder à ce cours' });
        }
        req.lesson = lesson;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: error.message || 'Accès refusé' });
    }
};

// GET toutes les leçons
router.get('/', authMiddleware, async (req, res) => {
    try {
        const lessons = await lessonController.getLessonsByUser(req.user.id);
        res.status(200).json(lessons);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// POST créer leçon
router.post('/', authMiddleware, async (req, res) => {
    const { name, content } = req.body;
    const userId = req.user.id;

    console.log('[LESSON POST] req.user:', req.user);
    console.log('[LESSON POST] userId:', userId);
    console.log('[LESSON POST] name:', name, 'content:', content ? 'present' : 'absent');

    if (typeof req.body === 'undefined' || !name || !content) {
        return res.status(400).json({ "error": "Aucune donnée reçue ou champs incomplets" });
    }

    try {
        const lesson = await lessonController.addLesson(name, content, userId);
        res.status(201).json(lesson);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// PATCH modifier leçon
router.patch('/:id', authMiddleware, requireOwnLesson, async (req, res) => {
    try {
        const lesson = await lessonController.editLesson(req.params.id, req.body);
        res.status(200).json(lesson);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// PUT modifier leçon (alias)
router.put('/:id', authMiddleware, requireOwnLesson, async (req, res) => {
    try {
        const lesson = await lessonController.editLesson(req.params.id, req.body);
        res.status(200).json(lesson);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// DELETE supprimer leçon
router.delete('/:id', authMiddleware, requireOwnLesson, async (req, res) => {
    try {
        const result = await lessonController.deleteLesson(req.params.id);
        res.status(200).json({ "message": result ? "Cours supprimé" : "Suppression impossible" });
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

// GET leçon par ID (route générique EN DERNIER)
router.get('/:id', authMiddleware, requireOwnLesson, async (req, res) => {
    try {
        const lesson = await lessonController.getLessonById(req.params.id);
        res.status(200).json(lesson);
    }
    catch (error) {
        res.status(404).json({ "error": error.message });
    }
});

module.exports = router;