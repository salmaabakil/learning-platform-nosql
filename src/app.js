// Question: Comment organiser le point d'entrée de l'application ?
// Réponse : Le point d'entrée d'une application initialise et démarre l'application en configurant les connexions, les middlewares, les routes, et le serveur. Pour une bonne organisation, il est essentiel de séparer les préoccupations en plaçant les configurations complexes dans des fichiers séparés. Le démarrage du serveur doit être asynchrone pour garantir que toutes les connexions nécessaires sont établies avant d'accepter des requêtes. Enfin, la gestion des erreurs doit être claire, par exemple, en évitant de démarrer le serveur si la connexion à la base de données échoue.
// Question: Quelle est la meilleure façon de gérer le démarrage de l'application ?
// Réponse : La gestion du démarrage de l'application peut être optimisée en suivant ces bonnes pratiques : assurez-vous que toutes les connexions aux bases de données et services externes (comme Redis) sont établies avant de démarrer le serveur, en utilisant async/await pour attendre leur réussite. Le démarrage du serveur doit être asynchrone, permettant de lancer les connexions avant de commencer à accepter les requêtes. Enfin, il est crucial de gérer les erreurs de démarrage en empêchant le serveur de démarrer si une connexion échoue, avec un message d'erreur explicite.

const express = require('express');
const config = require('./config/env');
const db = require('./config/db');

// Import des routes
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Enregistrement des routes
app.use('/api/courses', courseRoutes);
app.use('/api/student', studentRoutes);

async function startServer() {
  try {
    // Initialiser les connexions aux bases de données
    await db.connectMongo();
    await db.connectRedis();

    const port = config.port || 3000;
    app.listen(port, () => {
      console.log(`Server started on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Gestion propre de l'arrêt du serveur
process.on('SIGTERM', async () => {
  try {
    console.log('Stopping server...');

    await db.closeConnections();

    process.exit(0);
  } catch (error) {
    console.error('Error stopping the server:', error);
    process.exit(1);
  }
});

startServer();
module.exports = app;
