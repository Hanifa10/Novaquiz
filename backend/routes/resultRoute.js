const express = require('express');
const resultController = require('../controllers/resultController');
const authMiddleware = require('../middlewares/authMiddleware');
const resultModel = require('../models/resultModel');
const router = express.Router();

const requireOwnResult = async (req, res, next) => {
    try {
        const result = await resultModel.findByPk(req.params.id);
        if (!result || result.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas accéder à ce résultat' });
        }
        req.result = result;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: error.message || 'Accès refusé' });
    }
};

router.get('/', authMiddleware, async (req, res) => {
    try {
        const results = await resultController.getAllResultsByUser(req.user.id);
        res.status(200).json(results);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

router.get('/user/:userId', authMiddleware, async (req, res) => {
    try {
        if (req.params.userId !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas voir les résultats d\'un autre utilisateur' });
        }
        const results = await resultController.getAllResultsByUser(req.params.userId);
        res.status(200).json(results);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

router.get('/quiz/:quizId/user/:userId', authMiddleware, async (req, res) => {
    try {
        if (req.params.userId !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas voir les résultats d\'un autre utilisateur' });
        }
        const result = await resultController.getResultByQuizByUser(req.params.quizId, req.params.userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const result = await resultController.getResultById(req.params.id);
        if (!result || result.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Vous ne pouvez pas accéder à ce résultat' });
        }
        res.status(200).json(result);
    }
    catch (error) {
        res.status(404).json({ "error": error.message });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    const { quizId, results } = req.body;
    const finalUserId = req.user.id;
    const finalQuizId = quizId;

    if (typeof req.body === 'undefined' || !finalUserId || !finalQuizId || !Array.isArray(results)) {
        return res.status(400).json({ "error": "Aucune donnée reçue ou payload invalide" });
    }

    try {
        const saved = await resultController.addResult(finalUserId, finalQuizId, results);
        res.status(200).json(saved);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

router.patch('/:id', authMiddleware, requireOwnResult, async (req, res) => {
    try {
        const result = await resultController.editResult(req.params.id, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

router.put('/:id', authMiddleware, requireOwnResult, async (req, res) => {
    try {
        const result = await resultController.editResult(req.params.id, req.body);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

router.delete('/:id', authMiddleware, requireOwnResult, async (req, res) => {
    try {
        const result = await resultController.deleteResult(req.params.id);
        res.status(200).json({ "message": result ? "Résultat supprimé" : "Suppression impossible" });
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

module.exports = router;
