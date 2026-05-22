import {initializeApp, getApp, getApps} from"firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAb3CXPOEPDq1nbxRV0-JmosYagLPISXSs",
  authDomain: "prepwise-eff06.firebaseapp.com",
  projectId: "prepwise-eff06",
  storageBucket: "prepwise-eff06.firebasestorage.app",
  messagingSenderId: "356946603881",
  appId: "1:356946603881:web:a67db3c0058085c04a17f8",
  measurementId: "G-BDC3KRV4FS"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);