// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse : La gestion du cache avec Redis repose sur plusieurs principes clés pour optimiser la performance : - Expiration des clés (TTL) : Définir un temps d'expiration pour éviter les données obsolètes. - Eviction des clés : Utiliser des stratégies comme LRU pour supprimer les clés moins utilisées lorsque la mémoire est saturée. - Clé unique pour chaque élément : Assurer une clé unique pour chaque donnée, ce qui facilite son accès et sa gestion.
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse : Les bonnes pratiques pour les clés Redis incluent l’utilisation de clés descriptives, l’ajout de préfixes (namespace) pour éviter les collisions, et la création de clés courtes pour limiter la surcharge. Il est également recommandé de stocker des valeurs simples et de définir une expiration pour les données mises en cache, sauf si elles sont permanentes.

const redisClient = require('../config/db').redisClient;
const { getRedisClient } = require('../config/db');

// Fonctions utilitaires pour Redis
async function cacheData(key, data, ttl) {
  // TODO: Implémenter une fonction générique de cache
  const redisClient = getRedisClient();
  
  if (!redisClient) {
    console.error("Redis client non initialisé.");
    throw new Error("Redis client non initialisé.");
  }

  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
    console.log(`Données mises en cache avec succès sous la clé ${key}`);
  } catch (error) {
    console.error("Erreur lors du stockage dans le cache Redis:", error);
    throw new Error("Erreur de mise en cache dans Redis");
  }
}

//recuperer les donnees du cache
async function getCacheData(key) {
  try {
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      return JSON.parse(cachedData);
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Erreur lors de la récupération du cache Redis : ${error.message}`);
    throw new Error('Erreur de récupération du cache Redis');
  }
}

module.exports = {
  // TODO: Exporter les fonctions utilitaires
  cacheData,
  getCacheData,
};