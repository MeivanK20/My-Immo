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
