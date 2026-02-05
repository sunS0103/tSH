import { signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";
import { auth } from "./config";

export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const getIdToken = async (): Promise<string | null> => {
  if (!auth.currentUser) {
    return null;
  }
  return await auth.currentUser.getIdToken();
};

