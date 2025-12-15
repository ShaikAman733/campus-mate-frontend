import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Server, Wifi, Clock, AlertCircle } from 'lucide-react';

const ServerWakeupLoader = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('initiating'); // initiating, waking, ready
  const [secondsWaited, setSecondsWaited] = useState(0);
  const scrollRef = useRef(null);
  const logIdRef = useRef(0); // Fix for unique keys

  // Helper to add logs with timestamps
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    // Increment the counter to guarantee unique IDs even if logs happen in the same millisecond
    logIdRef.current += 1;
    setLogs(prev => [...prev, { id: logIdRef.current, time: timestamp, message, type }]);
  };

  useEffect(() => {
    // Auto-scroll logs
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    let timerInterval;
    
    // Initial Sequence
    addLog("Initializing Campus Mate client...", "info");
    setTimeout(() => addLog("Checking server status...", "info"), 800);

    const checkServer = async () => {
      try {
        // 1. Trigger Python Server (Fire & Forget)
        // We use no-cors because we just want to trigger the boot-up process without waiting for a valid CORS response
        fetch('https://campus-bot-python.onrender.com/', { mode: 'no-cors' })
          .catch(() => {}); 

        // 2. Check Node Server (The Gateway)
        // We add a timestamp (?t=...) to prevent the browser from caching a 503 response
        const start = Date.now();
        const response = await fetch(`https://campus-bot-node.onrender.com/api/lostfound?t=${start}`);
        
        if (response.ok) {
          clearInterval(timerInterval);
          setStatus('ready');
          addLog("Connection established successfully.", "success");
          addLog("Loading application interface...", "success");
          setTimeout(() => setIsReady(true), 1500);
        } else {
          throw new Error("Server warming up");
        }
      } catch (error) {
        if (status !== 'waking') {
            setStatus('waking');
            // These two logs happen in the same millisecond, causing the key conflict previously
            addLog("Free-tier instance detected (Cold Start).", "warning");
            addLog("Waking up Render dynos... (This usually takes 30-50s)", "warning");
        }
        // Retry logic: Wait 4 seconds before trying again to avoid flooding
        setTimeout(checkServer, 4000);
      }
    };

    // Start the timer to show users this is expected behavior
    timerInterval = setInterval(() => {
      setSecondsWaited(prev => prev + 1);
    }, 1000);

    // Initial delay before first check
    setTimeout(checkServer, 1500);

    return () => clearInterval(timerInterval);
  }, []);

  if (isReady) return <>{children}</>;

  return (
    <div className="vercel-loader">
      <div className="card">
        {/* Header */}
        <div className="header">
          <div className="project-info">
            <span className="project-name">Campus Mate</span>
          </div>
          <div className={`status-pill ${status}`}>
            <div className="dot"></div>
            {status === 'initiating' && 'CONNECTING'}
            {status === 'waking' && 'BOOTING SERVER'}
            {status === 'ready' && 'ONLINE'}
          </div>
        </div>

        {/* Status Graphic */}
        <div className="graphic-area">
            <div className="server-icon-wrapper">
                <Server size={32} className={status === 'waking' ? 'pulse-icon' : ''} />
                <div className="connection-line"></div>
                <div className={`signal ${status === 'ready' ? 'success' : 'waiting'}`}>
                    <Wifi size={20} />
                </div>
            </div>
            <div className="wait-timer">
                <Clock size={14} />
                <span>{secondsWaited}s elapsed</span>
            </div>
        </div>

        {/* Explanation for Recruiter */}
        <div className="info-box">
            <AlertCircle size={16} className="info-icon"/>
            <p>
                This project is hosted on <strong>Render Free Tier</strong>. 
                If the server was inactive, it may take up to <strong>50 seconds</strong> to cold-start. 
                Please do not close the tab.
            </p>
        </div>

        {/* Terminal Logs */}
        <div className="terminal" ref={scrollRef}>
          <div className="terminal-header">
            <Terminal size={12} />
            <span>System Logs</span>
          </div>
          <div className="terminal-content">
            {logs.map((log) => (
              <div key={log.id} className={`log-line ${log.type}`}>
                <span className="timestamp">[{log.time}]</span>
                <span className="message">
                  {log.type === 'success' && '✓ '}
                  {log.type === 'warning' && '⚠ '}
                  {log.message}
                </span>
              </div>
            ))}
            {status === 'waking' && (
               <div className="log-line typing">
                 <span className="timestamp">...</span>
                 <span className="message">Waiting for server handshake...</span>
               </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .vercel-loader {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
          background: #000; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          z-index: 9999;
        }
        .card {
          width: 90%; max-width: 450px;
          background: #111;
          border: 1px solid #333;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        /* Header */
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .project-name { font-weight: 700; font-size: 18px; letter-spacing: -0.5px; }
        .badge { background: #333; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 8px; color: #888; }
        
        .status-pill { 
            display: flex; align-items: center; gap: 6px; 
            font-size: 11px; font-weight: 600; 
            padding: 4px 10px; border-radius: 20px;
            border: 1px solid;
        }
        .status-pill.initiating { background: #000; border-color: #333; color: #888; }
        .status-pill.waking { background: rgba(245, 166, 35, 0.1); border-color: #f5a623; color: #f5a623; }
        .status-pill.ready { background: rgba(80, 227, 194, 0.1); border-color: #50e3c2; color: #50e3c2; }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
        .status-pill.waking .dot { animation: blink 1s infinite; }

        /* Graphic */
        .graphic-area { display: flex; flex-direction: column; align-items: center; margin-bottom: 24px; gap: 15px; }
        .server-icon-wrapper { display: flex; align-items: center; gap: 10px; color: #666; }
        .pulse-icon { color: #f5a623; animation: pulse 2s infinite; }
        .connection-line { width: 60px; height: 1px; background: #333; position: relative; }
        .connection-line::after {
            content: ''; position: absolute; top: -1px; left: 0; width: 20px; height: 3px; 
            background: #f5a623; opacity: 0;
            animation: transmit 1.5s infinite linear;
        }
        .wait-timer { font-size: 12px; color: #444; display: flex; align-items: center; gap: 6px; font-family: monospace; }

        /* Info Box */
        .info-box {
            background: rgba(51, 51, 51, 0.3);
            border: 1px solid #333;
            border-radius: 6px;
            padding: 12px;
            display: flex; gap: 10px;
            margin-bottom: 20px;
        }
        .info-icon { min-width: 16px; color: #888; margin-top: 2px; }
        .info-box p { margin: 0; font-size: 13px; color: #999; line-height: 1.5; }
        .info-box strong { color: #ccc; font-weight: 500; }

        /* Terminal */
        .terminal { background: #000; border: 1px solid #333; border-radius: 6px; height: 160px; display: flex; flex-direction: column; overflow: hidden; }
        .terminal-header { 
            background: #111; padding: 8px 12px; border-bottom: 1px solid #333; 
            display: flex; align-items: center; gap: 8px; font-size: 12px; color: #666; 
        }
        .terminal-content { padding: 12px; font-family: 'SF Mono', 'Monaco', 'Courier New', monospace; font-size: 11px; overflow-y: auto; flex: 1; }
        .log-line { margin-bottom: 6px; display: flex; gap: 8px; }
        .timestamp { color: #444; min-width: 70px; }
        .message { color: #ccc; }
        .log-line.warning .message { color: #f5a623; }
        .log-line.success .message { color: #50e3c2; }
        .log-line.typing { opacity: 0.5; }

        /* Animations */
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.8; transform: scale(0.95); } }
        @keyframes transmit { 0% { left: 0; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
        
        .vercel-loader::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ServerWakeupLoader;