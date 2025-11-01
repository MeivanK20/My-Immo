import { Client, Account, Databases, Storage, ID } from "appwrite";

const client = new Client();

// This is a public demo project ID. For your own app, use your project ID and
// make sure to add your app's hostname as a "Web App" platform in the Appwrite console.
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("690390ee003a2fd4605f");

// Export the configured services
export const account = new Account(client);

// Export Databases and Storage for future use (e.g., storing property data)
export const databases = new Databases(client);
export const storage = new Storage(client);

// Export ID for creating unique IDs
export { ID };