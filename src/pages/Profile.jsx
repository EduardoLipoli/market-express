import { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, KeyRound } from "lucide-react";
import { auth } from "../services/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export function Profile() {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage({ text: "Email de redefinição enviado com sucesso! Verifique sua caixa de entrada.", type: "success" });
    } catch (error) {
      setMessage({ text: "Ocorreu um erro ao tentar enviar o email. Tente novamente mais tarde.", type: "error" });
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
      {/* HEADER DA TELA */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} className="text-white/70" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white">Conta e Perfil</h2>
          <p className="text-xs text-white/50">Seus dados de acesso</p>
        </div>
      </div>

      {/* CARD DE INFORMAÇÕES */}
      <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-3xl font-bold border-2 border-blue-500/30 mb-4">
          {user?.email?.charAt(0).toUpperCase() || <User size={32} />}
        </div>
        <h3 className="text-white font-medium text-lg">Usuário do App</h3>
        <p className="text-white/50 text-sm flex items-center gap-2 mt-1">
          <Mail size={14} /> {user?.email}
        </p>
      </div>

      {/* SEGURANÇA */}
      <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-medium text-white/70 mb-4 uppercase tracking-wider flex items-center gap-2">
          <KeyRound size={16} /> Segurança
        </h3>
        
        <p className="text-sm text-white/60 mb-4">
          Deseja alterar sua senha atual? Enviaremos um link seguro para o seu email cadastrado.
        </p>

        <button 
          onClick={handleResetPassword}
          className="w-full bg-white/5 border border-white/10 text-white py-3.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
        >
          Solicitar Redefinição de Senha
        </button>

        {message.text && (
          <div className={`mt-4 p-3 rounded-xl text-sm text-center ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}