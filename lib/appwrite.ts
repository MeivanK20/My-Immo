import { Client, Account, Databases, Storage, ID, OAuthProvider, AppwriteException } from 'appwrite';

const VITE_APPWRITE_PROJECT_ID = "690390ee003a2fd4605f";
const VITE_APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1";

if (!VITE_APPWRITE_PROJECT_ID || !VITE_APPWRITE_ENDPOINT) {
    throw new Error("Appwrite environment variables are not set. Please check your configuration.");
}

const client = new Client()
    .setEndpoint(VITE_APPWRITE_ENDPOINT)
    .setProject(VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, OAuthProvider, AppwriteException };

const createSessionAndGetAccount = async (promise: Promise<any>) => {
    await promise;
    return await account.get();
};

export const api = {
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
        const successUrl = window.location.origin;
        const failureUrl = window.location.origin;
        account.createOAuth2Session(OAuthProvider.Google, successUrl, failureUrl);
    },

    /**
     * Fetches the currently logged-in user's account data.
     * @returns A promise that resolves with the user's account object or null if not logged in.
     */
    getCurrentAccount: async () => {
        try {
            return await account.get();
        } catch (error) {
            if (error instanceof AppwriteException && error.code === 401) {
                return null; // This is an expected case for a user who is not logged in.
            }
            // For other errors (e.g., network issues), re-throw to be handled by the caller.
            console.error("Appwrite service error while fetching account:", error);
            throw error;
        }
    },

    /**
     * Deletes the current user session (logs the user out).
     * @returns A promise that resolves when the session is successfully deleted.
     */
    deleteCurrentSession: () => {
        return account.deleteSession('current');
    },
};
