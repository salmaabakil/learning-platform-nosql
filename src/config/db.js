// Question : Pourquoi créer un module séparé pour les connexions aux bases de données ?
// Réponse : Il est essentiel d'avoir un module dédié à la gestion des connexions aux bases de données afin d'éviter la duplication de code dans l'ensemble de l'application et de permettre sa réutilisation dans d'autres fichiers.
// Question : Comment gérer proprement la fermeture des connexions ?
// Réponse : Il est important d'ajouter une fonction pour fermer les connexions lorsque l'application se termine ou qu'une erreur se produit. Par exemple, pour MongoDB, on utilise `mongoClient.close()`, et pour Redis, `redisClient.quit()`.

const { MongoClient } = require('mongodb');
const redis = require('redis');
const config = require('./env');

let mongoClient, redisClient, db;


async function connectMongo() {
  // TODO: Implémenter la connexion MongoDB
  try {
    console.log('Tentative de connexion à MongoDB avec URI:', config.mongodb.mongoURI);
    mongoClient = await MongoClient.connect(config.mongodb.mongoURI);
    db = mongoClient.db(config.mongodb.dbName);
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur lors de la connexion à MongoDB:', error);
    setTimeout(connectMongo, 5000);
  }
}

async function connectRedis() {
  // TODO: Implémenter la connexion Redis
  return new Promise((resolve, reject) => {
    redisClient = redis.createClient({
      url: config.redisURI
    });

    redisClient.on('connect', () => {
      console.log('Redis connected');
      resolve();
    });

    redisClient.on('error', (error) => {
      console.error('Error connecting to Redis:', error);
      reject(error);
    });

    redisClient.connect();
  });
}

// Fonction pour fermer proprement les connexions
async function closeConnections() {
  try {
    if (mongoClient) {
      await mongoClient.close();
      console.log('MongoDB connection closed');
    }
    if (redisClient) {
      redisClient.quit();
      console.log('Redis connection closed');
    }
  } catch (error) {
    console.error('Error closing connections:', error);
  }
}

// Export des fonctions et clients
module.exports = {
  // TODO: Exporter les clients et fonctions utiles
  connectMongo,
  connectRedis,
  closeConnections,
  db,
  redisClient,
};