import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  User as FirebaseUser 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { auth } from "./firebaseConfig";

const provider = new GoogleAuthProvider();

/**
 * Initiates the Google Sign-In process using a popup window.
 * @returns A promise that resolves with the Firebase User object on successful authentication, or null if the process fails or is cancelled.
 */
export const signInWithGoogle = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    // Log errors for debugging, but handle them gracefully in the UI.
    // Common errors include 'auth/popup-closed-by-user'.
    console.error("Google Sign-In Error:", error.code, error.message);
    return null;
  }
};
