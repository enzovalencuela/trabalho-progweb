/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./FormDados.css";
import BackButton from "../BackButton/BackButton";
import { authenticatedFetch } from "../../utils/api";

function FormDados({
  setShowErrorMessage,
  setFormSubmit,
  setShowOkMessage,
}: any) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zip: "",
  });

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  if (!user) return;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTimeout(() => {
      setFormSubmit(false);
    }, 1000);

    try {
      const res = await authenticatedFetch(
        `${VITE_BACKEND_URL}/api/user/${user.id}/update-checkout-info`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao salvar dados do usuário");
      }

      setShowOkMessage(true);
    } catch (error) {
      console.error("Erro ao atualizar dados de checkout:", error);
      setShowErrorMessage(true);
    }
  };

  return (
    <>
      <BackButton />
      <form onSubmit={handleSubmit} className="input_container">
        <input
          name="phone"
          placeholder="Telefone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Endereço"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <input
          name="number"
          placeholder="Número"
          value={formData.number}
          onChange={handleChange}
          required
        />
        <input
          name="neighborhood"
          placeholder="Bairro"
          value={formData.neighborhood}
          onChange={handleChange}
        />
        <input
          name="city"
          placeholder="Cidade"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <input
          name="state"
          placeholder="Estado"
          value={formData.state}
          onChange={handleChange}
          required
        />
        <input
          name="zip"
          placeholder="CEP"
          value={formData.zip}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="submit-button"
          disabled={
            !formData.address ||
            !formData.city ||
            !formData.neighborhood ||
            !formData.number ||
            !formData.phone ||
            !formData.state ||
            !formData.zip
          }
        >
          Salvar informações
        </button>
        <button
          className="add-to-cart-btn"
          onClick={() => setFormSubmit(false)}
        >
          Voltar
        </button>
      </form>
    </>
  );
}

export default FormDados;
