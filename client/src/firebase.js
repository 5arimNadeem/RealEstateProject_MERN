// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-cf301.firebaseapp.com",
    projectId: "mern-estate-cf301",
    storageBucket: "mern-estate-cf301.firebasestorage.app",
    messagingSenderId: "350421613458",
    appId: "1:350421613458:web:31b12b52ea1f25899f9f4b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);