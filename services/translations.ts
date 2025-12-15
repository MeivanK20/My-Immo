export const translations = {
  fr: {
    navbar: {
      home: 'Accueil',
      listings: 'Annonces',
      about: 'À propos',
      contact: 'Contact',
      login: 'CONNEXION',
      signup: 'INSCRIPTION',
      dashboard: 'Tableau de bord',
      profile: 'Paramètres du profil',
      logout: 'Déconnexion',
    },
    login: {
      title: 'Connexion',
      email: 'Email',
      password: 'Mot de passe',
      login_btn: 'Se connecter',
      resend_confirmation: 'Renvoyer le mail de confirmation',
      resend_confirmation_sent: 'Email de confirmation envoyé. Vérifiez votre boîte de réception.' ,
      google_signin: 'Se connecter avec Google',
    },
    signup: {
      title: 'Inscription',
      full_name: 'Nom complet',
      username: 'Nom d\'utilisateur',
      email: 'Email',
      password: 'Mot de passe',
      signup_btn: "S'inscrire",
    },
    profile: {
      title: 'Profil',
      edit: 'Modifier',
      save: 'Enregistrer',
    },
    footer: {
      about: 'À propos',
      contact: 'Contact',
    },
  },
  en: {
    navbar: { home: 'Home', listings: 'Listings', about: 'About', contact: 'Contact', login: 'LOGIN', signup: 'SIGNUP', dashboard: 'Dashboard', profile: 'Profile Settings', logout: 'Logout' },
    login: { title: 'Login', email: 'Email', password: 'Password', login_btn: 'Login', google_signin: 'Sign in with Google' },
    signup: { title: 'Sign Up', full_name: 'Full Name', email: 'Email', password: 'Password', signup_btn: 'Sign Up' },
    profile: { title: 'Profile', edit: 'Edit', save: 'Save' },
    footer: { about: 'About', contact: 'Contact' },
  },
};

export type LanguageKey = 'fr' | 'en';
