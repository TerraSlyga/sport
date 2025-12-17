import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TournamentList = ({ tournaments = [] }) => {
  const { user } = useAuth();
  const isAdmin =
    !!user && (user.role === "ADMIN" || user.roles?.includes("ADMIN"));
  const [sliderPos, setSliderPos] = useState(0);

  const recommended = tournaments.filter((t) => t.recommended).slice(0, 5);
  const recommendedIds = new Set(recommended.map((t) => t.id));
  const others = tournaments.filter((t) => !recommendedIds.has(t.id));
  const shuffledOthers = [...others].sort(() => Math.random() - 0.5);

  const handleSliderScroll = (direction) => {
    const container = document.getElementById("recommended-slider");
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="flex-1 min-h-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 md:p-6 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold tracking-widest uppercase">
          Tournament List
        </h2>
        {isAdmin && (
          <button className="px-4 py-2 border border-white rounded-xl text-sm font-bold tracking-widest hover:bg-white hover:text-black transition-all">
            Create Tournament
          </button>
        )}
      </div>

      {recommended.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-3 uppercase tracking-wider">
            Recommended Tournaments
          </h3>
          <div className="relative">
            <div
              id="recommended-slider"
              className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide"
              style={{ scrollBehavior: "smooth" }}
            >
              {recommended.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-80 p-5 border border-white/20 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="flex flex-col h-full">
                    <span className="text-[10px] uppercase tracking-widest text-green-300 mb-2">
                      Recommended
                    </span>
                    <h4 className="text-lg font-medium tracking-wide mb-3 flex-1">
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                      <span className="text-xs font-bold tracking-wider text-white/70 uppercase">
                        {item.date}
                      </span>
                      <button className="px-4 py-2 border border-white rounded-full text-xs font-bold tracking-widest hover:bg-white hover:text-black transition-all">
                        JOIN
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {recommended.length > 3 && (
              <>
                <button
                  onClick={() => handleSliderScroll("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => handleSliderScroll("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 flex-1 min-h-0">
        <h3 className="text-base font-semibold mb-2 uppercase tracking-wider">
          All Tournaments
        </h3>
        {(() => {
          return shuffledOthers;
        })().map((item) => (
          <div
            key={item.id}
            className="group flex items-center justify-between p-5  border border-white/20 rounded-2xl bg-white/0 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex flex-col">
              {item.recommended && (
                <span className="text-[10px] uppercase tracking-widest text-green-300 mb-1">
                  Recommended
                </span>
              )}
              <span className="text-lg md:text-xl font-medium tracking-wide">
                {item.name}
              </span>
            </div>

            <div className="flex items-center gap-6 md:gap-12">
              <span className="text-sm md:text-base font-bold tracking-wider text-white/70 uppercase">
                {item.date} - {item.status}
              </span>

              <button className="px-6 py-2 border border-white rounded-full text-sm font-bold tracking-widest hover:bg-white hover:text-black transition-all">
                JOIN
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default TournamentList;
