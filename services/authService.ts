// services/authService.ts
export const login = async (email: string, password: string) => {
  // Simule une connexion
  return { user: { id: 1, name: "Utilisateur", email } };
};

export const logout = async () => {
  // Simule une déconnexion
  return true;
};
