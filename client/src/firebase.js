// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHD-ez_2p2LbHUIMOBKkt9l6ZS1lAqfC8",
  authDomain: "adminproject-26d75.firebaseapp.com",
  projectId: "adminproject-26d75",
  storageBucket: "adminproject-26d75.appspot.com",
  messagingSenderId: "1071874739647",
  appId: "1:1071874739647:web:1139c921f72caf6d7fe50a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db, collection, getDocs, addDoc };
