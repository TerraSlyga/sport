import React, { createContext, useContext, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Стан завантаження при першому вході

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Робимо запит до API, щоб перевірити валідність Cookie
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // ОБОВ'ЯЗКОВО: відправляє HttpOnly Cookie
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data); // Сервер має повернути { user: { ... } }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  // Поки перевіряємо токен - показуємо лоадер на весь екран
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
