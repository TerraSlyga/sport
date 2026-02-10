import React from "react";
import { SquareStar, User } from "lucide-react";

const Header = ({ user, logout }) => {
  return (
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
          Welcome{user?.nickname ? `, ${user.nickname}` : ""}
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
  );
};

export default Header;
