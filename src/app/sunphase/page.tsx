'use client';

import { HeartbeatWebGPU } from "@/components/rhythmia/Heartbeat";

export default function Page() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      <HeartbeatWebGPU />
      
      {/* Title and Info Overlay */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        color: "white",
        zIndex: 10,
        pointerEvents: "none",
        textShadow: "0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)",
      }}>
        <h1 style={{
          fontSize: "4rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "pulse 3s ease-in-out infinite",
        }}>
          ☀️ SunPhase 🌙
        </h1>
        <p style={{
          fontSize: "1.2rem",
          opacity: 0.9,
          maxWidth: "600px",
          lineHeight: "1.6",
        }}>
          Experience the beautiful cycle of day and night with dynamic atmospheric effects
        </p>
        <p style={{
          fontSize: "0.9rem",
          opacity: 0.7,
          marginTop: "1rem",
        }}>
          Move your mouse to interact with the celestial bodies ✨
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}