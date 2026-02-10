import React from "react";
import { LayoutDashboard, Trophy, Users, Settings } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <nav className="flex flex-col gap-3 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl h-full">
        <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem icon={<Trophy size={20} />} label="Tournaments" active />
        <NavItem icon={<Users size={20} />} label="Teams" />
        <NavItem icon={<Settings size={20} />} label="Settings" />
      </nav>
    </aside>
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

export default Sidebar;
