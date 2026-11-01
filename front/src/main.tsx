/* eslint-disable react-refresh/only-export-components */
// src/main.tsx

import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PaymentProvider } from "./contexts/PaymentContext.tsx";
import App from "./App.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { ProductProvider } from "./contexts/ProductContext.tsx";
import Loading from "./components/Loading/Loading.tsx";
import "./App.css";
import { ReviewProvider } from "./contexts/ReviewContext.tsx";

const Register = lazy(() => import("./pages/Register/Register.tsx"));
const Login = lazy(() => import("./pages/Login/Login.tsx"));
const Account = lazy(() => import("./pages/Account/Account.tsx"));
const Carrinho = lazy(() => import("./pages/CartPage/CartPage.tsx"));
const ProductPage = lazy(() => import("./pages/ProductPage/ProductPage.tsx"));
const Home = lazy(() => import("./pages/Home/Home.tsx"));
const Dashboard = lazy(() => import("./pages/Admin/Dashboard.tsx"));
const SearchResultsPage = lazy(
  () => import("./pages/SearchResultsPage/SearchResultsPage.tsx"),
);
const StatusPagamento = lazy(() => import("./pages/Status/Status.tsx"));
const PaymentResum = lazy(
  () => import("./pages/PaymentResum/PaymentResum.tsx"),
);
const MinhasCompras = lazy(
  () => import("./pages/MinhasCompras/MinhasCompras.tsx"),
);

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
  locale: "pt-BR",
});

const RouteFallback = () => <Loading variant="products" />;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <ReviewProvider>
            <PaymentProvider>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="product/:id" element={<ProductPage />} />
                    <Route path="account" element={<Account />} />
                    <Route path="carrinho" element={<Carrinho />} />
                    <Route path="minhas-compras" element={<MinhasCompras />} />
                    <Route
                      path="/produtos/search"
                      element={<SearchResultsPage />}
                    />
                    <Route path="status" element={<StatusPagamento />} />
                    <Route path="checkout" element={<PaymentResum />} />
                    <Route
                      path="dashboard"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                </Routes>
              </Suspense>
            </PaymentProvider>
          </ReviewProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
