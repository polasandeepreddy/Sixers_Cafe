// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Optional: Only if you need analytics
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAFWuxeijvx3WGq4SnwecduQyDIlCKhtJo",
  authDomain: "sixercafe-a7fa1.firebaseapp.com",
  projectId: "sixercafe-a7fa1",
  storageBucket: "sixercafe-a7fa1.appspot.com", // corrected .app to .appspot.com
  messagingSenderId: "859140453801",
  appId: "1:859140453801:web:6e253b2fdf5eac39b080b8",
  measurementId: "G-TRRX3DS2YQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firestore
export const db = getFirestore(app);

// Optional: Analytics
// const analytics = getAnalytics(app);
