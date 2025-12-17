import React from "react";

const FrontCard = ({ onStartClick }) => {
  return (
    <div
      className="absolute w-full h-full flex flex-col justify-between items-center p-12 md:p-16 
                    bg-white/10 backdrop-blur-xl border-2 border-white/30 rounded-3xl shadow-2xl 
                    [backface-visibility:hidden]"
    >
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-[0.2em] text-white uppercase mt-2 text-center">
        We unite players, create teams, and identify the best.
      </h1>

      <button
        onClick={onStartClick}
        className="mb-4 px-10 py-4 text-xl md:text-4xl font-light tracking-widest text-white 
                   border border-white/60 rounded-full 
                   hover:bg-white hover:text-black hover:border-white 
                   transition-all duration-300"
      >
        START NOW
      </button>
    </div>
  );
};

export default FrontCard;
