/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Account.tsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import "./Account.css";
import BackButton from "../../components/BackButton/BackButton";
import Loading from "../../components/Loading/Loading";
import FormDados from "../../components/FormDados/FormDados";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import SpanMessage from "../../components/SpanMessage/SpanMessage";

const Account: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>();
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>();
  const [loading, setLoading] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [formSubmit, setFormSubmit] = useState(false);
  const [showOkMessage, setShowOkMessage] = useState(false);
  const [nome, setNome] = useState("");
  const spanMessage = "Operação, realizada com sucesso.";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    setNome(user ? user.name || user.displayName || "Usuário" : "Faça login!");
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChangePassword = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!user || !user.email) {
      setPasswordError("Usuário não logado ou e-mail indisponível.");
      setLoading(false);
      return;
    }
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("Por favor, preencha todos os campos de senha.");
      setLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("A nova senha e a confirmação não coincidem.");
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      setPasswordSuccess("Senha atualizada com sucesso!");
      setNewPassword("");
      setConfirmNewPassword("");
      setCurrentPassword("");
    } catch (error: any) {
      console.error("Erro ao mudar senha:", error);
      if (error.code === "auth/requires-recent-login") {
        setPasswordError(
          "Sua sessão expirou. Por favor, faça login novamente para mudar sua senha.",
        );
      } else if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password"
      ) {
        setPasswordError("Senha atual incorreta.");
      } else if (error.code === "auth/weak-password") {
        setPasswordError(
          "A nova senha é muito fraca. Ela deve ter pelo menos 6 caracteres.",
        );
      } else {
        setPasswordError(
          `Erro ao mudar senha: ${error.message || "Tente novamente."}`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return loading || !user ? (
    <Loading />
  ) : (
    <div className="account-container">
      {showOkMessage && <SpanMessage message={spanMessage} status="ok" />}
      {showErrorMessage && (
        <ErrorMessage
          onClose={() => (setShowErrorMessage(false), navigate("/carrinho"))}
        />
      )}
      {formSubmit ? (
        <FormDados
          setShowErrorMessage={setShowErrorMessage}
          setFormSubmit={setFormSubmit}
          setShowOkMessage={setShowOkMessage}
        />
      ) : (
        <>
          <BackButton />
          <h2>Minha Conta</h2>
          <div className="user-info">
            <p>
              <strong>Nome:</strong> {nome}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
          <div className="change-password-section">
            <button
              className="submit-button"
              onClick={() => setFormSubmit(true)}
            >
              Atualizar dados pessoais
            </button>
          </div>
          <div className="change-password-section">
            <h3>Alterar Senha</h3>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label htmlFor="current-password">Senha Atual</label>
                <input
                  type="password"
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-password">Nova Senha</label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-new-password">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  id="confirm-new-password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
              {passwordSuccess && (
                <p className="success-message">{passwordSuccess}</p>
              )}
              <Button child="Alterar Senha" />
            </form>
          </div>

          <div className="change-password-section">
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Account;
