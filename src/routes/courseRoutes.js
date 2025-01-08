// Question: Pourquoi séparer les routes dans différents fichiers ?
// Réponse : Séparer les routes dans différents fichiers permet de mieux organiser l'application, d'éviter que le fichier des routes ne devienne trop volumineux et difficile à maintenir, et facilite l'ajout de nouvelles fonctionnalités sans perturber le reste de l'application.
// Question : Comment organiser les routes de manière cohérente ?
// Réponse: Pour organiser les routes de manière cohérente, il est important de : - Séparer par entité : Créer des fichiers de routes spécifiques à chaque entité. - Utiliser des préfixes : Ajouter des préfixes aux routes pour les regrouper par fonctionnalité. - Centraliser les routes : Regrouper toutes les routes dans un fichier central pour faciliter leur gestion et leur maintenance.

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// Routes pour les cours
router.post('/', courseController.createCourse);
router.get('/:id', courseController.getCourse);
router.get('/', courseController.getAllCourses);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;