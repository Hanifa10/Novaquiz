const lessonModel = require('../models/lessonModel');

const addLesson = async (name, content, userId) => {
    if (!userId) throw new Error("userId is not defined");
    
    try {
        const lesson = await lessonModel.create ({
            name: name,
            content: content,
            user_id: userId
        });
        console.log('[LESSON SERVICE] created lesson:', lesson.id);
        return lesson;
    }
    catch(error) { 
        console.error('[LESSON SERVICE] DB error:', error.message);
        throw new Error ("Erreur lors de la création du cours: " + error.message);
    }
}

const getAllLessons = async () => {
    try {
        const lessons = await lessonModel.findAll();
        return lessons;
    }
    catch(error) {
        throw new Error ("Erreur lors de la récupérations des cours");
    }
}

const getLessonsByUser = async (userId) => {
    try {
        return await lessonModel.findAll({ where: { user_id: userId } });
    }
    catch (error) {
        throw new Error("Erreur lors de la récupération des cours de l'utilisateur");
    }
}

const getLessonById = async (id) => {
    try {
        const lesson = await lessonModel.findByPk(id);
        if (!lesson) throw new Error ("Ce cours n'existe pas");
        return lesson;
    }
    catch(error) {
        throw new Error ("Erreur lors de la récupération du cours");
    }
}

const editLesson = async (id, data) => {
    const lesson = await lessonModel.findByPk(id);
    if (!lesson) throw new Error ("Ce cours n'existe pas");

    try {
        await lesson.update(data);
        return lesson;
    }
    catch(error) {
        throw new Error ("Erreur lors de la modification du cours");
    }
}

const deleteLesson = async (id) => {
    const lesson = await lessonModel.findByPk(id);
    if (!lesson) throw new Error ("Cours n'existe pas");

    try {
        await lesson.destroy();
        return true;
    }
    catch(error) {
        throw new Error ("Erreur lors de la suppression du cours");
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
