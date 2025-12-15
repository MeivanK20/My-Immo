const apiKey = process.env.API_KEY || '';

export const getRealEstateAdvice = async (userQuery: string): Promise<string> => {
  if (!apiKey) {
    return "L'assistant n'est pas configuré (Clé API manquante).";
  }

  try {
    // Lazy-load the client so a missing CDN/import doesn't throw during app boot/refresh
    const mod = await import('@google/genai').catch((err) => {
      console.error('Failed to import @google/genai:', err);
      throw new Error("Assistant indisponible (échec d'importation du client IA).");
    });

    const { GoogleGenAI } = mod as any;
    if (!GoogleGenAI) {
      console.error('GoogleGenAI not available from module import:', mod);
      return "Assistant indisponible (client IA introuvable).";
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: "Tu es un expert immobilier virtuel pour l'agence 'My Immo'. Tu es poli, professionnel et tu aides les utilisateurs à trouver des maisons, ou à répondre à des questions sur l'achat/vente. Réponds de manière concise (max 3 phrases) et en français.",
      }
    });

    return (response as any)?.text || "Désolé, je n'ai pas pu traiter votre demande.";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    // Surface helpful message for NOT_FOUND from remote (e.g., model not found or CDN import failed)
    const msg = error?.message || String(error);
    if (msg.toLowerCase().includes('not_found') || msg.toLowerCase().includes('not found') || msg.toLowerCase().includes('cpt1')) {
      return "Assistant temporairement indisponible (modèle introuvable ou clé invalide).";
    }
    return "Une erreur est survenue lors de la communication avec l'assistant.";
  }
};