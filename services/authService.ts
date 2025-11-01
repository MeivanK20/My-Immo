// services/authService.ts
import { account, ID } from "../lib/appwriteConfig";
import { AppwriteException, OAuthProvider } from "appwrite";

// Création d’un compte utilisateur
export const registerUser = async (email: string, password: string, name?: string) => {
  try {
    return await account.create(
      ID.unique(), // FIX: Use ID.unique() for a unique user ID
      email,
      password,
      name
    );
  } catch (error) {
    console.error("Erreur registration:", error);
    throw error;
  }
};

// Connexion utilisateur
export const loginUser = async (email: string, password: string) => {
  try {
    // FIX: createEmailPasswordSession takes two string arguments, not an object.
    await account.createEmailPasswordSession(
      email,
      password
    );
    // Return the user account object on successful session creation
    return await account.get();
  } catch (error) {
    console.error("Erreur login:", error);
    throw error;
  }
};

// Connexion avec Google
export const googleSignIn = () => {
    const successUrl = window.location.origin;
    const failureUrl = window.location.origin;
    account.createOAuth2Session(OAuthProvider.Google, successUrl, failureUrl);
};

// Déconnexion utilisateur
export const logoutUser = async () => {
  try {
    return await account.deleteSession("current");
  } catch (error) {
    console.error("Erreur logout:", error);
    throw error;
  }
};

// Récupérer les informations de l’utilisateur connecté
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    if (error instanceof AppwriteException && error.code === 401) {
      return null; // Not logged in, this is expected.
    }
    console.error("Erreur getCurrentUser:", error);
    return null;
  }
};
