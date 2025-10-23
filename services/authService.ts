import { 
  GoogleAuthProvider, 
  signInWithRedirect,
  getRedirectResult,
  User as FirebaseUser 
} from "firebase/auth";
import { auth } from "../firebaseConfig";

export const signInWithGoogleRedirect = async (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  
  try {
    await signInWithRedirect(auth, provider);
  } catch (error: any) {
    console.error("Google Redirect Sign-In Error:", error.code, error.message);
  }
};

export const handleGoogleRedirectResult = async (): Promise<FirebaseUser | null> => {
  try {
    const result = await getRedirectResult(auth);
    return result ? result.user : null;
  } catch (error: any) {
    if (error.code === 'auth/network-request-failed') {
        console.warn('Network error during redirect check. This is often normal on first page load.');
    } else {
        console.error("Google Redirect Result Error:", error.code, error.message);
    }
    return null;
  }
};
