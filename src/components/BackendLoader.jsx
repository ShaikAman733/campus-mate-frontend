import React, { useState, useEffect } from 'react';
import { Shield, Zap, Database, Globe, CheckCircle2, Lock } from 'lucide-react';

const BackendLoader = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [decodedText, setDecodedText] = useState("INIT_SYSTEM");
  const [activeStage, setActiveStage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // The checklist of "systems" coming online
  const stages = [
    { id: 1, text: "Neural Network", icon: <Zap size={14} /> },
    { id: 2, text: "Database Shards", icon: <Database size={14} /> },
    { id: 3, text: "Security Protocols", icon: <Lock size={14} /> },
    { id: 4, text: "Global CDN", icon: <Globe size={14} /> },
    { id: 5, text: "User Interface", icon: <Shield size={14} /> },
  ];

  // Matrix-style Text Decryption Effect
  const originalText = "CAMPUS MATE";
  const shuffleText = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";
    let iterations = 0;
    const interval = setInterval(() => {
      setDecodedText(prev => 
        originalText.split("").map((letter, index) => {
          if (index < iterations) return originalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      
      if (iterations >= originalText.length) clearInterval(interval);
      iterations += 1 / 3; // Speed of decryption
    }, 30);
  };

  useEffect(() => {
    // Trigger text shuffle on mount and every 10 seconds
    shuffleText();
    const shuffleInterval = setInterval(shuffleText, 10000);

    // 1. Progress & Stage Logic
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98; 
        
        // Advance stages based on progress
        const stageIndex = Math.floor((prev / 100) * stages.length);
        setActiveStage(stageIndex);

        // Variable speed: Fast start, slow middle, slow end
        const speed = prev < 30 ? 0.8 : prev < 70 ? 0.4 : 0.1; 
        return prev + speed;
      });
    }, 100);

    // 2. Real Server Check (Simulated for this demo, keeping your logic structure)
    const checkServer = async () => {
      try {
        // Keeping your original endpoint
        const response = await fetch('https://campus-bot-node.onrender.com/api/lostfound');
        if (response.ok) {
          triggerExit();
        } else {
          // Fallback simulation if server is down so you can see the UI
          // Remove this else block in production if you want strictly server-dependent loading
           setTimeout(checkServer, 2000);
        }
      } catch (error) {
         setTimeout(checkServer, 2000);
      }
    };

    const triggerExit = () => {
      setProgress(100);
      setActiveStage(5);
      setIsExiting(true);
      setTimeout(() => setIsReady(true), 1500);
    };

    checkServer();

    return () => {
      clearInterval(progressInterval);
      clearInterval(shuffleInterval);
    };
  }, []);

  if (isReady) return <>{children}</>;

  return (
    <div className={`quantum-loader ${isExiting ? 'warp-speed' : ''}`}>
      
      {/* 3D Holographic Floor */}
      <div className="holo-floor"></div>
      
      {/* Ambient Particles */}
      <div className="particles"></div>

      <div className="interface-container">
        
        {/* THE QUANTUM GYROSCOPE */}
        <div className="gyro-scene">
          <div className="gyro-ring ring-1"></div>
          <div className="gyro-ring ring-2"></div>
          <div className="gyro-ring ring-3"></div>
          <div className="gyro-core">
            <div className="core-inner"></div>
          </div>
        </div>

        {/* Decrypting Title */}
        <div className="title-section">
          <h1 className="cyber-title" data-text={decodedText}>{decodedText}</h1>
          <div className="status-bar">
            <div className="status-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="percentage-text">SYSTEM INTEGRITY: {Math.floor(progress)}%</div>
        </div>

        {/* System Checklist Modules */}
        <div className="modules-list">
          {stages.map((stage, index) => (
            <div 
              key={stage.id} 
              className={`module-item ${index <= activeStage ? 'active' : 'pending'} ${index === activeStage ? 'pulsing' : ''}`}
            >
              <div className="module-icon">
                {index < activeStage ? <CheckCircle2 size={14} color="#00ff9d" /> : stage.icon}
              </div>
              <span className="module-text">{stage.text}</span>
              <div className="module-status">
                {index < activeStage ? 'ONLINE' : index === activeStage ? 'LOADING...' : 'WAITING'}
              </div>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        /* --- CONTAINER & EXIT FX --- */
        .quantum-loader {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: #030305;
          color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Rajdhani', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          overflow: hidden;
          perspective: 1000px;
          z-index: 9999;
          /* Handle mobile viewport quirks */
          min-height: -webkit-fill-available;
        }

        .warp-speed {
          animation: warpOut 1.5s cubic-bezier(0.7, 0, 0.2, 1) forwards;
        }
        
        .warp-speed .gyro-scene {
          animation: coreImplode 0.5s forwards;
        }

        @keyframes warpOut {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 1; transform: scale(4); filter: brightness(20); }
          100% { opacity: 0; transform: scale(10); display: none; }
        }

        /* --- HOLOGRAPHIC FLOOR --- */
        .holo-floor {
          position: absolute; bottom: -50%; left: -50%; width: 200%; height: 100%;
          background-image: 
            linear-gradient(rgba(0, 210, 255, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 210, 255, 0.3) 1px, transparent 1px);
          background-size: 50px 50px;
          transform: rotateX(70deg);
          animation: floorMove 3s linear infinite;
          mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 60%);
          z-index: 1;
          pointer-events: none;
        }

        @keyframes floorMove { from { background-position: 0 0; } to { background-position: 0 50px; } }

        /* --- 3D GYROSCOPE --- */
        .gyro-scene {
          position: relative; 
          /* Responsive sizing using clamp */
          width: clamp(120px, 25vw, 180px);
          height: clamp(120px, 25vw, 180px);
          transform-style: preserve-3d;
          animation: float 6s ease-in-out infinite;
          /* Responsive margin */
          margin-bottom: clamp(20px, 5vh, 40px);
        }

        .gyro-ring {
          position: absolute; width: 100%; height: 100%;
          border-radius: 50%;
          border: 2px solid rgba(0, 210, 255, 0.1);
          box-shadow: 0 0 15px rgba(0, 210, 255, 0.1);
        }

        .ring-1 {
          border-top: 2px solid #00d2ff;
          border-bottom: 2px solid #00d2ff;
          animation: rotate1 4s linear infinite;
        }

        .ring-2 {
          width: 80%; height: 80%; top: 10%; left: 10%;
          border: 2px solid rgba(255, 0, 255, 0.1);
          border-left: 2px solid #ff00ff;
          border-right: 2px solid #ff00ff;
          animation: rotate2 5s linear infinite;
        }

        .ring-3 {
          width: 60%; height: 60%; top: 20%; left: 20%;
          border: 2px solid rgba(0, 255, 157, 0.1);
          border-top: 2px solid #00ff9d;
          animation: rotate3 10s linear infinite;
        }

        .gyro-core {
          position: absolute; top: 35%; left: 35%; width: 30%; height: 30%;
          background: #00d2ff;
          border-radius: 50%;
          box-shadow: 0 0 30px #00d2ff;
          animation: pulseCore 2s infinite;
        }

        @keyframes rotate1 { 0% { transform: rotateX(60deg) rotateY(0deg); } 100% { transform: rotateX(60deg) rotateY(360deg); } }
        @keyframes rotate2 { 0% { transform: rotateX(-60deg) rotateY(0deg); } 100% { transform: rotateX(-60deg) rotateY(360deg); } }
        @keyframes rotate3 { 0% { transform: rotateX(90deg) rotateZ(0deg); } 100% { transform: rotateX(90deg) rotateZ(360deg); } }
        @keyframes pulseCore { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(0.8); opacity: 0.7; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        /* --- TYPOGRAPHY & HUD --- */
        .interface-container {
          position: relative; z-index: 10;
          display: flex; flex-direction: column; align-items: center;
          width: 90%; 
          max-width: 400px;
          padding: 0 10px;
        }

        .title-section { text-align: center; width: 100%; margin-bottom: 30px; }
        
        .cyber-title {
          /* Fluid font size */
          font-size: clamp(24px, 8vw, 36px);
          font-weight: 800; color: #fff;
          letter-spacing: clamp(2px, 1vw, 4px);
          margin: 0 0 15px 0;
          text-shadow: 0 0 10px rgba(0, 210, 255, 0.5);
          white-space: nowrap;
        }

        .status-bar {
          width: 100%; height: 4px; background: rgba(255,255,255,0.1);
          border-radius: 2px; overflow: hidden; margin-bottom: 8px;
          position: relative;
        }

        .status-fill {
          height: 100%; background: #00d2ff;
          box-shadow: 0 0 10px #00d2ff;
          transition: width 0.1s linear;
        }

        .percentage-text {
          font-size: 12px; color: #00d2ff; letter-spacing: 2px;
          text-align: right; font-weight: bold;
        }

        /* --- MODULE CHECKLIST --- */
        .modules-list {
          width: 100%;
          background: rgba(0, 10, 20, 0.6);
          border: 1px solid rgba(0, 210, 255, 0.2);
          backdrop-filter: blur(5px);
          padding: 15px;
          border-radius: 4px;
          /* Prevent overflowing on very small screens */
          max-height: 40vh;
          overflow-y: auto;
          scrollbar-width: none; /* Firefox */
        }
        
        .modules-list::-webkit-scrollbar { display: none; } /* Chrome/Safari */

        .module-item {
          display: flex; align-items: center; gap: 12px;
          padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 14px; transition: all 0.3s;
        }

        .module-item:last-child { border-bottom: none; }
        
        .module-item.pending { opacity: 0.4; }
        .module-item.active { opacity: 1; }
        .module-item.pulsing .module-text { color: #00d2ff; }
        .module-item.pulsing .module-status { color: #00d2ff; animation: blink 0.5s infinite; }

        .module-text { flex-grow: 1; font-weight: 500; letter-spacing: 1px; }
        .module-status { font-size: 10px; font-weight: bold; letter-spacing: 1px; color: #00ff9d; white-space: nowrap; }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        /* --- MEDIA QUERIES FOR LANDSCAPE & SMALL DEVICES --- */
        
        /* Landscape Mode on Phones (Short height) */
        @media (max-height: 500px) and (orientation: landscape) {
          .quantum-loader {
            align-items: flex-start;
            padding-top: 20px;
            overflow-y: auto;
          }
          
          .interface-container {
            flex-direction: row;
            max-width: 600px;
            gap: 20px;
            align-items: center;
            justify-content: center;
          }
          
          .gyro-scene {
            width: 100px;
            height: 100px;
            margin-bottom: 0;
            flex-shrink: 0;
          }
          
          .title-section {
            margin-bottom: 10px;
            text-align: left;
          }
          
          .modules-list {
            padding: 10px;
            max-width: 300px;
          }
          
          .cyber-title {
             font-size: 24px;
             margin-bottom: 5px;
          }
        }

        /* Small Phones (Portrait) */
        @media (max-width: 380px) {
           .cyber-title { font-size: 28px; }
           .module-text { font-size: 13px; }
           .module-status { font-size: 9px; }
        }
      `}</style>
    </div>
  );
};

export default BackendLoader;