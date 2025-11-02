// src/services/authService.ts
import { account } from "../lib/appwriteConfig";
import { ID, OAuthProvider, AppwriteException } from "../lib/appwrite";

// A helper function to create a user session and then immediately get the user's account data.
const createSessionAndGetAccount = async (promise: Promise<any>) => {
    await promise;
    return await account.get();
};

export const authService = {
  /**
   * Creates a new user account.
   * @param email The user's email.
   * @param password The user's password.
   * @param name The user's name.
   * @returns A promise that resolves with the newly created user object.
   */
  createAccount: (email: string, password: string, name: string) => {
    return account.create(ID.unique(), email, password, name);
  },

  /**
   * Creates an email and password session (logs the user in).
   * @param email The user's email.
   * @param password The user's password.
   * @returns A promise that resolves with the user's account data upon successful login.
   */
  createEmailSession: (email: string, password: string) => {
    return createSessionAndGetAccount(account.createEmailPasswordSession(email, password));
  },

  /**
   * Initiates the Google OAuth2 login flow.
   */
  createGoogleOAuth2Session: () => {
    const successUrl = `${window.location.origin}`;
    const failureUrl = `${window.location.origin}/login`;
    account.createOAuth2Session(
      OAuthProvider.Google,
      successUrl,
      failureUrl
    );
  },

  /**
   * Deletes the current user session (logs the user out).
   */
  deleteCurrentSession: () => account.deleteSession("current"),

  /**
   * Fetches the currently logged-in user's account data.
   */
  getCurrentAccount: async () => {
    try {
      const user = await account.get();
      return user;
    } catch (err) {
      if (err instanceof AppwriteException && err.code !== 401) {
          console.error("Appwrite Error fetching account:", err);
      }
      return null;
    }
  },
};
