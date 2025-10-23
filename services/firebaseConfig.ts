// It's recommended to use a more recent version of the Firebase SDK.
// Using ES module imports from the Firebase CDN is the modern approach.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// --- IMPORTANT ---
// The Firebase configuration values below are placeholders.
// You MUST replace them with your own Firebase project's credentials.
// Go to your Firebase project console > Project settings > General tab,
// scroll down to "Your apps", and find your web app's configuration.
//
// In a real-world application, these keys should not be hardcoded.
// They should be stored securely, for example, using environment variables
// with a build tool like Vite or Create React App.
const firebaseConfig = {
  apiKey: "AIzaSyD27ISSfrPPahidXPWRpjOVjGqPdUgMQgY",
  authDomain: "my-immo-8d85d.firebaseapp.com",
  projectId: "my-immo-8d85d",
  storageBucket: "my-immo-8d85d.firebasestorage.app",
  messagingSenderId: "651818479687",
  appId: "1:651818479687:web:4d701431c5253ccf304162",
  measurementId: "G-MZC75DEKHS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth instance to be used throughout the application
export const auth = getAuth(app);
export default auth;