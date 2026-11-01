import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, LogOut, Package, User, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface MenuProps {
  onClose: () => void;
}

export default function Menu({ onClose }: MenuProps) {
  const [userAdmin, setUserAdmin] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setUserAdmin(Boolean(user && user.role === "admin"));
  }, [user]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-start justify-end p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="w-full max-w-xs rounded-[24px] border border-slate-200 bg-white p-5 shadow-2xl mt-12 md:mt-14"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Sua área</p>
              <p className="text-xs text-slate-500">
                Acesse conta, pedidos e gestão.
              </p>
            </div>
            <button
              className="flex min-h-9 min-w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition active:scale-[0.98] active:bg-slate-100"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            {userAdmin && (
              <Link
                to="/dashboard"
                onClick={onClose}
                className="flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}
            <Link
              to="/account"
              onClick={onClose}
              className="flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
            >
              <User className="h-4 w-4" />
              Minha Conta
            </Link>
            <Link
              to="/minhas-compras"
              onClick={onClose}
              className="flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
            >
              <Package className="h-4 w-4" />
              Minhas Compras
            </Link>
            <button
              onClick={handleLogout}
              className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
