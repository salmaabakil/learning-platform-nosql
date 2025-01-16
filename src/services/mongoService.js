// Question: Pourquoi créer des services séparés ?
// Réponse: Créer des services séparés permet d'encapsuler la logique métier et d'isoler les interactions avec des composants externes (comme les bases de données ou les systèmes de cache).

const { ObjectId } = require('mongodb');
const db = require('../config/db');

require('dotenv').config();

const { getDb } = require('../config/db');

function getCollection(collectionName) {
  const db = getDb();
  if (!db) {
    throw new Error('La connexion à MongoDB n\'est pas encore initialisée.');
  }
  return db.collection(collectionName);
}


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

async function findOneByField(collectionName, query) {
  try {
    const collection = getCollection(collectionName);
    return await collection.findOne(query);
  } catch (error) {
    console.error(`Erreur lors de la recherche dans ${collectionName} :`, error);
    throw error;
  }
}

//course
async function createCourse(course) {
  try {
    const collection = getCollection('courses');
    const result = await collection.insertOne(course);

    const createdCourse = { ...course, _id: result.insertedId };
    return createdCourse;
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error);
    throw error;
  }
}

//student
async function createStudent(student) {
  try {
    const collection = getCollection('student');
    const result = await collection.insertOne(student);

    const createdStudent = { ...student, _id: result.insertedId };
    return createdStudent;
  } catch (error) {
    console.error('Erreur lors de la création de l\'étudiant:', error);
    throw new Error('Erreur lors de la création de l\'étudiant');
  }
}

async function findAll(collectionName) {
  try {
    const db = getDb(); 
    const collection = db.collection(collectionName);
    const result = await collection.find({}).toArray();
    return result;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la collection ${collectionName}:`, error);
    throw new Error('Erreur lors de la récupération des données');
  }
}

async function updateOneById(collectionName, id, updatedFields) {
  try {
    const objectId = new ObjectId(id);
    const collection = getCollection(collectionName);
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updatedFields }
    );

    if (result.matchedCount === 0) {
      return null;
    }

    return await findOneById(collectionName, id);
  } catch (error) {
    console.error(`Erreur lors de la mise à jour dans ${collectionName}:`, error);
    throw new Error('Erreur lors de la mise à jour des données');
  }
}

async function deleteOneById(collectionName, id) {
  try {
    const objectId = new ObjectId(id);
    const collection = getCollection(collectionName);
    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return null;
    }

    return true;
  } catch (error) {
    console.error(`Erreur lors de la suppression dans ${collectionName}:`, error);
    throw new Error('Erreur lors de la suppression des données');
  }
}


// Export des services
module.exports = {
  // TODO: Exporter les fonctions utilitaires
  findOneById,
  findOneByField,
  createCourse,
  createStudent,
  findAll,
  updateOneById,
  deleteOneById,
};