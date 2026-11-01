import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Grid2X2,
  Home,
  LayoutDashboard,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const navDepartments = [
  "Setups",
  "Notebooks",
  "Periféricos",
  "Consoles",
  "Acessórios",
  "Monitores",
  "Realidade VR",
  "Áudio",
];

const MobileBottomNav = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { user, cart } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = cart.length;
  const profilePath = user?.role === "admin" ? "/dashboard" : "/account";
  const profileLabel = user?.role === "admin" ? "Dashboard" : "Perfil";
  const ProfileIcon = user?.role === "admin" ? LayoutDashboard : UserRound;

  const navigateToCategory = (category: string) => {
    navigate(`/produtos/search?categoria=${category}`);
    setIsCategoriesOpen(false);
  };

  const navItemClass = (isActive: boolean) =>
    `relative flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition active:scale-[0.98] ${
      isActive
        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
        : "text-slate-500 active:bg-slate-100"
    }`;

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-3 shadow-[0_-12px_32px_rgba(15,23,42,0.08)] backdrop-blur xl:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-2">
          <Link
            to="/"
            className={navItemClass(location.pathname === "/")}
            aria-label="Ir para a home"
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsCategoriesOpen(true)}
            className={navItemClass(false)}
            aria-label="Abrir categorias"
          >
            <Grid2X2 className="h-5 w-5" />
            <span>Categorias</span>
          </button>

          <Link
            to={user ? "/carrinho" : "/login"}
            className={navItemClass(location.pathname === "/carrinho")}
            aria-label="Ir para o carrinho"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span>Carrinho</span>
          </Link>

          <Link
            to={user ? profilePath : "/login"}
            className={navItemClass(
              location.pathname === profilePath || location.pathname === "/login"
            )}
            aria-label={`Ir para ${profileLabel}`}
          >
            <ProfileIcon className="h-5 w-5" />
            <span>{profileLabel}</span>
          </Link>
        </div>
      </nav>

      <AnimatePresence>
        {isCategoriesOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end bg-slate-950/25 backdrop-blur-sm xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCategoriesOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              onClick={(event) => event.stopPropagation()}
              className="w-full rounded-t-[28px] bg-white px-4 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] pt-4 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Categorias
                  </p>
                  <p className="text-sm text-slate-500">
                    Navegue pela vitrine com o polegar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCategoriesOpen(false)}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 active:scale-[0.98] active:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {navDepartments.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => navigateToCategory(category)}
                    className="flex min-h-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition active:scale-[0.98] active:bg-slate-100"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileBottomNav;
