// appwriteConfig.ts
// This file now re-exports from the main appwrite service to avoid duplicate client initializations.
export { account, databases, storage, DEMO_DATABASE_ID, DEMO_TODOS_COLLECTION_ID } from './appwrite';
