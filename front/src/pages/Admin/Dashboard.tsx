import React, { useState } from "react";
import { useProduct } from "../../contexts/ProductContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGauge, faBox, faChartBar } from "@fortawesome/free-solid-svg-icons";
import ProdutosDashboard from "./Produtos/Produtos";
import Vendas from "./Vendas/Vendas";
import Loading from "../../components/Loading/Loading";
import { motion } from "framer-motion";

type DashboardView = "overview" | "catalog";

const Dashboard: React.FC = () => {
  const {
    produtos,
    setProdutos,
    products,
    loading: productsLoading,
  } = useProduct();
  const [activeView, setActiveView] = useState<DashboardView>(
    produtos ? "catalog" : "overview",
  );

  const navItems = [
    { id: "overview" as const, label: "Visão geral", icon: faGauge },
    { id: "catalog" as const, label: "Catálogo", icon: faBox },
  ];

  return (
    <div className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
      {/* SIDEBAR DE NAVEGAÇÃO */}
      <aside className="h-fit rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
            Admin Panel
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-slate-950">
            Dashboard
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Navegação pensada para gestão de catálogo e visão rápida do negócio.
          </p>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setProdutos(item.id === "catalog");
              }}
              whileTap={{ scale: 0.98 }}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                activeView === item.id
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
              {item.label}
            </motion.button>
          ))}
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL DO DASHBOARD */}
      <section className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
            {activeView === "overview" ? "Operação" : "Catálogo"}
          </p>
          <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold text-slate-950">
                {activeView === "overview"
                  ? "Painel Administrativo"
                  : "Gestão de Produtos"}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                {activeView === "overview"
                  ? "Resumo executivo com métricas e gráficos em tempo real sobre vendas e avaliações."
                  : "Gerencie o catálogo completo exibindo, adicionando, editando e removendo produtos."}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600">
              <FontAwesomeIcon icon={faChartBar} className="h-4 w-4" />
              {products.length} itens no catálogo
            </div>
          </div>
        </div>

        {/* EXIBIÇÃO DA VISÃO GERAL (VENDAS) OU CATÁLOGO (PRODUTOS) */}
        {activeView === "overview" ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-2 shadow-sm sm:p-4">
            <Vendas />
          </div>
        ) : productsLoading ? (
          <Loading variant="dashboard" />
        ) : (
          <div className="rounded-[32px] border border-slate-200 bg-white p-2 shadow-sm sm:p-4">
            <ProdutosDashboard embedded />
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
