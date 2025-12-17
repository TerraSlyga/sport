import React from "react";
import VideoBackground from "../components/mainPage/VideoBackground";
import {
  SquareStar,
  User,
  LayoutDashboard,
  Trophy,
  Users,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Імпортуємо, щоб взяти юзернейм або логаут
import TournamentList from "../components/TournamentList";
import { useTournaments } from "../hooks/useTournaments";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tournaments, loading, error } = useTournaments();

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-white">
      {/* --- ФОН --- */}
      <VideoBackground />
      {/* Темна підкладка, щоб текст читався краще */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0f1218]/90"></div>

      {/* --- ОСНОВНИЙ КОНТЕНТ --- */}
      <div className="relative z-10 flex flex-col min-h-screen p-6 md:p-8 max-w-[1600px] mx-auto">
        {/* 1. ВЕРХНІЙ ХЕДЕР */}
        <header className="flex items-center justify-between mb-6 px-2 flex-shrink-0">
          {/* Логотип */}
          <div className="flex items-center gap-3">
            <div className="border border-white/50 p-1 rounded">
              <SquareStar size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-widest uppercase">
              Rivalry
            </span>
          </div>

          {/* Профіль користувача */}
          <div className="flex items-center gap-4">
            {/* Привітання з юзернеймом перед іконкою профілю */}
            <span className="text-sm md:text-base text-white/80">
              Welcome{user?.username ? `, ${user.username}` : ""}
            </span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 hover:bg-white/20 transition cursor-pointer">
              <User size={20} />
            </div>
            {/* Кнопка виходу після іконки профілю */}
            <button
              onClick={logout}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* 2. РОБОЧА ОБЛАСТЬ (GRID) */}
        <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0 overflow-hidden">
          {/* === ЛІВИЙ САЙДБАР === */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="flex flex-col gap-3 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl h-full">
              <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <NavItem icon={<Trophy size={20} />} label="Tournaments" active />
              <NavItem icon={<Users size={20} />} label="Teams" />
              <NavItem icon={<Settings size={20} />} label="Settings" />
            </nav>
          </aside>

          {/* === ПРАВИЙ БЛОК (СПИСОК ТУРНІРІВ) === */}

          {/* Ліва колонка: список турнірів */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
              <Loader2 className="animate-spin text-white" size={48} />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
              <p className="text-red-400">Error loading tournaments: {error}</p>
            </div>
          ) : (
            <TournamentList tournaments={tournaments} />
          )}
        </div>
      </div>
    </div>
  );
};

// Допоміжний компонент для пункту меню
const NavItem = ({ icon, label, active = false }) => {
  return (
    <button
      className={`flex items-center gap-4 px-6 py-4 rounded-xl text-left transition-all duration-300
        ${
          active
            ? "bg-white/10 border border-white/20 text-white shadow-lg shadow-white/5"
            : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
        }
      `}
    >
      {icon}
      <span className="font-medium text-lg tracking-wide">{label}</span>
    </button>
  );
};

export default Dashboard;
