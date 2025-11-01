import { useState } from "react";
import { client } from "../lib/appwriteConfig";

export default function PingButton() {
  const [message, setMessage] = useState("");

  const handlePing = async () => {
    try {
      // Appelle l’API root de Appwrite pour tester la connexion
      const response = await client.call('GET', '/health');
      setMessage("✅ Ping réussi : " + JSON.stringify(response));
    } catch (err: any) {
      setMessage("❌ Ping échoué : " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handlePing}
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Send a ping
      </button>
      <p className="text-sm mt-2">{message}</p>
    </div>
  );
}
