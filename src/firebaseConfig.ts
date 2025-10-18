import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwQ0TTT4QGCu5V_vnnExG3jZSdCjldn_4",
  authDomain: "my-immo-a8674.firebaseapp.com",
  projectId: "my-immo-a8674",
  storageBucket: "my-immo-a8674.firebasestorage.app",
  messagingSenderId: "451589935533",
  appId: "1:451589935533:web:f9b062a92d84b0997f9124",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
