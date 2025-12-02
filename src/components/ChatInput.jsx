// src/components/ChatInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Plus, Paperclip, X, FileText } from 'lucide-react';
import ResumeBuilder from './ResumeBuilder';

const ChatInput = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  // handleKeyPress prop is removed/ignored here because we define a local one
  isLoading,
  isTyping
}) => {
  const [isListening, setIsListening] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // State for Resume Builder Modal
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  
  const fileInputRef = useRef(null);
  const menuRef = useRef(null);

  // --- Handle Click Outside Menu ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Voice Logic ---
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onstart = () => setIsListening(true);
      recog.onend = () => setIsListening(false);

      recog.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setInputMessage(transcript);
      };

      setRecognition(recog);
    }
  }, [setInputMessage]);

  const [recognition, setRecognition] = useState(null);

  const toggleListening = () => {
    if (!recognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  // --- File Logic ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      e.target.value = ''; // Reset so same file can be selected again
      setShowMenu(false); // Close menu after selection
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  // Unified Send Handler
  const onSendClick = () => {
    if (!inputMessage.trim() && !selectedFile) return;
    
    // Pass both text AND file to the parent handler
    handleSendMessage(inputMessage, selectedFile);
    
    // Clear local file state immediately
    setSelectedFile(null);
  };

  // --- NEW LOCAL KEY PRESS HANDLER ---
  const handleLocalKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendClick(); // Call the unified handler that includes the file
    }
  };

  return (
    <>
      <div className="p-4 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className={`max-w-4xl mx-auto border rounded-2xl p-2 bg-gray-50 dark:bg-[#1a1a1a] shadow-sm transition-all ${isListening ? 'border-red-500 ring-1 ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-[#00B291]/20 dark:focus:ring-[#00F5C8]/20'}`}>

          {/* Listening Indicator */}
          {isListening && (
            <div className="px-3 py-1 text-xs font-bold text-red-500 animate-pulse flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span> Listening...
            </div>
          )}

          {/* File Preview Chip */}
          {selectedFile && (
            <div className="mx-2 mb-2 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-[#262626] rounded-lg text-sm text-gray-700 dark:text-gray-200 animate-in fade-in slide-in-from-bottom-2">
              <Paperclip className="h-3.5 w-3.5 text-[#00B291]" />
              <span className="max-w-[200px] truncate font-medium">{selectedFile.name}</span>
              <button onClick={clearFile} className="ml-1 p-0.5 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-1 md:gap-2 relative">
            
            {/* Hidden File Input */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            {/* --- THE PLUS MENU --- */}
            <div className="relative" ref={menuRef}>
              {/* Plus Button */}
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`mb-2 p-2 rounded-xl transition-all bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800 shrink-0 ${showMenu ? 'text-[#00B291] bg-gray-200 dark:bg-gray-800' : 'text-gray-400'}`}
                title="Add..."
              >
                <Plus className={`h-5 w-5 transition-transform duration-200 ${showMenu ? 'rotate-45' : ''}`} />
              </button>

              {/* Popover Menu */}
              {showMenu && (
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-bottom-left">
                  <div className="flex flex-col p-1">
                    
                    {/* Option 1: Attach File */}
                    <button 
                      onClick={() => {
                        fileInputRef.current?.click();
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg transition-colors w-full text-left"
                    >
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
                        <Paperclip className="h-4 w-4" />
                      </div>
                      Summarize File
                    </button>

                    {/* Option 2: Resume Builder */}
                    <button 
                      onClick={() => {
                        setShowResumeBuilder(true); // Open the Resume Builder Modal
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-lg transition-colors w-full text-left"
                    >
                      <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                         <FileText className="h-4 w-4" />
                      </div>
                      Resume Builder
                    </button>

                  </div>
                </div>
              )}
            </div>

            {/* Text Area */}
            <textarea
              className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:outline-none p-3 min-h-[50px] max-h-32 text-sm"
              placeholder={isListening ? "Listening..." : "Ask Campus Mate..."}
              rows="1"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              // UPDATED: Use local handler instead of parent handler
              onKeyDown={handleLocalKeyPress}
              disabled={isLoading || isTyping}
            />

            <button
              onClick={toggleListening}
              className={`mb-2 p-2.5 rounded-xl transition-all shrink-0 ${isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-transparent text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <button
              onClick={onSendClick}
              disabled={isLoading || isTyping || (!inputMessage.trim() && !isListening && !selectedFile)}
              className={`mb-2 mr-1 p-2.5 rounded-xl transition-all shrink-0 ${isLoading || isTyping || (!inputMessage.trim() && !isListening && !selectedFile)
                  ? 'bg-transparent text-gray-400 cursor-not-allowed'
                  : 'bg-transparent text-[#00B291] dark:text-[#00F5C8] hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95'
                }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-400">Campus Mate may produce inaccurate information.</p>
        </div>
      </div>

      {/* --- RESUME BUILDER MODAL --- */}
      {showResumeBuilder && (
        <ResumeBuilder onClose={() => setShowResumeBuilder(false)} />
      )}
    </>
  );
};

export default ChatInput;