import { useOutletContext, useNavigate } from "react-router-dom";
import { User, Tags, ChevronRight, LogOut, Info } from "lucide-react";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";

export function Settings() {
  const { user } = useOutletContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const menuItems = [
    {
      id: 1,
      title: "Conta e Perfil",
      desc: "Seus dados de acesso",
      icon: User,
      route: "/profile",
      color: "text-blue-400 bg-blue-400/10",
    },
    {
      id: 2,
      title: "Categorias",
      desc: "Cores, ícones e edição",
      icon: Tags,
      route: "/categories",
      color: "text-emerald-400 bg-emerald-400/10",
    },
    {
      id: 3,
      title: "Sobre o App",
      desc: "Versão 1.0.0",
      icon: Info,
      route: "/about",
      color: "text-stone-400 bg-stone-400/10",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Card do Usuário */}
      <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] rounded-2xl p-5 shadow-lg border border-white/5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xl font-bold border border-primary/30">
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex-1 overflow-hidden">
          <h2 className="text-white font-semibold text-lg truncate">
            Minha Conta
          </h2>
          <p className="text-white/50 text-sm truncate">{user?.email}</p>
        </div>
      </div>

      {/* Menus de Configuração */}
      <div className="bg-[#1E1E1E] rounded-2xl shadow-lg border border-white/5 overflow-hidden">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.route !== "#") navigate(item.route);
            }}
            className={`w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left ${index !== menuItems.length - 1 ? "border-b border-white/5" : ""}`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}
            >
              <item.icon size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium text-sm">{item.title}</h3>
              <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
            </div>
            <ChevronRight size={18} className="text-white/20" />
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors py-4 rounded-2xl flex items-center justify-center gap-2 font-medium mt-2"
      >
        <LogOut size={18} /> Sair do Aplicativo
      </button>
    </div>
  );
}
