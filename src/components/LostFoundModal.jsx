import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Image as ImageIcon, X, CheckCircle, Clock, Trash2, Loader2, AlertCircle, PlusCircle } from 'lucide-react';
import Modal from './Modal';

const LostFoundModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [type, setType] = useState('lost');
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    item: '', location: '', description: '', contact: '', image: null
  });

  const fileInputRef = useRef(null);

  // --- 1. SMART IMAGE COMPRESSION ---
  const handleImageResize = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800; // Standardize width for faster loading
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Export as compressed JPEG
        const base64 = canvas.toDataURL('image/jpeg', 0.7); 
        setFormData(prev => ({ ...prev, image: base64 }));
        setImagePreview(base64);
      };
    };
  };

  // --- 2. FETCH DATA ---
  useEffect(() => {
    if (isOpen) {
      setIsFetching(true);
      fetch('https://campus-bot-node.onrender.com/api/lostfound')
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setPosts(data); })
        .catch(err => console.error("Fetch error:", err))
        .finally(() => setIsFetching(false));
    }
  }, [isOpen]);

  // --- 3. SUBMIT WITH VALIDATION ---
  const handleSubmit = async (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }

    if (!formData.item || !formData.location || !formData.contact) return;

    setIsSubmitting(true);
    const newItem = { ...formData, type, time: new Date().toLocaleString() };

    try {
      const response = await fetch('https://campus-bot-node.onrender.com/api/lostfound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        const savedData = await response.json();
        // Insert at the top and ensure we only keep unique items
        setPosts(prev => [savedData.item, ...prev]);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setFormData({ item: '', location: '', description: '', contact: '', image: null });
          setImagePreview(null);
          setActiveTab('browse');
        }, 1800);
      }
    } catch (error) {
      alert("Error connecting to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.item?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lost & Found" icon={Search}>
      
      {/* SUCCESS OVERLAY */}
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-[#121212]/95 backdrop-blur-sm rounded-2xl animate-in fade-in zoom-in duration-300">
          <div className="bg-green-500/10 p-4 rounded-full mb-4">
            <CheckCircle className="h-14 w-14 text-[#00B291] animate-bounce" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">Posted Successfully!</h3>
          <p className="text-sm text-gray-500 mt-1">Returning to feed...</p>
        </div>
      )}

      {/* HEADER CONTROLS */}
      <div className="sticky top-0 bg-white dark:bg-[#1a1a1a] z-10 pb-2 space-y-4">
        <div className="flex bg-gray-100 dark:bg-[#252525] p-1 rounded-xl">
          <button 
            type="button" 
            onClick={() => setActiveTab('browse')} 
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'browse' ? 'bg-white dark:bg-[#333] text-[#00B291] shadow-sm' : 'text-gray-500'}`}
          >
            <Search className="h-3.5 w-3.5" /> Browse
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('report')} 
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'report' ? 'bg-white dark:bg-[#333] text-[#00B291] shadow-sm' : 'text-gray-500'}`}
          >
            <PlusCircle className="h-3.5 w-3.5" /> Report
          </button>
        </div>
        
        {activeTab === 'browse' && (
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#00B291] transition-colors" />
            <input 
              type="text" 
              placeholder="Search items, locations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-[#121212] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B291]/30 transition-all"
            />
          </div>
        )}
      </div>

      {/* BROWSE TAB */}
      {activeTab === 'browse' && (
        <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
          {isFetching ? (
            // SKELETON LOADER
            [1, 2, 3].map(n => (
              <div key={n} className="h-28 w-full bg-gray-100 dark:bg-[#252525] rounded-xl animate-pulse border border-gray-200 dark:border-gray-800" />
            ))
          ) : filteredPosts.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="bg-gray-100 dark:bg-[#252525] h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">No items found matching your search.</p>
            </div>
          ) : (
            filteredPosts.map((post, idx) => (
              <div key={post._id || idx} className="group bg-white dark:bg-[#202020] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:border-[#00B291]/30 transition-all duration-300">
                <div className="flex">
                  <div className={`w-1.5 ${post.type === 'lost' ? 'bg-red-500' : 'bg-[#00B291]'}`} />
                  <div className="flex-1 p-4 flex gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${post.type === 'lost' ? 'bg-red-50 text-red-500 dark:bg-red-500/10' : 'bg-green-50 text-green-500 dark:bg-green-500/10'}`}>
                          {post.type}
                        </span>
                        <h4 className="font-bold text-gray-800 dark:text-white truncate">{post.item}</h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" /> {post.location}
                        </p>
                        <p className="text-[11px] font-medium text-[#00B291] bg-[#00B291]/5 px-2 py-1 rounded-lg w-fit">
                          Contact: {post.contact}
                        </p>
                      </div>
                    </div>
                    {post.image && (
                      <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-black flex-shrink-0 border border-gray-100 dark:border-gray-800">
                        <img 
                          src={post.image.startsWith('http') ? post.image : `https://campus-bot-node.onrender.com/api/lostfound/image/${post._id}`} 
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          onError={(e) => e.target.parentElement.style.display = 'none'}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* REPORT TAB */}
      {activeTab === 'report' && (
        <div className="space-y-5 animate-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-[#252525] p-1.5 rounded-2xl">
            <button 
              type="button" 
              onClick={() => setType('lost')} 
              className={`py-2.5 text-[11px] font-black uppercase rounded-xl transition-all ${type === 'lost' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500 hover:text-gray-700'}`}
            >
              I Lost Something
            </button>
            <button 
              type="button" 
              onClick={() => setType('found')} 
              className={`py-2.5 text-[11px] font-black uppercase rounded-xl transition-all ${type === 'found' ? 'bg-[#00B291] text-white shadow-lg shadow-[#00B291]/20' : 'text-gray-500 hover:text-gray-700'}`}
            >
              I Found Something
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">Item Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Blue Wallet" 
                  value={formData.item} 
                  onChange={(e) => setFormData({...formData, item: e.target.value})} 
                  className={`w-full px-4 py-3 text-sm rounded-xl border dark:bg-[#121212] dark:border-gray-800 dark:text-white focus:ring-2 focus:ring-[#00B291]/40 outline-none transition-all ${!formData.item && 'border-dashed'}`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">Location *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Canteen" 
                  value={formData.location} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})} 
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:bg-[#121212] dark:border-gray-800 dark:text-white focus:ring-2 focus:ring-[#00B291]/40 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">Photo Attachment</label>
              <div 
                onClick={() => fileInputRef.current.click()} 
                className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-[#1a1a1a] overflow-hidden group ${imagePreview ? 'border-[#00B291]' : 'border-gray-200 dark:border-gray-800'}`}
              >
                <input 
                  ref={fileInputRef} 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => e.target.files[0] && handleImageResize(e.target.files[0])} 
                />
                {imagePreview ? (
                  <div className="relative h-full w-full">
                    <img src={imagePreview} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <p className="text-white text-[10px] font-bold">CLICK TO CHANGE</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-7 w-7 text-gray-300 mb-2" />
                    <p className="text-[10px] text-gray-400 font-medium">Clear photo helps fast recovery</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 ml-1 uppercase">Contact Details *</label>
              <input 
                type="text" 
                placeholder="Phone number or IG Handle" 
                value={formData.contact} 
                onChange={(e) => setFormData({...formData, contact: e.target.value})} 
                className="w-full px-4 py-3 text-sm rounded-xl border dark:border-gray-800 dark:bg-[#121212] dark:text-white focus:ring-2 focus:ring-[#00B291]/40 transition-all outline-none" 
              />
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleSubmit} 
            disabled={isSubmitting || !formData.item || !formData.location || !formData.contact}
            className={`w-full py-4 text-white text-[11px] font-black uppercase rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl ${isSubmitting || !formData.item || !formData.location || !formData.contact ? 'bg-gray-300 cursor-not-allowed shadow-none' : (type === 'lost' ? 'bg-red-500 shadow-red-500/20 hover:bg-red-600' : 'bg-[#00B291] shadow-[#00B291]/20 hover:bg-[#00967a]')}`}
          >
            {isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Publish Report"}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default LostFoundModal;