import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD27ISSfrPPahidXPWRpjOVjGqPdUgMQgY",
  authDomain: "my-immo-8d85d.firebaseapp.com",
  projectId: "my-immo-8d85d",
  storageBucket: "my-immo-8d85d.firebasestorage.app",
  messagingSenderId: "651818479687",
  appId: "1:651818479687:web:4d701431c5253ccf304162",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
