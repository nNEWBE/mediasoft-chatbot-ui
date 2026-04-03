'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Bot, Plus, Loader2, User,
  LineChart, Boxes, Store, Code,
  Settings, LayoutDashboard, ChevronDown, Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatStore } from '@/store/chatStore';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ConfirmationModal } from '@/components/ConfirmationModal';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TypewriterMarkdown = React.memo(function TypewriterMarkdown({ content, isLast, isNew }: { content: string; isLast: boolean; isNew: boolean }) {
  const [displayedContent, setDisplayedContent] = useState(isNew ? '' : content);
  const [isTypingLocal, setIsTypingLocal] = useState(isNew);
  const { setIsTyping, isTyping } = useChatStore();

  useEffect(() => {
    if (!isNew) {
      setDisplayedContent(content);
      setIsTypingLocal(false);
      return;
    }

    let index = 0;
    const speed = 10;

    setDisplayedContent('');
    setIsTypingLocal(true);
    setIsTyping(true);

    const interval = setInterval(() => {
      index += 3;
      if (index >= content.length) {
        setDisplayedContent(content);
        setIsTypingLocal(false);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        let slicePoint = index;
        const currentSlice = content.slice(0, index);
        
        const lastOpenBracket = currentSlice.lastIndexOf('[');
        const lastCloseBracket = currentSlice.lastIndexOf(']');
        const lastBacktick = currentSlice.lastIndexOf('`');
        
        if (lastOpenBracket > lastCloseBracket && lastOpenBracket > index - 20) {
          const nextCloseBracket = content.indexOf(']', index);
          if (nextCloseBracket !== -1 && nextCloseBracket < content.length) {
            slicePoint = nextCloseBracket + 1;
          }
        } else if (lastBacktick % 2 === 1) {
          const nextBacktick = content.indexOf('`', index);
          if (nextBacktick !== -1) {
            slicePoint = nextBacktick + 1;
          }
        }

        setDisplayedContent(content.slice(0, Math.min(slicePoint, content.length)));
      }
    }, speed);

    return () => {
      clearInterval(interval);
      setIsTyping(false);
    };
  }, [content, isLast, setIsTyping]);

  useEffect(() => {
    if (!isTyping && isLast && isTypingLocal) {
      setDisplayedContent(content);
      setIsTypingLocal(false);
    }
  }, [isTyping, isLast, isTypingLocal, content]);

  return (
    <div className="relative group/markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, children, ...props }) => (
            <p className="mb-3 last:mb-0 leading-relaxed text-zinc-100 font-normal" {...props}>
              {children}
            </p>
          ),
          ul: ({ node, children, ...props }) => (
            <ul className="mb-4 mt-2 space-y-1.5 list-none pl-1" {...props}>
              {children}
            </ul>
          ),
          ol: ({ node, children, ...props }) => (
            <ol className="list-decimal ml-6 mb-4 mt-2 space-y-1.5 text-zinc-100" {...props}>
              {children}
            </ol>
          ),
          li: ({ node, children, ...props }: any) => {
            const stripper = (content: any): any => {
              if (typeof content === 'string') {
                return content.replace(/^[\s\u2022\u25CF\u25CB\u25A0\u25AA\u25AB\u2013\u2014\u203A\u203B•●○■▪▫–—›»·]+/u, '').trimStart();
              }
              if (Array.isArray(content)) {
                const res = [...content];
                if (res.length > 0) res[0] = stripper(res[0]);
                return res;
              }
              if (content?.props?.children) {
                return { ...content, props: { ...content.props, children: stripper(content.props.children) } };
              }
              return content;
            };
            return (
              <li className="relative pl-5 py-0.5 leading-relaxed group/li" {...props}>
                <div className="absolute left-0 top-[0.7em] w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover/li:bg-white transition-all duration-200" />
                {stripper(children)}
              </li>
            );
          },
          strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-zinc-200" {...props} />,
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mb-4 mt-6 first:mt-0 text-white border-b border-zinc-800 pb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-semibold mb-3 mt-5 first:mt-0 text-white" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-semibold mb-2 mt-4 first:mt-0 text-zinc-100" {...props} />
          ),
          blockquote: ({ node, children, ...props }) => (
            <blockquote className="border-l-3 border-white pl-4 py-2 m-4 bg-zinc-900/50 rounded-r-lg italic text-zinc-300" {...props}>
              {children}
            </blockquote>
          ),
          hr: ({ node, ...props }) => (
            <hr className="border-zinc-800 my-6" {...props} />
          ),
          table: ({ node, children, ...props }) => (
            <div className="w-full overflow-x-auto my-4 border border-zinc-800 rounded-lg">
              <table className="w-full text-left border-collapse text-sm" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-zinc-900 border-b border-zinc-800" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wide whitespace-nowrap border-r border-zinc-800 last:border-0" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-2.5 border-b border-zinc-800/50 text-zinc-200 border-r last:border-0 align-top" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="border-b border-zinc-800/30 last:border-0 hover:bg-zinc-900/30 transition-colors" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const rawContent = String(children);
            const content = rawContent.trim();

            const hasLanguage = match !== null;
            const isMultiLineCode = rawContent.includes('\n') && content.length > 0;

            if (hasLanguage || isMultiLineCode) {
              return (
                <div className="rounded-lg overflow-hidden my-4 border border-zinc-800 bg-zinc-950 shadow-lg group/code relative">
                  <div className="bg-zinc-900 px-4 py-2.5 flex items-center justify-between border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                      </div>
                      {match && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 ml-2">{match[1]}</span>
                      )}
                    </div>
                    <div className="opacity-0 group-hover/code:opacity-100 transition-opacity">
                      <button
                        className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 hover:text-white transition-colors"
                        onClick={() => navigator.clipboard.writeText(content)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="p-0 overflow-x-auto">
                    <SyntaxHighlighter
                      language={match ? match[1] : 'text'}
                      customStyle={{
                        margin: 0,
                        padding: '16px',
                        background: 'transparent',
                        fontSize: '13px',
                        lineHeight: '1.6',
                        fontFamily: 'inherit',
                        color: '#e4e4e7',
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: 'inherit',
                          color: '#e4e4e7',
                        }
                      }}
                    >
                      {content}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );
            }

            return (
              <code className="bg-zinc-800/80 text-zinc-100 px-1.5 py-0.5 rounded text-sm font-mono border border-zinc-700/50 inline align-baseline" {...props}>
                {content || children}
              </code>
            );
          },
          pre: ({ node, children, ...props }) => (
            <pre className="mb-4 mt-2 p-0 bg-transparent rounded-lg overflow-hidden" {...props}>
              {children}
            </pre>
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-white hover:text-zinc-300 font-medium underline underline-offset-4 decoration-white/40 hover:decoration-zinc-300 transition-all wrap-break-word"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
        }}
      >
        {displayedContent}
      </ReactMarkdown>
    </div>
  );
});

export default function DashboardPage() {
  const [input, setInput] = useState('');
  const {
    currentConversation,
    conversations,
    isLoading,
    isSending,
    startNewChat,
    sendMessage,
    stopGeneration,
    isTyping
  } = useChatStore();

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('mediasoft_welcome_seen');
    if (!hasSeenWelcome) {
      setShowWelcomeModal(true);
      sessionStorage.setItem('mediasoft_welcome_seen', 'true');
    }
  }, []);

  const sessionFilteredCountRef = useRef(0);
  const lastIdRef = useRef<string | null>(null);

  const filteredMessages = currentConversation?.messages.filter(m => m.role !== 'system') || [];

  if (currentConversation?._id !== lastIdRef.current) {
    sessionFilteredCountRef.current = filteredMessages.length || 0;
    lastIdRef.current = currentConversation?._id || null;
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 300;
    
    // Only update state if value actually changed to minimize re-renders
    setShowScrollButton(prev => {
      if (prev !== isScrolledUp) return isScrolledUp;
      return prev;
    });
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const observer = new ResizeObserver(() => {
      const container = scrollContainerRef.current;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
        if (isNearBottom || isSending) {
          scrollToBottom('auto');
        }
      }
    });

    const messageList = scrollContainerRef.current.querySelector('.space-y-10');
    if (messageList) observer.observe(messageList);

    return () => observer.disconnect();
  }, [isSending]);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage = input;
    setInput('');
    await sendMessage(userMessage);
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-zinc-100 overflow-hidden font-outfit antialiased">
      <DashboardHeader
        title={currentConversation ? currentConversation.title : 'MediaSoft AI'}
        subtitle="Secure AI Pipeline Online"
        isBotWorking={isSending}
        onAction={startNewChat}
        actionText="New Chat"
      />

      <div className="flex-1 relative overflow-hidden flex flex-col">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 lg:px-6 py-8 scroll-smooth transform-gpu will-change-scroll scrollbar-hide flex flex-col"
        >
          <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col min-h-full">
            {isLoading && conversations.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-20">
                <Loader2 className="w-8 h-8 animate-spin text-white/10" />
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">Connecting to Core...</p>
              </div>
            ) : !currentConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6 animate-in fade-in duration-700">
                <div className="space-y-4 mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto shadow-2xl relative mb-8">
                    <Bot size={44} className="text-black" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-4 border-black" />
                  </div>
                  <div className="space-y-4 px-4 overflow-hidden w-full">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-space tracking-tight leading-tight uppercase wrap-break-word">
                      How can I <span className="gradient-text">Help you?</span>
                    </h2>
                    <p className="text-zinc-500 max-w-sm mx-auto text-[10px] lg:text-sm leading-relaxed font-medium mt-4 lg:mt-6 uppercase tracking-widest opacity-80">
                      Secure AI Assistant Ready
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl px-4">
                  {[
                    { title: "Retail Intelligence", sub: "Marigold POS", icon: LineChart, msg: "Analyze the sales velocity of the Marigold POS ecosystem across all outlets" },
                    { title: "Supply Chain", sub: "ERP Synchronization", icon: Boxes, msg: "Audit stock variance between our showroom inventory and the central ERP records" },
                    { title: "System Health", sub: "Cloud Ecosystem", icon: Store, msg: "Check the current status of the automated data reconciliation pipeline" },
                    { title: "Finance & Tax", sub: "Business Rules", icon: Code, msg: "Explain the VAT calculation logic for multi-currency transactions in the accounts module" }
                  ].map((tip, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      onClick={() => !isSending && sendMessage(tip.msg)}
                      className="h-auto p-4 text-left justify-start border-zinc-800/40 hover:border-zinc-700 hover:bg-zinc-900/40 bg-zinc-950/20 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-800 group-hover:bg-white group-hover:border-white transition-all">
                          <tip.icon className="w-4 h-4 text-zinc-500 group-hover:text-black transition-colors" />
                        </div>
                        <div className="text-left leading-none uppercase">
                          <p className="font-bold text-white text-[13px] group-hover:translate-x-0.5 transition-transform">{tip.title}</p>
                          <p className="text-[7px] tracking-widest text-zinc-600 mt-1.5 font-bold">{tip.sub}</p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-10 w-full pb-10">
                {(() => {
                  return filteredMessages.map((msg, idx) => {
                    const isLast = idx === filteredMessages.length - 1;
                    const isNew = idx >= sessionFilteredCountRef.current;
                    const msgId = `${currentConversation._id}-${idx}`;

                    return (
                      <div
                        key={msgId}
                        className={`flex w-full animate-in fade-in slide-in-from-bottom-3 duration-500 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-4 max-w-[92%] lg:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className="shrink-0 flex flex-col justify-end mb-1">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all shadow-md ${msg.role === 'user'
                                ? 'bg-white border-zinc-200'
                                : 'bg-zinc-900 border-zinc-800'
                              }`}>
                              {msg.role === 'user' ? <User size={14} className="text-black" /> : <Bot size={14} className="text-zinc-400" />}
                            </div>
                          </div>

                          <div className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`transition-all relative overflow-hidden w-full ${msg.role === 'user'
                                ? 'px-4 lg:px-6 py-3 lg:py-3.5 rounded-2xl font-bold text-[13px] lg:text-[15px] bg-white text-black rounded-br-none shadow-2xl border border-white'
                                : 'px-5 lg:px-8 py-4 lg:py-6 rounded-2xl text-[14px] lg:text-[16px] leading-relaxed bg-white/10 text-white rounded-bl-none border border-white/10 shadow-2xl font-mixed'
                              }`}>
                              {msg.role !== 'user' ? (
                                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
                              ) : (
                                <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-black/5 to-transparent pointer-events-none" />
                              )}
                              {msg.role === 'user' ? (
                                msg.content
                              ) : (
                                <div className={`flex flex-col gap-1 w-full max-w-none ${isLast ? 'animate-in fade-in slide-in-from-bottom-2' : ''}`}>
                                  <TypewriterMarkdown
                                    content={msg.content}
                                    isLast={isLast}
                                    isNew={isNew}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}

                {isSending && (
                  <div className="flex w-full animate-in fade-in slide-in-from-bottom-3 duration-500 justify-start">
                    <div className="flex gap-4 max-w-[92%] lg:max-w-[85%] flex-row">
                      <div className="shrink-0 flex flex-col justify-end mb-1">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all shadow-md bg-zinc-900 border-zinc-800">
                          <Bot size={14} className="text-zinc-400 animate-pulse" />
                        </div>
                      </div>
                      <div className="flex flex-col items-start font-hind w-full">
                        <div className={`px-4 lg:px-6 py-3 lg:py-4 rounded-2xl bg-white/5 backdrop-blur-md text-zinc-400 rounded-bl-none border border-white/10 shadow-2xl flex items-center gap-3 lg:gap-4`}>
                          <div className="flex gap-2 items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white animate-pulse">Analyzing Session...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} className="min-h-[150px] w-full pointer-events-none" />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-zinc-900/5 blur-3xl -z-10 rounded-full" />
        <div
          className="absolute top-0 left-0 right-0 h-6 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0px, transparent 24px)',
            transform: 'translateZ(0)'
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 isolate px-4 lg:px-8 pb-4 lg:pb-6 z-40">
          <div
            className="absolute inset-x-0 bottom-0 h-64 pointer-events-none -z-10"
            style={{
              background: 'linear-gradient(to top, #000 0px, #000 84px, rgba(0,0,0,0.8) 120px, rgba(0,0,0,0.4) 160px, transparent 240px)',
              transform: 'translateZ(0)'
            }}
          />

          <div className="w-full max-w-4xl mx-auto relative flex flex-col pt-6">
            <form
              onSubmit={handleSendMessage}
              className="relative group flex items-center gap-4"
            >
              <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl focus-within:border-white/10 transition-all shadow-2xl relative overflow-hidden p-1">
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

                  <textarea
                    rows={1}
                    value={input}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Mediasoft AI..."
                    className="w-full bg-transparent border-none focus:outline-none resize-none py-3.5 lg:py-4 pl-4 lg:pl-6 pr-14 lg:pr-16 text-white placeholder-zinc-800 max-h-40 text-[13px] lg:text-[14px] font-bold tracking-tight"
                  />

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                  <Button
                    type={(isSending || isTyping) ? "button" : "submit"}
                    onClick={(isSending || isTyping) ? (e) => { e.preventDefault(); stopGeneration(); } : undefined}
                    disabled={!input.trim() && !isSending && !isTyping}
                    className={`w-10 h-10 rounded-lg transition-all active:scale-95 shrink-0 shadow-lg ${(isSending || isTyping)
                        ? 'bg-red-500/90 hover:bg-red-500 text-white border-red-500/50'
                        : 'bg-white hover:bg-zinc-200 text-black border-transparent'
                      } disabled:bg-zinc-900 disabled:text-zinc-700 disabled:opacity-100 disabled:border-zinc-800`}
                  >
                    {(isSending || isTyping) ? <Square size={16} fill="currentColor" className="animate-pulse" /> : <Send size={16} />}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-4 flex items-center justify-center gap-2.5 opacity-40 group transition-opacity">
              <div className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-600 flex items-center justify-center shadow-inner">
                <Bot size={10} className="text-zinc-200" />
              </div>
              <span className="text-[10px] lg:text-[12px] font-bold text-zinc-400 text-center">
                Architecture is the synchronization of structure and intent
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={() => scrollToBottom()}
            className="fixed bottom-24 sm:bottom-32 right-4 sm:right-12 z-50 w-10 h-10 rounded-full bg-white text-black shadow-2xl flex items-center justify-center hover:bg-zinc-200 transition-all border-4 border-black/20 group backdrop-blur-md"
            aria-label="Scroll to bottom"
          >
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping group-hover:hidden" />
            <ChevronDown className="w-5 h-5 relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>


      <ConfirmationModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        onConfirm={() => setShowWelcomeModal(false)}
        title="Secure Intelligence"
        description="Your high-fidelity AI pipeline is currently active and ready for archival synchronization."
        confirmText="Access Dashboard"
        abortText="Configure"
        confirmIcon={LayoutDashboard}
        abortIcon={Settings}
        icon={Bot}
        footerText="Core Ecosystem Online"
      >
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="w-1 h-1 rounded-full bg-white/20 animate-pulse" />
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Module 01 Active</span>
          <div className="w-1 h-1 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </ConfirmationModal>
    </div>
  );
}
