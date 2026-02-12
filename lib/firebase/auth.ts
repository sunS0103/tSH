import { signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth, hasFirebaseAuth } from "./config";

export const signInWithGoogle = async (): Promise<User> => {
  if (!hasFirebaseAuth) {
    throw new Error(
      "Firebase is not configured.",
    );
  }
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const getIdToken = async (): Promise<string | null> => {
  if (!hasFirebaseAuth || !auth.currentUser) {
    return null;
  }
  return await auth.currentUser.getIdToken();
};

