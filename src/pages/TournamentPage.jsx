import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, User, Tag, Clock, Users } from "lucide-react";
import TimeBadge from "../components/TimeBadge";
import VideoBackground from "../components/background/VideoBackground";

const TournamentPage = ({ tournaments }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tournaments) {
      setLoading(false);
      return;
    }

    const items = Array.isArray(tournaments)
      ? tournaments
      : tournaments.content || [];
    const found = items.find((t) => t.eventId === parseInt(id));
    setTournament(found || null);
    setLoading(false);
  }, [tournaments, id]);

  if (loading) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden font-sans text-white">
        <VideoBackground />
        <div className="absolute top-0 left-0 w-full h-full bg-[#0f1218]/90"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white/60">Loading...</div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden font-sans text-white">
        <VideoBackground />
        <div className="absolute top-0 left-0 w-full h-full bg-[#0f1218]/90"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="text-white/60">Tournament not found</div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const registrationCount = tournament.eventRegistration?.length || 0;
  const organizerName =
    tournament.organizer?.nickname || tournament.organizerName || "Unknown";

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans text-white">
      <VideoBackground />
      <div className="absolute top-0 left-0 w-full h-full bg-[#0f1218]/90"></div>

      <div className="relative z-10 flex flex-col min-h-screen p-6 md:p-8 max-w-[1200px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 mb-8 text-white/60 hover:text-white transition-colors self-start"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8 flex-1">
          {/* Left: Icon & Basic Info */}
          <div className="md:w-1/3 flex flex-col gap-6">
            {/* Icon (with TimeBadge overlay bottom-right) */}
            <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center overflow-visible shadow-lg">
              {tournament.IconPath ? (
                <img
                  src={tournament.IconPath}
                  alt={tournament.eventName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Trophy className="text-white/30" size={80} />
              )}

              <div className="absolute bottom-3 right-3">
                <TimeBadge tournament={tournament} />
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="text-xs text-white/50 uppercase tracking-widest mb-3">
                Organizer
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {organizerName}
                  </div>
                  <div className="text-xs text-white/40">Event Creator</div>
                </div>
              </div>
            </div>

            {/* Status Card using TimeBadge */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
              <div className="text-xs text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Clock size={14} />
                Schedule
              </div>
              {/* Time moved to icon overlay */}
              <div className="text-sm text-white/50">
                Schedule overview shown on icon
              </div>
            </div>
          </div>

          {/* Right: Description & Details */}
          <div className="md:w-2/3 flex flex-col gap-6">
            {/* Title & Description */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {tournament.eventName}
              </h1>
              <p className="text-white/70 leading-relaxed">
                {tournament.eventDescription || "No description provided"}
              </p>
            </div>

            {/* Tags */}
            {tournament.eventTags && tournament.eventTags.length > 0 && (
              <div>
                <div className="text-xs text-white/50 uppercase tracking-widest mb-3">
                  Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {tournament.eventTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-sm text-white/80 hover:bg-white/15 transition-colors"
                    >
                      <Tag size={14} />
                      {typeof tag === "object"
                        ? tag.eventTagName || tag.name
                        : tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Registration Info */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mt-auto">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="text-yellow-500" size={28} />
                  <div>
                    <div className="text-sm text-white/60">
                      Current Registrations
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {registrationCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration List */}
              {registrationCount > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="text-xs text-white/50 uppercase tracking-widest mb-3">
                    Registered Teams/Players
                  </div>
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {tournament.eventRegistration.map((reg, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5"
                      >
                        <span className="text-sm text-white/80">
                          {reg.participantName ||
                            reg.teamName ||
                            `Participant ${idx + 1}`}
                        </span>
                        <span className="text-xs text-white/40">
                          {new Date(reg.registrationDate).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentPage;
