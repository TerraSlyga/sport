import React from "react";
import { useNavigate } from "react-router-dom";

const ActionButton = ({ icon: Icon, label, path, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm transition-colors"
      title={label}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
};

export default ActionButton;
