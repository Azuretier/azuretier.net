import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_RHYTHMIA_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_RHYTHMIA_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_RHYTHMIA_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_RHYTHMIA_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_RHYTHMIA_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_RHYTHMIA_FIREBASE_APP_ID,
};

// Singleton pattern to prevent re-initialization in Next.js dev mode
let app;
try {
  app = getApp('rhythmia');
} catch (error) {
  app = initializeApp(firebaseConfig, 'rhythmia');
}

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
