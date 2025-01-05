// Question: Pourquoi créer des services séparés ?
// Réponse: Créer des services séparés permet d'encapsuler la logique métier et d'isoler les interactions avec des composants externes (comme les bases de données ou les systèmes de cache).

const { ObjectId } = require('mongodb');
const { createCourse } = require('../controllers/courseController');

// Fonctions utilitaires pour MongoDB
async function findOneById(collection, id) {
  // TODO: Implémenter une fonction générique de recherche par ID
  try {
    const objectId = new ObjectId(id);
    const result = await db.collection(collection).findOne({ _id: objectId });
    return result;
  } catch (error) {
    throw new Error(`Erreur lors de la recherche dans la collection ${collection}: ${error.message}`);
  }
}

// Export des services
module.exports = {
  // TODO: Exporter les fonctions utilitaires
  findOneById,
  createCourse,
};