// src/components/SettingsModal.jsx
import React, { useState } from 'react';
import { 
  X, Moon, Sun, Bell, Trash2, Globe, 
  ChevronRight, Smartphone, 
  Check, Volume2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// --- 1. Modern iOS-Style Switch ---
const Switch = ({ checked, onChange }) => (
  <button 
    onClick={onChange}
    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#00B291]/30 ${
      checked ? 'bg-[#00B291]' : 'bg-gray-200 dark:bg-gray-700'
    }`}
  >
    <div 
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-spring ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} 
    />
  </button>
);

// --- 2. Theme Selection Card ---
const ThemeOption = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
      active 
        ? 'border-[#00B291] bg-[#00B291]/5 dark:bg-[#00B291]/10' 
        : 'border-transparent bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-gray-800'
    }`}
  >
    <div className={`p-2 rounded-full ${
      active ? 'bg-[#00B291] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
    }`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-sm font-semibold ${active ? 'text-[#00B291]' : 'text-gray-600 dark:text-gray-400'}`}>
        {label}
      </span>
      {active && <Check className="h-3 w-3 text-[#00B291]" />}
    </div>
  </button>
);

// --- 3. Settings Row Component ---
const SettingRow = ({ icon: Icon, colorClass, bgClass, title, subtitle, action, onClick, isDestructive }) => (
  <div 
    onClick={onClick}
    className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
      onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.98]' : ''
    } ${isDestructive ? 'hover:bg-red-50 dark:hover:bg-red-900/10' : ''}`}
  >
    <div className="flex items-center gap-4">
      {/* Icon Container */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
        isDestructive 
          ? 'bg-red-100 dark:bg-red-900/20 text-red-500' 
          : `${bgClass} ${colorClass}`
      }`}>
        <Icon className="h-5 w-5" />
      </div>
      
      {/* Text Info */}
      <div className="flex flex-col">
        <span className={`text-sm font-semibold ${
          isDestructive ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
        }`}>
          {title}
        </span>
        {subtitle && (
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {subtitle}
          </span>
        )}
      </div>
    </div>

    {/* Action Area */}
    <div className="flex items-center gap-2">
      {action}
      {onClick && !action && (
        <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
      )}
    </div>
  </div>
);

const SettingsModal = ({ isOpen, onClose, isDarkMode, setIsDarkMode, onClearHistory }) => {
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(false);

  if (!isOpen) return null;

  const handleClearHistory = () => {
    if (window.confirm("Are you sure? This will permanently delete your chat history.")) {
      onClearHistory();
      toast.success("History cleared");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity animate-fade-in" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white dark:bg-[#121212] w-full max-w-md rounded-[2rem] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-scale-in flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Customize your experience</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* 1. Appearance Section (Visual Cards) */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Appearance</h3>
            <div className="flex gap-4">
              <ThemeOption 
                label="Light" 
                icon={Sun} 
                active={!isDarkMode} 
                onClick={() => setIsDarkMode(false)} 
              />
              <ThemeOption 
                label="Dark" 
                icon={Moon} 
                active={isDarkMode} 
                onClick={() => setIsDarkMode(true)} 
              />
            </div>
          </section>

          {/* 2. Preferences Section */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Preferences</h3>
            <div className="flex flex-col gap-1">
              <SettingRow 
                icon={Bell}
                bgClass="bg-purple-100 dark:bg-purple-900/20"
                colorClass="text-purple-600 dark:text-purple-400"
                title="Push Notifications"
                subtitle="Receive updates about campus events"
                action={<Switch checked={notifications} onChange={() => setNotifications(!notifications)} />}
              />
              <SettingRow 
                icon={Volume2}
                bgClass="bg-blue-100 dark:bg-blue-900/20"
                colorClass="text-blue-600 dark:text-blue-400"
                title="Sound Effects"
                subtitle="Play sounds for messages"
                action={<Switch checked={sound} onChange={() => setSound(!sound)} />}
              />
              <SettingRow 
                icon={Globe}
                bgClass="bg-cyan-100 dark:bg-cyan-900/20"
                colorClass="text-cyan-600 dark:text-cyan-400"
                title="Language"
                subtitle="English (Default)"
                onClick={() => toast('Language selection coming soon!')}
              />
            </div>
          </section>

          {/* 3. Data Zone (Destructive Actions) */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-red-400/80 uppercase tracking-widest ml-1">Data Zone</h3>
            <div className="border border-red-100 dark:border-red-900/30 rounded-2xl overflow-hidden">
              <SettingRow 
                icon={Trash2}
                isDestructive
                title="Clear Chat History"
                subtitle="This action cannot be undone"
                onClick={handleClearHistory}
              />
            </div>
          </section>

        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-50 dark:bg-[#0f0f0f] border-t border-gray-100 dark:border-gray-800 text-center">
           <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Smartphone className="h-3 w-3" />
              <span>Campus Mate v1.2.0 (Build 2026)</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;