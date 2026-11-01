import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "./CartPage.css";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import BackButton from "../../components/BackButton/BackButton";
import Button from "../../components/Button/Button";
import Loading from "../../components/Loading/Loading";
import { usePayment } from "../../contexts/PaymentContext";
import { motion } from "framer-motion";

const CartPage: React.FC = () => {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const {
    user,
    cart,
    removeFromCart,
    selectedItems,
    setSelectedItems,
    loading,
  } = useAuth();
  const { totalAmount } = usePayment();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setShowErrorMessage(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

  const handleSelect = (productId: number): void => {
    setSelectedItems((prevSelected: number[]) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleRemoveFromCart = async (productId: number) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("Erro ao remover do carrinho:", error);
      setShowErrorMessage(true);
    }
  };

  return loading ? (
    <Loading variant="cart" />
  ) : (
    <motion.div
      className="cart-page-container"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.34, ease: "easeOut" }}
    >
      {showErrorMessage && (
        <ErrorMessage onClose={() => setShowErrorMessage(false)} />
      )}

      <BackButton />
      <h1>Seu Carrinho</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Seu carrinho está vazio.</p>
          <Link to="/">Voltar para a página inicial</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {cart.map((item, index) => (
              <motion.div
                key={item.id}
                className="cart-item-card"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.24 }}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleSelect(item.id)}
                />
                <Link to={`/product/${item.id}`} className="cart-item-link">
                  <img
                    src={item.img}
                    alt={item.titulo}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3>{item.titulo}</h3>
                    <span>R$ {item.preco}</span>
                  </div>
                </Link>
                <motion.button
                  className="cart-remove-btn"
                  onClick={() => handleRemoveFromCart(item.id)}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faTrashCan} /> Remover
                </motion.button>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="cart-summary"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
          >
            <h2>Resumo da Compra</h2>
            <div className="summary-item">
              <span>Total de itens selecionados:</span>
              <span>{selectedItems.length}</span>
            </div>
            <div className="summary-item total">
              <span>Valor total:</span>
              <span>R$ {totalAmount.toFixed(2).replace(".", ",")}</span>
            </div>
            {totalAmount > 0 && (
              <Link to={"/checkout"}>
                <Button
                  disabled={selectedItems.length <= 0}
                  child="Ir para Checkout"
                  type="button"
                />
              </Link>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CartPage;
