/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./MinhasCompras.css";
import { useAuth } from "../../contexts/AuthContext";
import Loading from "../../components/Loading/Loading";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton/BackButton";
import SpanMessage from "../../components/SpanMessage/SpanMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { authenticatedFetch } from "../../utils/api";

interface MinhasComprasProps {
  id: number;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  provider_payment_id: string;
}

function MinhasCompras() {
  const [minhasCompras, setMinhasCompras] = useState<MinhasComprasProps[]>();
  const [loading, setLoading] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSpanOkMessage, setShowSpanOkMessage] = useState(false);
  const { user, setAtualizarQuery } = useAuth();
  const navigate = useNavigate();
  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setShowErrorMessage(true);
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    if (!user) return;

    const fetchCompras = async () => {
      try {
        const response = await authenticatedFetch(
          `${VITE_BACKEND_URL}/api/user/payments?id=${user.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();

        if (!response.ok) {
          console.log("Erro ao buscar suas compras");
        }

        setMinhasCompras(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao realizar conexão:", error);
        setLoading(false);
      }
    };
    fetchCompras();
  }, []);

  const CancelPurchase = async (id: number) => {
    setLoading(true);
    if (!user) return;

    try {
      const response = await authenticatedFetch(`${VITE_BACKEND_URL}/api/user/payments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        console.log("Erro ao cancelar compra");
      }

      setMinhasCompras((prev) => prev?.filter((c) => c.id !== id));

      setShowSpanOkMessage(true);
      setTimeout(() => {
        setShowSpanOkMessage(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao cancelar compra", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-minhas-compras">
      {loading && <Loading />}
      {showErrorMessage && (
        <ErrorMessage onClose={() => setShowErrorMessage(false)} />
      )}
      {showSpanOkMessage && (
        <SpanMessage message="operação realizada com sucesso" status="ok" />
      )}
      <BackButton />
      <div className="div-compras">
        <h1>Minhas Compras</h1>
        {minhasCompras ? (
          minhasCompras.map((compra) => (
            <div className="div-compra" key={compra.id}>
              <div
                className="div-info"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/status?payment_id=${compra.provider_payment_id}`);
                  setAtualizarQuery(true);
                }}
              >
                <p>Valor: R${compra.amount}</p>
                <p>
                  Status:{" "}
                  {compra.status === "approved" ? "Aprovado" : "Rejeitado"}
                </p>
              </div>
              {compra.status !== "approved" ? (
                <button
                  onClick={() => CancelPurchase(compra.id)}
                  className="cancelar-compra-button"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              ) : (
                <FontAwesomeIcon style={{ color: "#00ad11" }} icon={faCheck} />
              )}
            </div>
          ))
        ) : (
          <div>
            <h2>Nenhuma compra realizada</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default MinhasCompras;
