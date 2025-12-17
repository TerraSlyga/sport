import { useState, useEffect } from "react";

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tournaments");
      }

      const data = await response.json();
      setTournaments(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { tournaments, loading, error, refetch: fetchTournaments };
};
