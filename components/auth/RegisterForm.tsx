import { useState } from "react";
import { AuthService } from "./AuthService";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AuthService.register(email, password, name);
      setMessage("✅ Compte créé et connecté !");
      setEmail("");
      setPassword("");
      setName("");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-2 w-80 p-4 border rounded-xl bg-white shadow">
      <h2 className="text-xl font-semibold">Inscription</h2>
      <input type="text" placeholder="Nom" className="p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="Email" className="p-2 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Mot de passe" className="p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">Créer un compte</button>
      <p className="text-sm mt-2">{message}</p>
    </form>
  );
}
