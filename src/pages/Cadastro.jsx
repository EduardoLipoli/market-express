// src/pages/Cadastro.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();

  // Validação do email
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue.trim()) return "O email é obrigatório";
    if (!emailRegex.test(emailValue))
      return "Digite um email válido (exemplo@dominio.com)";
    return "";
  };

  // Validação da senha
  const validatePassword = (passwordValue) => {
    if (!passwordValue) return "A senha é obrigatória";
    if (passwordValue.length < 6)
      return "A senha deve ter pelo menos 6 caracteres";
    return "";
  };

  // Validação da confirmação de senha
  const validateConfirmPassword = (confirmValue, passwordValue) => {
    if (!confirmValue) return "Confirme sua senha";
    if (confirmValue !== passwordValue) return "As senhas não coincidem";
    return "";
  };

  // Limpar erros ao digitar
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
    if (generalError) setGeneralError("");
  };

  const handlePasswordChange = (e) => {
    setSenha(e.target.value);
    if (passwordError) setPasswordError("");
    if (confirmError && confirmSenha) {
      setConfirmError(validateConfirmPassword(confirmSenha, e.target.value));
    }
    if (generalError) setGeneralError("");
  };

  const handleConfirmChange = (e) => {
    setConfirmSenha(e.target.value);
    if (confirmError) setConfirmError("");
    if (generalError) setGeneralError("");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validações client-side
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(senha);
    const confirmErr = validateConfirmPassword(confirmSenha, senha);

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmError(confirmErr);

    if (emailErr || passwordErr || confirmErr) {
      return; // Impede envio se houver erro
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      alert("Conta criada com sucesso!");
      navigate("/"); // Redireciona para o app principal
    } catch (err) {
      console.error(err);
      let errorMsg = "Erro ao criar conta.";
      if (err.code === "auth/email-already-in-use") {
        errorMsg =
          "Este email já está cadastrado. Faça login ou use outro email.";
      } else if (err.code === "auth/weak-password") {
        errorMsg = "A senha é muito fraca. Use pelo menos 6 caracteres.";
      } else if (err.code === "auth/invalid-email") {
        errorMsg = "Email inválido.";
      } else {
        errorMsg = `Erro: ${err.message}`;
      }
      setGeneralError(errorMsg);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Lado Esquerdo - Oculto em telas menores */}
      <div className="hidden md:flex flex-1 bg-primary text-white justify-center items-center text-4xl font-bold">
        MarketExpress
      </div>

      {/* Lado Direito - Formulário */}
      <div className="flex-1 bg-cardDark p-10 md:p-16 flex flex-col justify-center h-full">
        <div className="text-2xl font-bold mb-2 text-white">
          Faça agora o <strong>Cadastro</strong> 👇
        </div>
        <div className="text-sm text-[#aaaaaa] mb-8">
          Insira seus dados para criar sua conta.
        </div>

        {generalError && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          {/* Campo Email */}
          <div>
            <label className="block text-white font-medium mb-1">Email:</label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                className="w-full h-12 pl-10 pr-4 bg-[#2a2a2a] text-white border-none rounded focus:ring-2 focus:ring-primary focus:outline-none placeholder-gray-500"
                placeholder="seu@email.com"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            {emailError && (
              <div className="text-sm text-red-500 mt-1">{emailError}</div>
            )}
          </div>

          {/* Campo Senha */}
          <div>
            <label className="block text-white font-medium mb-1">Senha:</label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full h-12 pl-10 pr-10 bg-[#2a2a2a] text-white border-none rounded focus:ring-2 focus:ring-primary focus:outline-none placeholder-gray-500"
                placeholder="••••••"
                value={senha}
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && (
              <div className="text-sm text-red-500 mt-1">{passwordError}</div>
            )}
          </div>

          {/* Campo Confirme a Senha */}
          <div>
            <label className="block text-white font-medium mb-1">
              Confirme a Senha:
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full h-12 pl-10 pr-10 bg-[#2a2a2a] text-white border-none rounded focus:ring-2 focus:ring-primary focus:outline-none placeholder-gray-500"
                placeholder="••••••"
                value={confirmSenha}
                onChange={handleConfirmChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmError && (
              <div className="text-sm text-red-500 mt-1">{confirmError}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 mt-2 bg-primary hover:bg-accent text-white font-medium rounded transition-colors"
          >
            Cadastrar
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-primary no-underline hover:underline"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
