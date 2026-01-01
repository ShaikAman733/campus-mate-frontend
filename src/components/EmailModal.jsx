import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import Modal from './Modal';
import { departments } from '../data.js';

const EmailModal = ({ isOpen, onClose }) => {
  const [mailName, setMailName] = useState('');
  const [mailUSN, setMailUSN] = useState('');
  const [mailHod, setMailHod] = useState('');
  const [mailReason, setMailReason] = useState('');
  const [mailDraft, setMailDraft] = useState(null);

  const handleGenerateMail = () => {
    if (!mailName || !mailUSN || !mailHod || !mailReason) return;
    const selectedDept = departments.find(d => d.hodEmail === mailHod);
    const deptName = selectedDept ? selectedDept.name : "Department";
    const subject = `Application regarding ${mailReason.substring(0, 25)}${mailReason.length > 25 ? '...' : ''} - ${mailName} (${mailUSN})`;
    const body = `Respected Sir/Madam,\n\nI hope this email finds you in good health.\n\nI am writing to you today to submit a request regarding: ${mailReason}.\n\nMy name is ${mailName} and I am a student of the ${deptName} with USN: ${mailUSN}.\n\nI would be strictly obliged if you could kindly consider my request and take the necessary action. I am available to provide any further information if required.\n\nThank you for your time and consideration.\n\nYours faithfully,\n\n${mailName}\n${mailUSN}\n${deptName}`;
    setMailDraft({ to: mailHod, subject, body });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave Generator" icon={Mail}>
       <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Your Name" value={mailName} onChange={(e) => setMailName(e.target.value)} className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B291]/50 dark:focus:ring-[#00F5C8]/50" />
            <input type="text" placeholder="Your USN" value={mailUSN} onChange={(e) => setMailUSN(e.target.value)} className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B291]/50 dark:focus:ring-[#00F5C8]/50" />
          </div>
          <select value={mailHod} onChange={(e) => setMailHod(e.target.value)} className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B291]/50 dark:focus:ring-[#00F5C8]/50">
             <option value="">Select To (HOD)</option>
             {departments.map((dept) => (<option key={dept.id} value={dept.hodEmail}>HOD of {dept.name}</option>))}
          </select>
          <textarea placeholder="Reason (e.g. Request for leave due to...)" value={mailReason} onChange={(e) => setMailReason(e.target.value)} rows="3" className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B291]/50 dark:focus:ring-[#00F5C8]/50 resize-none" />
          <button onClick={handleGenerateMail} className="w-full py-3 bg-[#00B291] dark:bg-[#00F5C8] text-white dark:text-black text-sm font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#00B291]/20 dark:shadow-[#00F5C8]/20">Generate Draft</button>
          
          {mailDraft && (
             <div className="mt-4 p-4 bg-gray-50 dark:bg-[#202020] rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-2 font-bold">Preview</p>
                <div className="text-xs text-gray-800 dark:text-gray-200 space-y-2 mb-4 p-3 bg-white dark:bg-black/20 rounded-lg border border-gray-100 dark:border-gray-800">
                   <p><strong>To:</strong> {mailDraft.to}</p>
                   <p><strong>Subject:</strong> {mailDraft.subject}</p>
                </div>
                <a href={`mailto:${mailDraft.to}?subject=${encodeURIComponent(mailDraft.subject)}&body=${encodeURIComponent(mailDraft.body)}`} className="block w-full text-center py-2.5 border border-[#00B291] dark:border-[#00F5C8] text-[#00B291] dark:text-[#00F5C8] text-sm font-bold rounded-lg hover:bg-[#00B291]/10 dark:hover:bg-[#00F5C8]/10 transition-colors">Launch Mail App</a>
             </div>
          )}
       </div>
    </Modal>
  );
};

export default EmailModal;