/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Button from "../../components/Button/Button";
import GoogleLoginButton from "../../components/ButtonGoogle/ButtonGoogle";
import AuthFormLayout from "../../components/AuthFormLayout/AuthFormLayout";
import { useAuth } from "../../contexts/AuthContext";
import { authenticatedFetch } from "../../utils/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const googlePopupInFlight = useRef(false);
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  let authInstance: any;
  try {
    authInstance = getAuth();
  } catch (e: any) {
    console.warn(
      "Não foi possível obter a instância do Firebase Auth globalmente. Certifique-se de que o Firebase está inicializado.",
      e,
    );
  }
  const auth = authInstance;

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading || !auth) return;
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      if (!user) {
        throw new Error("Usuário não encontrado após login com e-mail/senha.");
      }

      const firebaseIdToken = await user.getIdToken();
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
        const errorText = await response.text();
        console.error(
          "Erro do backend após login Firebase:",
          response.status,
          errorText,
        );
        setError(
          "Erro ao sincronizar dados do usuário no backend. Tente novamente.",
        );
      }
    } catch (err) {
      console.error("Erro ao fazer login com e-mail/senha (Firebase)", err);
      setError("Falha no login. Verifique seu e-mail e senha.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (firebaseUser: any) => {
    if (isLoading || googlePopupInFlight.current) return;
    googlePopupInFlight.current = true;

    setIsLoading(true);
    setError("");

    try {
      const success = await googleLogin(firebaseUser);

      if (success) {
        navigate("/");
      } else {
        setError("Erro ao autenticar via Google no servidor.");
      }
    } catch (error: any) {
      console.error("Erro durante o processo de login com Google:", error);
      setError("Falha ao realizar login com o Google. Tente novamente.");
    } finally {
      googlePopupInFlight.current = false;
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Entrar"
      welcomeTitle="Bem-vindo de volta!"
      welcomeMessage="Para se conectar, faça login com seus dados."
      welcomeButtonText="Cadastre-se"
      welcomeButtonLink="/register"
      showLogo={true}
    >
      <form className="auth-form" onSubmit={handleEmailLogin}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="sua senha"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <Button
          child={isLoading ? "Carregando..." : "Entrar"}
          disabled={isLoading}
        />
      </form>
      <GoogleLoginButton onSuccess={handleGoogleLogin} disabled={isLoading} />
    </AuthFormLayout>
  );
};

export default Login;
