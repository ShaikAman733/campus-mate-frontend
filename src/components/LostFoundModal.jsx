// src/components/LostFoundModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Upload, Image as ImageIcon, X, CheckCircle, Clock, Trash2, Loader2 } from 'lucide-react';
import Modal from './Modal';

const LostFoundModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('browse'); 
  const [posts, setPosts] = useState([]);
  
  // --- LOADING STATES ---
  const [isFetching, setIsFetching] = useState(false);   // For loading the list
  const [isSubmitting, setIsSubmitting] = useState(false); // For uploading
  const [isDeleting, setIsDeleting] = useState(false);     // For deleting

  // Form State
  const [type, setType] = useState('lost'); 
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    item: '',
    location: '',
    description: '',
    contact: '',
    image: null
  });

  const fileInputRef = useRef(null);

  // --- 1. FETCH DATA (With Loading State) ---
  useEffect(() => {
    if (isOpen) {
      setIsFetching(true); // Start Loading
      fetch('https://campus-bot-node.onrender.com/api/lostfound')
        .then(res => res.json())
        .then(data => {
            if(Array.isArray(data)) setPosts(data);
        })
        .catch(err => console.error("Error fetching items:", err))
        .finally(() => setIsFetching(false)); // Stop Loading
    }
  }, [isOpen, activeTab]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setFormData({ ...formData, image: base64 });
      setImagePreview(base64);
    }
  };

  const removeImage = (e) => {
    e.stopPropagation();
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  // --- 2. DELETE FUNCTION ---
  const handleDelete = async (id, e) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setIsDeleting(true);
    try {
        const response = await fetch(`https://campus-bot-node.onrender.com/api/lostfound/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setPosts(posts.filter(post => post._id !== id));
        } else {
            alert("Failed to delete item.");
        }
    } catch (error) {
        console.error("Delete error:", error);
    }
    setIsDeleting(false);
  };

  // --- 3. SUBMIT FUNCTION (With Loading State) ---
  const handleSubmit = async () => {
    if(!formData.item || !formData.location || !formData.contact) {
      alert("Please fill in the required fields.");
      return;
    }

    setIsSubmitting(true); // Disable button and show spinner

    const newItem = {
      type: type,
      item: formData.item,
      location: formData.location,
      description: formData.description,
      contact: formData.contact,
      image: formData.image 
    };

    try {
      const response = await fetch('https://campus-bot-node.onrender.com/api/lostfound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        const savedItem = await response.json();
        setPosts([savedItem, ...posts]);
        
        setFormData({ item: '', location: '', description: '', contact: '', image: null });
        setImagePreview(null);
        setActiveTab('browse');
      } else {
        alert("Failed to save item. Server error.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Could not connect to backend.");
    } finally {
        setIsSubmitting(false); // Re-enable button
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lost & Found" icon={Search}>
      
      <div className="flex border-b border-gray-100 dark:border-gray-800 mb-4">
        <button 
          onClick={() => setActiveTab('browse')}
          className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'browse' ? 'border-[#00B291] text-[#00B291]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Browse Items
        </button>
        <button 
          onClick={() => setActiveTab('report')}
          className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'report' ? 'border-[#00B291] text-[#00B291]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Report Item
        </button>
      </div>

      {/* --- TAB 1: BROWSE FEED --- */}
      {activeTab === 'browse' && (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1 animate-fade-in relative min-h-[200px]">
          
          {/* LOADING SPINNER */}
          {isFetching ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 z-10">
                <Loader2 className="h-8 w-8 text-[#00B291] animate-spin" />
                <p className="text-xs text-gray-500 mt-2">Loading items...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Search className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No items reported yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="relative bg-white dark:bg-[#202020] rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                
                <button 
                    onClick={(e) => handleDelete(post._id, e)}
                    className="absolute top-2 right-2 z-10 p-2 bg-white/80 dark:bg-black/50 text-gray-500 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Item"
                >
                    <Trash2 className="h-4 w-4" />
                </button>

                <div className={`h-1 w-full ${post.type === 'lost' ? 'bg-red-500' : 'bg-[#00B291]'}`} />
                <div className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mr-2 ${post.type === 'lost' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-green-100 text-green-600 dark:bg-green-900/30'}`}>
                        {post.type}
                      </span>
                      <h4 className="font-bold text-gray-800 dark:text-gray-100 inline align-middle">{post.item}</h4>
                    </div>
                    <span className="flex items-center text-[10px] text-gray-400 gap-1">
                      <Clock className="h-3 w-3" /> {post.time}
                    </span>
                  </div>

                  <div className="h-32 w-full bg-gray-100 dark:bg-black rounded-lg mb-3 overflow-hidden relative">
                      <img 
                        src={`https://campus-bot-node.onrender.com/api/lostfound/image/${post._id}`} 
                        alt="Item" 
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.style.display = 'none'} 
                      />
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" /> {post.location}
                    </p>
                    {post.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-[#2a2a2a] p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                        "{post.description}"
                      </p>
                    )}
                    <p className="text-xs font-semibold pt-1 text-[#00B291] dark:text-[#00F5C8]">
                      Contact: {post.contact}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* --- TAB 2: REPORT FORM --- */}
      {activeTab === 'report' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex bg-gray-100 dark:bg-[#252525] p-1 rounded-xl">
            <button onClick={() => setType('lost')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${type === 'lost' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>I Lost Something</button>
            <button onClick={() => setType('found')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${type === 'found' ? 'bg-[#00B291] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>I Found Something</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Item Name</label>
              <input type="text" name="item" placeholder={type === 'lost' ? "e.g. Blue Wallet" : "e.g. Calculator"} value={formData.item} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B291]/50" />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input type="text" name="location" placeholder="e.g. Library" value={formData.location} onChange={handleChange} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B291]/50" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Upload Image</label>
            <div onClick={() => !imagePreview && fileInputRef.current.click()} className={`w-full h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden relative ${imagePreview ? 'border-[#00B291] bg-black' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#252525]'}`}>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                  <button onClick={removeImage} className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors"><X className="h-3 w-3" /></button>
                </>
              ) : (
                <div className="text-center p-2"><ImageIcon className="h-5 w-5 mx-auto mb-1 text-gray-400" /><p className="text-[10px] text-gray-500">Click to upload photo</p></div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Description</label>
            <textarea name="description" rows="2" placeholder="Details (color, brand, etc)..." value={formData.description} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B291]/50 resize-none" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Contact Info</label>
            <input type="text" name="contact" placeholder="Phone or Email" value={formData.contact} onChange={handleChange} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B291]/50" />
          </div>

          {/* SUBMIT BUTTON WITH LOADING STATE */}
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={`w-full py-3 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : (type === 'lost' ? 'bg-red-500 shadow-red-500/20' : 'bg-[#00B291] shadow-[#00B291]/20')
            }`}
          >
            {isSubmitting ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                </>
            ) : (
                "Submit Report"
            )}
          </button>
        </div>
      )}

    </Modal>
  );
};

export default LostFoundModal;