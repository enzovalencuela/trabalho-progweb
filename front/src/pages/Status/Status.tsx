import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faClock,
  faCopy,
  faExternalLinkAlt,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../../contexts/AuthContext";
import BackButton from "../../components/BackButton/BackButton";
import Loading from "../../components/Loading/Loading";
import { authenticatedFetch } from "../../utils/api";
import "./Status.css";

const StatusPagamento: React.FC = () => {
  const {
    paymentStatus: authPaymentStatus,
    setPaymentStatus: setAuthPaymentStatus,
    purchasedProducts: authPurchasedProducts,
  } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [localPaymentStatus, setLocalPaymentStatus] = useState<any>(null);
  const [localProducts, setLocalProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const paymentIdParam =
    searchParams.get("payment_id") || searchParams.get("id");

  useEffect(() => {
    let isMounted = true;

    // Safety timeout to guarantee loading never hangs indefinitely
    const safetyTimer = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 2500);

    const loadStatus = async () => {
      const cleanParam =
        paymentIdParam && paymentIdParam !== "undefined" && paymentIdParam !== "null"
          ? paymentIdParam
          : null;

      // Check if AuthContext already has this payment status
      if (
        cleanParam &&
        authPaymentStatus &&
        String(
          authPaymentStatus.id ||
            authPaymentStatus.provider_payment_id ||
            authPaymentStatus.transaction_id ||
            "",
        ) === cleanParam
      ) {
        if (isMounted) {
          setLocalPaymentStatus(authPaymentStatus);
          setLoading(false);
        }
        return;
      }

      try {
        const url = cleanParam
          ? `${VITE_BACKEND_URL}/api/payments/status?payment_id=${cleanParam}`
          : `${VITE_BACKEND_URL}/api/payments/status`;

        const response = await authenticatedFetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          const p = data.payment || data;
          if (isMounted && p) {
            setLocalPaymentStatus(p);
            if (setAuthPaymentStatus) {
              setAuthPaymentStatus(p);
            }
            const items = p.additional_info?.items || p.items || [];
            if (items.length > 0) {
              setLocalProducts(
                items.map((it: any) => ({
                  id: Number(it.id),
                  titulo: it.title || it.titulo || "Produto",
                  preco: Number(it.unit_price || it.preco || 0),
                  img: it.img || "",
                })),
              );
            }
          }
        } else if (response.status === 404) {
          if (isMounted) setNotFound(true);
        }
      } catch (err) {
        console.error("Erro ao carregar detalhes do pagamento:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStatus();

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [paymentIdParam, VITE_BACKEND_URL]);

  const paymentStatus = localPaymentStatus || authPaymentStatus;

  if (loading) {
    return <Loading />;
  }

  if (notFound || !paymentStatus) {
    return (
      <div className="status-container">
        <BackButton />
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <FontAwesomeIcon
            icon={faTimesCircle}
            style={{ fontSize: "3.5rem", color: "#e11d48", marginBottom: "16px" }}
          />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "8px" }}>
            Pedido não encontrado
          </h2>
          <p style={{ color: "#64748b", marginBottom: "24px" }}>
            Não foi possível localizar os dados desta transação.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Voltar para a Loja
          </button>
        </div>
      </div>
    );
  }

  const pixData = paymentStatus.point_of_interaction?.transaction_data;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixData?.qr_code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusStr = String(paymentStatus.status || "").toLowerCase();
  const isApproved = statusStr === "approved";
  const isRejected =
    statusStr === "rejected" ||
    statusStr === "cancelled" ||
    statusStr === "canceled";
  const isPending = !isApproved && !isRejected;

  const transactionId =
    paymentStatus.id ||
    paymentStatus.provider_payment_id ||
    paymentStatus.providerPaymentId ||
    paymentStatus.transaction_id ||
    (paymentIdParam !== "undefined" ? paymentIdParam : "") ||
    "";

  const totalAmountNumber = Number(
    paymentStatus.transaction_amount ??
      paymentStatus.total_amount ??
      paymentStatus.amount ??
      0,
  );
  const formattedTotal = totalAmountNumber.toFixed(2);

  const rawItems =
    paymentStatus.additional_info?.items ||
    paymentStatus.items ||
    [];

  const fallbackItems = rawItems.map((item: any) => ({
    id: Number(item.id),
    titulo: item.title || item.titulo || "Produto",
    preco: Number(item.unit_price || item.preco || 0),
    img: item.img || "",
  }));

  const displayProducts =
    authPurchasedProducts && authPurchasedProducts.length > 0
      ? authPurchasedProducts
      : localProducts.length > 0
        ? localProducts
        : fallbackItems;

  const handleApprovePayment = async () => {
    if (!transactionId || actionLoading) return;
    setActionLoading(true);
    try {
      const response = await authenticatedFetch(
        `${VITE_BACKEND_URL}/api/payments/${transactionId}/approve`,
        { method: "POST", credentials: "include" },
      );
      if (response.ok) {
        const data = await response.json();
        const p = data.payment || data;
        const updated = {
          ...(paymentStatus || {}),
          ...p,
          status: "APPROVED",
        };
        setLocalPaymentStatus(updated);
        if (setAuthPaymentStatus) setAuthPaymentStatus(updated);
      }
    } catch (err) {
      console.error("Erro ao aprovar pagamento simulado:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!transactionId || actionLoading) return;
    setActionLoading(true);
    try {
      const response = await authenticatedFetch(
        `${VITE_BACKEND_URL}/api/payments/${transactionId}/cancel`,
        { method: "POST", credentials: "include" },
      );
      if (response.ok) {
        const data = await response.json();
        const p = data.payment || data;
        const updated = {
          ...(paymentStatus || {}),
          ...p,
          status: "CANCELLED",
        };
        setLocalPaymentStatus(updated);
        if (setAuthPaymentStatus) setAuthPaymentStatus(updated);
      }
    } catch (err) {
      console.error("Erro ao cancelar compra simulada:", err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="status-container">
      <BackButton />
      <header className="status-header">
        <div
          className={`status-badge ${
            isApproved ? "approved" : isPending ? "pending" : "rejected"
          }`}
        >
          <FontAwesomeIcon
            icon={
              isApproved ? faCheckCircle : isPending ? faClock : faTimesCircle
            }
          />
          <span>
            {isApproved ? "Sucesso" : isPending ? "Pendente" : "Rejeitado"}
          </span>
        </div>
      </header>

      <main className="status-content">
        <section className="payment-details-card">
          <div className="status-message">
            {isApproved && (
              <>
                <h2>Pagamento Confirmado!</h2>
                <p>Obrigado! Seu pedido já está sendo preparado.</p>
              </>
            )}
            {isPending && (
              <>
                <h2>Quase lá!</h2>
                <p>
                  {pixData?.qr_code
                    ? "Aguardando confirmação do pagamento via PIX."
                    : "Aguardando confirmação do pagamento."}
                </p>
              </>
            )}
            {isRejected && (
              <>
                <h2>Pedido Cancelado.</h2>
                <p>Esta transação foi cancelada ou não pôde ser processada.</p>
              </>
            )}
          </div>

          {/* Painel de Simulação Interativa de Pagamento */}
          {isPending && (
            <div
              style={{
                marginTop: "16px",
                marginBottom: "20px",
                padding: "16px",
                backgroundColor: "#f8fafc",
                borderRadius: "8px",
                border: "1px dashed #cbd5e1",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.2rem" }}>🧪</span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: "#334155",
                  }}
                >
                  Gateway Simulado — Ações de Teste:
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.825rem",
                  color: "#64748b",
                  lineHeight: "1.4",
                }}
              >
                Escolha o desfecho para simular a resposta da instituição financeira:
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={handleApprovePayment}
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    minWidth: "160px",
                    padding: "12px 18px",
                    backgroundColor: "#16a34a",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: actionLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 2px 4px rgba(22, 163, 74, 0.2)",
                  }}
                >
                  <FontAwesomeIcon icon={faCheckCircle} />
                  {actionLoading ? "Processando..." : "Confirmar Pagamento"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelPayment}
                  disabled={actionLoading}
                  style={{
                    flex: 1,
                    minWidth: "160px",
                    padding: "12px 18px",
                    backgroundColor: "#ffffff",
                    color: "#dc2626",
                    border: "2px solid #dc2626",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: actionLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                  {actionLoading ? "Processando..." : "Cancelar Compra"}
                </button>
              </div>
            </div>
          )}

          {isPending && pixData?.qr_code && (
            <div className="pix-section">
              {pixData.qr_code_base64 && (
                <div className="qr-wrapper">
                  <img
                    src={`data:image/png;base64,${pixData.qr_code_base64}`}
                    alt="QR Code PIX"
                  />
                </div>
              )}
              <div className="pix-copy-box">
                <p className="pix-label">Código Copia e Cola</p>
                <div className="copy-action">
                  <span className="truncate">{pixData.qr_code}</span>
                  <button
                    onClick={handleCopyPix}
                    className={copied ? "copied" : ""}
                  >
                    <FontAwesomeIcon icon={faCopy} />
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
              {pixData.ticket_url && pixData.ticket_url !== "#" && (
                <a
                  href={pixData.ticket_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bank-link"
                >
                  Pagar no App do Banco{" "}
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </a>
              )}
            </div>
          )}

          <div className="transaction-info">
            <div className="info-row">
              <span>Valor Total</span>
              <strong>R$ {formattedTotal}</strong>
            </div>
            <div className="info-row">
              <span>Método</span>
              <span>
                {String(
                  paymentStatus.payment_method ||
                    paymentStatus.payment_method_id ||
                    "Cartão de Crédito",
                ).toUpperCase()}
              </span>
            </div>
            <div className="info-row">
              <span>Data</span>
              <span>
                {new Date(
                  paymentStatus.date_approved ||
                    paymentStatus.created_at ||
                    Date.now(),
                ).toLocaleDateString()}
              </span>
            </div>
            <div className="info-row">
              <span>ID da Transação</span>
              <span className="id-txt">#{transactionId}</span>
            </div>
          </div>
        </section>

        <section className="order-summary">
          <h3>Resumo do Pedido</h3>
          <div className="products-list">
            {displayProducts.length > 0 ? (
              displayProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="mini-product-card"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.img ? (
                    <img src={product.img} alt={product.titulo} />
                  ) : (
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f1f5f9",
                        borderRadius: "8px",
                        fontSize: "1.5rem",
                      }}
                    >
                      🎮
                    </div>
                  )}
                  <div className="mini-info">
                    <h4>{product.titulo}</h4>
                    <p>R$ {Number(product.preco).toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#64748b", padding: "10px 0" }}>
                Nenhum detalhe de produto disponível.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StatusPagamento;
