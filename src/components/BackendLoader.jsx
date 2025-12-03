import React, { useState, useEffect, useRef } from 'react';
import { Shield, Zap, Database, Globe, Cpu, Activity, Radio, Hexagon, Scan, Wifi, Server, Code } from 'lucide-react';

const BackendLoader = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [decodedText, setDecodedText] = useState("INITIALIZING");
  const [activeStage, setActiveStage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  
  // Physics State for Smooth Parallax
  const [springPos, setSpringPos] = useState({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  const stages = [
    { id: 1, text: "UPLINK_ESTABLISHED", sub: "Handshake verified", icon: <Wifi size={16} /> },
    { id: 2, text: "KERNEL_INJECTION", sub: "Loading modules", icon: <Code size={16} /> },
    { id: 3, text: "ENCRYPTION_LAYER", sub: "Securing connection", icon: <Shield size={16} /> },
    { id: 4, text: "DATA_SHARDING", sub: "Fetching assets", icon: <Database size={16} /> },
    { id: 5, text: "HUD_RENDERING", sub: "Finalizing UI", icon: <Cpu size={16} /> },
  ];

  // --- 1. DECRYPTION ENGINE ---
  const originalText = "CAMPUS MATE";
  useEffect(() => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDecodedText(prev => 
        originalText.split("").map((letter, index) => {
          if (index < iterations) return originalText[index];
          const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#&§";
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iterations >= originalText.length) clearInterval(interval);
      iterations += 1 / 4;
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // --- 2. PROGRESS LOGIC ---
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98; 
        const stageIndex = Math.floor((prev / 100) * stages.length);
        setActiveStage(stageIndex);
        const stallChance = Math.random();
        const speed = prev < 20 ? 0.8 : prev < 60 ? 0.4 : (stallChance > 0.8 ? 0 : 0.2); 
        return prev + speed;
      });
    }, 100);

    const checkServer = async () => {
      try {
        const response = await fetch('https://campus-bot-node.onrender.com/api/lostfound');
        if (response.ok) {
          setProgress(100);
          setActiveStage(5);
          setIsExiting(true);
          setTimeout(() => setIsReady(true), 1500);
        } else {
          setTimeout(checkServer, 2000);
        }
      } catch (error) {
        setTimeout(checkServer, 2000);
      }
    };
    checkServer();
    return () => clearInterval(progressInterval);
  }, []);

  // --- 3. PHYSICS ENGINE ---
  useEffect(() => {
    let animationFrameId;
    const renderLoop = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.08;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.08;
      setSpringPos({ x: currentPos.current.x, y: currentPos.current.y });
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e) => {
    if (isExiting) return;
    const { innerWidth, innerHeight } = window;
    targetPos.current = {
      x: (e.clientX - innerWidth / 2) / 35,
      y: (e.clientY - innerHeight / 2) / 35
    };
  };

  if (isReady) return <>{children}</>;

  return (
    <div 
      className={`titan-loader ${isExiting ? 'warp-out' : ''}`} 
      onMouseMove={handleMouseMove}
    >
      {/* --- CINEMATIC BACKGROUND --- */}
      <div className="aurora-bg"></div>
      <div className="grid-plane"></div>
      <div className="crt-overlay"></div>
      <div className="vignette"></div>

      {/* --- 3D INTERFACE RIG --- */}
      <div 
        className="interface-rig"
        style={{ transform: `rotateX(${-springPos.y}deg) rotateY(${springPos.x}deg)` }}
      >
        
        {/* HEADER DECK */}
        <div className="header-deck">
           <div className="deck-item left">
             <Activity size={12} className="icon-pulse mr-2"/> 
             <span>SYS_OPTIMAL</span>
           </div>
           <div className="deck-center">CM-OS v2.4</div>
           <div className="deck-item right text-dim">
             PING: <span className="text-neon">{Math.floor(Math.random() * 20 + 10)}ms</span>
           </div>
        </div>

        {/* --- GYRO REACTOR CORE --- */}
        <div className="reactor-container">
          <div className="gyro-outer"></div>
          <div className="gyro-mid"></div>
          <div className="gyro-inner">
             <Hexagon size={40} className="core-hex"/>
          </div>
          <div className="particle-cloud"></div>
        </div>

        {/* MAIN DISPLAY */}
        <div className="main-display">
          <h1 className="cyber-title" data-text={decodedText}>{decodedText}</h1>
          
          <div className="loading-sector">
             <div className="scan-line-x"></div>
             <div className="loading-bar-track">
               <div className="loading-bar-fill" style={{ width: `${progress}%` }}></div>
             </div>
             <div className="loading-metrics">
               <span>LOADING ASSETS</span>
               <span className="nums">{Math.floor(progress)}%</span>
             </div>
          </div>
        </div>

        {/* DATA GRID CARDS */}
        <div className="data-grid">
          {stages.map((stage, index) => (
            <div 
              key={stage.id} 
              className={`holo-card ${index === activeStage ? 'active' : ''} ${index < activeStage ? 'done' : ''}`}
            >
              <div className="card-status-line"></div>
              <div className="card-body">
                <div className="card-icon-box">
                  {index < activeStage ? <Shield size={14} className="text-neon"/> : 
                   index === activeStage ? <Radio size={14} className="text-warn animate-spin-slow"/> : 
                   stage.icon}
                </div>
                <div className="card-text">
                  <div className="card-header">{stage.text}</div>
                  <div className="card-sub">{stage.sub}</div>
                </div>
              </div>
              {index === activeStage && <div className="scanning-bar"></div>}
            </div>
          ))}
        </div>

      </div>

      <style>{`
        /* --- CORE --- */
        .titan-loader {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: #030305; color: #e0e0e0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Rajdhani', 'Segoe UI', monospace;
          overflow: hidden; perspective: 1200px;
          cursor: crosshair; z-index: 9999;
        }

        /* --- BACKGROUND FX --- */
        .aurora-bg {
          position: absolute; width: 150%; height: 150%;
          background: radial-gradient(circle at 50% 50%, rgba(20, 30, 60, 0.4) 0%, #000 70%),
                      conic-gradient(from 0deg at 50% 50%, #000 0deg, rgba(0, 210, 255, 0.05) 120deg, #000 240deg);
          animation: auroraSpin 30s linear infinite;
          z-index: 1;
        }

        .grid-plane {
          position: absolute; bottom: -50%; width: 300%; height: 100%;
          background: linear-gradient(0deg, transparent 0%, rgba(0, 243, 255, 0.1) 100%),
                      linear-gradient(90deg, rgba(0, 243, 255, 0.05) 1px, transparent 1px);
          background-size: 100% 100%, 60px 60px;
          transform: rotateX(80deg);
          animation: gridMove 4s linear infinite;
          z-index: 2;
        }

        .crt-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                      linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
          pointer-events: none; z-index: 20;
        }

        .vignette {
          position: absolute; inset: 0;
          background: radial-gradient(circle, transparent 50%, #000 130%);
          z-index: 15;
        }

        /* --- INTERFACE RIG --- */
        .interface-rig {
          position: relative; z-index: 10;
          display: flex; flex-direction: column; align-items: center;
          width: 90vw; max-width: 460px;
          transform-style: preserve-3d;
        }

        /* --- HEADER --- */
        .header-deck {
          width: 100%; display: flex; justify-content: space-between;
          padding: 0 10px 10px; border-bottom: 1px solid rgba(0, 243, 255, 0.2);
          margin-bottom: 40px; font-size: 11px; letter-spacing: 2px;
          text-transform: uppercase; color: rgba(0, 243, 255, 0.7);
        }
        .deck-item { display: flex; align-items: center; }

        /* --- REACTOR CORE --- */
        .reactor-container {
          position: relative; width: 140px; height: 140px;
          display: flex; justify-content: center; align-items: center;
          margin-bottom: 40px; transform-style: preserve-3d;
        }

        .gyro-outer {
          position: absolute; width: 100%; height: 100%;
          border: 1px dashed rgba(0, 243, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid #00f3ff;
          border-bottom: 2px solid #00f3ff;
          animation: spin 8s linear infinite;
        }
        
        .gyro-mid {
          position: absolute; width: 80%; height: 80%;
          border-radius: 50%;
          border: 1px solid rgba(188, 19, 254, 0.3);
          border-left: 2px solid #bc13fe;
          border-right: 2px solid #bc13fe;
          transform: rotateX(60deg);
          animation: spinRev 5s linear infinite;
        }

        .gyro-inner {
          position: absolute; width: 50%; height: 50%;
          border-radius: 50%;
          border: 2px dotted #fff;
          display: flex; align-items: center; justify-content: center;
          transform: rotateY(60deg);
          animation: spin 3s linear infinite;
          background: radial-gradient(circle, rgba(0,243,255,0.1), transparent);
          box-shadow: 0 0 20px rgba(0,243,255,0.2);
        }

        .core-hex { color: #fff; animation: pulse 2s infinite; filter: drop-shadow(0 0 5px #00f3ff); }

        /* --- MAIN DISPLAY --- */
        .main-display { width: 100%; text-align: center; margin-bottom: 25px; }

        .cyber-title {
          font-size: 42px; font-weight: 800; color: #fff;
          letter-spacing: 6px; margin: 0 0 15px 0;
          text-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
          position: relative; display: inline-block;
        }
        
        .loading-sector {
          position: relative; width: 100%; padding: 0 10px;
        }

        .loading-bar-track {
          width: 100%; height: 2px; background: rgba(255,255,255,0.1);
          overflow: hidden; margin-bottom: 8px;
        }
        
        .loading-bar-fill {
          height: 100%; background: #00f3ff;
          box-shadow: 0 0 15px #00f3ff;
          position: relative;
        }

        .loading-metrics {
          display: flex; justify-content: space-between;
          font-size: 10px; color: #666; letter-spacing: 1px;
        }

        .nums { font-family: monospace; color: #00f3ff; }

        /* --- DATA GRID --- */
        .data-grid {
          width: 100%; display: grid; grid-template-columns: 1fr; gap: 8px;
          perspective: 1000px;
        }

        .holo-card {
          position: relative;
          background: rgba(0, 10, 20, 0.4);
          border: 1px solid rgba(0, 243, 255, 0.1);
          padding: 12px; display: flex; align-items: center;
          border-radius: 2px; overflow: hidden;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .holo-card.active {
          background: rgba(0, 243, 255, 0.05);
          border-color: #00f3ff;
          transform: translateX(10px);
          box-shadow: -5px 0 15px rgba(0,243,255,0.1);
        }

        .holo-card.done { border-color: rgba(0, 255, 157, 0.3); opacity: 0.7; }
        .holo-card.done .card-status-line { background: #00ff9d; }

        .card-status-line {
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: rgba(0, 243, 255, 0.3);
          transition: background 0.3s;
        }
        .active .card-status-line { background: #00f3ff; box-shadow: 0 0 10px #00f3ff; }

        .card-body { display: flex; align-items: center; width: 100%; padding-left: 8px; }
        .card-icon-box { width: 24px; display: flex; justify-content: center; margin-right: 12px; }
        
        .card-header { font-size: 12px; font-weight: 700; letter-spacing: 1px; color: #e0e0e0; }
        .card-sub { font-size: 9px; color: #777; text-transform: uppercase; margin-top: 2px; }

        .scanning-bar {
          position: absolute; top: 0; left: 0; width: 2px; height: 100%;
          background: rgba(255,255,255,0.5);
          filter: blur(2px);
          animation: scanX 2s ease-in-out infinite;
        }

        /* --- ANIMATIONS --- */
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinRev { from { transform: rotateX(60deg) rotate(360deg); } to { transform: rotateX(60deg) rotate(0deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }
        @keyframes gridMove { from { background-position: 0 0; } to { background-position: 0 60px; } }
        @keyframes auroraSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes scanX { 0% { left: -10%; opacity: 0; } 50% { opacity: 1; } 100% { left: 110%; opacity: 0; } }
        
        .animate-spin-slow { animation: spin 2s linear infinite; }
        .text-neon { color: #00f3ff; }
        .text-warn { color: #bc13fe; }
        .mr-2 { margin-right: 8px; }

        .warp-out { animation: warp 1s cubic-bezier(0.7, 0, 0.2, 1) forwards; }
        @keyframes warp { 
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(2) rotate(2deg); filter: brightness(2) blur(2px); }
          100% { opacity: 0; transform: scale(8); display: none; }
        }

        /* --- RESPONSIVE ADJUSTMENTS --- */
        
        /* Tablet / Small Desktop */
        @media (max-width: 1024px) {
          .interface-rig { max-width: 400px; }
          .cyber-title { font-size: 36px; }
        }

        /* Mobile Phones */
        @media (max-width: 600px) {
          .interface-rig { width: 92vw; }
          
          /* Scale down header */
          .header-deck { margin-bottom: 20px; font-size: 10px; }
          
          /* Scale down Reactor */
          .reactor-container { width: 100px; height: 100px; margin-bottom: 20px; }
          .core-hex { width: 30px; height: 30px; }

          /* Scale down Title */
          .cyber-title { font-size: 26px; letter-spacing: 3px; margin-bottom: 10px; }
          
          /* Compact Cards */
          .holo-card { padding: 10px; }
          .card-icon-box { width: 20px; margin-right: 8px; }
          .card-header { font-size: 11px; }
          .card-sub { font-size: 8px; }
        }

        /* Very Small Screens / Landscape Mobile (Height constrained) */
        @media (max-height: 750px) {
          .interface-rig { transform: scale(0.85); transform-origin: center center; }
          .reactor-container { margin-bottom: 15px; }
          .header-deck { margin-bottom: 15px; }
          .main-display { margin-bottom: 15px; }
        }
        
        /* Ultra Compact (iPhone SE, etc) */
        @media (max-width: 380px) {
           .cyber-title { font-size: 22px; letter-spacing: 2px; }
           .deck-item span { display: none; } /* Hide text, keep icon */
           .deck-item.left span { display: inline; } /* Keep left text */
        }
      `}</style>
    </div>
  );
};

export default BackendLoader;