import { Client, Account, ID, AppwriteException } from "appwrite";

// ✅ Initialisation du client Appwrite
const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// ✅ Export des services Appwrite
export const account = new Account(client);
export { ID };

/**
 * Enregistre un nouvel utilisateur
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe
 * @param name - Nom de l'utilisateur
 */
export const registerUser = async (email: string, password: string, name: string) => {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    return user;
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new Error(error.message);
    }
    throw error;
  }
};

/**
 * Connecte un utilisateur existant
 * @param email - Email
 * @param password - Mot de passe
 */
export const loginUser = async (email: string, password: string) => {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new Error(error.message);
    }
    throw error;
  }
};

/**
 * Déconnecte l'utilisateur actuel
 */
export const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    if (error instanceof AppwriteException) {
      throw new Error(error.message);
    }
    throw error;
  }
};

/**
 * Récupère l'utilisateur actuellement connecté
 */
export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    return null; // Pas de session active
  }
};
