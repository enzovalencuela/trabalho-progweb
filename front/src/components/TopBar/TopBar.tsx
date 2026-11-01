const TopBar = () => {
  return (
    <div className="hidden border-b border-slate-200/80 bg-white/90 backdrop-blur sm:block">
      <div className="mx-auto flex max-w-[1440px] items-center justify-center px-4 py-2 text-center text-xs font-semibold text-slate-700 sm:px-6 lg:px-8">
        <p>
          Ganhe <span className="text-primary">R$10,00</span> de desconto no
          seu primeiro pedido. Utilize o cupom{" "}
          <span className="text-secondary">DESCONTO10</span>
        </p>
      </div>
    </div>
  );
};

export default TopBar;
