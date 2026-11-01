import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import "./Status.css";

const StatusPagamento: React.FC = () => {
  const { paymentStatus, purchasedProducts, loading } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (loading || !paymentStatus) {
    return <Loading />;
  }

  const pixData = paymentStatus.point_of_interaction?.transaction_data;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixData?.qr_code || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isApproved = paymentStatus.status === "approved";
  const isPending =
    paymentStatus.status === "pending" || paymentStatus.status === "in_process";
  const isRejected = !isApproved && !isPending;

  return (
    <div className="status-container">
      <BackButton />
      <header className="status-header">
        <div className={`status-badge ${paymentStatus.status}`}>
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
                <p>Obrigado! Seu pedido ja esta sendo preparado.</p>
              </>
            )}
            {isPending && (
              <>
                <h2>Quase la!</h2>
                <p>Aguardando confirmacao do pagamento via PIX.</p>
              </>
            )}
            {isRejected && (
              <>
                <h2>Ops! Algo deu errado.</h2>
                <p>Nao conseguimos processar o pagamento. Tente novamente.</p>
              </>
            )}
          </div>

          {isPending && pixData?.qr_code_base64 && (
            <div className="pix-section">
              <div className="qr-wrapper">
                <img
                  src={`data:image/png;base64,${pixData.qr_code_base64}`}
                  alt="QR Code PIX"
                />
              </div>
              <div className="pix-copy-box">
                <p className="pix-label">Codigo Copia e Cola</p>
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
              {pixData.ticket_url && (
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
              <strong>R$ {paymentStatus.total_amount}</strong>
            </div>
            <div className="info-row">
              <span>Metodo</span>
              <span>{paymentStatus.payment_method?.toUpperCase()}</span>
            </div>
            <div className="info-row">
              <span>Data</span>
              <span>
                {new Date(
                  paymentStatus.date_approved || Date.now()
                ).toLocaleDateString()}
              </span>
            </div>
            <div className="info-row">
              <span>ID da Transacao</span>
              <span className="id-txt">#{paymentStatus.id}</span>
            </div>
          </div>
        </section>

        <section className="order-summary">
          <h3>Resumo do Pedido</h3>
          <div className="products-list">
            {purchasedProducts.map((product) => (
              <div
                key={product.id}
                className="mini-product-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img src={product.img} alt={product.titulo} />
                <div className="mini-info">
                  <h4>{product.titulo}</h4>
                  <p>R$ {product.preco}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StatusPagamento;
