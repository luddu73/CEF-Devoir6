/**
 * Initialise la connexion à la base de données MongoDB.
 * 
 * Cette fonction utilise Mongoose pour se connecter à MongoDB en utilisant l'URL de connexion définie dans les variables d'environnement.
 * Elle affiche un message de succès en cas de connexion réussie et un message d'erreur en cas d'échec.
 * 
 * @async
 * @throws {Error} Si la connexion échoue, l'erreur sera lancée.
 * 
 * @example
 * // Exemple d'utilisation
 * await initClientDbConnection();
 */
const mongoose = require('mongoose');

const clientOptions = {
    useNewUrlParser : true,
    dbName : process.env.DB_NAME
};

exports.initClientDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('✅ Connexion à la base de données MongoDB réussie');
    } catch (error) {
        console.log("❌ Erreur de connexion à MongoDB : ", error);
        throw error;
    }
}