import { account } from "../appwriteConfig";

// Inscription utilisateur
export const registerUser = async (email: string, password: string, name: string) => {
  try {
    return await account.create('unique()', email, password, name);
  } catch (error) {
    console.error("Erreur inscription :", error);
    throw error;
  }
};

// Connexion utilisateur
export const loginUser = async (email: string, password: string) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.error("Erreur connexion :", error);
    throw error;
  }
};

// Déconnexion
export const logoutUser = async () => {
  try {
    await account.deleteSessions();
  } catch (error) {
    console.error("Erreur déconnexion :", error);
  }
};

// Récupérer le profil utilisateur connecté
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};
