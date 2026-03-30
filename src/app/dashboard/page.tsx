'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, Send, Plus, MessageSquare, Database, Settings, 
  LogOut, BookOpen, User, Hash, Paperclip, 
  History, Info, MoreVertical, Loader2, ArrowRight, Zap, LayoutDashboard, X, Save
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function DashboardPage() {
  const { 
    conversations, 
    currentConversation, 
    resources, 
    isLoading, 
    isSending,
    fetchConversations,
    fetchResources,
    selectConversation,
    startNewChat,
    sendMessage,
    createResource,
    updateContext
  } = useChatStore();

  const { user, logout } = useAuthStore();

  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceContent, setResourceContent] = useState('');
  
  const [contextInput, setContextInput] = useState('');
  const [isEditingContext, setIsEditingContext] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (sessionStorage.getItem('showWelcomeModal') === 'true') {
      setShowWelcomeModal(true);
      sessionStorage.removeItem('showWelcomeModal');
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    fetchResources();
  }, [fetchConversations, fetchResources]);

  useEffect(() => {
    scrollToBottom();
    if (currentConversation) {
       setContextInput(currentConversation.context || '');
       setIsEditingContext(false);
    }
  }, [currentConversation]);

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle.trim() || !resourceContent.trim()) return;
    await createResource(resourceTitle, resourceContent);
    setShowResourceModal(false);
    setResourceTitle('');
    setResourceContent('');
  };

  const handleUpdateContext = async () => {
    if (!currentConversation) return;
    await updateContext(currentConversation._id, contextInput);
    setIsEditingContext(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage = input;
    setInput('');
    await sendMessage(userMessage);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="flex h-screen bg-surface text-white/90 overflow-hidden font-outfit">
      

      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 300 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="glass-effect border-r border-white/5 flex flex-col z-20 overflow-hidden"
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-brand-primary to-brand-secondary flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" />
             </div>
             <span className="font-bold tracking-tight text-white font-space">History</span>
          </div>
          <Button variant="ghost" size="icon" onClick={startNewChat} className="text-brand-primary hover:bg-white/5">
            <Plus size={20} />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4 space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv._id}
              onClick={() => selectConversation(conv)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all text-left text-sm ${
                currentConversation?._id === conv._id 
                ? 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary' 
                : 'hover:bg-white/5 border border-transparent text-white/40 hover:text-white/70'
              }`}
            >
              <MessageSquare size={16} className="shrink-0" />
              <span className="truncate">{conv.title}</span>
            </button>
          ))}
        </ScrollArea>

        <div className="p-6 border-t border-white/5">
           <Button 
             variant="ghost" 
             onClick={handleLogout}
             className="w-full flex items-center justify-start gap-3 p-3 rounded-xl hover:bg-red-500/10 text-white/30 hover:text-red-400 border-none h-auto"
           >
             <LogOut size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
             Sign Out
           </Button>
        </div>
      </motion.aside>


      <main className="flex-1 flex flex-col relative">
        
        
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
             <Button 
               variant="ghost"
               size="icon"
               onClick={() => setSidebarOpen(!sidebarOpen)}
               className="text-white/40 hover:bg-white/5"
             >
               <History size={20} />
             </Button>
             <div className="flex flex-col">
                <h1 className="text-sm font-bold tracking-wide font-space uppercase">
                  {currentConversation ? currentConversation.title : 'New Session'}
                </h1>
                <div className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase tracking-widest font-semibold">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  AI Ready
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-brand-primary/20 bg-brand-primary/10 text-brand-primary text-[10px] font-bold tracking-widest uppercase py-1 px-3">
                Enterprise Active
              </Badge>
              <Avatar className="w-9 h-9 border border-white/10 bg-white/5 hover:border-brand-primary/50 transition-all cursor-pointer">
                <AvatarFallback className="bg-transparent font-bold text-sm tracking-widest text-brand-primary">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} className="text-white opacity-40" />}
                </AvatarFallback>
              </Avatar>
          </div>
        </header>


        <div className="flex-1 overflow-y-auto scroll-smooth overscroll-y-contain will-change-scroll p-6 md:p-12 space-y-8">
           {isLoading && conversations.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center space-y-4">
               <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
               <p className="text-white/30 text-sm font-medium tracking-widest uppercase anim-pulse">Synchronizing Sessions...</p>
             </div>
           ) : !currentConversation ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-8">
                 <div className="w-24 h-24 rounded-3xl bg-brand-primary/5 flex items-center justify-center text-brand-primary ring-1 ring-brand-primary/20">
                    <Bot size={40} className="animate-bounce" />
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight font-space">How can I assist <span className="gradient-text">Mediasoft</span> today?</h2>
                    <p className="text-white/30 leading-relaxed text-sm">
                      Access real-time POS data, ERP architecture analysis, or general business intelligence. I'm trained on the Mediasoft BD ecosystem.
                    </p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/2 hover:border-brand-primary/30 transition-all cursor-pointer text-left space-y-2 group">
                       <Hash className="w-5 h-5 text-brand-primary" />
                       <p className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">What is POS software?</p>
                    </div>
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/2 hover:border-brand-primary/30 transition-all cursor-pointer text-left space-y-2 group">
                       <Database className="w-5 h-5 text-brand-secondary" />
                       <p className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">Explore Mediasoft ERP</p>
                    </div>
                 </div>
              </div>
           ) : (
             <div className="space-y-8">
              {currentConversation.messages.filter(m => m.role !== 'system').map((msg, idx) => (
                <div 
                  key={`${currentConversation._id}-${idx}`}
                  className={`flex gap-6 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                    <Avatar className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${
                      msg.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'
                    }`}>
                      <AvatarFallback className="bg-transparent">{msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}</AvatarFallback>
                    </Avatar>
                    <div className={`space-y-2 flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                      <div className={`px-6 py-4 rounded-3xl text-sm leading-relaxed wrap-break-word whitespace-pre-wrap ${
                        msg.role === 'user' 
                        ? 'bg-brand-primary/10 text-white/90 rounded-tr-none border border-brand-primary/20' 
                        : 'bg-white/5 text-white/70 rounded-tl-none border border-white/5 shadow-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                </div>
              ))}
             </div>
           )}
           
           {isSending && (
             <div className="flex gap-6 max-w-4xl mx-auto">
                <Avatar className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary animate-pulse border border-brand-primary/20">
                  <AvatarFallback className="bg-transparent"><Bot size={18} /></AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-white/5 border border-white/5 mt-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce shadow-[0_0_8px_rgba(79,172,254,0.5)]" />
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce delay-75 shadow-[0_0_8px_rgba(79,172,254,0.5)]" />
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce delay-150 shadow-[0_0_8px_rgba(79,172,254,0.5)]" />
                </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>


        <div className="p-6 border-t border-white/5 bg-black/20">
           <form 
              onSubmit={handleSendMessage} 
              className="max-w-4xl mx-auto flex items-center gap-3 p-1.5 pl-5 rounded-[14px] glass-effect border border-white/5 focus-within:border-brand-primary/40 transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-white/2"
           >
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
                placeholder="Ask about Mediasoft BD ecosystems..."
                className="flex-1 bg-transparent border-none py-2.5 mt-1 focus:outline-none text-[13px] resize-none placeholder:text-white/20 font-outfit"
              />
              <Button 
               type="submit" 
               disabled={!input.trim() || isSending}
               className="w-10 h-10 shrink-0 bg-linear-to-tr from-brand-primary to-brand-secondary rounded-[10px] text-black transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale border-none cursor-pointer"
              >
                 {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={15} />}
              </Button>
           </form>
        </div>
      </main>

      
      <aside className="w-80 glass-effect border-l border-white/5 hidden xl:flex flex-col z-10 shadow-2xl">
         <div className="p-6 border-b border-white/5 flex items-center gap-3">
             <Database className="w-5 h-5 text-brand-secondary" />
             <h2 className="font-bold text-sm tracking-tight font-space uppercase">Intelligence Bank</h2>
         </div>
         
         <ScrollArea className="flex-1 p-6">
            
            <div className="space-y-4 mb-10">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-space">Active Context</span>
                  {!isEditingContext ? (
                    <Settings className="w-3.5 h-3.5 text-white/20 cursor-pointer hover:text-white" onClick={() => setIsEditingContext(true)} />
                  ) : (
                    <X className="w-3.5 h-3.5 text-white/20 cursor-pointer hover:text-red-400" onClick={() => setIsEditingContext(false)} />
                  )}
               </div>
               <div className="p-5 rounded-2xl border border-white/5 bg-white/2 space-y-4 shadow-inner min-h-[80px]">
                  {isEditingContext && currentConversation ? (
                    <div className="flex flex-col gap-3">
                       <Input 
                         value={contextInput} 
                         onChange={(e) => setContextInput(e.target.value)} 
                         className="h-9 bg-black/40 border border-white/10 text-xs text-white focus-visible:ring-1 focus-visible:ring-brand-primary"
                         placeholder="System or Persona prompt..."
                       />
                       <Button size="sm" onClick={handleUpdateContext} className="w-full h-8 bg-brand-primary text-black text-xs font-bold cursor-pointer hover:bg-white border-none transition-all">
                          <Save size={12} className="mr-2" /> Save Context
                       </Button>
                    </div>
                  ) : currentConversation?.context ? (
                    <p className="text-xs text-white/50 leading-relaxed font-outfit">{currentConversation.context}</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-[11px]">
                         <span className="text-white/40 font-medium">Session Tokens</span>
                         <span className="text-primary font-mono font-bold">1.2k / 8k</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                         <div className="h-full w-[15%] bg-linear-to-r from-brand-primary to-brand-secondary shadow-[0_0_8px_rgba(79,172,254,0.3)]" />
                      </div>
                    </div>
                  )}
               </div>
            </div>

            
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-space">Knowledge Clusters</span>
                  <Plus className="w-3.5 h-3.5 text-white/20 cursor-pointer hover:text-brand-primary" onClick={() => setShowResourceModal(true)} />
               </div>
               <div className="space-y-4">
                  {resources.map((res) => (
                    <motion.div 
                      key={res._id}
                      whileHover={{ x: 4 }}
                      className="p-5 rounded-2xl border border-white/5 bg-white/2 group cursor-pointer hover:border-brand-secondary/30 transition-all shadow-sm"
                    >
                       <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-white/70 group-hover:text-brand-secondary transition-colors font-space uppercase tracking-tight">{res.title}</h4>
                          <BookOpen size={12} className="text-white/20 group-hover:text-brand-secondary transition-colors" />
                       </div>
                       <p className="text-[10px] text-white/30 line-clamp-2 leading-relaxed">
                          {res.content}
                       </p>
                    </motion.div>
                  ))}
               </div>
            </div>
         </ScrollArea>

         
         <div className="p-6">
            <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex gap-4">
               <Info size={18} className="text-orange-500 shrink-0 opacity-70" />
               <p className="text-[10px] text-orange-500/60 leading-relaxed font-medium">
                 AI responses are influenced by these resources (RAG enabled). Keep them accurate for best results.
               </p>
            </div>
         </div>
      </aside>

      
      <AnimatePresence>
        {showWelcomeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-effect w-full max-w-md rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-center mb-6 mt-2">
                 <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center border border-brand-primary/20">
                   <Bot size={32} />
                 </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center text-white mb-2 font-space">Welcome to Mission Control</h2>
              <p className="text-white/50 text-center text-sm mb-8 leading-relaxed">
                Your AI-powered assistant is ready. Access real-time intelligence, manage your ecosystems, and streamline your workflow with enterprise-grade precision.
              </p>

              <div className="flex gap-3 w-full justify-center">
                <Button 
                  onClick={() => setShowWelcomeModal(false)}
                  variant="outline"
                  className="flex-1 max-w-[160px] bg-black/40 hover:bg-white/10 border border-white/10 h-11 rounded-[10px] text-white/80 font-bold flex items-center justify-center gap-2 transition-all text-xs cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Configure
                </Button>
                <Button 
                  onClick={() => setShowWelcomeModal(false)}
                  className="flex-1 max-w-[190px] bg-white h-11 rounded-[10px] text-black font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all text-xs cursor-pointer border-none shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Access Dashboard
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {showResourceModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-effect w-full max-w-lg rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white font-space">New Resource</h2>
                  <p className="text-white/40 text-xs mt-1">Inject dynamic logic blocks directly into your active RAG ecosystem.</p>
                </div>
                <Button variant="ghost" size="icon" className="hover:bg-white/5" onClick={() => setShowResourceModal(false)}>
                  <X className="w-5 h-5 opacity-50" />
                </Button>
              </div>

              <form onSubmit={handleCreateResource} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1 font-space">Index Title</label>
                  <Input 
                    required
                    value={resourceTitle}
                    onChange={e => setResourceTitle(e.target.value)}
                    className="h-12 bg-black/40 border border-white/10 text-xs text-white focus-visible:ring-1 focus-visible:ring-brand-primary rounded-xl"
                    placeholder="e.g. Sales Division Logistics"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest pl-1 font-space">Vector Content Data</label>
                  <textarea 
                    required
                    rows={5}
                    value={resourceContent}
                    onChange={e => setResourceContent(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-xs text-white focus-visible:outline-none focus:ring-1 focus:ring-brand-primary rounded-xl p-4 resize-none placeholder:text-white/20 transition-all font-outfit"
                    placeholder="Provide specific documents, APIs, rulesets, or enterprise context..."
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full h-12 bg-brand-primary text-black font-bold text-xs mt-4 hover:bg-white border-none rounded-xl"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Index to Knowledge Base
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

