import React, { useState } from "react";
import "./AuthFormLayout.css";
import { Link, useNavigate } from "react-router-dom";
import OkMessage from "../OkMessage/OkMessage";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { authenticatedFetch } from "../../utils/api";

interface AuthFormLayoutProps {
  title: string;
  children: React.ReactNode;
  welcomeTitle: string;
  welcomeMessage: string;
  welcomeButtonText: string;
  welcomeButtonLink: string;
  showLogo?: boolean;
}

const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({
  title,
  children,
  welcomeTitle,
  welcomeMessage,
  welcomeButtonText,
  welcomeButtonLink,
  showLogo = false,
}) => {
  const [showContaTesteMessage, setShowContaTesteMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const contaTesteMessage =
    "Se for preferível você pode entrar com uma conta teste, assim não precisará se cadastrar";

  const handleLoginTeste = async () => {
    setIsLoading(true);
    const auth = getAuth();
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        "usuarioteste@teste.com",
        "usuarioteste"
      );

      const firebaseIdToken = await userCredential.user.getIdToken();

      const response = await authenticatedFetch(`${VITE_BACKEND_URL}/api/user-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firebaseToken: firebaseIdToken }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        login(data);
        navigate("/");
      } else {
        throw new Error("Erro ao sincronizar conta teste.");
      }
    } catch (error) {
      console.error("Erro no login de teste:", error);
      setShowErrorMessage(true);
    } finally {
      setIsLoading(false);
      setShowContaTesteMessage(false);
    }
  };

  return (
    <div className="auth-page-container">
      {showErrorMessage && (
        <ErrorMessage onClose={() => setShowErrorMessage(false)} />
      )}
      {showContaTesteMessage && (
        <OkMessage
          message={contaTesteMessage}
          onClose={() => setShowContaTesteMessage(false)}
          onClick={handleLoginTeste}
          buttonContent="Entrar"
        />
      )}
      <div className="auth-card">
        <div className="auth-welcome-section">
          {showLogo && (
            <img src="/LOGO_MARCA.png" alt="Logo" className="auth-logo" />
          )}
          <h3>{welcomeTitle}</h3>
          <p>{welcomeMessage}</p>
        </div>
        <div className="auth-form-section">
          <h2>{title}</h2>
          {children}
          <button
            onClick={() => setShowContaTesteMessage(true)}
            className="conta-teste-button"
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Entrar com conta teste"}
          </button>
          <Link to={welcomeButtonLink} className="welcome-button">
            {welcomeButtonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthFormLayout;
