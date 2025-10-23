import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD27ISSfrPPahidXPWRpjOVjGqPdUgMQgY",
  authDomain: "my-immo-8d85d.firebaseapp.com",
  projectId: "my-immo-8d85d",
  storageBucket: "my-immo-8d85d.firebasestorage.app",
  messagingSenderId: "651818479687",
  appId: "1:651818479687:web:4d701431c5253ccf304162",
  measurementId: "G-MZC75DEKHS"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
