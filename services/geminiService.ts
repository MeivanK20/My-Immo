import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getRealEstateAdvice = async (userQuery: string): Promise<string> => {
  if (!apiKey) {
    return "L'assistant n'est pas configuré (Clé API manquante).";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: "Tu es un expert immobilier virtuel pour l'agence 'My Immo'. Tu es poli, professionnel et tu aides les utilisateurs à trouver des maisons, ou à répondre à des questions sur l'achat/vente. Réponds de manière concise (max 3 phrases) et en français.",
      }
    });

    return response.text || "Désolé, je n'ai pas pu traiter votre demande.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Une erreur est survenue lors de la communication avec l'assistant.";
  }
};