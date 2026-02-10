import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const BackCard = ({ isLogin, setIsLogin, onBack }) => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // --- ЛОГІКА ВХОДУ (LOGIN) ---
        const response = await fetch("/api/auth/login", {
          method: "POST",
          // 'include' змушує браузер приймати Set-Cookie від сервера та відправляти Cookie на сервер
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nickname: formData.nickname,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Помилка входу");
        }

        login(User);
      } else {
        // --- ЛОГІКА РЕЄСТРАЦІЇ (REGISTER) ---
        if (formData.password !== formData.repeatPassword) {
          throw new Error("Паролі не співпадають");
        }

        const response = await fetch("/api/auth/register", {
          method: "POST",
          credentials: "include", // Також важливо для реєстрації, якщо сервер відразу логінить юзера і шле кукі
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            nickname: formData.nickname,
            phone: "",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Помилка реєстрації");
        }

        console.log("Registration Success");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="absolute w-full h-full flex flex-col justify-center items-center p-8 md:p-12 
                    bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-3xl shadow-2xl 
                    [backface-visibility:hidden] [transform:rotateY(180deg)] text-white"
    >
      <h2 className="text-4xl font-bold tracking-widest uppercase mb-6 transition-all">
        {isLogin ? "Welcome Back" : "Join Rivalry"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-100 text-sm w-full max-w-md animate-pulse">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form className="w-full max-w-md flex flex-col" onSubmit={handleSubmit}>
        {/* Username field (Always visible per your API login requirements) */}
        <div className="grid grid-rows-[1fr] opacity-100 mb-4 transition-all duration-500 ease-in-out">
          <div className="overflow-hidden">
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-white"
                size={20}
              />
              <input
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                type="text"
                placeholder="Nickname"
                required
                className="w-full bg-black/20 border border-white/30 rounded-full py-4 pl-12 pr-6 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-black/40 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Email field (Only for Registration) */}
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            isLogin
              ? "grid-rows-[0fr] opacity-0 margin-0"
              : "grid-rows-[1fr] opacity-100 mb-4"
          }`}
        >
          <div className="overflow-hidden">
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-white"
                size={20}
              />
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email Address"
                className="w-full bg-black/20 border border-white/30 rounded-full py-4 pl-12 pr-6 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-black/40 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Password field */}
        <div className="relative group mb-4">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-white"
            size={20}
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            required
            className="w-full bg-black/20 border border-white/30 rounded-full py-4 pl-12 pr-6 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-black/40 transition-all"
          />
        </div>

        {/* Repeat Password field (Only for Registration) */}
        <div
          className={`grid transition-all duration-500 ease-in-out ${
            isLogin
              ? "grid-rows-[0fr] opacity-0 margin-0"
              : "grid-rows-[1fr] opacity-100"
          }`}
        >
          <div className="overflow-hidden">
            <div className="relative group">
              <CheckCircle
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-white"
                size={20}
              />
              <input
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
                type="password"
                placeholder="Repeat Password"
                required={!isLogin}
                className="w-full bg-black/20 border border-white/30 rounded-full py-4 pl-12 pr-6 text-white placeholder-white/50 focus:outline-none focus:border-white focus:bg-black/40 transition-all"
              />
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full py-4 bg-white text-black text-xl font-bold rounded-full hover:bg-gray-200 transition-colors uppercase tracking-widest flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="animate-spin" size={24} />}
          {isLogin ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-white/70 mb-2">
          {isLogin ? "Don't have an account?" : "Already a member?"}
        </p>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-white font-bold border-b border-transparent hover:border-white transition-all uppercase tracking-wide"
        >
          {isLogin ? "Register now" : "I have an account"}
        </button>
      </div>

      <div className="mt-4">
        <button
          onClick={onBack}
          className="text-xs text-white/50 hover:text-white transition-colors uppercase tracking-widest"
        >
          Back to start
        </button>
      </div>
    </div>
  );
};

export default BackCard;
