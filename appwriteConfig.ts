// appwriteConfig.ts
import { Client, Account, Databases, Storage } from "appwrite";

// Création du client Appwrite
const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Endpoint Appwrite Cloud
  .setProject("690390ee003a2fd4605f");            // ID projet My Immo

// Services Appwrite
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Tu peux maintenant utiliser :
// account -> pour l'authentification (login, signup, OAuth2)
// databases -> pour créer/lire/mettre à jour/supprimer des collections et documents
// storage -> pour gérer le stockage de fichiers (images, documents, etc.)
