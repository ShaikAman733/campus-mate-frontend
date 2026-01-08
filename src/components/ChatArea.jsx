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
                ) : ("Hi there !")}
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
                  <div className={`flex max-w-[95%] md:max-w-[85%] gap-2 md:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} min-w-0`}>

                    {!isUser && (
                      <div className={`shrink-0 h-8 w-8 md:h-12 md:w-12 rounded-full flex items-center justify-center shadow-sm select-none overflow-hidden dark:bg-[#1a1a1a]`}>
                        <img
                          src={botLogo}
                          alt="AI"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}

                    
                    <div className={`relative px-3 py-2 md:px-5 md:py-3.5 text-sm md:text-base shadow-sm min-w-0 overflow-hidden ${isUser ? 'bg-white text-gray-800 dark:bg-[#262626] dark:text-gray-100 rounded-2xl rounded-tr-sm' : 'bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm'}`}>

                      {msg.file && (
                        <div className="mb-3 p-2 bg-gray-100 dark:bg-[#333] rounded-lg flex items-center gap-3 border border-gray-200 dark:border-gray-600">
                          <div className="p-2 bg-white dark:bg-black rounded-full">
                            <FileText className="h-5 w-5 text-[#00B291]" />
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-bold truncate max-w-[120px] md:max-w-[200px]">{msg.file.name}</span>
                            <span className="text-[10px] opacity-70 uppercase">{msg.file.type.split('/')[1] || 'FILE'}</span>
                          </div>
                        </div>
                      )}

                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 md:mb-3 space-y-1 text-sm md:text-base" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 md:mb-3 space-y-1 text-sm md:text-base" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed break-words text-sm md:text-base" {...props} />,

                          // MOBILE OPTIMIZED CODE BLOCK
                          code: ({ node, inline, className, children, ...props }) =>
                            inline ? (
                              <code className="bg-gray-100 dark:bg-gray-800 text-[#ff4a4a] px-1.5 py-0.5 rounded font-mono text-[11px] md:text-xs" {...props}>
                                {children}
                              </code>
                            ) : (
                              <div className="w-full my-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0d0d0d] overflow-hidden shadow-sm">
                                {/* Terminal Header */}
                                <div className="flex items-center justify-between px-3 py-2 bg-gray-200/50 dark:bg-white/5 border-b border-gray-200 dark:border-gray-800">
                                  <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                                  </div>
                                  <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Editor</span>
                                </div>

                                {/* Scrollable Code Area */}
                                <div className="overflow-x-auto custom-scrollbar">
                                  <code
                                    className="block p-4 font-mono text-[11px] md:text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap break-all md:break-normal leading-relaxed"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                </div>
                              </div>
                            ),

                          // MOBILE OPTIMIZED TABLE
                          table: ({ node, ...props }) => (
                            <div className="w-full overflow-hidden my-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                              <div className="overflow-x-auto custom-scrollbar">
                                {/* table-fixed can sometimes be better if you have specific widths, but table-auto is safer for mixed content */}
                                <table className="w-full table-auto border-collapse text-left" {...props} />
                              </div>
                            </div>
                          ),
                          th: ({ node, ...props }) => (
                            <th className="px-3 py-2.5 bg-gray-100 dark:bg-[#1a1a1a] text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b dark:border-gray-800" {...props} />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="px-3 py-3 text-[12px] md:text-sm border-b last:border-0 dark:border-gray-800 leading-snug break-words min-w-[100px] align-top" {...props} />
                          ),
                        }}
                      >
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