// Question : Comment gérer efficacement le cache avec Redis ?
// Réponse : La gestion du cache avec Redis repose sur plusieurs principes clés pour optimiser la performance : - Expiration des clés (TTL) : Définir un temps d'expiration pour éviter les données obsolètes. - Eviction des clés : Utiliser des stratégies comme LRU pour supprimer les clés moins utilisées lorsque la mémoire est saturée. - Clé unique pour chaque élément : Assurer une clé unique pour chaque donnée, ce qui facilite son accès et sa gestion.
// Question: Quelles sont les bonnes pratiques pour les clés Redis ?
// Réponse : Les bonnes pratiques pour les clés Redis incluent l’utilisation de clés descriptives, l’ajout de préfixes (namespace) pour éviter les collisions, et la création de clés courtes pour limiter la surcharge. Il est également recommandé de stocker des valeurs simples et de définir une expiration pour les données mises en cache, sauf si elles sont permanentes.

// Fonctions utilitaires pour Redis
async function cacheData(key, data, ttl) {
  // TODO: Implémenter une fonction générique de cache
  return new Promise((resolve, reject) => {
    const serializedData = JSON.stringify(data);

    redisClient.setex(key, ttl, serializedData, (err) => {
      if (err) {
        reject(new Error(`Erreur lors du stockage dans le cache Redis : ${err.message}`));
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  // TODO: Exporter les fonctions utilitaires
  cacheData
};