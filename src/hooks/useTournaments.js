import { useState, useEffect, useCallback } from "react";

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTournaments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/event/allEventsSmallInfo", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tournaments");
      }

      const data = await response.json();

      // --- ВИПРАВЛЕННЯ ТУТ ---
      // Якщо це Page, беремо data.content. Якщо це List, беремо data.
      if (data.content && Array.isArray(data.content)) {
        setTournaments(data.content);
      } else if (Array.isArray(data)) {
        setTournaments(data);
      } else {
        // Про всяк випадок, якщо прийшло щось пусте або помилкове
        setTournaments([]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setError(err.message);
      setTournaments([]); // Скидаємо список при помилці, щоб не поламати UI
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  return { tournaments, loading, error, refetch: fetchTournaments };
};
