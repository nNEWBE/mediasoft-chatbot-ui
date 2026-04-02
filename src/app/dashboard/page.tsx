'use client';

import {
  Send, Bot, Plus, Loader2, User,
  LineChart, Boxes, Store, Code,
  Settings, LayoutDashboard, ChevronDown, Square
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatStore } from '@/store/chatStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function TypewriterMarkdown({ content, isLast }: { content: string; isLast: boolean }) {
  const [displayedContent, setDisplayedContent] = useState(isLast ? '' : content);
  const [isTypingLocal, setIsTypingLocal] = useState(isLast);
  const { setIsTyping, isTyping } = useChatStore();

  useEffect(() => {
    if (!isLast) {
      setDisplayedContent(content);
      setIsTypingLocal(false);
      return;
    }

    let index = 0;
    const speed = 15;
    const charsPerChunk = 2;

    setDisplayedContent('');
    setIsTypingLocal(true);
    setIsTyping(true);

    const interval = setInterval(() => {
      index += charsPerChunk;
      if (index >= content.length) {
        setDisplayedContent(content);
        setIsTypingLocal(false);
        setIsTyping(false);
        clearInterval(interval);
      } else {
        setDisplayedContent(content.slice(0, index));
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
          p: ({ node, ...props }) => <div className="mb-4 last:mb-0 leading-[1.6] text-zinc-300 font-medium tracking-tight" {...props} />,
          ul: ({ node, ...props }) => <ul className="mb-6 space-y-4 list-none p-0 m-0" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal ml-8 mb-6 space-y-4 text-zinc-300 marker:font-bold marker:text-zinc-500" {...props} />,
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
              <li className={`relative pl-6 leading-[1.6] group/li list-none ${isTyping ? 'shimmer-text' : ''}`} {...props}>
                <div className="absolute left-0 top-[0.65em] w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover/li:bg-blue-500 transition-all duration-300 shadow-[0_0_8px_rgba(59,130,246,0)] group-hover/li:shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                {stripper(children)}
              </li>
            );
          },
          strong: ({ node, ...props }) => <strong className="font-bold text-white tracking-tight" {...props} />,
          h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-4 mt-8 first:mt-0 font-space text-white uppercase tracking-tighter" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-sm font-bold mb-3 mt-6 first:mt-0 font-space text-zinc-500 uppercase tracking-widest bg-zinc-800/20 inline-block px-2 py-0.5 rounded" {...props} />,
          table: ({ node, ...props }) => (
            <div className="w-full overflow-x-auto my-6 border border-zinc-800/50 rounded-xl bg-zinc-950/20 shadow-2xl">
              <table className="w-full text-left border-collapse" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-zinc-900/50 border-b border-zinc-800/50" {...props} />,
          th: ({ node, ...props }) => <th className="px-5 py-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap" {...props} />,
          td: ({ node, ...props }) => <td className="px-5 py-3.5 text-[13px] border-b border-zinc-800/20 text-zinc-300 align-top font-medium leading-relaxed" {...props} />,
          tr: ({ node, ...props }) => <tr className="border-b border-zinc-800/10 last:border-0 hover:bg-white/2 transition-colors" {...props} />,
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const rawContent = String(children);
            const content = rawContent.trim();

            // Only render multi-line block if it actually has content
            const isMultiLine = (rawContent.includes('\n') || !inline) && content.length > 0;

            if (isMultiLine) {
              return (
                <div className="rounded-xl overflow-hidden my-6 border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] group/code relative animate-in fade-in zoom-in-95 duration-300">
                  <div className="bg-zinc-900/60 px-5 py-3 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 opacity-50">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                      </div>
                      {match && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-2">{match[1]}</span>
                      )}
                    </div>
                    <div className="opacity-0 group-hover/code:opacity-100 transition-opacity">
                      <button className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 hover:text-white transition-colors" onClick={() => navigator.clipboard.writeText(content)}>Copy</button>
                    </div>
                  </div>
                  <div className="p-0 selection:bg-white selection:text-black">
                    <SyntaxHighlighter
                      language={match ? match[1] : 'text'}
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: content.includes('\n') ? '24px' : '16px 24px',
                        background: 'transparent',
                        fontSize: '13px',
                        lineHeight: '1.7',
                        fontFamily: 'var(--font-mono), monospace',
                      }}
                      codeTagProps={{
                        style: {
                          fontFamily: 'inherit',
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
              <code className="bg-white/10 text-white px-1.5 py-0.5 rounded text-[13px] font-mono border border-white/10 shadow-sm font-semibold selection:bg-white selection:text-black inline-block align-middle my-0.5" {...props}>
                {content || children}
              </code>
            );
          },
          a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4 decoration-blue-400/30 hover:decoration-blue-300 transition-all" {...props} />,
        }}
      >
        {displayedContent}
      </ReactMarkdown>
    </div>
  );
}

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
    setShowScrollButton(isScrolledUp);
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const observer = new ResizeObserver(() => {
      // Auto-scroll if we are near the bottom
      const container = scrollContainerRef.current;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
        if (isNearBottom || isSending) {
          scrollToBottom('auto');
        }
      }
    });

    // Also observe the children of the message list specifically
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
    <div className="flex flex-col h-full bg-black text-white overflow-hidden font-outfit antialiased">
      <div className="px-4 lg:px-6 py-3 border-b border-zinc-800/10 bg-black/90 z-20 shrink-0">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-lg">
              <Bot className={`w-5 h-5 text-black ${isSending ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h2 className="font-bold text-base text-white font-space tracking-tight leading-none uppercase">
                {currentConversation ? currentConversation.title : 'New Session'}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <p className="text-[8px] uppercase tracking-widest text-zinc-600 font-bold">Secure AI Pipeline Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={startNewChat}
              className="flex items-center gap-2 text-zinc-500 hover:text-white border-zinc-800/50 hover:bg-zinc-800/50 rounded-lg px-3 h-8 transition-all shrink-0 font-bold text-[10px] uppercase tracking-widest"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </Button>
          </div>
        </div>
      </div>

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
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto shadow-xl relative">
                    <Bot size={32} className="text-black" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black" />
                  </div>
                  <div className="space-y-1.5 px-4">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white font-space tracking-tight leading-none uppercase">How can I help you?</h2>
                    <p className="text-zinc-500 max-w-sm mx-auto text-xs leading-relaxed font-medium mt-3">
                      Secure AI Assistant Ready. Access your retail data, cloud ecosystems, and enterprise architecture.
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
                  const filteredMessages = currentConversation.messages.filter(m => m.role !== 'system');
                  return filteredMessages.map((msg, idx) => (
                    <div
                      key={`${currentConversation._id}-${idx}`}
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

                        <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`transition-all relative overflow-hidden ${msg.role === 'user'
                              ? 'px-5 py-2.5 rounded-2xl text-[14px] font-semibold bg-white text-black rounded-br-none shadow-[0_10px_40px_rgba(255,255,255,0.1)] border border-white'
                              : 'px-6 py-4 rounded-2xl text-[16px] leading-relaxed bg-zinc-900 text-white rounded-bl-none border border-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.3)] font-mixed'
                            }`}>
                            {msg.role !== 'user' && (
                              <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
                            )}
                            {msg.role === 'user' ? (
                              msg.content
                            ) : (
                              <div className={`flex flex-col gap-1 w-full max-w-none ${idx === filteredMessages.length - 1 ? 'animate-in fade-in slide-in-from-bottom-2' : ''}`}>
                                {(() => {
                                  const isLast = idx === filteredMessages.length - 1;
                                  return (
                                    <TypewriterMarkdown
                                      content={msg.content}
                                      isLast={isLast}
                                    />
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ));
                })()}

                {isSending && (
                  <div className="flex w-full animate-in fade-in slide-in-from-bottom-3 duration-500 justify-start">
                    <div className="flex gap-4 max-w-[92%] lg:max-w-[85%] flex-row">
                      <div className="shrink-0 flex flex-col justify-end mb-1">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all shadow-md bg-zinc-900 border-zinc-800">
                          <Bot size={14} className="text-zinc-400 animate-pulse" />
                        </div>
                      </div>
                      <div className="flex flex-col items-start font-hind">
                        <div className={`px-5 py-3 rounded-2xl bg-white/5 text-zinc-400 rounded-bl-none border border-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center gap-4`}>
                          <div className="flex gap-2 items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 animate-bounce" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Thinking...</span>
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
              className="relative group flex items-center gap-3"
            >
              <div className="flex-1 bg-zinc-950 border border-zinc-800/80 rounded-xl focus-within:border-zinc-700 focus-within:bg-black transition-all shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/5 to-transparent" />

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
                  placeholder="Ask Mediasoft AI anything about your enterprise architecture..."
                  className="w-full bg-transparent border-none focus:outline-none resize-none py-4 pl-6 pr-16 text-white placeholder-zinc-800 max-h-40 text-[14px] font-bold tracking-tight"
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
              <span className="text-[12px] font-bold text-zinc-400 whitespace-nowrap">
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
            className="fixed bottom-32 right-12 z-50 w-10 h-10 rounded-full bg-white text-black shadow-2xl flex items-center justify-center hover:bg-zinc-200 transition-all border-4 border-black/20 group backdrop-blur-md"
            aria-label="Scroll to bottom"
          >
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping group-hover:hidden" />
            <ChevronDown className="w-5 h-5 relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-zinc-950 w-full max-w-md rounded-2xl p-8 border border-zinc-800 relative overflow-hidden"
            >
              <div className="flex justify-center mb-6 mt-2">
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center">
                  <Bot size={32} className="text-black" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-center text-white mb-2 font-space uppercase">Welcome to Mediasoft AI</h2>
              <p className="text-zinc-400 text-center text-sm mb-8 leading-relaxed">
                Your AI-powered assistant is ready. Access real-time intelligence, manage your ecosystems, and streamline your workflow with enterprise-grade precision.
              </p>

              <div className="flex gap-3 w-full justify-center">
                <Button
                  onClick={() => setShowWelcomeModal(false)}
                  variant="outline"
                  className="flex-1 max-w-[160px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 h-11 rounded-xl text-zinc-300 font-medium flex items-center justify-center gap-2 transition-all text-sm uppercase"
                >
                  <Settings className="w-4 h-4" />
                  Configure
                </Button>
                <Button
                  onClick={() => setShowWelcomeModal(false)}
                  className="flex-1 max-w-[190px] bg-white h-11 rounded-xl text-black font-medium flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all text-sm uppercase"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Access Dashboard
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
