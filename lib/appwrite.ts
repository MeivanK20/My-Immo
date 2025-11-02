import { Client, Account, Databases, Storage, ID, OAuthProvider, AppwriteException, Permission, Role, Query } from 'appwrite';

// FIX: Hardcoded Appwrite configuration to resolve runtime errors caused by
// the environment's lack of support for Vite's `import.meta.env`.
const VITE_APPWRITE_PROJECT_ID = "690390ee003a2fd4605f";
const VITE_APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1";

const client = new Client()
    .setEndpoint(VITE_APPWRITE_ENDPOINT)
    .setProject(VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// IDs for the Appwrite Starter demo. These should be replaced by the user
// in their Appwrite project console.
export const DEMO_DATABASE_ID = "YOUR_DATABASE_ID"; // Replace with your actual database ID
export const DEMO_TODOS_COLLECTION_ID = "YOUR_COLLECTION_ID"; // Replace with your actual collection ID

export { ID, OAuthProvider, AppwriteException, Permission, Role, Query };