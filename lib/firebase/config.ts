import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isFirebaseConfigured =
  typeof firebaseConfig.apiKey === "string" &&
  firebaseConfig.apiKey.length > 0;

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth;

if (typeof window !== "undefined" && isFirebaseConfigured) {
  // Client-side: only init when API key is set
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
} else {
  // Server-side or missing config: minimal auth object for types only
  auth = {} as Auth;
}

export const hasFirebaseAuth = isFirebaseConfigured && typeof window !== "undefined";

export { auth, GoogleAuthProvider };

