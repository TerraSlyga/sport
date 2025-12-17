import React from "react";
import { SquareStar } from "lucide-react";

const Header = ({ onLogoClick, onLoginClick, onRegisterClick }) => {
  return (
    <header className="relative z-20 flex items-center justify-between px-8 py-6">
      <div className="flex items-center gap-3 text-white">
        <div className="border-2 border-white p-1 rounded-md">
          <SquareStar size={24} strokeWidth={2.5} />
        </div>
        <button
          className="text-2xl font-bold tracking-widest uppercase"
          onClick={onLogoClick}
        >
          Rivalry
        </button>
      </div>

      <div className="flex items-center gap-8 text-white text-xl font-bold tracking-wide">
        <button
          onClick={onLoginClick}
          className="hover:text-gray-300 transition-colors"
        >
          Log_In
        </button>
        <button
          onClick={onRegisterClick}
          className="hover:text-gray-300 transition-colors"
        >
          Log_Up
        </button>
      </div>
    </header>
  );
};

export default Header;
