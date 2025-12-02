import React, { useState, useEffect } from 'react';
import { 
  Map, Search, Navigation, Clock, MapPin, X, ChevronRight, 
  Building, LayoutGrid, List, Footprints, Compass, Star, 
  Share2, ArrowRight, ArrowLeft, ArrowUp, CornerUpRight, 
  CornerUpLeft, CheckCircle, RotateCcw 
} from 'lucide-react';

// --- HELPERS & CONSTANTS ---

const CATEGORIES = ["All", "Academic", "Admin", "Food", "Labs", "Hostel", "Sports"];

const LOCATIONS = [
  { id: 1, name: "Principal's Office", category: "Admin", floor: "Ground Floor", block: "Admin Block", opens: 9, closes: 16.5, steps: 120, route: "Main Entrance -> Go Straight -> Enter Admin Block -> Turn Left" },
  { id: 2, name: "Main Library", category: "Academic", floor: "1st Floor", block: "Library Block", opens: 8.5, closes: 20, steps: 250, route: "Main Entrance -> Pass Admin Block -> Turn Right -> Library Building -> 1st Floor" },
  { id: 3, name: "CSE HOD Cabin", category: "Academic", floor: "2nd Floor", block: "CSE Block", opens: 9, closes: 16, steps: 300, route: "Main Entrance -> Take Left Path -> Enter CSE Block -> Lift to 2nd Floor -> Right Wing" },
  { id: 4, name: "College Canteen", category: "Food", floor: "Ground Floor", block: "Canteen", opens: 7.5, closes: 18, steps: 400, route: "Main Entrance -> Pass Mechanical Block -> Follow Path Down -> Canteen Entrance" },
  { id: 5, name: "Placement Cell", category: "Admin", floor: "1st Floor", block: "Admin Block", opens: 9, closes: 17, steps: 150, route: "Admin Block Lobby -> Take Stairs to 1st Floor -> Conference Hall Side" },
  { id: 6, name: "Chemistry Lab", category: "Labs", floor: "Ground Floor", block: "Science Block", opens: 9, closes: 16.5, steps: 350, route: "Main Entrance -> Right Path -> Science Block -> Ground Floor -> End of Corridor" },
  { id: 7, name: "Sports Room", category: "Sports", floor: "Basement", block: "Auditorium", opens: 6, closes: 19, steps: 500, route: "Auditorium Complex -> Take Side Stairs Down -> Basement Level" },
  { id: 8, name: "Girls Hostel", category: "Hostel", floor: "-", block: "Residential Area", opens: 6, closes: 19, steps: 800, route: "North Gate -> Straight Road -> Past Garden Area -> Hostel Gate" },
];

const CAMPUS_BLOCKS = [
  { id: 'Admin Block', label: 'Admin Block', color: 'from-blue-500 to-indigo-600', icon: '🏛️', col: 'col-span-2 row-span-1' },
  { id: 'Library Block', label: 'Central Library', color: 'from-purple-500 to-fuchsia-600', icon: '📚', col: 'col-span-1 row-span-1' },
  { id: 'CSE Block', label: 'CSE Department', color: 'from-teal-400 to-emerald-600', icon: '💻', col: 'col-span-1 row-span-2' },
  { id: 'Science Block', label: 'Science Block', color: 'from-green-500 to-lime-600', icon: '🧪', col: 'col-span-1 row-span-1' },
  { id: 'ECE Block', label: 'ECE Department', color: 'from-indigo-500 to-violet-600', icon: '📡', col: 'col-span-1 row-span-1' },
  { id: 'Auditorium', label: 'Main Auditorium', color: 'from-orange-400 to-amber-600', icon: '🎭', col: 'col-span-2 row-span-1' },
  { id: 'Canteen', label: 'College Canteen', color: 'from-red-400 to-rose-600', icon: '🍔', col: 'col-span-1 row-span-1' },
  { id: 'Residential Area', label: 'Student Hostels', color: 'from-pink-500 to-rose-600', icon: '🏠', col: 'col-span-3 row-span-1' },
];

// --- INTERNAL COMPONENT: MODAL ---
const Modal = ({ isOpen, onClose, title, icon: Icon, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 shrink-0 bg-white/50 dark:bg-[#111]/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            {Icon && <div className="p-2.5 bg-[#00B291]/10 rounded-xl border border-[#00B291]/20"><Icon className="h-5 w-5 text-[#00B291]" /></div>}
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none">{title}</h2>
              <p className="text-xs text-gray-500 font-medium mt-1">RLJIT Campus Guide</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col relative bg-gray-50/50 dark:bg-[#0a0a0a]">
            {children}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const CampusMapModal = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('map'); 
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Navigation State
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('campus_favs');
    if (saved) setFavorites(JSON.parse(saved));
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Helper to parse route and get current direction icon
  const getRouteSteps = (route) => route ? route.split('->').map(s => s.trim()) : [];
  
  const getStepIcon = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('left')) return <CornerUpLeft className="h-10 w-10 text-white" />;
    if (lower.includes('right')) return <CornerUpRight className="h-10 w-10 text-white" />;
    if (lower.includes('straight') || lower.includes('pass') || lower.includes('go')) return <ArrowUp className="h-10 w-10 text-white" />;
    return <Navigation className="h-10 w-10 text-white" />;
  };

  const startNavigation = () => {
    setIsNavigating(true);
    setCurrentStep(0);
  };

  const endNavigation = () => {
    setIsNavigating(false);
    setCurrentStep(0);
  };

  const toggleFavorite = (id, e) => {
    e?.stopPropagation();
    const newFavs = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem('campus_favs', JSON.stringify(newFavs));
  };

  const getStatus = (open, close) => {
    const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;
    if (currentHour >= open && currentHour < close) {
      if (close - currentHour < 0.5) return 'closing_soon';
      return 'open';
    }
    return 'closed';
  };

  const filteredLocations = LOCATIONS.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(search.toLowerCase()) || loc.block.toLowerCase().includes(search.toLowerCase());
    const matchesBlock = selectedBlock ? loc.block === selectedBlock : true;
    const matchesCategory = activeCategory === 'All' ? true : loc.category === activeCategory;
    return matchesSearch && matchesBlock && matchesCategory;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isNavigating ? "Navigating..." : "Campus Navigator"} icon={isNavigating ? Navigation : Map}>
      
      {/* 1. HEADER CONTROLS (Hidden during navigation) */}
      {!isNavigating && (
        <div className="flex flex-col gap-3 p-4 bg-white dark:bg-[#111] border-b border-gray-100 dark:border-gray-800 shrink-0 shadow-sm z-10">
          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400 group-focus-within:text-[#00B291] transition-colors" />
              <input 
                type="text" 
                placeholder="Find rooms, labs, or blocks..." 
                value={search}
                onChange={(e) => { 
                  setSearch(e.target.value); 
                  if(e.target.value) setViewMode('list'); 
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] text-sm font-medium focus:ring-2 focus:ring-[#00B291]/50 outline-none transition-all"
              />
            </div>
            <div className="flex bg-gray-100 dark:bg-[#1a1a1a] p-1 rounded-xl shrink-0 border border-gray-200 dark:border-gray-700">
              <button onClick={() => setViewMode('map')} className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-white dark:bg-[#2a2a2a] shadow-sm text-[#00B291]' : 'text-gray-400'}`}>
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-[#2a2a2a] shadow-sm text-[#00B291]' : 'text-gray-400'}`}>
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setViewMode('list'); }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  activeCategory === cat 
                    ? 'bg-[#00B291] border-[#00B291] text-white shadow-lg shadow-[#00B291]/20' 
                    : 'bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#00B291]/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. MAIN CONTENT AREA */}
      <div className="relative h-[480px] bg-gray-50 dark:bg-[#0a0a0a]">
        
        {/* VIEW A: INTERACTIVE GRID MAP */}
        {!selectedLocation && viewMode === 'map' && (
            <div className="absolute inset-0 p-4 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-4 px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Campus Zones</h3>
                </div>
                <div className="grid grid-cols-3 gap-3 pb-10">
                    {CAMPUS_BLOCKS.map((block) => (
                        <button
                            key={block.id}
                            onClick={() => { setSelectedBlock(block.id); setViewMode('list'); }}
                            className={`${block.col} relative group overflow-hidden rounded-2xl bg-gradient-to-br ${block.color} p-4 shadow-sm hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex flex-col justify-between items-start text-white border border-white/10`}
                        >
                             <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                             <div className="absolute -bottom-4 -right-4 text-7xl opacity-20 rotate-12 group-hover:rotate-0 transition-transform select-none">{block.icon}</div>
                             <div className="bg-black/20 p-2 rounded-lg backdrop-blur-md border border-white/10 shadow-inner">
                                <span className="text-xl select-none">{block.icon}</span>
                            </div>
                            <div className="relative z-10 w-full mt-6">
                                <p className="font-bold text-sm text-left leading-tight drop-shadow-md">{block.label}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* VIEW B: LIST RESULTS */}
        {!selectedLocation && viewMode === 'list' && (
            <div className="absolute inset-0 flex flex-col animate-in fade-in duration-300 bg-gray-50 dark:bg-[#0a0a0a]">
                {selectedBlock && (
                    <div className="px-4 py-3 bg-white dark:bg-[#111] border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0 shadow-sm z-10">
                        <span className="text-xs font-bold text-[#00B291] flex items-center gap-2 bg-[#00B291]/10 px-3 py-1.5 rounded-lg border border-[#00B291]/20">
                            <Building className="h-3.5 w-3.5" /> Filtering: {selectedBlock}
                        </span>
                        <button onClick={() => { setSelectedBlock(null); setViewMode('map'); }} className="text-[11px] font-bold text-gray-500 hover:text-red-500 px-2 py-1 transition-colors flex items-center gap-1">
                            <X className="h-3 w-3" /> Clear
                        </button>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                    {filteredLocations.map((loc) => {
                        const status = getStatus(loc.opens, loc.closes);
                        const isFav = favorites.includes(loc.id);
                        return (
                            <div key={loc.id} onClick={() => setSelectedLocation(loc)} className="flex items-center justify-between p-4 bg-white dark:bg-[#151515] border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-[#00B291] dark:hover:border-[#00B291] hover:shadow-[0_4px_20px_-10px_rgba(0,178,145,0.3)] cursor-pointer transition-all duration-300 group relative">
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100 truncate">{loc.name}</h4>
                                      {isFav && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1"><Building className="h-3 w-3" /> {loc.block}</span>
                                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {loc.floor}</span>
                                    </div>
                                </div>
                                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status === 'open' ? 'bg-green-50 text-green-700 border-green-200' : status === 'closing_soon' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                    {status === 'open' ? 'Open' : status === 'closing_soon' ? 'Closing Soon' : 'Closed'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* --- VIEW C: DETAILS OVERLAY --- */}
        {selectedLocation && !isNavigating && (
            <div className="absolute inset-0 bg-white dark:bg-[#111] z-20 flex flex-col animate-in slide-in-from-bottom-5 duration-300">
                <div className="h-36 bg-gradient-to-br from-[#00B291] via-teal-700 to-emerald-900 shrink-0 relative overflow-hidden">
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                       <button onClick={() => toggleFavorite(selectedLocation.id)} className="p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all">
                          <Star className={`h-5 w-5 ${favorites.includes(selectedLocation.id) ? 'fill-white text-white' : ''}`} />
                       </button>
                       <button onClick={() => setSelectedLocation(null)} className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md transition-all">
                          <X className="h-5 w-5" />
                       </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                      <h2 className="text-2xl font-extrabold text-white leading-tight mb-1">{selectedLocation.name}</h2>
                      <div className="flex items-center gap-3 text-white/90 text-xs font-medium">
                        <span className="flex items-center gap-1"><Building className="h-3.5 w-3.5" /> {selectedLocation.block}</span>
                      </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div className="relative mb-6">
                        <div className="flex justify-between items-end mb-4">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                             <Compass className="h-4 w-4 text-[#00B291]" /> Wayfinding
                          </h3>
                        </div>
                        <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                            <div className="absolute left-[29px] top-6 bottom-6 w-0.5 bg-gray-100 dark:bg-gray-800"></div>
                            <div className="space-y-6 relative z-10">
                                {getRouteSteps(selectedLocation.route).map((step, idx, arr) => (
                                    <div key={idx} className="flex gap-4 group">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors z-10 ${idx === 0 ? 'bg-[#00B291] border-[#00B291] text-white' : idx === arr.length - 1 ? 'bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-black' : 'bg-white dark:bg-[#1a1a1a] border-gray-300 dark:border-gray-700'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${idx === 0 || idx === arr.length - 1 ? 'bg-current' : 'bg-gray-300'}`}></div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 pt-0.5">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={startNavigation} className="w-full py-4 rounded-xl bg-[#00B291] hover:bg-[#009b7d] text-white font-bold text-sm shadow-lg shadow-[#00B291]/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                       <Navigation className="h-4 w-4" /> Start Live Navigation
                    </button>
                </div>
            </div>
        )}

        {/* --- VIEW D: ACTIVE NAVIGATION OVERLAY --- */}
        {isNavigating && selectedLocation && (
          <div className="absolute inset-0 bg-[#00B291] z-30 flex flex-col animate-in fade-in duration-300 text-white">
            
            {/* Nav Header */}
            <div className="p-6 flex justify-between items-start shrink-0">
               <div>
                  <p className="text-[#005c4b] font-bold text-xs uppercase tracking-wider mb-1">Navigating to</p>
                  <h2 className="text-2xl font-extrabold leading-none">{selectedLocation.name}</h2>
               </div>
               <button onClick={endNavigation} className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors">
                 <X className="h-6 w-6" />
               </button>
            </div>

            {/* Nav Body */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                {/* Background Pulse Effect */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  <div className="w-64 h-64 rounded-full border-[20px] border-white animate-ping"></div>
                </div>

                {/* Big Direction Icon */}
                <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-8 shadow-2xl relative z-10 animate-bounce-slow">
                   {getStepIcon(getRouteSteps(selectedLocation.route)[currentStep])}
                </div>

                {/* Instruction Text */}
                <div className="relative z-10 animate-in slide-in-from-bottom-4 duration-500 key={currentStep}">
                  <h3 className="text-3xl font-black mb-4 leading-tight">
                    {getRouteSteps(selectedLocation.route)[currentStep]}
                  </h3>
                  <p className="text-white/80 font-medium text-lg">
                    Step {currentStep + 1} of {getRouteSteps(selectedLocation.route).length}
                  </p>
                </div>
            </div>

            {/* Nav Footer Controls */}
            <div className="p-6 bg-black/10 backdrop-blur-sm shrink-0">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-30 transition-all"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </button>
                  
                  {currentStep < getRouteSteps(selectedLocation.route).length - 1 ? (
                    <button 
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="flex-1 py-4 rounded-2xl bg-white text-[#00B291] font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      Next Step <ArrowRight className="h-5 w-5" />
                    </button>
                  ) : (
                     <button 
                      onClick={endNavigation}
                      className="flex-1 py-4 rounded-2xl bg-white text-[#00B291] font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="h-5 w-5" /> Arrived!
                    </button>
                  )}
               </div>
               {/* Progress Bar */}
               <div className="mt-6 h-1.5 bg-black/20 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-white transition-all duration-500 ease-out"
                   style={{ width: `${((currentStep + 1) / getRouteSteps(selectedLocation.route).length) * 100}%` }}
                 ></div>
               </div>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};

export default CampusMapModal;