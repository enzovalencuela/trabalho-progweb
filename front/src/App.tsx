import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "./hooks/ScrollToTop.tsx";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition/PageTransition.tsx";
import MobileBottomNav from "./components/MobileBottomNav/MobileBottomNav.tsx";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-slate-900">
      <ScrollToTop />
      <Header />
      <main className="w-full overflow-x-hidden pb-28 xl:pb-16">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>{<Outlet />}</PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default App;
