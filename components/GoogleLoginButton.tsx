// src/components/GoogleLoginButton.tsx
import React from "react";
import { account } from "../lib/appwriteConfig";

const GoogleLoginButton: React.FC = () => {
  // Fonction de connexion Google via Appwrite
  const loginWithGoogle = () => {
    account.createOAuth2Session(
      "google",
      "http://localhost:5173",      // URL en cas de succès (retour vers ton app)
      "http://localhost:5173/login" // URL en cas d'échec
    );
  };

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={loginWithGoogle}
        className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg shadow-sm transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        <span>Se connecter avec Google</span>
      </button>
    </div>
  );
};

export default GoogleLoginButton;
