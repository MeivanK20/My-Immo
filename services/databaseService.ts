import { databases } from "../appwriteConfig";

const DATABASE_ID = "6903ab1000172589d78a";
const COLLECTION_ID = "properties";

export const getProperties = async () => {
  const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
  return res.documents;
};

export const addProperty = async (propertyData: object) => {
  return await databases.createDocument(DATABASE_ID, COLLECTION_ID, "unique()", propertyData);
};
