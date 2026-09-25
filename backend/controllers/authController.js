const authService = require('../services/authService');

const register = async (lastName, firstName, email, password) => {
    if (!lastName || !firstName || !email || !password) throw new Error("Veuillez remplir tous les champs du formulaire d'inscription");

    try {
        return await authService.register(lastName, firstName, email, password);
    }
    catch (error) {
        throw new Error("Erreur lors de l'inscription");
    }
}

const login = async (email, password) => {
    if (!email || !password) throw new Error("Veuillez remplir tous les champs du formulaire de connexion");

    try {
        return await authService.login(email, password);
    }
    catch (error) {
        throw new Error("Erreur lors de la connexion");
    }
}

const logout = async (id) => {
    try {
        return await authService.logout(id);
    }
    catch (error) {
        throw new Error("Erreur lors de la déconnexion");
    }
} 

module.exports = {
    register,
    login,
    logout
}