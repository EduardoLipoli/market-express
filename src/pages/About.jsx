import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Star, Code, Heart } from "lucide-react";

export function About() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
      {/* HEADER DA TELA */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} className="text-white/70" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white">Sobre o App</h2>
          <p className="text-xs text-white/50">Informações e versão</p>
        </div>
      </div>

      {/* LOGO E VERSÃO */}
      <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-[#009624] flex items-center justify-center shadow-lg shadow-primary/20 mb-5 border-4 border-[#121212]">
          <span className="text-5xl">🛒</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Market Express</h2>
        <p className="text-sm text-white/50 bg-white/5 px-3 py-1 rounded-full">Versão 1.0.0</p>
      </div>

      {/* INFORMAÇÕES */}
      <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-2 shadow-lg">
        <div className="flex items-center gap-4 p-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
            <Star size={20} />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">Avalie o App</h3>
            <p className="text-white/40 text-xs">Deixe sua opinião na loja</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0">
            <Code size={20} />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">Desenvolvedor</h3>
            <p className="text-white/40 text-xs">Desenvolvido com React & Firebase</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0">
            <Heart size={20} />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">Agradecimento</h3>
            <p className="text-white/40 text-xs">Obrigado por utilizar nosso app!</p>
          </div>
        </div>
      </div>
    </div>
  );
}