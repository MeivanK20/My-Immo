import { Client, Account, ID, AppwriteException } from 'appwrite';

const client = new Client();

// IMPORTANT: Replace 'YOUR_PROJECT_ID' with your actual Appwrite project ID.
client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject('YOUR_PROJECT_ID'); 

export const account = new Account(client);

// A helper function to create a user session and then immediately get the user's account data.
const createSessionAndGetAccount = async (promise: Promise<any>) => {
    await promise;
    return await account.get();
};

export const appwriteService = {
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
        return createSessionAndGetAccount(account.createEmailSession(email, password));
    },

    /**
     * Initiates the Google OAuth2 login flow. The browser will be redirected to Google's login page.
     */
    createGoogleOAuth2Session: () => {
        // The URL Appwrite will redirect to after a successful login.
        const successUrl = window.location.origin;
        // The URL Appwrite will redirect to after a failed login.
        const failureUrl = window.location.origin;
        account.createOAuth2Session('google', successUrl, failureUrl);
    },

    /**
     * Fetches the currently logged-in user's account data.
     * @returns A promise that resolves with the user's account object or null if not logged in.
     */
    getCurrentAccount: async () => {
        try {
            return await account.get();
        } catch (error) {
            // Appwrite throws a 401 error if the user is not logged in. We can safely ignore this.
            // Any other error should be logged for debugging.
            if (error instanceof AppwriteException && error.code !== 401) {
                console.error("Appwrite Error fetching account:", error);
            }
            return null;
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

// Export AppwriteException to be used for type checking in components.
export { AppwriteException };
