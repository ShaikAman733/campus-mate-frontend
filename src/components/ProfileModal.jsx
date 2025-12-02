// src/components/ProfileModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, User, Mail, Save, Shield, Camera, Trash2, 
  Upload, Building2, BookOpen, Check, AlertCircle, ChevronDown, Loader2, Briefcase 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://campus-bot-node.onrender.com';

// --- REUSABLE COMPONENTS ---

const InputField = ({ label, icon: Icon, error, success, ...props }) => (
  <div className="space-y-1.5 group">
    <div className="flex justify-between items-center px-1">
      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider group-focus-within:text-[#00B291] transition-colors">
        {label}
      </label>
      {error && <span className="text-[10px] text-red-500 font-semibold animate-fade-in flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {error}</span>}
    </div>
    <div className="relative">
      <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors duration-200 ${props.disabled ? 'bg-gray-200 dark:bg-gray-800' : 'bg-gray-100 dark:bg-[#252525] group-focus-within:bg-[#00B291]/10 group-focus-within:text-[#00B291]'}`}>
        <Icon className={`h-4 w-4 ${props.disabled ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400 group-focus-within:text-[#00B291]'}`} />
      </div>
      <input 
        {...props}
        className={`w-full pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border rounded-xl outline-none transition-all font-medium text-sm
          ${error 
            ? 'border-red-500 focus:ring-4 focus:ring-red-500/10' 
            : success 
              ? 'border-green-500/50 focus:ring-4 focus:ring-green-500/10' 
              : 'border-gray-200 dark:border-gray-700 focus:border-[#00B291] focus:ring-4 focus:ring-[#00B291]/10'
          }
          dark:text-white disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-400`}
      />
      {success && !error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-green-100 dark:bg-green-900/30 rounded-full animate-scale-in">
           <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
        </div>
      )}
    </div>
  </div>
);

const SelectField = ({ label, icon: Icon, value, onChange, options, error }) => (
  <div className="space-y-1.5 group">
    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-1 group-focus-within:text-[#00B291] transition-colors">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gray-100 dark:bg-[#252525] group-focus-within:bg-[#00B291]/10 group-focus-within:text-[#00B291] transition-colors">
         <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400 group-focus-within:text-[#00B291]" />
      </div>
      <select
        value={value}
        onChange={onChange}
        className={`w-full pl-12 pr-10 py-3.5 bg-gray-50 dark:bg-[#1a1a1a] border rounded-xl outline-none transition-all dark:text-white appearance-none cursor-pointer font-medium text-sm
        ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-[#00B291] focus:ring-4 focus:ring-[#00B291]/10'}`}
      >
        <option value="" disabled>Select an option</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
    </div>
  </div>
);

// New Component: 3-Way Identity Selector
const IdentitySelector = ({ selected, onChange }) => {
  const options = [
    { id: 'student', label: 'Student (USN)' },
    { id: 'new', label: 'New Admission' },
    { id: 'faculty', label: 'Faculty' }
  ];

  return (
    <div className="flex p-1 bg-gray-100 dark:bg-[#151515] rounded-xl border border-gray-200 dark:border-gray-800">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex-1 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wide rounded-lg transition-all duration-300
            ${selected === opt.id 
              ? 'bg-white dark:bg-[#252525] text-[#00B291] shadow-sm ring-1 ring-black/5 dark:ring-white/5' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

// --- MAIN MODAL COMPONENT ---

const ProfileModal = ({ isOpen, onClose, currentUser, onUpdateUser }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // New State for Identity Type ('student', 'new', 'faculty')
  const [identityType, setIdentityType] = useState('student');

  const [formData, setFormData] = useState({
    identifier: '', 
    email: '',
    department: '',
    role: 'Student',
    avatar: null
  });

  useEffect(() => {
    if (currentUser) {
      // Determine initial identity type based on data
      let initialType = 'student';
      if (currentUser.isNewAdmission) initialType = 'new';
      if (currentUser.role === 'Teacher') initialType = 'faculty';

      setIdentityType(initialType);

      setFormData({
        identifier: currentUser.identifier || currentUser.username || '', 
        email: currentUser.email || '',
        department: currentUser.department || '',
        role: currentUser.role || 'Student',
        avatar: currentUser.avatar || null
      });
    }
  }, [currentUser, isOpen]);

  // Handle Identity Type Change
  const handleIdentityChange = (type) => {
    setIdentityType(type);
    // Auto-update Role based on Identity
    if (type === 'faculty') {
      setFormData(prev => ({ ...prev, role: 'Teacher' }));
    } else {
      setFormData(prev => ({ ...prev, role: 'Student' }));
    }
  };

  if (!isOpen) return null;

  // --- Handlers ---

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("Image size must be less than 2MB");
    if (!file.type.startsWith('image/')) return toast.error("Please upload an image file");
    
    setImageLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, avatar: reader.result }));
      setImageLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isStudentWithUSN = identityType === 'student';

    if (isStudentWithUSN) {
      if (!formData.identifier.toUpperCase().startsWith('1RL')) {
        setLoading(false);
        return toast.error("USN must start with '1RL'");
      }
    }
    
    if (!formData.identifier || formData.identifier.length < 3) {
      setLoading(false);
      return toast.error("Please enter a valid Name/ID");
    }

    if (!formData.department) {
      setLoading(false);
      return toast.error("Please select a department");
    }

    try {
      const payload = { 
        ...formData, 
        isNewAdmission: identityType === 'new', // Only true for New Admission tab
        username: currentUser.username 
      };
      
      const response = await fetch(`${API_URL}/api/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        onUpdateUser(data.user); 
        onClose();
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Failed to save.');
      }
    } catch (error) {
      toast.error('Server unavailable.');
    } finally {
      setLoading(false);
    }
  };

  // Validation Logic for UI Feedback
  const isUSNValid = identityType === 'student' && formData.identifier.length >= 10 && formData.identifier.toUpperCase().startsWith('1RL');
  const isNameValid = (identityType === 'new' || identityType === 'faculty') && formData.identifier.length > 3;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  // Dynamic Labels
  let identifierLabel = "University Seat No. (USN)";
  let identifierPlaceholder = "e.g., 1RL22CS001";
  let identifierIcon = BookOpen;

  if (identityType === 'new') {
    identifierLabel = "Full Name";
    identifierPlaceholder = "Enter your full name";
    identifierIcon = User;
  } else if (identityType === 'faculty') {
    identifierLabel = "Employee ID / Name";
    identifierPlaceholder = "Enter Employee ID or Name";
    identifierIcon = Briefcase;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      
      {/* Modal Container */}
      <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh] relative animate-scale-in">
        
        {/* --- 1. HEADER --- */}
        <div className="relative h-36 bg-[#00B291] shrink-0 overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-sm transition-all z-20"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="absolute top-6 left-6 z-10 text-white">
             <h2 className="text-2xl font-bold tracking-tight mb-0.5">Edit Profile</h2>
             <div className="flex items-center gap-2">
               <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-wide">
                 {formData.role}
               </span>
             </div>
          </div>
        </div>

        {/* --- 2. AVATAR (Sticky Overlay) --- */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
             <div 
                className={`relative group h-28 w-28 rounded-full border-[4px] shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-300 cursor-pointer bg-white dark:bg-[#151515]
                  ${dragActive 
                    ? 'border-[#00B291] scale-110' 
                    : 'border-white dark:border-[#0a0a0a]'}`}
                onClick={() => fileInputRef.current.click()}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {imageLoading ? (
                  <Loader2 className="h-8 w-8 text-[#00B291] animate-spin" />
                ) : formData.avatar ? (
                  <img src={formData.avatar} alt="Profile" className="h-full w-full object-cover transition-transform group-hover:scale-110 duration-500" />
                ) : (
                  <span className="text-4xl font-bold text-[#00B291] select-none">
                    {formData.identifier ? formData.identifier.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}

                <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center transition-opacity duration-200 ${dragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <Camera className="h-8 w-8 text-white mb-1" />
                  <span className="text-[8px] text-white font-bold uppercase tracking-widest">{dragActive ? 'DROP' : 'EDIT'}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mt-2">
                 <button 
                    type="button" 
                    onClick={() => fileInputRef.current.click()}
                    className="p-1.5 bg-white dark:bg-[#202020] text-[#00B291] hover:text-white hover:bg-[#00B291] rounded-full shadow-lg border border-gray-100 dark:border-gray-700 transition-all"
                    title="Upload"
                  >
                    <Upload className="h-3.5 w-3.5" />
                 </button>
                 {formData.avatar && (
                   <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, avatar: null }))}
                      className="p-1.5 bg-white dark:bg-[#202020] text-red-500 hover:text-white hover:bg-red-500 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 transition-all"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                   </button>
                 )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => handleFile(e.target.files[0])} 
              />
        </div>

        {/* --- 3. SCROLLABLE FORM --- */}
        {/* Padding top 28 ensures form starts below the avatar area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-28">
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
            
            <div className="space-y-4 animate-slide-up">
              
              {/* New Identity Selector */}
              <IdentitySelector selected={identityType} onChange={handleIdentityChange} />

              <div className="grid gap-4">
                <InputField 
                  label={identifierLabel}
                  icon={identifierIcon}
                  placeholder={identifierPlaceholder}
                  value={formData.identifier}
                  onChange={(e) => setFormData({...formData, identifier: e.target.value.toUpperCase()})}
                  success={isUSNValid || isNameValid}
                  error={identityType === 'student' && formData.identifier.length > 0 && !formData.identifier.startsWith('1RL') ? "Must start with 1RL" : null}
                />

                <SelectField 
                  label="Department"
                  icon={Building2}
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  error={!formData.department}
                  options={[
                    { value: 'CSE', label: 'Computer Science (CSE)' },
                    { value: 'ECE', label: 'Electronics (ECE)' },
                    { value: 'MECH', label: 'Mechanical (MECH)' },
                    { value: 'CIVIL', label: 'Civil Engineering' },
                    { value: 'AIDS', label: 'AI & Data Science' },
                    { value: 'CYBER', label: 'Cyber Security' },
                    { value: 'MBA', label: 'Master of Business Admin (MBA)' },
                  ]}
                />

                <InputField 
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  placeholder="student@rljit.in"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  success={isEmailValid}
                />

                <SelectField
                  label="Current Role"
                  icon={Shield}
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  options={[
                    { value: 'Student', label: 'Student' },
                    { value: 'Teacher', label: 'Teacher' },
                  ]}
                />

              </div>
            </div>

            {/* Save Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00B291] to-[#00F5C8] hover:shadow-lg hover:shadow-[#00B291]/25 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving Changes...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2 relative z-10">
                  <Save className="h-5 w-5" /> Save Profile
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;