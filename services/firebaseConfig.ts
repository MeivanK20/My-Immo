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
  apiKey: "AIzaSyBwQ0TTT4QGCu5V_vnnExG3jZSdCjldn_4",
  authDomain: "my-immo-a8674.firebaseapp.com",
  projectId: "my-immo-a8674",
  storageBucket: "my-immo-a8674.firebasestorage.app",
  messagingSenderId: "451589935533",
  appId: "1:451589935533:web:f9b062a92d84b0997f9124",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the auth instance to be used throughout the application
export const auth = getAuth(app);
export default auth;