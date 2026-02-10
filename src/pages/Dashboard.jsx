import React from "react";
import VideoBackground from "../components/background/VideoBackground";
import { useAuth } from "../context/AuthContext";
import { useTournaments } from "../hooks/useTournaments";
import Header from "../components/dashboard/Header";
import Sidebar from "../components/dashboard/Sidebar";
import TournamentContent from "../components/dashboard/TournamentContent";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tournaments, loading, error } = useTournaments();

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-white">
      <VideoBackground />

      <div className="absolute top-0 left-0 w-full h-full bg-[#0f1218]/90"></div>

      {/* --- ОСНОВНИЙ КОНТЕНТ --- */}
      <div className="relative z-10 flex flex-col min-h-screen p-6 md:p-8 max-w-[1600px] mx-auto">
        {/* 1. ВЕРХНІЙ ХЕДЕР */}
        <Header user={user} logout={logout} />

        {/* 2. РОБОЧА ОБЛАСТЬ (GRID) */}
        <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0 overflow-hidden">
          <Sidebar />
          <TournamentContent
            user={user}
            tournaments={tournaments}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
