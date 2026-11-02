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
    purchasedProducts: authPurchasedProducts,
    loading: authLoading,
  } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [localPaymentStatus, setLocalPaymentStatus] = useState<any>(null);
  const [localProducts, setLocalProducts] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);

  const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const paymentIdParam =
    searchParams.get("payment_id") || searchParams.get("id");

  useEffect(() => {
    if (!paymentIdParam || paymentIdParam === "undefined") return;

    const currentId = String(
      authPaymentStatus?.id ||
        authPaymentStatus?.provider_payment_id ||
        authPaymentStatus?.transaction_id ||
        "",
    );

    if (authPaymentStatus && currentId === paymentIdParam) {
      return;
    }

    let isMounted = true;
    setFetching(true);

    const loadStatus = async () => {
      try {
        const response = await authenticatedFetch(
          `${VITE_BACKEND_URL}/api/payments/status?payment_id=${paymentIdParam}`,
          { method: "GET", credentials: "include" },
        );
        if (response.ok) {
          const data = await response.json();
          const p = data.payment || data;
          if (isMounted && p) {
            setLocalPaymentStatus(p);
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
        }
      } catch (err) {
        console.error("Erro ao carregar detalhes do pagamento:", err);
      } finally {
        if (isMounted) setFetching(false);
      }
    };

    loadStatus();

    return () => {
      isMounted = false;
    };
  }, [paymentIdParam, authPaymentStatus, VITE_BACKEND_URL]);

  const paymentStatus = localPaymentStatus || authPaymentStatus;
  const loading = (authLoading && !paymentStatus) || fetching;

  if (loading || !paymentStatus) {
    return <Loading />;
  }

  const pixData = paymentStatus.point_of_interaction?.transaction_data;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixData?.qr_code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusStr = String(paymentStatus.status || "").toLowerCase();
  const isApproved = statusStr === "approved";
  const isRejected = statusStr === "rejected" || statusStr === "cancelled" || statusStr === "canceled";
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
                <p>Aguardando confirmação do pagamento via PIX.</p>
              </>
            )}
            {isRejected && (
              <>
                <h2>Ops! Algo deu errado.</h2>
                <p>Não conseguimos processar o pagamento. Tente novamente.</p>
              </>
            )}
          </div>

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
