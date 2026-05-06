import { Home, ListTodo, Plus, Settings, Package } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#161616]/95 backdrop-blur-md border-t border-white/5 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center h-[72px] max-w-md mx-auto px-6 relative">
        {/* Lado Esquerdo */}
        <div className="flex gap-6 sm:gap-8">
          <button
            onClick={() => navigate("/")}
            className={`flex flex-col items-center justify-center w-12 transition-colors ${isActive("/") ? "text-primary" : "text-white/40 hover:text-white/70"}`}
          >
            <Home size={22} strokeWidth={isActive("/") ? 2.5 : 2} />
            <span className="text-[10px] mt-1.5 font-medium">Lista</span>
          </button>

          <button
            onClick={() => navigate("/lists")}
            className={`flex flex-col items-center justify-center w-12 transition-colors ${isActive("/lists") ? "text-primary" : "text-white/40 hover:text-white/70"}`}
          >
            <ListTodo size={22} strokeWidth={isActive("/lists") ? 2.5 : 2} />
            <span className="text-[10px] mt-1.5 font-medium">Listas</span>
          </button>
        </div>

        {/* Botão Central Flutuante */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <button
            onClick={() => navigate("/add-product")}
            className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#00C853] to-[#009624] rounded-full shadow-lg shadow-primary/25 text-white hover:scale-105 active:scale-95 transition-transform border-4 border-[#121212]"
          >
            <Plus size={28} strokeWidth={2.5} />
          </button>
        </div>

        {/* Lado Direito */}
        <div className="flex gap-6 sm:gap-8">
          {/* Este botão usaremos na parte 2 para o Catálogo de Produtos */}
          <button
            onClick={() => navigate("/products")}
            className={`flex flex-col items-center justify-center w-12 transition-colors ${isActive("/products") ? "text-primary" : "text-white/40 hover:text-white/70"}`}
          >
            <Package size={22} strokeWidth={isActive("/products") ? 2.5 : 2} />
            <span className="text-[10px] mt-1.5 font-medium">Itens</span>
          </button>

          <button
            onClick={() => navigate("/settings")}
            className={`flex flex-col items-center justify-center w-12 transition-colors ${isActive("/settings") || isActive("/categories") ? "text-primary" : "text-white/40 hover:text-white/70"}`}
          >
            <Settings
              size={22}
              strokeWidth={
                isActive("/settings") || isActive("/categories") ? 2.5 : 2
              }
            />
            <span className="text-[10px] mt-1.5 font-medium">Config</span>
          </button>
        </div>
      </div>
    </div>
  );
}
