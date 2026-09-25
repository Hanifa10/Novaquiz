const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', async (req, res) => {
    if (typeof req.body == 'undefined') {
        return res.status(500).json({ "error": "aucune info reçue" });
    }

    const { lastName, firstName, email, password, nom, prenom } = req.body;
    const finalLastName = lastName ?? nom;
    const finalFirstName = firstName ?? prenom;

    try {
        const result = await authController.register(finalLastName, finalFirstName, email, password);
        return res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

router.post('/login', async (req, res) => {
    if (typeof req.body == 'undefined') {
        return res.status(500).json({ "error": "aucune donnée reçue" });
    }

    const { email, password } = req.body;

    try {
        const result = await authController.login(email, password);
        return res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

router.post('/logout', async (req, res) => {
    try {
        await authController.logout();
        return res.status(200).json({ "message": "Déconnexion réussie" });
    }
    catch (error) {
        res.status(500).json({ "error": error.message });
    }
});

module.exports = router;