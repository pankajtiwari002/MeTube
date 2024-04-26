// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtuq_-bdch2P9kv0HjRopCD3H9slhJuo0",
  authDomain: "video-b7db7.firebaseapp.com",
  projectId: "video-b7db7",
  storageBucket: "video-b7db7.appspot.com",
  messagingSenderId: "891124278045",
  appId: "1:891124278045:web:4d472fe3d5a9908ea8b7f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export default app;