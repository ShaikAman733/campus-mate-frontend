import React, { useState, useEffect, useCallback } from 'react';
import { 
  Menu, Moon, Sun, LogIn, LogOut, User, 
  ChevronDown, Settings, HelpCircle, UserCircle,
  Loader2, WifiOff, Zap
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

// Data & Components (Assumed external imports)
import { faqs } from './data';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';

// Modals
import NotesModal from './components/NotesModal';
import EmailModal from './components/EmailModal';
import ComplaintDeskModal from './components/ComplaintDeskModal';
import GPACalculatorModal from './components/GPACalculatorModal';
import LostFoundModal from './components/LostFoundModal';
import CampusMapModal from './components/CampusMapModal';
import AuthModal from './components/AuthsModal'; 
import ProfileModal from './components/ProfileModal';
import SettingsModal from './components/SettingsModal';
import HelpSupportModal from './components/HelpSupportModal';

// Constants
const API_URL = import.meta.env.VITE_API_URL || 'https://campus-bot-node.onrender.com';

const customStyles = `
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 10px; transition: all 0.2s ease; }
  ::-webkit-scrollbar-thumb:hover { background: #00B291; }
  .dark ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }
  .dark ::-webkit-scrollbar-thumb:hover { background: #00F5C8; }
  
  @keyframes slideUp { 0% { transform: translateY(10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
  .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
  
  @keyframes scaleIn { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  .animate-scale-in { animation: scaleIn 0.15s ease-out forwards; }
  
  .bg-grid-pattern { background-image: radial-gradient(rgba(0, 178, 145, 0.07) 1px, transparent 1px); background-size: 32px 32px; }
  .dark .bg-grid-pattern { background-image: radial-gradient(rgba(0, 245, 200, 0.03) 1px, transparent 1px); }

  
`;

const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('campusMateUser');
    if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
    } else {
        setIsAuthModalOpen(true);
    }
  }, []);

  const login = useCallback((userData) => {
    if (!userData) return;
    setCurrentUser(prev => {
        const updated = { ...prev, ...userData };
        localStorage.setItem('campusMateUser', JSON.stringify(updated));
        return updated;
    });
    setIsAuthModalOpen(false);
    setTimeout(() => {
      toast.success(`Welcome, ${userData.username || 'Student'}!`, {
        icon: '👋',
        style: { borderRadius: '12px', background: '#333', color: '#fff' },
      });
    }, 100);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('campusMateUser');
    toast.success('Logged out successfully');
    setIsAuthModalOpen(true);
  }, []);

  return { currentUser, isAuthModalOpen, setIsAuthModalOpen, login, logout };
};

const useChat = (currentUser, isBackendReady) => {
  const [defaultId] = useState(Date.now()); 
  const [sessions, setSessions] = useState([{ id: defaultId, messages: [] }]);
  const [currentSessionId, setCurrentSessionId] = useState(defaultId);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      if (currentUser && currentUser._id) {
        try {
          const res = await fetch(`${API_URL}/api/history/${currentUser._id}`);
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSessions(data);
            setCurrentSessionId(data[0].id);
          }
        } catch (err) { loadFromLocalStorage(); }
      } else { loadFromLocalStorage(); }
    };
    const loadFromLocalStorage = () => {
      const saved = localStorage.getItem('chatSessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setSessions(parsed);
          setCurrentSessionId(parsed[0].id);
        }
      }
    };
    loadHistory();
  }, [currentUser]);

  const saveSessions = useCallback(async (updatedSessions) => {
    setSessions(updatedSessions);
    if (currentUser) {
      try {
        await fetch(`${API_URL}/api/save-chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUser._id, sessions: updatedSessions }),
        });
      } catch (err) { console.error("Save error", err); }
    } else {
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
    }
  }, [currentUser]);

  const streamResponse = async (fullText, sessionId, currentSessions) => {
    setIsTyping(true);
    let currentText = "";
    const chunkSize = 2; 
    let activeSessions = currentSessions.map(s => 
      s.id === sessionId ? { ...s, messages: [...s.messages, { type: 'bot', text: '', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }] } : s
    );
    setSessions(activeSessions);

    for (let i = 0; i < fullText.length; i += chunkSize) {
      currentText += fullText.slice(i, i + chunkSize);
      setSessions(prev => prev.map(s => {
        if (s.id === sessionId) {
          const msgs = [...s.messages];
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg.type === 'bot') {
            msgs[msgs.length - 1] = { ...lastMsg, text: currentText };
          }
          return { ...s, messages: msgs };
        }
        return s;
      }));
      await new Promise(r => setTimeout(r, 10)); 
    }
    setIsTyping(false);
    const finalSessions = activeSessions.map(s => {
      if (s.id === sessionId) {
        const msgs = [...s.messages];
        msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], text: fullText };
        return { ...s, messages: msgs };
      }
      return s;
    });
    saveSessions(finalSessions);
  };

  const sendMessage = async (text, file) => {
    if (!isBackendReady || (!text?.trim() && !file) || isTyping) return;
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let activeSessionId = currentSessionId;
    const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
    if (!currentSession) return;

    const chatHistory = (currentSession.messages || []).map(msg => ({
      role: msg.type === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text || "" }]
    }));

    const userMessage = { 
      type: 'user', 
      text: text, 
      time: timestamp,
      file: file ? { name: file.name, type: file.type } : null 
    };

    const updatedWithUser = sessions.map(s => 
      s.id === activeSessionId ? { ...s, messages: [...s.messages, userMessage] } : s
    );
    
    setSessions(updatedWithUser);
    setIsLoading(true);

    try {
      let payload = { message: text || "", history: chatHistory, userName: currentUser?.username || 'Student' };
      if (file) {
        const base64Data = await convertFileToBase64(file);
        payload.file = { name: file.name, mime_type: file.type, data: base64Data };
      }

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);
      const data = await response.json();
      setIsLoading(false);

      if (data.response) {
        if (currentUser && currentUser._id) {
          fetch(`${API_URL}/api/history/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser._id, userMessage: text || "Sent a file", botResponse: data.response })
          }).catch(err => console.error("MongoDB Sync Error:", err));
        }
        await streamResponse(data.response, activeSessionId, updatedWithUser);
      }
    } catch (error) {
      setIsLoading(false);
      await streamResponse("⚠️ I'm having trouble connecting to the server. Please try again.", activeSessionId, updatedWithUser);
    }
  };

  return { 
    sessions, setSessions, currentSessionId, setCurrentSessionId, 
    isLoading, isTyping, sendMessage, 
    createNewChat: () => {
      const newSession = { id: Date.now(), messages: [] };
      saveSessions([newSession, ...sessions]);
      setCurrentSessionId(newSession.id);
    }, 
    deleteChat: (e, id) => {
      e.stopPropagation();
      if (isTyping) return;
      const updated = sessions.filter(s => s.id !== id);
      const finalSessions = updated.length ? updated : [{ id: Date.now(), messages: [] }];
      setSessions(finalSessions);
      if (currentSessionId === id) setCurrentSessionId(finalSessions[0].id);
      saveSessions(finalSessions);
      toast.success('Chat deleted');
    }
  };
};

const UserAvatar = ({ user, className = "h-8 w-8", textClass="text-sm" }) => {
    if (!user) return <div className={`${className} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}><User className="h-1/2 w-1/2 text-gray-400" /></div>;
    if (user.avatar) return <img src={user.avatar} alt={user.username} className={`${className} rounded-full object-cover ring-2 ring-white dark:ring-[#1a1a1a] shadow-sm`} />;
    return (
      <div className={`${className} rounded-full bg-gradient-to-br from-[#00B291] to-[#00F5C8] flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white dark:ring-[#1a1a1a] ${textClass}`}>
        {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
      </div>
    );
};

const App = () => {
  const [isBackendReady, setIsBackendReady] = useState(false);

  const { currentUser, isAuthModalOpen, setIsAuthModalOpen, login, logout: authLogout } = useAuth();
  const { 
    sessions, setSessions, currentSessionId, setCurrentSessionId, 
    isLoading, isTyping, sendMessage, createNewChat, deleteChat 
  } = useChat(currentUser, isBackendReady);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('campusMateDarkMode');
    return savedMode !== null ? JSON.parse(savedMode) : true;
  });

  useEffect(() => {
    localStorage.setItem('campusMateDarkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [currentFaqIndex, setCurrentFaqIndex] = useState(0);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      try {
        fetch('https://campus-bot-python.onrender.com/', { mode: 'no-cors' }).catch(() => {});
        const res = await fetch(`${API_URL}/api/lostfound?t=${Date.now()}`);
        if (res.ok) {
          setIsBackendReady(true);
          toast.success("Connection Secured. All systems online.", { id: 'backend-ready' });
        } else {
          setTimeout(checkServer, 3000);
        }
      } catch (err) {
        setTimeout(checkServer, 4000);
      }
    };
    checkServer();
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    authLogout();
    const newId = Date.now();
    setSessions([{ id: newId, messages: [] }]);
    setCurrentSessionId(newId);
  };

  const handleNewChatWrapper = () => {
    createNewChat();
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (inputMessage.length > 0) return;
    const interval = setInterval(() => {
      setCurrentFaqIndex((prev) => (prev + 1) % faqs.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [inputMessage]);

  const handleSendWrapper = (text, file) => {
    sendMessage(text || inputMessage, file);
    setInputMessage('');
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendWrapper(inputMessage, null);
    }
  };

  const getCurrentMessages = useCallback(() => {
    return sessions.find(s => s.id === currentSessionId)?.messages || [];
  }, [sessions, currentSessionId]);

  const handleClearAllHistory = () => {
    const newId = Date.now();
    setSessions([{ id: newId, messages: [] }]);
    setCurrentSessionId(newId);
    localStorage.removeItem('chatSessions');
    toast.success("Chat history cleared");
  };

  const renderModal = () => {
    const commonProps = { onClose: () => setActiveModal(null) };
    const modals = {
      notes: <NotesModal isOpen={true} {...commonProps} />,
      email: <EmailModal isOpen={true} {...commonProps} />,
      gpa: <GPACalculatorModal isOpen={true} {...commonProps} />,
      complaint: <ComplaintDeskModal isOpen={true} {...commonProps} />,
      lostfound: <LostFoundModal isOpen={true} {...commonProps} />,
      map: <CampusMapModal isOpen={true} {...commonProps} />,
      profile: <ProfileModal isOpen={true} {...commonProps} currentUser={currentUser} onUpdateUser={login} />,
      settings: <SettingsModal isOpen={true} {...commonProps} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onClearHistory={handleClearAllHistory} />,
      help: <HelpSupportModal isOpen={true} {...commonProps} faqs={faqs} />
    };
    return modals[activeModal] || null;
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-screen w-full flex overflow-hidden font-sans bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100`}>
      <style>{customStyles}</style>
      
      <Toaster 
        position="top-center" 
        containerStyle={{ zIndex: 99999 }}
        toastOptions={{ 
          duration: 3000, 
          style: { background: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' } 
        }} 
      />

      {/* Sidebar Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)} 
      />
      
      {isProfileMenuOpen && <div className="fixed inset-0 z-20 bg-transparent cursor-default" onClick={() => setIsProfileMenuOpen(false)} />}

      <div className={`h-full z-50 transition-all duration-300 ${isSidebarOpen ? 'relative' : ''}`}>
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          handleNewChat={handleNewChatWrapper} 
          isTyping={isTyping}
          sessions={sessions}
          currentSessionId={currentSessionId}
          setCurrentSessionId={setCurrentSessionId}
          handleDeleteChat={deleteChat}
          setActiveModal={setActiveModal}
          currentUser={currentUser}
        />
      </div>

      {/* Padding-top removed from main since banner is gone */}
      <main className="flex-1 flex flex-col h-full relative bg-white dark:bg-[#0a0a0a] bg-grid-pattern transition-all duration-500">
        
        <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-800/60 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors active:scale-95"
            >
              <Menu className="h-5 w-5" />
            </button>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
                Campus<span className="text-[#00B291] dark:text-[#00F5C8]">Mate</span>
              </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {!isBackendReady && (
  <div className="hidden sm:flex px-3 py-1 rounded-full text-[10px] font-medium tracking-wide border bg-amber-500/10 border-amber-500/20 text-amber-500 animate-fade-in">
    
    Backend warming up (Render free tier, ~50 seconds )

  </div>
)}

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

            {currentUser ? (
              <div className="relative z-30">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                  className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all duration-200 ${isProfileMenuOpen ? 'bg-[#00B291]/10 border-[#00B291] dark:border-[#00F5C8] shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'}`}
                >
                  <UserAvatar user={currentUser} className="h-8 w-8" textClass="text-xs" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[100px] truncate hidden md:block">{currentUser.username}</span>
                  <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180 text-[#00B291]' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#151515] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in origin-top-right cursor-default ring-1 ring-black/5">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 flex items-center gap-3">
                      <UserAvatar user={currentUser} className="h-10 w-10" textClass="text-lg" />
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{currentUser.username}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email || 'Your Account'}</p>
                      </div>
                    </div>
                    <div className="p-2 space-y-1">
                      <button onClick={() => { setActiveModal('profile'); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#202020] rounded-xl transition-colors text-left"><div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"><UserCircle className="h-4 w-4" /></div>My Profile</button>
                      <button onClick={() => { setActiveModal('settings'); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#202020] rounded-xl transition-colors text-left"><div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"><Settings className="h-4 w-4" /></div>Settings</button>
                      <button onClick={() => { setActiveModal('help'); setIsProfileMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#202020] rounded-xl transition-colors text-left"><div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"><HelpCircle className="h-4 w-4" /></div>Help & Support</button>
                    </div>
                    <div className="p-2 border-t border-gray-100 dark:border-gray-800">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors text-left"><div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-500"><LogOut className="h-4 w-4" /></div>Log Out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#00B291] to-[#00F5C8] text-white hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-[#00B291]/20 text-sm font-bold active:scale-95">
                <LogIn className="h-4 w-4" /><span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </header>

        <ChatArea messages={getCurrentMessages()} isLoading={isLoading} suggestionText={faqs[currentFaqIndex]} currentUser={currentUser} />
        
        {/* KEPT: Your marked 'Waiting for backend handshake' status indicator */}
        <div className="relative">
            {!isBackendReady && (
                <div className="absolute inset-x-0 -top-10 flex justify-center pointer-events-none">
                    <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800/50 backdrop-blur-sm font-bold shadow-sm">
                         Establishing backend connection… ~50 seconds 
                    </span>
                </div>
            )}
            <ChatInput 
                inputMessage={inputMessage} 
                setInputMessage={setInputMessage} 
                handleSendMessage={handleSendWrapper} 
                handleKeyPress={handleKeyPress} 
                isLoading={isLoading || !isBackendReady} 
                isTyping={isTyping} 
                placeholder={isBackendReady ? "Ask CampusMate..." : "Connecting to server engines..."}
            />
        </div>
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => { if (currentUser) setIsAuthModalOpen(false); }} 
        onLogin={login} 
        canClose={!!currentUser}
      />
      <div className="relative z-50">{renderModal()}</div>
    </div>
  );
};

export default App;