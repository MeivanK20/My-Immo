import { Client, Account, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // URL Appwrite Cloud
  .setProject("690390ee003a2fd4605f"); // 🔥 Remplace par ton vrai Project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export default client;