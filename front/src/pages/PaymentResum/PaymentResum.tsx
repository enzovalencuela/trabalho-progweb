import { useEffect, useState } from "react";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import BackButton from "../../components/BackButton/BackButton";
import "./PaymentResum.css";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import FormDados from "../../components/FormDados/FormDados";
import SpanMessage from "../../components/SpanMessage/SpanMessage";
import { usePayment } from "../../contexts/PaymentContext";
import Button from "../../components/Button/Button";

const PaymentResum = () => {
  const {
    totalAmount,
    showErrorMessage,
    onSubmitCustom,
    setShowErrorMessage,
    loading,
    setLoading,
    maxParcelas,
    paymentProcessing,
  } = usePayment();

  const [formSubmit, setFormSubmit] = useState(false);
  const [showOkMessage, setShowOkMessage] = useState(false);
  const [method, setMethod] = useState<"credit_card" | "debit_card" | "pix">("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiration, setCardExpiration] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState(1);
  const [pixEmail, setPixEmail] = useState("");

  const spanMessage = "Operação realizada com sucesso.";
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [setLoading]);

  if (totalAmount <= 0) {
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }

  const handlePayClick = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: any = {
      payment_method_id: method,
      installments: Number(installments),
    };
    if (method === "pix") {
      formData.pix_email = pixEmail;
    } else {
      formData.card_number = cardNumber;
      formData.card_holder = cardHolder;
      formData.card_expiration = cardExpiration;
      formData.card_cvv = cardCvv;
    }
    onSubmitCustom(formData);
  };

  return (
    <div className="cart-resum-container" style={{ maxWidth: "600px" }}>
      {(loading || paymentProcessing) && (
        <Loading message="Processando pagamento seguro..." />
      )}
      {showOkMessage && <SpanMessage message={spanMessage} status="ok" />}
      <BackButton />
      {showErrorMessage && (
        <ErrorMessage
          onClose={() => setShowErrorMessage(false)}
        />
      )}
      {formSubmit ? (
        <FormDados
          setShowErrorMessage={setShowErrorMessage}
          setFormSubmit={setFormSubmit}
          setShowOkMessage={setShowOkMessage}
        />
      ) : (
        <div className="content-resum" style={{ width: "100%", background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1e293b" }}>Checkout Gamer Segurizado</h2>
            <Button
              child="Atualizar Dados"
              type="button"
              onClick={() => setFormSubmit(true)}
            />
          </div>

          <div style={{ marginBottom: "20px", padding: "15px", background: "#f8fafc", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "600", color: "#475569" }}>Valor Total:</span>
            <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a" }}>
              R$ {totalAmount.toFixed(2)}
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button
              type="button"
              onClick={() => setMethod("credit_card")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: method === "credit_card" ? "2px solid #2563eb" : "1px solid #cbd5e1",
                background: method === "credit_card" ? "#eff6ff" : "#fff",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Cartão de Crédito
            </button>
            <button
              type="button"
              onClick={() => setMethod("debit_card")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: method === "debit_card" ? "2px solid #2563eb" : "1px solid #cbd5e1",
                background: method === "debit_card" ? "#eff6ff" : "#fff",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Cartão de Débito
            </button>
            <button
              type="button"
              onClick={() => setMethod("pix")}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: method === "pix" ? "2px solid #16a34a" : "1px solid #cbd5e1",
                background: method === "pix" ? "#f0fdf4" : "#fff",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              Pix Instantâneo
            </button>
          </div>

          <form onSubmit={handlePayClick} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {method !== "pix" ? (
              <>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "5px" }}>Número do Cartão</label>
                  <input
                    type="text"
                    required
                    placeholder="4000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "5px" }}>Nome Impresso no Cartão</label>
                  <input
                    type="text"
                    required
                    placeholder="NOME DO TITULAR"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "5px" }}>Validade</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      value={cardExpiration}
                      onChange={(e) => setCardExpiration(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "5px" }}>CVV</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                    />
                  </div>
                </div>
                {method === "credit_card" && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "5px" }}>Parcelamento</label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(Number(e.target.value))}
                      style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", background: "#fff" }}
                    >
                      {Array.from({ length: maxParcelas() }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}x de R$ {(totalAmount / n).toFixed(2)} {n === 1 ? "à vista" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            ) : (
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "600", marginBottom: "5px" }}>E-mail para Confirmação do Pix</label>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={pixEmail}
                  onChange={(e) => setPixEmail(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>
            )}

            <button
              type="submit"
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "14px",
                background: method === "pix" ? "#16a34a" : "#2563eb",
                color: "#fff",
                fontWeight: "700",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              {method === "pix" ? "Gerar Pix Copia e Cola" : `Pagar R$ ${totalAmount.toFixed(2)}`}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PaymentResum;