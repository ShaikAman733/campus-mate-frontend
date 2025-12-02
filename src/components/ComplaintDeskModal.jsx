// src/components/ComplaintDeskModal.jsx
import React, { useState, useRef } from 'react';
import { AlertTriangle, Upload, FileText, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import Modal from './Modal';
import { departments } from '../data';

const ComplaintDeskModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Confirmation
  const [formData, setFormData] = useState({
    category: '',
    recipient: '',
    usn: '',
    details: '',
    file: null
  });
  
  const fileInputRef = useRef(null);

  const categories = [
    "Academic Issue",
    "Hostel & Accommodation",
    "Infrastructure/Campus",
    "Faculty Related",
    "Examination",
    "Other"
  ];

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle File Upload (Mock)
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files[0].name }));
    }
  };

  // Validate and Proceed to Confirmation
  const handleNext = () => {
    if (formData.category && formData.recipient && formData.usn && formData.details) {
      setStep(2);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  // Generate Mailto Link on Submit
  const handleSubmit = () => {
    const subject = `[Formal Complaint] ${formData.category} - ${formData.usn}`;
    const body = `Complaint Details:\n\nCategory: ${formData.category}\nStudent USN: ${formData.usn}\n\nDescription:\n${formData.details}\n\n[Attachment: ${formData.file || 'None'}]`;
    
    window.location.href = `mailto:${formData.recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    onClose();
    setStep(1); // Reset for next time
    setFormData({ category: '', recipient: '', usn: '', details: '', file: null });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complaint Desk" icon={AlertTriangle}>
      
      {/* STEP 1: COMPLAINT FORM */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Category & Recipient */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B291]/50"
              >
                <option value="">Select Type...</option>
                {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Recipient (HOD)</label>
              <select 
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B291]/50"
              >
                <option value="">Select Dept...</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.hodEmail}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* USN */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Your USN</label>
            <input 
              type="text" 
              name="usn"
              placeholder="e.g. 1RL22CS..."
              value={formData.usn}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B291]/50"
            />
          </div>

          {/* Details */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Complaint Details</label>
            <textarea 
              name="details"
              rows="4"
              placeholder="Describe your issue clearly..."
              value={formData.details}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B291]/50 resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">Attachment (Optional)</label>
            <div 
              onClick={() => fileInputRef.current.click()}
              className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
            >
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
              {formData.file ? (
                <span className="text-sm font-semibold text-[#00B291] flex items-center gap-2">
                  <FileText className="h-4 w-4" /> {formData.file}
                </span>
              ) : (
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <Upload className="h-4 w-4" /> Click to upload proof
                </span>
              )}
            </div>
          </div>

          {/* Next Button (FIXED COLOR) */}
          <button 
            onClick={handleNext}
            className="w-full py-3 bg-[#00B291] dark:bg-[#00F5C8] text-white dark:text-black text-sm font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-[#00B291]/20"
          >
            Review Complaint <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* STEP 2: CONFIRMATION SUMMARY */}
      {step === 2 && (
        <div className="space-y-4 animate-slide-down">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl flex items-start gap-3">
             <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
             <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed">
               Please review the details below. Submitting this will open your default email client to send a formal complaint to the selected department head.
             </p>
          </div>

          <div className="bg-gray-50 dark:bg-[#252525] rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700">
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Category</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formData.category}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">To</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{formData.recipient}</p>
                </div>
             </div>
             <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">From USN</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formData.usn}</p>
             </div>
             <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold">Details</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 p-2 bg-white dark:bg-black/20 rounded-lg border border-gray-100 dark:border-gray-800">
                  {formData.details}
                </p>
             </div>
             {formData.file && (
               <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Attachment</p>
                  <p className="text-xs text-[#00B291] font-medium">{formData.file}</p>
               </div>
             )}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-transparent border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-[#252525] flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Edit
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-[2] py-3 bg-[#00B291] dark:bg-[#00F5C8] text-white dark:text-black text-sm font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-[#00B291]/20"
            >
              Confirm & Send <CheckCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

    </Modal>
  );
};

export default ComplaintDeskModal;