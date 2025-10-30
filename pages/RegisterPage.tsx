import React, { useState } from "react";
import { registerUser } from "../services/authService";
import { NavigationFunction } from "../types";

interface Props {
  onRegister?: (name: string, email: string, role?: string) => any;
  onNavigate?: NavigationFunction;
}

export default function RegisterPage({ onNavigate, onRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser(email, password, name);
      // call parent handler if provided
      if (onRegister) onRegister(name, email);
      alert("Compte créé avec succès !");
      if (onNavigate) onNavigate("login");
    } catch (err) {
      alert("Erreur lors de l’inscription");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Inscription</h2>
        <input
          type="text"
          placeholder="Nom complet"
          className="border p-2 w-full mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="border p-2 w-full mb-5 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          S'inscrire
        </button>
      </div>
    </div>
  );
}
