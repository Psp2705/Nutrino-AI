// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8g8y7WLcgYgfIt_zDmoi_VWwewk1OBM4",
  authDomain: "adminproject-31dbc.firebaseapp.com",
  databaseURL: "https://adminproject-31dbc-default-rtdb.firebaseio.com",
  projectId: "adminproject-31dbc",
  storageBucket: "adminproject-31dbc.firebasestorage.app",
  messagingSenderId: "147629354322",
  appId: "1:147629354322:web:4bb0132b2f30cc48579e8b",
  measurementId: "G-DBS0T0QY11"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db, collection, getDocs, addDoc };
