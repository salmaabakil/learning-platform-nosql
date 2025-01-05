// Question: Pourquoi est-il important de valider les variables d'environnement au démarrage ?
// Réponse : Il est important de valider les variables d'environnement au démarrage pour s'assurer que toutes les configurations nécessaires sont présentes avant que l'application ne démarre, ce qui permet de mieux gérer les erreurs et d'améliorer la résilience de l'application.
// Question: Que se passe-t-il si une variable requise est manquante ?
// Réponse : Si une variable requise est manquante, cela peut causer des problèmes comme des erreurs de connexion à la base de données, des pannes de l'API, ou même des plantages de l'application.

require('dotenv').config();
console.log('Chargement du fichier .env');

const requiredEnvVars = [
  'MONGODB_URI',
  'MONGODB_DB_NAME',
  'REDIS_URI'
];

// Validation des variables d'environnement
function validateEnv() {
  // TODO: Implémenter la validation
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new Error(`La variable d'environnement ${envVar} est requise mais manquante.`);
    }
  });
}

validateEnv();

module.exports = {
  mongodb: {
    mongoURI: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB_NAME
  },
  redis: {
    redisURI: process.env.REDIS_URI
  },
  port: process.env.PORT || 3000
};
