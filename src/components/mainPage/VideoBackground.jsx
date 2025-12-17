import React from "react";

const VideoBackground = () => {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 min-w-full min-h-full object-cover filter blur-xl scale-105"
      >
        <source
          src="https://assets.mixkit.co/videos/43483/43483-720.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>
    </>
  );
};

export default VideoBackground;
