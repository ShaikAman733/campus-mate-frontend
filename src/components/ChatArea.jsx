// components/ChatArea.js
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FileText } from 'lucide-react';

import botLogo from '../assets/campus-logo.png';

const ChatArea = ({ messages, isLoading, suggestionText, currentUser }) => {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  return (
    <div className="relative flex-1 h-full overflow-hidden bg-gray-50 dark:bg-[#0a0a0a]">
      <div ref={scrollContainerRef} onScroll={handleScroll} className="h-full overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6 scroll-smooth">
        
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 animate-fade-in">
            <div className="flex flex-col items-center justify-center w-full max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 tracking-tight">
                {currentUser ? (
                  <>Hello <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B291] to-[#00F5C8] capitalize">{currentUser.username}</span> !</>
                ) : ( "Hi there !" )}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-lg">I'm your campus assistant. <br /> I can help you survive college life.</p>
              <div className="h-8 mb-10 overflow-hidden">
                <span key={suggestionText} className="text-xl md:text-2xl font-medium text-[#00B291] dark:text-[#00F5C8] animate-slide-up block">{suggestionText}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4 md:space-y-6 pb-4">
            {messages.map((msg, index) => {
              const isUser = msg.type === 'user';
              return (
                <div key={index} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`flex max-w-[90%] md:max-w-[75%] gap-2 md:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* AVATAR CONTAINER - Only show for bot */}
                    {!isUser && (
                      <div className={`shrink-0 h-8 w-8 md:h-12 md:w-12 rounded-full flex items-center justify-center text-xs font-bold shadow-sm select-none overflow-hidden dark:bg-[#1a1a1a] dark:border-gray-700`}>
                        <img 
                          src={botLogo} 
                          alt="AI" 
                          className="shrink-0 h-8 w-8 md:h-12 md:w-12 object-contain" 
                        />
                      </div>
                    )}

                    {/* MESSAGE BUBBLE */}
                    <div className={`relative px-3 py-2 md:px-5 md:py-3.5 text-sm md:text-base shadow-sm ${isUser ? 'bg-white text-gray-800 dark:bg-[#262626] dark:text-gray-100 rounded-2xl rounded-tr-sm' : 'bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm'}`}>
                      
                      {msg.file && (
                        <div className="mb-3 p-2 bg-gray-100 dark:bg-[#333] rounded-lg flex items-center gap-3 border border-gray-200 dark:border-gray-600">
                            <div className="p-2 bg-white dark:bg-black rounded-full">
                              <FileText className="h-5 w-5 text-[#00B291]" />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-xs font-bold truncate max-w-[150px]">{msg.file.name}</span>
                              <span className="text-[10px] opacity-70 uppercase">{msg.file.type.split('/')[1] || 'FILE'}</span>
                            </div>
                        </div>
                      )}

                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                          ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 md:mb-3 space-y-1" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 md:mb-3 space-y-1" {...props} />,
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 mt-4" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2 mt-3" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1 mt-2" {...props} />,
                          a: ({ node, ...props }) => <a className="text-[#00B291] hover:underline break-all" target="_blank" rel="noopener noreferrer" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-1 md:mb-2 last:mb-0 leading-relaxed" {...props} />,
                          code: ({ node, inline, className, children, ...props }) => inline ? <code className="bg-gray-100 dark:bg-gray-800 text-red-500 dark:text-red-400 px-1 py-0.5 rounded font-mono text-xs" {...props}>{children}</code> : <div className="overflow-x-auto my-2 md:my-3 rounded-lg border border-gray-200 dark:border-gray-700"><code className="block bg-gray-50 dark:bg-[#111] p-2 md:p-3 font-mono text-xs md:text-sm text-gray-800 dark:text-gray-300" {...props}>{children}</code></div>,
                          table: ({ node, ...props }) => <div className="overflow-x-auto my-3 md:my-4"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-700" {...props} /></div>,
                          th: ({ node, ...props }) => <th className="px-3 py-2 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />,
                          td: ({ node, ...props }) => <td className="px-3 py-2 whitespace-nowrap text-sm border-t dark:border-gray-700" {...props} />,
                        }}>
                        {msg.text}
                      </ReactMarkdown>
                      <div className={`text-[10px] mt-1 select-none opacity-60 flex items-center gap-1 ${isUser ? 'justify-end' : 'justify-start'}`}>{msg.time}{isUser && <span>• Sent</span>}</div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex w-full justify-start animate-pulse">
                <div className="flex max-w-[90%] md:max-w-[75%] gap-2 md:gap-3">
                  <img src={botLogo} alt="Loading..." className="shrink-0 h-8 w-8 md:h-12 md:w-12 object-contain opacity-70" />
                  <div className="flex items-center gap-1 px-3 py-2 md:px-4 md:py-3 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl rounded-tl-sm">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-px" />
          </div>
        )}
      </div>
      {showScrollButton && (
        <button onClick={scrollToBottom} className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-gray-700 shadow-xl rounded-full p-2 text-[#00B291] hover:scale-110 transition-transform z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </button>
      )}
    </div>
  );
};

export default ChatArea;