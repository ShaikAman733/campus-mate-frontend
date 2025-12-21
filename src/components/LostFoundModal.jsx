import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Image as ImageIcon, X, Clock, Trash2, Loader2 } from 'lucide-react';
import Modal from './Modal';

const LostFoundModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('browse'); 
  const [posts, setPosts] = useState([]);
  
  const [isFetching, setIsFetching] = useState(false);   
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [isDeleting, setIsDeleting] = useState(false);     

  const [type, setType] = useState('lost'); 
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    item: '', location: '', description: '', contact: '', image: null
  });

  const fileInputRef = useRef(null);

  // --- FETCH ITEMS ---
  useEffect(() => {
    if (isOpen) {
      setIsFetching(true); 
      fetch('https://campus-bot-node.onrender.com/api/lostfound')
        .then(res => res.json())
        .then(data => { if(Array.isArray(data)) setPosts(data); })
        .catch(err => console.error("Fetch error:", err))
        .finally(() => setIsFetching(false)); 
    }
  }, [isOpen, activeTab]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result });
        setImagePreview(reader.result);
      };
    }
  };

  // --- DELETE FUNCTION (FIXED) ---
  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation(); 
    if (!window.confirm("Are you sure?")) return;

    setIsDeleting(true);
    try {
        const response = await fetch(`https://campus-bot-node.onrender.com/api/lostfound/${id}`, { method: 'DELETE' });
        if (response.ok) {
            // Force state update using string comparison
            setPosts(prev => prev.filter(post => String(post._id) !== String(id)));
        }
    } catch (err) { console.error("Delete error:", err); }
    setIsDeleting(false);
  };

  // --- SUBMIT FUNCTION (FIXED) ---
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevents page refresh crash

    if(!formData.item || !formData.location || !formData.contact) {
      alert("Please fill required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('https://campus-bot-node.onrender.com/api/lostfound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setPosts(prev => [result.item, ...prev]); // Add to UI
        setFormData({ item: '', location: '', description: '', contact: '', image: null });
        setImagePreview(null);
        setActiveTab('browse'); 
      }
    } catch (err) { console.error("Submit error:", err); }
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lost & Found" icon={Search}>
      <div className="flex border-b border-gray-100 dark:border-gray-800 mb-4">
        <button onClick={() => setActiveTab('browse')} className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'browse' ? 'border-[#00B291] text-[#00B291]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Browse</button>
        <button onClick={() => setActiveTab('report')} className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'report' ? 'border-[#00B291] text-[#00B291]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Report</button>
      </div>

      {activeTab === 'browse' && (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 relative min-h-[200px]">
          {isFetching ? <Loader2 className="h-8 w-8 text-[#00B291] animate-spin mx-auto" /> : 
            posts.map((post) => (
              <div key={post._id} className="relative bg-white dark:bg-[#202020] rounded-xl border border-gray-100 dark:border-gray-700 p-3 shadow-sm group">
                <button onClick={(e) => handleDelete(post._id, e)} className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-4 w-4" /></button>
                <div className="flex justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${post.type === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{post.type}</span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="h-3 w-3" /> {post.time || "Recently"}</span>
                </div>
                <h4 className="font-bold mb-2">{post.item}</h4>
                <div className="h-32 bg-gray-100 dark:bg-black rounded-lg mb-2 overflow-hidden">
                    <img src={`https://campus-bot-node.onrender.com/api/lostfound/image/${post._id}`} alt="Item" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <p className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3" /> {post.location}</p>
                <p className="text-xs text-[#00B291] mt-2 font-bold">Contact: {post.contact}</p>
              </div>
            ))
          }
        </div>
      )}

      {activeTab === 'report' && (
        <div className="space-y-4">
          <input type="text" name="item" placeholder="Item Name" value={formData.item} onChange={handleChange} className="w-full p-2.5 rounded-xl border dark:bg-[#252525]" />
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-2.5 rounded-xl border dark:bg-[#252525]" />
          <input type="text" name="contact" placeholder="Contact Info" value={formData.contact} onChange={handleChange} className="w-full p-2.5 rounded-xl border dark:bg-[#252525]" />
          <button onClick={(e) => handleSubmit(e)} disabled={isSubmitting} className={`w-full py-3 text-white font-bold rounded-xl ${isSubmitting ? 'bg-gray-400' : 'bg-[#00B291]'}`}>
            {isSubmitting ? "Posting..." : "Submit Report"}
          </button>
        </div>
      )}
    </Modal>
  );
};

export default LostFoundModal;