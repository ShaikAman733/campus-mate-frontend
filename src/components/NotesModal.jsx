import React, { useState } from 'react';
import { Download } from 'lucide-react';
import Modal from './Modal';

const NotesModal = ({ isOpen, onClose }) => {
  const [notesSubjectCode, setNotesSubjectCode] = useState('');

  const handleSearch = () => {
    if(notesSubjectCode.trim()) {
       window.open(`https://vtucircle.com/?s=${encodeURIComponent(notesSubjectCode)}`, '_blank');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Download Notes" icon={Download}>
      <div className="space-y-4">
         <p className="text-sm text-gray-500 dark:text-gray-400">Enter Subject Code (e.g., BAI701) to find relevant notes from VTU Circle.</p>
         <div className="flex gap-3">
           <input 
             type="text" 
             placeholder="Subject Code..."
             value={notesSubjectCode}
             onChange={(e) => setNotesSubjectCode(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
             className="flex-1 px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B291]/50 dark:focus:ring-[#00F5C8]/50"
           />
           <button onClick={handleSearch} className="px-5 bg-[#00B291] dark:bg-[#00F5C8] text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity">
             Search
           </button>
         </div>
      </div>
    </Modal>
  );
};

export default NotesModal;