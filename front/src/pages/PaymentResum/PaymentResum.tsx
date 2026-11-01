import { useEffect, useState } from "react";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import BackButton from "../../components/BackButton/BackButton";
import { Payment } from "@mercadopago/sdk-react";
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
    onSubmit,
    onError,
    onReady,
    setShowErrorMessage,
    loading,
    setLoading,
    maxParcelas,
    paymentProcessing,
  } = usePayment();
  const [formSubmit, setFormSubmit] = useState(false);
  const [showOkMessage, setShowOkMessage] = useState(false);
  const spanMessage = "Operação, realizada com sucesso.";

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, [setLoading]);

  if (totalAmount <= 1) {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }

  const initialization = {
    amount: parseFloat(totalAmount.toFixed(2)),
  };

  const customization = {
    paymentMethods: {
      ticket: [],
      bankTransfer: "all",
      creditCard: "all",
      debitCard: "all",
      maxInstallments: maxParcelas(),
    },
  };

  return (
    <div className="cart-resum-container">
      {(loading || paymentProcessing) && (
        <Loading message="Processando pagamento..." />
      )}
      {showOkMessage && <SpanMessage message={spanMessage} status="ok" />}
      <BackButton />
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
        <div className="content-resum">
          <Button
            child="Atualizar dados pessoais"
            type="button"
            onClick={() => setFormSubmit(true)}
          />
          {totalAmount > 0 && (
            <Payment
              initialization={initialization}
              customization={customization}
              onSubmit={onSubmit}
              onReady={onReady}
              onError={onError}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentResum;
