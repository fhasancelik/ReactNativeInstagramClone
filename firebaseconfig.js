import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore,collection  } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


// Firebase config
const firebaseConfig = {
apiKey: "AIzaSyBCdeu1DM2Q8lt8x5EHg-Ft6Qg0Vhw0j7s",
  authDomain: "instagram-352ad.firebaseapp.com",
  projectId: "instagram-352ad",
  storageBucket: "instagram-352ad.appspot.com",
  messagingSenderId: "403055511768",
  appId: "1:403055511768:web:a7d35460c07f2cac022fad"

};
// initialize firebase
const app=initializeApp(firebaseConfig);
export const auth = getAuth();
export const database = getFirestore(app);
export const storage = getStorage(app);


export const usersRef = collection(database, "users");