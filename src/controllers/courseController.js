// Question: Quelle est la différence entre un contrôleur et une route ?
// Réponse: Une route définit l'URL (ou le chemin) de l'API et la méthode HTTP associée, puis dirige les requêtes vers le contrôleur approprié. Et un contrôleur contient la logique pour traiter les requêtes, récupérer les données et renvoyer une réponse au client.
// Question : Pourquoi séparer la logique métier des routes ?
// Réponse : Séparer la logique métier des routes permet de respecter le principe de séparation des responsabilités et d'avoir une organisation modulaire. Par exemple cela rend le code plus lisible et facile à comprendre, et la logique métier peut être réutilisée dans différents contrôleurs ou services sans duplication de code.

const { ObjectId } = require('mongodb');
const db = require('../config/db');
const mongoService = require('../services/mongoService');
const redisService = require('../services/redisService');

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
    await redisService.cacheData(cacheKey, newCourse, 3600); // 3600 secondes = 1 heure

    return res.status(201).json(newCourse);
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error);
    return res.status(500).json({ message: 'Une erreur est survenue.' });
  }
}

//get
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

//get state 
async function getCourseStats(req, res) {
  try {
    const stats = await mongoService.getCourseStatistics();
    return res.status(200).json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques des cours:', error);
    return res.status(500).json({ message: 'Une erreur est survenue.' });
  }
}

// Export des contrôleurs
module.exports = {
  // TODO: Exporter les fonctions du contrôleur
  createCourse,
  getCourse,
  getCourseStats,
};
