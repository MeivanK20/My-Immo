

import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
// FIX: Import the shared auth instance from firebaseConfig to ensure a single instance is used across the app.
import { auth } from "../firebaseConfig";

const googleProvider = new GoogleAuthProvider();

/**
 * Initiates the Google Sign-In process using a popup window.
 * @returns A promise that resolves with the Firebase User object on successful authentication, or null if the process fails or is cancelled.
 */
export const signInWithGooglePopup = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Google Sign-In Error:", error.code, error.message);
    if (error.code === 'auth/popup-closed-by-user') {
        return null;
    }
    throw error;
  }
};


/**
 * Registers a new user with email and password.
 * @param email 
 * @param password 
 * @param name 
 * @returns A promise that resolves with the new Firebase User object.
 */
export const registerWithEmail = async (email: string, password: string, name: string): Promise<FirebaseUser> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return userCredential.user;
}

/**
 * Signs in a user with email and password.
 * @param email 
 * @param password 
 * @returns A promise that resolves with the Firebase User object.
 */
export const signInWithEmail = async (email: string, password: string): Promise<FirebaseUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}


/**
 * Signs out the current user.
 * @returns A promise that resolves when sign-out is complete.
 */
export const signOutUser = (): Promise<void> => {
    return signOut(auth);
}

/**
 * Sets up a listener for authentication state changes.
 * @param callback The function to call when the auth state changes.
 * @returns The unsubscribe function from Firebase.
 */
export const onAuthObserver = (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
}
