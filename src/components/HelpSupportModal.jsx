import React, { useState } from 'react';
import { 
  X, ChevronDown, MessageCircle, Send, 
  Zap, Shield, Activity, AlertTriangle, CheckCircle2,
  Mail // Added Mail icon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const CHATBOT_FAQS = [
  {
    icon: Zap,
    question: "How does Campus Mate work?",
    answer: "Campus Mate uses a Retrieval-Augmented Generation (RAG) engine. It searches through RLJIT's official handbooks and databases to find relevant facts, then uses a Large Language Model (LLM) to construct a natural answer for you."
  },
  {
    icon: Shield,
    question: "Is my chat history private?",
    answer: "Yes. Your chat history is stored primarily in your browser's local storage. We prioritize privacy and do not use your personal conversations to train the public model."
  },
  {
    icon: AlertTriangle,
    question: "What if the AI gives wrong information?",
    answer: "AI models can occasionally 'hallucinate' or provide outdated info. While we update the database weekly, always verify critical dates (like exams or fee deadlines) with the official college circulars."
  },
  {
    icon: Activity,
    question: "Why is the chatbot sometimes slow?",
    answer: "Response times depend on server load and the complexity of your query. If the system is analyzing a large document to find your answer, it might take a few extra seconds."
  }
];

const HelpSupportModal = ({ isOpen, onClose }) => {
  const [activeFaq, setActiveFaq] = useState(0); // First one open by default
  const [msg, setMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Feedback sent! We'll look into it.");
      setMsg('');
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#121212] w-full max-w-2xl h-[85vh] flex flex-col rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#121212]">
          <div>
             <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
               <MessageCircle className="h-6 w-6 text-[#00B291]" />
               Help & Support
             </h2>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get help with the chatbot</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* System Status Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 p-4 rounded-xl flex items-start gap-3">
             <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg shrink-0">
               <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
             </div>
             <div>
               <h4 className="text-sm font-bold text-blue-800 dark:text-blue-200">System Status: Operational</h4>
               <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                 The AI model (Gemini-Flash) and Campus Database are currently online and responding normally.
               </p>
             </div>
          </div>

          {/* FAQs Section */}
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Common Questions</h3>
            <div className="space-y-3">
              {CHATBOT_FAQS.map((faq, idx) => {
                const Icon = faq.icon;
                return (
                  <div key={idx} className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all duration-200 bg-white dark:bg-[#1a1a1a]">
                    <button 
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${activeFaq === idx ? 'bg-[#00B291]/10 text-[#00B291]' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className={`font-semibold text-sm ${activeFaq === idx ? 'text-[#00B291]' : 'text-gray-700 dark:text-gray-200'}`}>
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="p-4 pt-0 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-transparent pl-[3.25rem]">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Developer Contact Card (New Section) */}
          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Developer Contact</h3>
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl group transition-all hover:border-[#00B291]/30">
               <div className="p-3 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm group-hover:scale-105 transition-transform">
                  <Mail className="h-5 w-5 text-[#00B291]" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Lead Developer</p>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">Shaik Aman</h4>
                  <a href="mailto:shaikaman2411@gmail.com" className="text-xs text-[#00B291] hover:underline font-medium">
                    shaikaman2411@gmail.com
                  </a>
               </div>
            </div>
          </section>

          {/* Contact Form */}
          <section>
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Report a Bug</h3>
             <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div className="relative">
                  <textarea 
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Describe the bug or feature request..."
                    className="w-full p-4 h-32 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-[#00B291] focus:border-transparent outline-none resize-none dark:text-white text-sm transition-all"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={!msg.trim() || isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 bg-[#00B291] disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#009e80] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00B291]/20"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </button>
             </form>
          </section>

        </div>
      </div>
    </div>
  );
};

export default HelpSupportModal;