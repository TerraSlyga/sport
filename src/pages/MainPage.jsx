import React, { useState } from "react";
import VideoBackground from "../components/background/VideoBackground";
import Header from "../components/mainPage/Header";
import FrontCard from "../components/mainPage/FrontCard";
import BackCard from "../components/mainPage/BackCard";

const MainPage = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  // Хендлер для відкриття форми через хедер або кнопку Start
  const openForm = (loginMode) => {
    setIsFlipped(true);
    setIsLogin(loginMode);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      {/* 1. ФОН */}
      <VideoBackground />

      {/* 2. ХЕДЕР */}
      <Header
        onLogoClick={() => setIsFlipped(false)}
        onLoginClick={() => openForm(true)}
        onRegisterClick={() => openForm(false)}
      />

      {/* 3. ЦЕНТРАЛЬНИЙ БЛОК (СЦЕНА) */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-4 [perspective:1000px]">
        {/* КОНТЕЙНЕР ОБЕРТАННЯ */}
        <div
          className={`w-full max-w-4xl h-[600px] relative transition-all duration-700 [transform-style:preserve-3d] ${
            isFlipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Передня сторона */}
          <FrontCard onStartClick={() => openForm(false)} />

          {/* Задня сторона (передаємо стани та функції керування) */}
          <BackCard
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            onBack={() => setIsFlipped(false)}
          />
        </div>
      </main>
    </div>
  );
};

export default MainPage;
