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
import {
  faCheck,
  faTrash,
  faTimesCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { authenticatedFetch } from "../../utils/api";

interface MinhasComprasProps {
  id: number;
  amount: number;
  currency: string;
  status: string;
  provider?: string;
  provider_payment_id?: string;
  providerPaymentId?: string;
  transaction_id?: string;
  transaction_amount?: number;
  total_amount?: number;
  items?: any[];
  additional_info?: {
    items?: any[];
  };
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
        let response = await authenticatedFetch(
          `${VITE_BACKEND_URL}/api/payments/user/${user.id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          response = await authenticatedFetch(
            `${VITE_BACKEND_URL}/api/user/payments?id=${user.id}`,
            {
              method: "GET",
              credentials: "include",
            },
          );
        }

        const data = await response.json();

        if (response.ok && Array.isArray(data)) {
          setMinhasCompras(data);
        } else {
          console.error("Erro ao buscar compras:", data);
        }
      } catch (error) {
        console.error("Erro ao realizar conexão:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompras();
  }, [user]);

  const CancelPurchase = async (id: number) => {
    setLoading(true);
    if (!user) return;

    try {
      const response = await authenticatedFetch(
        `${VITE_BACKEND_URL}/api/user/payments/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        console.error("Erro ao cancelar compra");
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

  const getStatusDisplay = (rawStatus: string) => {
    const s = String(rawStatus || "").toLowerCase();
    if (s === "approved") {
      return {
        label: "Aprovado",
        color: "#00ad11",
        isApproved: true,
        isRejected: false,
      };
    }
    if (s === "rejected" || s === "cancelled" || s === "canceled") {
      return {
        label: "Rejeitado",
        color: "#e11d48",
        isApproved: false,
        isRejected: true,
      };
    }
    return {
      label: "Pendente",
      color: "#eab308",
      isApproved: false,
      isRejected: false,
    };
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
        {minhasCompras && minhasCompras.length > 0 ? (
          minhasCompras.map((compra) => {
            const statusInfo = getStatusDisplay(compra.status);
            const displayAmount = Number(
              compra.amount ??
                compra.transaction_amount ??
                compra.total_amount ??
                0,
            ).toFixed(2);
            const paymentId =
              compra.provider_payment_id ||
              compra.providerPaymentId ||
              compra.transaction_id ||
              compra.id;

            return (
              <div className="div-compra" key={compra.id}>
                <div
                  className="div-info"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/status?payment_id=${paymentId}`);
                    setAtualizarQuery(true);
                  }}
                  title="Clique para ver o comprovante"
                >
                  <p>Valor: R$ {displayAmount}</p>
                  <p>
                    Status:{" "}
                    <span
                      style={{
                        color: statusInfo.color,
                        fontWeight: 600,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </p>
                </div>
                {statusInfo.isApproved ? (
                  <FontAwesomeIcon
                    style={{ color: "#00ad11", fontSize: "1.2rem" }}
                    icon={faCheck}
                  />
                ) : statusInfo.isRejected ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FontAwesomeIcon
                      style={{ color: "#e11d48", fontSize: "1.2rem" }}
                      icon={faTimesCircle}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        CancelPurchase(compra.id);
                      }}
                      className="cancelar-compra-button"
                      title="Excluir registro"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <FontAwesomeIcon
                      style={{ color: "#eab308", fontSize: "1.2rem" }}
                      icon={faClock}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        CancelPurchase(compra.id);
                      }}
                      className="cancelar-compra-button"
                      title="Cancelar compra"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
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
