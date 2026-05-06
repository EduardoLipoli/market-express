// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../services/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const navigate = useNavigate();

  // Se já estiver logado, joga para o app
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/");
    });
    return () => unsubscribe();
  }, [navigate]);

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

  // Limpar erros ao digitar
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
    if (generalError) setGeneralError("");
  };

  const handlePasswordChange = (e) => {
    setSenha(e.target.value);
    if (passwordError) setPasswordError("");
    if (generalError) setGeneralError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validações client-side
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(senha);

    setEmailError(emailErr);
    setPasswordError(passwordErr);

    if (emailErr || passwordErr) {
      return; // Impede envio se houver erro
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigate("/");
    } catch (err) {
      // Tratamento de erro do Firebase
      let errorMsg = "Falha no login. Verifique suas credenciais.";
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        errorMsg = "Email ou senha incorretos.";
      } else if (err.code === "auth/too-many-requests") {
        errorMsg = "Muitas tentativas. Tente novamente mais tarde.";
      } else {
        errorMsg = `Erro: ${err.message}`;
      }
      setGeneralError(errorMsg);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex flex-1 bg-primary text-white justify-center items-center text-4xl font-bold">
        MarketExpress
      </div>

      <div className="flex-1 bg-cardDark p-10 md:p-16 flex flex-col justify-center h-full">
        <div className="text-2xl font-bold mb-2 text-white">
          Faça agora o <strong>Login</strong> 👇
        </div>
        <div className="text-sm text-[#aaaaaa] mb-8">
          Insira seus dados para acessar sua conta.
        </div>

        {generalError && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">
            {generalError}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Campo Email */}
          <div>
            <label className="block text-white font-medium mb-1">Email</label>
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
            <label className="block text-white font-medium mb-1">Senha</label>
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

          <div className="text-right text-sm -mt-2">
            <a href="#" className="text-primary no-underline hover:underline">
              Recuperar senha
            </a>
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-accent text-white font-medium rounded transition-colors"
          >
            Entrar
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          Não tem uma conta?{" "}
          <Link
            to="/cadastro"
            className="text-primary no-underline hover:underline"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </div>
  );
}
