// src/components/Sidebar.jsx
import React, { useState } from 'react';
import {
  Plus, Wrench, History, Compass, ChevronDown, ChevronRight,
  ExternalLink, Bell, Download, Mail, Search, MessageSquare,
  Trash2, Globe, X, Calculator, AlertTriangle, Map,
  User, Settings, Sparkles, Clock
} from 'lucide-react';
import { departments, updates } from '../data';

// --- HELPER COMPONENTS ---

const ToolCard = ({ icon: Icon, label, colorClass, bgClass, onClick }) => (
  <button 
    onClick={onClick} 
    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] hover:shadow-md hover:scale-[1.02] transition-all duration-300 group"
  >
    <div className={`p-2.5 rounded-xl ${bgClass} group-hover:scale-110 transition-transform duration-300`}>
      <Icon className={`h-5 w-5 ${colorClass}`} />
    </div>
    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
  </button>
);

const AccordionItem = ({ isOpen, title, icon: Icon, iconColor, children, onToggle }) => (
  <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#151515]/50 transition-colors">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3.5 text-left font-semibold text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors"
    >
      <div className="flex items-center gap-2.5">
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <span>{title}</span>
      </div>
      {isOpen ? <ChevronDown className="h-4 w-4 text-gray-400" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
    </button>
    
    <div className={`accordion ${isOpen ? 'accordion-open' : 'accordion-closed'} bg-white dark:bg-[#1a1a1a]`}>
      <div className="p-2 space-y-1">
        {children}
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

const Sidebar = ({
  isOpen,
  setIsOpen,
  handleNewChat,
  isTyping,
  sessions = [],
  currentSessionId,
  setCurrentSessionId,
  handleDeleteChat,
  setActiveModal,
  currentUser
}) => {
  const [sidebarMode, setSidebarMode] = useState('tools'); 
  const [expandedSidebarItem, setExpandedSidebarItem] = useState(null); 
  const [historySearch, setHistorySearch] = useState('');

  const toggleSidebarItem = (item) => {
    setExpandedSidebarItem(prev => (prev === item ? null : item));
  };

  const getFilteredSessions = () => {
    if (!historySearch.trim()) return sessions;
    return sessions.filter(session =>
      session.messages?.some(msg =>
        String(msg.text || '').toLowerCase().includes(historySearch.toLowerCase())
      )
    );
  };

  return (
    <>
      <style>{`
        .accordion { overflow: hidden; transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease; will-change: max-height, opacity; }
        .accordion-closed { max-height: 0; opacity: 0; }
        .accordion-open { max-height: 500px; opacity: 1; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
      `}</style>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed md:relative z-20 h-full bg-white dark:bg-[#1a1a1a] border-r border-gray-200 dark:border-gray-800
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col overflow-hidden
        ${isOpen ? 'w-80 translate-x-0 opacity-100 shadow-2xl md:shadow-none' : 'w-0 -translate-x-full opacity-0 md:translate-x-0 md:w-0 md:border-none'}
      `}>
        {/* UPDATED WRAPPER: 
            1. 'overflow-y-auto' enables scrolling for the WHOLE sidebar on mobile.
            2. 'md:overflow-hidden' disables whole-sidebar scrolling on desktop (so only content scrolls).
            3. 'custom-scrollbar' applied here for mobile view.
        */}
        <div className={`
          flex flex-col h-full w-80 transition-opacity duration-300 
          overflow-y-auto md:overflow-hidden custom-scrollbar
          ${isOpen ? 'opacity-100 delay-100' : 'opacity-0'}
        `}>

          {/* Header - UPDATED: Sticky top-0 so X button is always visible on mobile */}
          <div className="sticky top-0 z-50 h-20 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 shrink-0 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-none">
                Campus<span className="text-[#00B291] dark:text-[#00F5C8]">Mate</span>
              </h1>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your campus, simplified</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Profile Card */}
          <div className="px-5 pt-6 pb-0 shrink-0">
            <div 
              onClick={() => setActiveModal(currentUser ? 'profile' : 'settings')}
              className="relative overflow-hidden group w-full p-4 rounded-2xl bg-white dark:bg-[#202020] border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-[#00B291]/30 dark:hover:border-[#00F5C8]/30 hover:shadow-lg hover:shadow-[#00B291]/5 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#00B291]/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-tr from-[#00B291] to-[#00F5C8] p-[2px] shadow-sm group-hover:shadow-md transition-shadow">
                  <div className="h-full w-full rounded-full bg-white dark:bg-[#202020] flex items-center justify-center overflow-hidden">
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt="User" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[#00B291] dark:text-[#00F5C8] font-bold text-lg">
                        {currentUser ? currentUser.username.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                    {currentUser ? 'Welcome ' : 'Guest Mode'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate max-w-[120px]">
                      {currentUser ? currentUser.username : 'Student'}
                    </span>
                  </div>
                </div>
                
                <div className="ml-auto p-1.5 rounded-lg text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-[#333] group-hover:text-[#00B291] dark:group-hover:text-[#00F5C8] transition-all">
                   <Settings className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="px-5 pt-4 pb-2 shrink-0">
            <button
              onClick={handleNewChat}
              disabled={isTyping}
              className={`
                group w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300
                shadow-[0_4px_14px_0_rgba(0,178,145,0.39)] hover:shadow-[0_6px_20px_rgba(0,178,145,0.23)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95
                ${isTyping 
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500 shadow-none' 
                  : 'bg-gradient-to-r from-[#00B291] to-[#00D4B0] dark:from-[#00F5C8] dark:to-[#00B291] text-white dark:text-black'
                }
              `}
            >
              <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" /> 
              <span>NEW CHAT</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="px-5 py-2 flex gap-2 shrink-0">
            {['tools', 'history'].map((mode) => (
              <button 
                key={mode}
                onClick={() => setSidebarMode(mode)} 
                className={`flex-1 flex items-center justify-center gap-2 px-2 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 
                ${sidebarMode === mode 
                  ? 'bg-[#00B291]/10 text-[#00B291] dark:bg-[#00F5C8]/10 dark:text-[#00F5C8] ring-1 ring-[#00B291]/20' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#252525]'}`}
              >
                {mode === 'tools' ? <Wrench className="h-3.5 w-3.5" /> : <History className="h-3.5 w-3.5" />} 
                <span>{mode}</span>
              </button>
            ))}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent mx-5 shrink-0" />

          {/* Content Area - UPDATED: 
             1. Removed 'overflow-y-auto' from base class (so it doesn't trap scroll on mobile).
             2. Added 'md:overflow-y-auto' (re-enables internal scrolling ONLY on desktop).
             3. 'overflow-visible' allows content to expand naturally on mobile.
          */}
          <div className="flex-1 p-5 space-y-5 overflow-visible md:overflow-y-auto md:custom-scrollbar">
            {sidebarMode === 'tools' && (
              <div className="animate-fade-in space-y-5">

                {/* Explore */}
                <AccordionItem 
                  title="Campus Explore" 
                  icon={Compass} 
                  iconColor="text-[#00B291] dark:text-[#00F5C8]"
                  isOpen={expandedSidebarItem === 'explore'}
                  onToggle={() => toggleSidebarItem('explore')}
                >
                   {departments.map((dept) => (
                    <div key={dept.id} onClick={() => window.open(dept.link, '_blank')} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#252525] cursor-pointer group">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#00B291] dark:group-hover:text-[#00F5C8] transition-colors">{dept.name}</span>
                      </div>
                      <ExternalLink className="h-3 w-3 text-gray-300 group-hover:text-[#00B291] dark:group-hover:text-[#00F5C8] opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  ))}
                </AccordionItem>

                {/* Updates */}
                <AccordionItem 
                  title="Latest Updates" 
                  icon={Bell} 
                  iconColor="text-orange-500"
                  isOpen={expandedSidebarItem === 'updates'}
                  onToggle={() => toggleSidebarItem('updates')}
                >
                  {updates.map((update) => (
                    <div key={update.id} onClick={() => window.open(update.link, '_blank')} className="p-2.5 rounded-lg bg-gray-50 dark:bg-[#202020] hover:bg-orange-50 dark:hover:bg-orange-900/10 cursor-pointer border border-transparent hover:border-orange-100 dark:hover:border-orange-900/30 transition-all group">
                      <div className="flex justify-between items-start mb-1">
                         <span className="text-[10px] font-bold text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-1.5 py-0.5 rounded">NEW</span>
                         <span className="text-[10px] text-gray-400">{update.date}</span>
                      </div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 line-clamp-2">{update.title}</p>
                    </div>
                  ))}
                </AccordionItem>

                {/* 2-Column Tool Grid */}
                <div>
                   <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Quick Access</h3>
                   <div className="grid grid-cols-2 gap-3">
                      <ToolCard 
                        label="Notes" 
                        icon={Download} 
                        colorClass="text-[#00B291]" 
                        bgClass="bg-[#00B291]/10"
                        onClick={() => setActiveModal('notes')} 
                      />
                      <ToolCard 
                        label="Apply leave" 
                        icon={Mail} 
                        colorClass="text-blue-500" 
                        bgClass="bg-blue-50 dark:bg-blue-900/20"
                        onClick={() => setActiveModal('email')} 
                      />
                      <ToolCard 
                        label="CGPA Calc" 
                        icon={Calculator} 
                        colorClass="text-purple-500" 
                        bgClass="bg-purple-50 dark:bg-purple-900/20"
                        onClick={() => setActiveModal('gpa')} 
                      />
                      <ToolCard 
                        label="Navigate" 
                        icon={Map} 
                        colorClass="text-indigo-500" 
                        bgClass="bg-indigo-50 dark:bg-indigo-900/20"
                        onClick={() => setActiveModal('map')} 
                      />
                      <ToolCard 
                        label="Complaints" 
                        icon={AlertTriangle} 
                        colorClass="text-orange-500" 
                        bgClass="bg-orange-50 dark:bg-orange-900/20"
                        onClick={() => setActiveModal('complaint')} 
                      />
                      <ToolCard 
                        label="Lost & Found" 
                        icon={Search} 
                        colorClass="text-red-500" 
                        bgClass="bg-red-50 dark:bg-red-900/20"
                        onClick={() => setActiveModal('lostfound')} 
                      />
                   </div>
                </div>

                {/* Semester Progress */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white dark:from-[#202020] dark:to-[#151515] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Semester Status</span>
                    <span className="text-xs font-bold text-[#00B291] dark:text-[#00F5C8]">92%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00B291] to-[#00F5C8] w-[92%] rounded-full shadow-[0_0_10px_rgba(0,178,145,0.5)]"></div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Finals approaching in <b className="text-gray-800 dark:text-gray-200">3 weeks</b></span>
                  </div>
                </div>

                {/* Daily Insight */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/10 border border-amber-100 dark:border-amber-900/30 relative overflow-hidden group">
                   <div className="absolute -top-2 -right-2 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Clock className="h-20 w-20 text-yellow-500"/></div>
                   <div className="flex items-center gap-2 mb-2 relative z-10">
                      <div className="p-1 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                        <Sparkles className="h-3 w-3 fill-current" />
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider">Daily Tip</span>
                   </div>
                   <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed relative z-10">
                     "The central library has extended hours this week. Great for group studies!"
                   </p>
                </div>

              </div>
            )}

            {sidebarMode === 'history' && (
              <div className="animate-fade-in space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input type="text" placeholder="Search chats..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#202020] text-xs focus:outline-none focus:ring-2 focus:ring-[#00B291]/20 dark:focus:ring-[#00F5C8]/20 focus:border-[#00B291] dark:focus:border-[#00F5C8] text-gray-800 dark:text-gray-200 transition-all placeholder:text-gray-400" />
                </div>

                {getFilteredSessions().length === 0 ? (
                  <div className="text-center py-10 opacity-50">
                    <History className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-xs text-gray-500">No history found</p>
                  </div>
                ) : (
                  getFilteredSessions().map((session) => (
                    <div
                      key={session.id}
                      onClick={() => { setCurrentSessionId(session.id); if (window.innerWidth < 768) setIsOpen(false); }}
                      className={`group relative flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all border ${
                        currentSessionId === session.id 
                        ? 'bg-[#00B291]/5 border-[#00B291]/20 dark:bg-[#00F5C8]/5 dark:border-[#00F5C8]/20' 
                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-[#202020]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 overflow-hidden">
                        <div className={`p-2 rounded-lg ${currentSessionId === session.id ? 'bg-[#00B291]/10 text-[#00B291] dark:bg-[#00F5C8]/10 dark:text-[#00F5C8]' : 'bg-gray-100 dark:bg-[#252525] text-gray-400'}`}>
                           <MessageSquare className="h-4 w-4 shrink-0" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className={`text-xs font-semibold truncate w-32 md:w-36 ${currentSessionId === session.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                            {session.messages && session.messages.length > 0 ? session.messages[0].text : 'Empty Chat'}
                          </span>
                          <span className="text-[10px] text-gray-400">{new Date(session.id).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteChat(e, session.id); }}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        title="Delete Chat"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      
                      {currentSessionId === session.id && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-[#00B291] dark:bg-[#00F5C8] rounded-r-full"></div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer - No changes needed, it flows naturally on mobile now */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1a1a1a]/50 shrink-0 backdrop-blur-sm">
            <a href="https://rljit.in/" target="_blank" rel="noreferrer noopener" className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-gray-500 hover:text-[#00B291] dark:hover:text-[#00F5C8] dark:text-gray-400 transition-colors group rounded-lg hover:bg-white dark:hover:bg-[#202020]">
              <Globe className="h-3.5 w-3.5 group-hover:animate-spin-slow" /> 
              <span>Visit RLJIT Website</span> 
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-1 group-hover:ml-0" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;