const lessonService = require('../services/lessonService');

const addLesson = async (name, content, userId) => {
    if (!name || !content || !userId) throw new Error("Veuillez remplir tous les champs");

    try {
        return await lessonService.addLesson(name, content, userId);
    }
    catch (error) {
        console.error('[LESSON CONTROLLER] error:', error.message);
        throw new Error("Il est impossible d'ajouter ce cours");
    }
}

const getAllLessons = async () => {
    try {
        return await lessonService.getAllLessons();
    }
    catch (error) {
        throw new Error("Il est impossible d'afficher les cours");
    }
}

const getLessonsByUser = async (userId) => {
    if (!userId) throw new Error("Id manquant");

    try {
        return await lessonService.getLessonsByUser(userId);
    }
    catch (error) {
        throw new Error("Il est impossible d'afficher vos cours");
    }
}

const getLessonById = async (id) => {
    if (!id) throw new Error("Id manquant");

    try {
        return await lessonService.getLessonById(id);
    }
    catch (error) {
        throw new Error("Il est impossible d'afficher ce cours");
    }
}

const editLesson = async (id, data) => {
    if (!id) throw new Error("Id manquant");

    try {
        return await lessonService.editLesson(id, data);
    }
    catch (error) {
        throw new Error("Il est impossible de modifier ce cours");
    }
}

const deleteLesson = async (id) => {
    if (!id) throw new Error("Id manquant");

    try {
        return await lessonService.deleteLesson(id);
    }
    catch (error) {
        throw new Error("Il est impossible de supprimer ce cours");
    }
}

module.exports = {
    addLesson,
    getAllLessons,
    getLessonsByUser,
    getLessonById,
    editLesson,
    deleteLesson
};