// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0uf5oH-BXMHcnKlh_j8udDxWd46IMEJg",
  authDomain: "foodshareapp-358fc.firebaseapp.com",
  projectId: "foodshareapp-358fc",
  storageBucket: "foodshareapp-358fc.firebasestorage.app",
  messagingSenderId: "1037353114902",
  appId: "1:1037353114902:web:b71e46a4b31323ccfe8437"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;