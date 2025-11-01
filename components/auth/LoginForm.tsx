import { useState } from "react";
import { AuthService } from "./AuthService";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthService.login(email, password);
      setMessage("✅ Connecté avec succès !");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-2 w-80 p-4 border rounded-xl bg-white shadow">
      <h2 className="text-xl font-semibold">Connexion</h2>
      <input type="email" placeholder="Email" className="p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" className="p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Se connecter</button>
      <p className="text-sm mt-2">{message}</p>
    </form>
  );
}
