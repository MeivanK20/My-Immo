import React, { useState } from "react";
import { getCurrentUser } from "../services/authService";
import Button from "./common/Button";

const PingButton: React.FC = () => {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePing = async () => {
    setIsLoading(true);
    setResponse(null);
    setError(null);
    try {
      const user = await getCurrentUser();
      setResponse(user || "No user is currently logged in.");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-brand-card rounded-lg shadow-lg">
      <Button onClick={handlePing} disabled={isLoading} className="w-full">
        {isLoading ? "Pinging..." : "Ping Appwrite (getCurrentUser)"}
      </Button>
      
      {response && (
        <div className="mt-4">
          <h3 className="font-semibold text-green-400">Success:</h3>
          <pre className="p-2 mt-1 text-sm text-gray-200 bg-brand-dark rounded-md overflow-x-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <h3 className="font-semibold text-red-400">Error:</h3>
          <pre className="p-2 mt-1 text-sm text-red-300 bg-brand-dark rounded-md overflow-x-auto">
            {error}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PingButton;