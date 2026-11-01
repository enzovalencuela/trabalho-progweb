// src/utils/firebaseConfig.js

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";

import { getStorage } from "firebase/storage";

export const auth = getAuth();

export const googleAuthProvider = new GoogleAuthProvider();

export const storage = getStorage();

export {
  signInWithPopup,
  EmailAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  updateProfile,
};
