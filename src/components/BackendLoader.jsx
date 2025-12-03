import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react'; // Assuming you have lucide-react installed

const BackendLoader = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState("Connecting to server...");

  useEffect(() => {
    const checkServer = async () => {
      try {
        // We ping the lostfound endpoint because it connects Node -> Python -> Database
        // This forces ALL services to wake up.
        setStatus("Waking up Campus Mate (This can take 50s)");
        
        const response = await fetch('https://campus-bot-node.onrender.com/api/lostfound');
        
        if (response.ok) {
          setStatus("Connected! Launching...");
          setTimeout(() => setIsReady(true), 1000); // Small delay for smooth transition
        } else {
          // If 502 or error, try again in 3 seconds
          setTimeout(checkServer, 3000);
        }
      } catch (error) {
        // Network error, try again
        setTimeout(checkServer, 3000);
      }
    };

    checkServer();
  }, []);

  if (isReady) {
    return <>{children}</>;
  }

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#0f0f0f', // Match your dark theme
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      zIndex: 9999,
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Loader2 className="animate-spin" size={64} color="#00d2ff" style={{ animation: 'spin 2s linear infinite' }} />
      </div>
      
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>CampusMate</h2>
      <p style={{ color: '#888', fontSize: '16px' }}>{status}</p>

      {/* CSS Animation for the spinner */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BackendLoader;