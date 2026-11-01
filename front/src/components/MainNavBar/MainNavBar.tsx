import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu as MenuIcon, ShoppingBag, UserRound } from "lucide-react";
import SearchBar from "../SearchBar/SearchBar";
import { useAuth } from "../../contexts/AuthContext";
import Menu from "../Menu/Menu";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const MainNavbar: React.FC = () => {
  const [menu, setMenu] = useState(false);
  const [nome, setNome] = useState("");
  const { user, cart } = useAuth();
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const qtdItemsCart = cart.length;
  const navigate = useNavigate();

  useEffect(() => {
    setNome(
      user
        ? user.name || user.displayName || user.email || "Usuário"
        : "Faça login!"
    );
  }, [user]);

  useEffect(() => {
    if (qtdItemsCart <= 0) return;
    setCartBump(true);
    const timer = setTimeout(() => setCartBump(false), 550);
    return () => clearTimeout(timer);
  }, [qtdItemsCart]);

  const handleCartClick = (event: React.MouseEvent) => {
    if (!user) {
      event.preventDefault();
      setShowErrorMessage(true);
    }
  };

  return (
    <>
      {showErrorMessage && (
        <ErrorMessage onClose={() => setShowErrorMessage(false)} />
      )}
      {menu && <Menu onClose={() => setMenu(false)} />}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex min-h-11 items-center gap-3">
            <img
              src="/LOGO_MARCA.png"
              alt="Nexgen E-commerce"
              className="h-8 w-auto sm:h-10"
            />
          </Link>

          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to={user ? "/carrinho" : "/login"}
              onClick={handleCartClick}
              className="block"
            >
              <motion.div
                className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm active:scale-[0.98]"
                animate={
                  cartBump
                    ? { scale: [1, 1.18, 0.96, 1.08, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.52, ease: "easeOut" }}
              >
                <ShoppingBag className="h-5 w-5 text-secondary" />
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {qtdItemsCart}
                </span>
              </motion.div>
            </Link>

            <button
              type="button"
              onClick={user ? () => setMenu(!menu) : () => navigate("/login")}
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm active:scale-[0.98]"
            >
              {user ? (
                <MenuIcon className="h-5 w-5 text-primary" />
              ) : (
                <UserRound className="h-5 w-5 text-secondary" />
              )}
            </button>
          </div>
        </div>

        <div className="flex-1">
          <SearchBar />
        </div>

        <Link
          to={user ? "/carrinho" : "/login"}
          onClick={handleCartClick}
          className="hidden lg:block"
        >
          <motion.div
            className="relative flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            animate={
              cartBump
                ? { scale: [1, 1.18, 0.96, 1.08, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.52, ease: "easeOut" }}
          >
            <ShoppingBag className="h-5 w-5 text-secondary" />
            <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {qtdItemsCart}
            </span>
          </motion.div>
        </Link>

        <button
          type="button"
          onClick={user ? () => setMenu(!menu) : () => navigate("/login")}
          className="hidden min-h-12 min-w-[196px] items-center justify-between rounded-full border border-slate-200 bg-white px-4 py-1.5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:flex"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-secondary">
              <UserRound className="h-4 w-4" />
            </div>
            <p className="text-sm leading-tight text-slate-500">
              Olá,
              <br />
              <span className="font-semibold text-slate-900">{nome}</span>
            </p>
          </div>
          <MenuIcon className="h-4 w-4 text-primary" />
        </button>
      </div>
    </>
  );
};

export default MainNavbar;
