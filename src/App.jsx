import React from "react";
import { Loader2 } from "lucide-react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import MainPage from "./pages/MainPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TournamentPage from "./pages/TournamentPage.jsx";
import CreateTournament from "./pages/CreateTournament.jsx";
import { useTournaments } from "./hooks/useTournaments";

const TournamentPageWithData = () => {
  const { tournaments } = useTournaments();
  return <TournamentPage tournaments={tournaments} />;
};

// Компонент для захисту приватних маршрутів
const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth(); // Отримуємо isLoading

  // Якщо дані ще вантажаться - показуємо пустий екран або лоадер
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  // Якщо юзера немає - кидаємо на головну
  return user ? children : <Navigate to="/" replace />;
};

// Компонент для публічних маршрутів
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth(); // Отримуємо isLoading

  // Чекаємо, поки AuthContext вирішить: ми увійшли чи ні
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  // Якщо юзер є - кидаємо зразу в дешборд
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Компонент для маршрутизації (всередині AuthProvider)
const AppRoutes = () => {
  return (
    <Routes>
      {/* Публічний маршрут: Лендінг з логіном */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <MainPage />
          </PublicRoute>
        }
      />
      {/* Приватний маршрут: Дешборд */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      {/* Приватний маршрут: Сторінка турніра */}
      <Route
        path="/tournaments/:id"
        element={
          <PrivateRoute>
            <TournamentPageWithData />
          </PrivateRoute>
        }
      />
      {/* Приватний маршрут: Create event (uses same layout) */}
      <Route
        path="/create-event"
        element={
          <PrivateRoute>
            <CreateTournamentWithData />
          </PrivateRoute>
        }
      />
      ;
    </Routes>
  );
};

const CreateTournamentWithData = () => {
  const { tournaments } = useTournaments();
  return <CreateTournament tournaments={tournaments} />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
