/* eslint-disable @typescript-eslint/no-explicit-any */
import GoogleIcon from "../../assets/googleIcon.svg";
import {
  auth,
  googleAuthProvider,
  signInWithPopup,
} from "../../firebaseConfig";
import "./ButtonGoogle.css";
import { motion } from "framer-motion";
import { useRef } from "react";

function GoogleLoginButton({ onSuccess, onError, disabled = false }: any) {
  const popupInFlight = useRef(false);
  const handleGoogleSignIn = async () => {
    if (disabled || popupInFlight.current) return;
    popupInFlight.current = true;
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (onSuccess) {
        onSuccess(result.user);
      }
    } catch (error) {
      console.error(
        "Erro ao fazer login com o Google (componente GoogleLoginButton):",
        error
      );
      if (onError) {
        onError(error);
      }
    } finally {
      popupInFlight.current = false;
    }
  };

  return (
    <motion.button
      onClick={handleGoogleSignIn}
      type="button"
      disabled={disabled}
      className="button-google"
      whileTap={{ scale: 0.97 }}
    >
      <img src={GoogleIcon} alt="" />
      <span>Entre com sua conta Google</span>
    </motion.button>
  );
}

export default GoogleLoginButton;
