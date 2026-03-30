'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, Send, Plus, MessageSquare, Database, Settings, 
  LogOut, Sparkles, BookOpen, User, Hash, Paperclip, 
  History, Info, MoreVertical, Loader2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
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
    sendMessage
  } = useChatStore();

  const logout = useAuthStore((state) => state.logout);

  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchConversations();
    fetchResources();
  }, [fetchConversations, fetchResources]);

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

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="flex h-screen bg-surface text-white/90 overflow-hidden font-outfit">
      
      {/* --- SIDEBAR: CONVERSATIONS --- */}
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
              <MessageSquare size={16} />
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
             <LogOut size={16} />
             Sign Out
           </Button>
        </div>
      </motion.aside>

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col relative">
        
        {/* Header */}
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
                <AvatarFallback className="bg-transparent"><User size={16} className="text-white/40" /></AvatarFallback>
              </Avatar>
          </div>
        </header>

        {/* Messages List / Loading Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8">
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
             <AnimatePresence mode="popLayout">
              {currentConversation.messages.filter(m => m.role !== 'system').map((msg, idx) => (
                <motion.div 
                  key={`${currentConversation._id}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-6 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                    <Avatar className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${
                      msg.role === 'user' ? 'bg-white/5 border-white/10' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'
                    }`}>
                      <AvatarFallback className="bg-transparent">{msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}</AvatarFallback>
                    </Avatar>
                    <div className={`space-y-2 flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className={`px-6 py-4 rounded-3xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-brand-primary/10 text-white/90 rounded-tr-none border border-brand-primary/20' 
                        : 'bg-white/5 text-white/70 rounded-tl-none border border-white/5 shadow-sm'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                </motion.div>
              ))}
             </AnimatePresence>
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

        {/* Input Area */}
        <div className="p-6 border-t border-white/5 bg-black/20">
           <form 
              onSubmit={handleSendMessage} 
              className="max-w-4xl mx-auto flex items-end gap-3 p-2 pl-6 rounded-2xl glass-effect border border-white/5 focus-within:border-brand-primary/30 transition-all shadow-xl"
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
                className="flex-1 bg-transparent border-none py-3 focus:outline-none text-sm resize-none placeholder:text-white/20"
              />
              <div className="flex items-center gap-2 pr-2 pb-1.5">
                 <Button variant="ghost" size="icon" type="button" className="text-white/20 hover:text-white hover:bg-white/5">
                    <Paperclip size={18} />
                 </Button>
                 <Button 
                  type="submit" 
                  disabled={!input.trim() || isSending}
                  className="w-11 h-11 bg-linear-to-tr from-brand-primary to-brand-secondary rounded-xl text-black hover:scale-105 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:grayscale border-none"
                 >
                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} />}
                 </Button>
              </div>
           </form>
           <p className="text-center text-[10px] text-white/20 mt-4 uppercase tracking-[3px] font-black opacity-30">
              Powered by Mediasoft AI Intelligence
           </p>
        </div>
      </main>

      {/* --- RIGHTBAR: KNOWLEDGE BASE --- */}
      <aside className="w-80 glass-effect border-l border-white/5 hidden xl:flex flex-col z-10 shadow-2xl">
         <div className="p-6 border-b border-white/5 flex items-center gap-3">
             <Database className="w-5 h-5 text-brand-secondary" />
             <h2 className="font-bold text-sm tracking-tight font-space uppercase">Intelligence Bank</h2>
         </div>
         
         <ScrollArea className="flex-1 p-6">
            {/* Context Stats */}
            <div className="space-y-4 mb-10">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-space">Active Context</span>
                  <Settings className="w-3.5 h-3.5 text-white/20 cursor-pointer hover:text-white" />
               </div>
               <div className="p-5 rounded-2xl border border-white/5 bg-white/2 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between text-[11px]">
                     <span className="text-white/40 font-medium">Session Tokens</span>
                     <span className="text-blue-400 font-mono font-bold">1.2k / 8k</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                     <div className="h-full w-[15%] bg-linear-to-r from-brand-primary to-brand-secondary shadow-[0_0_8px_rgba(79,172,254,0.3)]" />
                  </div>
               </div>
            </div>

            {/* Resources List */}
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-space">Knowledge Clusters</span>
                  <Plus className="w-3.5 h-3.5 text-white/20 cursor-pointer hover:text-brand-primary" onClick={() => toast('Configure under Settings')} />
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

         {/* Context Warning Badge */}
         <div className="p-6">
            <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex gap-4">
               <Info size={18} className="text-orange-500 shrink-0 opacity-70" />
               <p className="text-[10px] text-orange-500/60 leading-relaxed font-medium">
                 AI responses are influenced by these resources (RAG enabled). Keep them accurate for best results.
               </p>
            </div>
         </div>
      </aside>

    </div>
  );
}

