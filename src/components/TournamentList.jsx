import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Для навігації
import { useAuth } from "../context/AuthContext";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Trophy,
  Clock,
  Hourglass,
  Tag,
  CheckCircle2,
} from "lucide-react";
import ActionButton from "./buttons/ActionButton";
import TimeBadge from "./TimeBadge";

// --- Стилі для кастомного скролбару (всередині тултіпа) ---
const styles = `
  .custom-tooltip-scroll::-webkit-scrollbar { width: 4px; }
  .custom-tooltip-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
  .custom-tooltip-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
  .custom-tooltip-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.4); }
`;

const TournamentList = ({
  tournaments,
  actions = [],
  navigate: externalNavigate,
}) => {
  const { user } = useAuth();
  const isAdmin =
    !!user && (user.role === "ADMIN" || user.roles?.includes("ADMIN"));
  const navigate = externalNavigate || useNavigate(); // Хук для навігації
  const sliderRef = useRef(null);

  // Оновлюємо таймери кожну хвилину
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Нормалізація даних ---
  const items = useMemo(() => {
    if (!tournaments) return [];
    return Array.isArray(tournaments) ? tournaments : tournaments.content || [];
  }, [tournaments]);

  // --- ХЕЛПЕРИ ЧАСУ ---

  const formatTimeDiff = (target) => {
    const diff = new Date(target) - now;
    if (diff <= 0) return "0m";
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (d > 0) return `${d}d ${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const formatFullDate = (dateStr) => {
    if (!dateStr) return "...";
    return new Date(dateStr).toLocaleString("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Головна логіка розрахунку часу
  const getTimeInfo = (tournament) => {
    const states = tournament.eventStates || [];

    // 1. Немає станів (перевіряємо реєстрацію)
    if (states.length === 0) {
      if (tournament.eventRegistration?.length > 0) {
        const reg = tournament.eventRegistration[0];
        const start = new Date(reg.startDate);
        const end = new Date(reg.registrationDeadline);
        if (now < start)
          return {
            text: `Reg in ${formatTimeDiff(start)}`,
            color: "text-blue-400",
            urgent: false,
          };
        if (now < end)
          return {
            text: `Reg ends ${formatTimeDiff(end)}`,
            color: "text-green-400",
            urgent: now > end - 86400000,
          };
      }
      return { text: "Date TBA", color: "text-white/30", urgent: false };
    }

    const sorted = [...states].sort(
      (a, b) => new Date(a.startTime) - new Date(b.startTime),
    );
    const firstStart = new Date(sorted[0].startTime);
    const lastEnd = sorted[sorted.length - 1].endTime
      ? new Date(sorted[sorted.length - 1].endTime)
      : null;

    // 2. Ще не почався
    if (now < firstStart) {
      return {
        text: `Starts in ${formatTimeDiff(firstStart)}`,
        color: "text-blue-400",
        urgent: false,
      };
    }

    // 3. Вже закінчився
    if (lastEnd && now > lastEnd) {
      return {
        text: "Finished",
        color: "text-white/30",
        urgent: false,
        finished: true,
      };
    }

    // 4. Активний етап (Ongoing)
    const activeState = sorted.find((s) => {
      const start = new Date(s.startTime);
      const end = s.endTime ? new Date(s.endTime) : null;
      return now >= start && (!end || now <= end);
    });

    if (activeState && activeState.endTime) {
      const end = new Date(activeState.endTime);
      const isUrgent = end - now < 86400000; // < 24h
      return {
        text: `Ends in ${formatTimeDiff(end)}`,
        color: isUrgent ? "text-orange-400" : "text-green-400",
        urgent: isUrgent,
      };
    }

    if (activeState)
      return { text: "Ongoing", color: "text-green-400", urgent: false };

    // 5. Між етапами (Waiting for next)
    const nextState = sorted.find((s) => new Date(s.startTime) > now);
    if (nextState) {
      return {
        text: `Next: ${formatTimeDiff(nextState.startTime)}`,
        color: "text-yellow-400",
        urgent: false,
      };
    }

    return { text: "Ongoing", color: "text-green-400", urgent: false };
  };

  // --- ХЕЛПЕРИ ДАНИХ ---
  const getOrganizer = (t) => {
    const org = t.organizer;
    if (!org) return "Unknown";
    if (org.personName && org.personSurname)
      return `${org.personName} ${org.personSurname}`;
    return org.nickname || "Admin";
  };

  const getStateName = (s) => {
    const nested = s.eventStates;
    return nested?.eventStateName || nested?.name || nested?.status || "Stage";
  };

  const handleRowClick = (id) => {
    navigate(`/tournaments/${id}`);
  };

  // --- МЕМОІЗАЦІЯ СПИСКІВ ---
  const { recommended, others } = useMemo(() => {
    const isRec = (t) =>
      t.eventTags?.some(
        (tag) =>
          tag === "RECOMMENDED" ||
          tag?.name === "RECOMMENDED" ||
          tag?.eventTagName === "RECOMMENDED",
      );
    const rec = items.filter(isRec).slice(0, 5);
    const recIds = new Set(rec.map((t) => t.eventId));
    const rest = items.filter((t) => !recIds.has(t.eventId));
    // Перемішуємо решту для різноманіття
    const shuffled = [...rest].sort(() => Math.random() - 0.5);
    return { recommended: rec, others: shuffled };
  }, [items]);

  // TimeBadge component extracted to src/components/TimeBadge.jsx

  return (
    <>
      <style>{styles}</style>
      <main className="flex-1 min-h-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-4 md:p-6 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-widest uppercase flex items-center gap-2 text-white">
            <Trophy className="text-yellow-500" size={24} />
            Tournament List
          </h2>
          <div className="flex items-center gap-3">
            {actions.map((action) => (
              <ActionButton
                key={action.id}
                icon={action.icon}
                label={action.label}
                path={action.path}
              />
            ))}
            {isAdmin && !actions.length && (
              <button className="px-4 py-2 border border-white rounded-xl text-sm font-bold tracking-widest text-white hover:bg-white hover:text-black transition-all">
                Create Tournament
              </button>
            )}
          </div>
        </div>

        {/* SLIDER (FEATURED) */}
        {recommended.length > 0 && (
          <div className="mb-8 relative group/slider">
            <div className="flex justify-between items-end mb-4 px-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">
                Featured Events
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    sliderRef.current?.scrollBy({
                      left: -340,
                      behavior: "smooth",
                    })
                  }
                  className="p-1.5 bg-white/5 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    sliderRef.current?.scrollBy({
                      left: 340,
                      behavior: "smooth",
                    })
                  }
                  className="p-1.5 bg-white/5 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div
              ref={sliderRef}
              className="flex gap-4 overflow-x-auto scroll-smooth pb-4 scrollbar-hide px-1"
            >
              {recommended.map((item) => (
                <div
                  key={item.eventId}
                  onClick={() => handleRowClick(item.eventId)}
                  className="flex-shrink-0 w-80 p-5 border border-yellow-500/30 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 transition-all duration-300 relative overflow-hidden group cursor-pointer"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/20 blur-3xl -mr-10 -mt-10 rounded-full pointer-events-none group-hover:bg-yellow-500/30 transition-all"></div>

                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <span className="text-[10px] uppercase font-bold text-yellow-400 border border-yellow-500/40 px-2 py-0.5 rounded bg-yellow-500/10">
                      Recommended
                    </span>
                    {item.IconPath && (
                      <img
                        src={item.IconPath}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover shadow-lg"
                      />
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1 line-clamp-1">
                    {item.eventName}
                  </h4>
                  <p className="text-xs text-white/60 mb-4 line-clamp-2 min-h-[2.5em]">
                    {item.eventDescription}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <User size={12} /> {getOrganizer(item)}
                    </div>
                    {/* Зупиняємо спливання кліку, щоб тултіп працював, але перехід був можливий */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <TimeBadge tournament={item} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIST (ALL TOURNAMENTS) */}
        <div className="flex flex-col gap-3 flex-1 min-h-0 pb-10">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-1">
            All Tournaments
          </h3>

          {others.length === 0 ? (
            <div className="text-center text-white/20 py-10 italic">
              No active tournaments found
            </div>
          ) : (
            others.map((item) => (
              <div
                key={item.eventId}
                onClick={() => handleRowClick(item.eventId)}
                className="group flex items-center p-3 sm:p-4 gap-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-200 cursor-pointer relative"
              >
                {/* 1. Icon */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center justify-center overflow-hidden shadow-inner">
                  {item.IconPath ? (
                    <img
                      src={item.IconPath}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Trophy
                      className="text-white/20 group-hover:text-yellow-500/80 transition-colors duration-300"
                      size={28}
                    />
                  )}
                </div>

                {/* 2. Content Info */}
                <div className="flex flex-col flex-1 min-w-0 gap-1">
                  <div className="flex items-baseline gap-2">
                    <h4 className="text-base sm:text-lg font-bold text-white leading-tight truncate group-hover:text-yellow-400 transition-colors">
                      {item.eventName}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span className="flex items-center gap-1 hover:text-white/80 transition-colors">
                      <User size={10} /> {getOrganizer(item)}
                    </span>
                  </div>

                  <p className="text-xs text-white/60 line-clamp-1 truncate pr-4">
                    {item.eventDescription || "Competitive tournament event"}
                  </p>

                  {/* Tags Row */}
                  {item.eventTags && item.eventTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {item.eventTags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-white/50"
                        >
                          <Tag size={8} />
                          {typeof tag === "object"
                            ? tag.eventTagName || tag.name
                            : tag}
                        </span>
                      ))}
                      {item.eventTags.length > 3 && (
                        <span className="text-[10px] text-white/30 py-0.5">
                          +{item.eventTags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Time & Status (Right Side) */}
                <div
                  className="flex flex-col items-end gap-2 shrink-0 pl-2 border-l border-white/5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <TimeBadge tournament={item} />
                  {/* Можна додати статус бейдж якщо потрібно, але таймер вже інформативний */}
                </div>

                {/* Hover Arrow (Visual Hint) */}
                <div className="absolute right-4 opacity-0 group-hover:opacity-10 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
                  <ChevronRight size={40} />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default TournamentList;
