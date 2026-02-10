import React from "react";
import { Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TournamentList from "../TournamentList";

// Список дій доступних за ролями
const ROLE_ACTIONS = {
  ROLE_ADMIN: [
    {
      id: "create_event",
      label: "Create Event",
      icon: Plus,
      path: "/create-event",
    },
  ],
};

const TournamentContent = ({ tournaments, loading, error, user }) => {
  const navigate = useNavigate();

  // Отримати список ролей з privileges
  const userPrivileges = user?.privileges?.map((p) => p.privilegeName) || [];

  // Знайти перший доступний action на основі ролей користувача
  let availableActions = [];
  userPrivileges.forEach((privilege) => {
    if (ROLE_ACTIONS[privilege]) {
      availableActions = availableActions.concat(ROLE_ACTIONS[privilege]);
    }
  });
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Список турнірів */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
          <Loader2 className="animate-spin text-white" size={48} />
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
          <p className="text-red-400">Error loading tournaments: {error}</p>
        </div>
      ) : (
        <TournamentList
          tournaments={tournaments}
          actions={availableActions}
          navigate={navigate}
        />
      )}
    </div>
  );
};

export default TournamentContent;
