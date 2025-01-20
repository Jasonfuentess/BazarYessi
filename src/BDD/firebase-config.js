// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCxXmiYNjqQnCNviR1RweGSRbXqQeM8ss",
  authDomain: "hypercraft-753ae.firebaseapp.com",
  projectId: "hypercraft-753ae",
  storageBucket: "hypercraft-753ae.firebasestorage.app",
  messagingSenderId: "73078138037",
  appId: "1:73078138037:web:d08713bbb6fe7fd7e28afc",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Firestore y Storage
export const db = getFirestore(app);
export const storage = getStorage(app);
