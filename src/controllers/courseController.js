// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: Une route définit l'URL (ou le chemin) de l'API et la méthode HTTP associée, puis dirige les requêtes vers le contrôleur approprié. Et un contrôleur contient la logique pour traiter les requêtes, récupérer les données et renvoyer une réponse au client.
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse : Séparer la logique métier des routes permet de respecter le principe de séparation des responsabilités et d'avoir une organisation modulaire. Par exemple cela rend le code plus lisible et facile à comprendre, et la logique métier peut être réutilisée dans différents contrôleurs ou services sans duplication de code.

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');
const { findAll } = require('../services/mongoService'); 

//Create a Course
async function createCourse(req, res) {
  // TODO: Implémenter la création d'un cours
  try {
    const { title, description, instructorId } = req.body;

    if (!title || !description || !instructorId) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const existingCourse = await mongoService.findOneByField('courses', { title });
    if (existingCourse) {
      return res.status(409).json({ message: 'Un cours avec ce titre existe déjà.' });
    }

    const newCourse = await mongoService.createCourse({ title, description, instructorId });

    const cacheKey = `course:${newCourse._id}`;
    await redisService.cacheData(cacheKey, newCourse, 3600);

    return res.status(201).json(newCourse);
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error);
    return res.status(500).json({ message: 'Une erreur est survenue.' });
  }
}

//get one course
async function getCourse(req, res) {
  try {
    const { id } = req.params;
    const course = await mongoService.findOneById(id);

    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé.' });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error('Erreur lors de la récupération du cours:', error);
    return res.status(500).json({ message: 'Une erreur est survenue.' });
  }
}


//get all courses
async function getAllCourses(req, res) {
  try {
    const courses = await findAll('courses');
    res.status(200).json(courses);
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des cours' });
  }
}

// Update a course
async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const { title, description, instructorId } = req.body;

    if (!title && !description && !instructorId) {
      return res.status(400).json({ message: 'Au moins un champ est requis pour la mise à jour.' });
    }

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (instructorId) updatedFields.instructorId = instructorId;

    const updatedCourse = await mongoService.updateOneById('courses', id, updatedFields);

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Cours non trouvé.' });
    }

    return res.status(200).json({ message: 'Cours mis à jour avec succès.', updatedCourse });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cours:', error);
    return res.status(500).json({ message: 'Une erreur est survenue.' });
  }
}

// Delete a course
async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    const deletedCourse = await mongoService.deleteOneById('courses', id);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Cours non trouvé.' });
    }

    return res.status(200).json({ message: 'Cours supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du cours:', error);
    return res.status(500).json({ message: 'Une erreur est survenue.' });
  }
}

// Export controller
module.exports = {
  // TODO: Exporter les fonctions du contrôleur
  createCourse,
  getCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
};
