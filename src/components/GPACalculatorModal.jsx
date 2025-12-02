// src/components/GPACalculatorModal.jsx
import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Trash2 } from 'lucide-react';
import Modal from './Modal';

const GPACalculatorModal = ({ isOpen, onClose }) => {
  const [subjects, setSubjects] = useState([
    { id: 1, name: '', credits: '', marks: '' },
    { id: 2, name: '', credits: '', marks: '' },
    { id: 3, name: '', credits: '', marks: '' },
  ]);
  
  const [result, setResult] = useState({ gpa: 0, totalCredits: 0 });

  // Helper: Convert Marks (0-100) to Grade Points (10 Scale)
  // Standard VTU/Engineering Logic
  const getGradePoint = (marks) => {
    const m = parseFloat(marks);
    if (isNaN(m)) return 0;
    if (m >= 90) return 10;
    if (m >= 80) return 9;
    if (m >= 70) return 8;
    if (m >= 60) return 7;
    if (m >= 50) return 6; // varies by scheme, usually 6
    if (m >= 45) return 5;
    if (m >= 40) return 4; // Pass
    return 0; // Fail
  };

  const handleAddRow = () => {
    setSubjects([...subjects, { id: Date.now(), name: '', credits: '', marks: '' }]);
  };

  const handleRemoveRow = (id) => {
    setSubjects(subjects.filter(sub => sub.id !== id));
  };

  const handleChange = (id, field, value) => {
    // Prevent marks > 100
    if (field === 'marks' && value > 100) return;
    
    setSubjects(subjects.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    ));
  };

  // Auto-calculate whenever input changes
  useEffect(() => {
    let totalCreds = 0;
    let totalPoints = 0;

    subjects.forEach(sub => {
      const cred = parseFloat(sub.credits);
      const marks = parseFloat(sub.marks);
      
      if (!isNaN(cred) && !isNaN(marks)) {
        const gradePoint = getGradePoint(marks);
        totalCreds += cred;
        totalPoints += (cred * gradePoint);
      }
    });

    const gpa = totalCreds === 0 ? 0 : (totalPoints / totalCreds).toFixed(2);
    setResult({ gpa, totalCredits: totalCreds });
  }, [subjects]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="GPA Calculator" icon={Calculator}>
      <div className="space-y-4">
        
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold text-gray-400 tracking-wider px-2">
          <div className="col-span-5">Subject (Optional)</div>
          <div className="col-span-3">Credits</div>
          <div className="col-span-3">Marks (0-100)</div>
          <div className="col-span-1"></div>
        </div>

        {/* Inputs */}
        <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">
          {subjects.map((sub) => (
            <div key={sub.id} className="grid grid-cols-12 gap-2 items-center animate-fade-in">
              {/* Subject Name */}
              <div className="col-span-5">
                <input 
                  type="text" 
                  placeholder="Subject..." 
                  value={sub.name}
                  onChange={(e) => handleChange(sub.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#00B291]"
                />
              </div>

              {/* Credits */}
              <div className="col-span-3">
                <input 
                  type="number" 
                  placeholder="4" 
                  value={sub.credits}
                  onChange={(e) => handleChange(sub.id, 'credits', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#00B291]"
                />
              </div>

              {/* Marks Input (Replaced Grade Dropdown) */}
              <div className="col-span-3 relative">
                <input 
                  type="number" 
                  placeholder="85"
                  min="0"
                  max="100"
                  value={sub.marks}
                  onChange={(e) => handleChange(sub.id, 'marks', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252525] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#00B291]"
                />
                {/* Small indicator of points if marks are entered */}
                {sub.marks && (
                   <span className="absolute right-2 top-2.5 text-[10px] text-gray-400 font-mono">
                      {getGradePoint(sub.marks)}pts
                   </span>
                )}
              </div>

              {/* Delete Button */}
              <div className="col-span-1 flex justify-center">
                <button 
                  onClick={() => handleRemoveRow(sub.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <button 
          onClick={handleAddRow}
          className="flex items-center gap-2 text-xs font-semibold text-[#00B291] dark:text-[#00F5C8] hover:underline px-2"
        >
          <Plus className="h-4 w-4" /> Add Subject
        </button>

        {/* Results Panel */}
        <div className="mt-6 p-4 bg-[#00B291]/10 dark:bg-[#00F5C8]/10 rounded-2xl border border-[#00B291]/20 dark:border-[#00F5C8]/20 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Total Credits</p>
            <p className="text-xl font-bold text-gray-800 dark:text-white">{result.totalCredits}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Calculated GPA</p>
            <p className="text-3xl font-extrabold text-[#00B291] dark:text-[#00F5C8]">{result.gpa}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GPACalculatorModal;