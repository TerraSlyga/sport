import React, { useEffect, useState } from "react";
import { Clock, Hourglass, CheckCircle2 } from "lucide-react";

const formatTimeDiff = (now, target) => {
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

const getStateName = (s) => {
  if (!s) return "Stage";
  if (typeof s === "string") return s;
  if (typeof s.eventStateName === "string") return s.eventStateName;
  if (typeof s.stateName === "string") return s.stateName;
  if (typeof s.name === "string") return s.name;
  if (typeof s.status === "string") return s.status;

  // handle nested shapes where the name may be inside another object
  if (s.eventStateName && typeof s.eventStateName === "object") {
    const nested = s.eventStateName;
    if (typeof nested.eventStateName === "string") return nested.eventStateName;
    if (typeof nested.name === "string") return nested.name;
    if (typeof nested.stateName === "string") return nested.stateName;
  }
  if (s.eventStates && typeof s.eventStates === "object") {
    const nested = s.eventStates;
    if (typeof nested.eventStateName === "string") return nested.eventStateName;
    if (typeof nested.name === "string") return nested.name;
  }

  return "Stage";
};

const TimeBadge = ({ tournament }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const states = tournament.eventStates || [];

  const getInfo = () => {
    if (states.length === 0) {
      if (tournament.eventRegistration?.length > 0) {
        const reg = tournament.eventRegistration[0];
        const start = new Date(reg.startDate);
        const end = new Date(reg.registrationDeadline);
        if (now < start)
          return {
            text: `Reg in ${formatTimeDiff(now, start)}`,
            color: "text-blue-400",
          };
        if (now < end)
          return {
            text: `Reg ends ${formatTimeDiff(now, end)}`,
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

    if (now < firstStart) {
      return {
        text: `Starts in ${formatTimeDiff(now, firstStart)}`,
        color: "text-blue-400",
      };
    }

    if (lastEnd && now > lastEnd) {
      return {
        text: "Finished",
        color: "text-white/30",
        urgent: false,
        finished: true,
      };
    }

    const activeState = sorted.find((s) => {
      const start = new Date(s.startTime);
      const end = s.endTime ? new Date(s.endTime) : null;
      return now >= start && (!end || now <= end);
    });

    if (activeState && activeState.endTime) {
      const end = new Date(activeState.endTime);
      const isUrgent = end - now < 86400000;
      return {
        text: `Ends in ${formatTimeDiff(now, end)}`,
        color: isUrgent ? "text-orange-400" : "text-green-400",
        urgent: isUrgent,
      };
    }

    if (activeState)
      return { text: "Ongoing", color: "text-green-400", urgent: false };

    const nextState = sorted.find((s) => new Date(s.startTime) > now);
    if (nextState) {
      return {
        text: `Next: ${formatTimeDiff(now, nextState.startTime)}`,
        color: "text-yellow-400",
        urgent: false,
      };
    }

    return { text: "Ongoing", color: "text-green-400", urgent: false };
  };

  const info = getInfo();

  return (
    <div className="relative group/time flex flex-col items-end">
      <div
        className={`flex items-center gap-1.5 py-1 px-2 rounded-lg bg-white/5 border border-white/5 group-hover/time:border-white/20 transition-all cursor-help`}
      >
        {info.finished ? (
          <CheckCircle2 size={13} className={info.color} />
        ) : info.urgent ? (
          <Hourglass size={13} className="text-orange-400 animate-pulse" />
        ) : (
          <Clock size={13} className={`${info.color} opacity-70`} />
        )}
        <span className={`text-xs font-mono font-medium ${info.color}`}>
          {info.text}
        </span>
      </div>

      {states.length > 0 && (
        <div className="absolute right-0 top-full pt-2 w-64 z-50 opacity-0 invisible group-hover/time:opacity-100 group-hover/time:visible transition-all duration-200 pointer-events-none group-hover/time:pointer-events-auto">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <div className="px-3 py-2 bg-white/5 border-b border-white/5 flex justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Schedule
              </span>
            </div>
            <div className="max-h-40 overflow-y-auto custom-tooltip-scroll p-2 flex flex-col gap-2">
              {[...states]
                .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
                .map((s, i) => {
                  const isPast = s.endTime && new Date(s.endTime) < now;
                  const isCurrent = !isPast && new Date(s.startTime) <= now;
                  return (
                    <div
                      key={i}
                      className={`flex flex-col pl-2 border-l-2 ${isCurrent ? "border-yellow-500" : isPast ? "border-white/5" : "border-white/20"}`}
                    >
                      <div className="flex justify-between">
                        <span
                          className={`text-[11px] font-bold ${isCurrent ? "text-yellow-400" : isPast ? "text-white/30 line-through" : "text-white/70"}`}
                        >
                          {getStateName(s)}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] text-yellow-500 animate-pulse">
                            NOW
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[9px] font-mono ${isPast ? "text-white/20" : "text-white/50"}`}
                      >
                        {formatFullDate(s.startTime)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeBadge;
