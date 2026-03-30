'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Send, Plus, MessageSquare, Database, Settings, 
  LogOut, Sparkles, BookOpen, User, Hash, Paperclip, 
  History, Info, MoreVertical 
} from 'lucide-react';
import api from '@/utils/axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  context?: string;
}

interface Resource {
  _id: string;
  title: string;
  content: string;
}

export default function DashboardPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/chatbot/conversations');
      setConversations(data.data);
    } catch (err) {
      toast.error('Failed to load conversations');
    }
  };

  const fetchResources = async () => {
    try {
      const { data } = await api.get('/chatbot/resources');
      setResources(data.data);
    } catch (err) {
      console.error('Failed to load resources');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/chatbot/send-message', {
        conversationId: currentConversation?._id,
        content: userMessage
      });
      
      const updatedConv = data.data;
      
      // Update conversations list
      if (!currentConversation) {
        setConversations([updatedConv, ...conversations]);
      } else {
        setConversations(conversations.map(c => c._id === updatedConv._id ? updatedConv : c));
      }
      
      setCurrentConversation(updatedConv);
    } catch (err) {
      toast.error('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setCurrentConversation(null);
  };

  const selectConversation = (conv: Conversation) => {
    setCurrentConversation(conv);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="flex h-screen bg-[#0a0a0b] text-white/90 overflow-hidden font-sans">
      
      {/* --- SIDEBAR: CONVERSATIONS --- */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 300 : 0, opacity: sidebarOpen ? 1 : 0 }}
        className="glass-effect border-r border-white/5 flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" />
             </div>
             <span className="font-bold tracking-tight text-white">History</span>
          </div>
          <button onClick={startNewChat} className="p-2 hover:bg-white/5 rounded-lg text-brand-primary transition-all">
            <Plus size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
        </div>

        <div className="p-6 border-t border-white/5 space-y-4">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all text-sm"
           >
             <LogOut size={16} />
             Sign Out
           </button>
        </div>
      </motion.aside>

      {/* --- MAIN CHAT AREA --- */}
      <main className="flex-1 flex flex-col relative">
        
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setSidebarOpen(!sidebarOpen)}
               className="p-2 hover:bg-white/5 rounded-lg text-white/40 transition-all"
             >
               <History size={20} />
             </button>
             <div className="flex flex-col">
                <h1 className="text-sm font-bold tracking-wide">
                  {currentConversation ? currentConversation.title : 'New Session'}
                </h1>
                <div className="flex items-center gap-1.5 text-[10px] text-white/40 uppercase tracking-widest font-semibold">
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                  AI Ready
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-bold text-brand-primary tracking-widest uppercase">
                Enterprise Active
              </div>
              <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center overflow-hidden bg-white/5 hover:border-brand-primary/50 transition-all">
                <User size={16} className="text-white/40" />
              </button>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8">
           {!currentConversation && (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-8">
                 <div className="w-24 h-24 rounded-3xl bg-brand-primary/5 flex items-center justify-center text-brand-primary ring-1 ring-brand-primary/20">
                    <Bot size={40} className="animate-bounce" />
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">How can I assist <span className="gradient-text">Mediasoft</span> today?</h2>
                    <p className="text-white/30 leading-relaxed text-sm">
                      Access real-time POS data, ERP architecture analysis, or general business intelligence. I'm trained on the Mediasoft BD ecosystem.
                    </p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/2 hover:border-brand-primary/30 transition-all cursor-pointer text-left space-y-2">
                       <Hash className="w-5 h-5 text-brand-primary" />
                       <p className="text-xs font-semibold text-white/70">What is POS software?</p>
                    </div>
                    <div className="p-6 rounded-2xl border border-white/5 bg-white/2 hover:border-brand-primary/30 transition-all cursor-pointer text-left space-y-2">
                       <Database className="w-5 h-5 text-brand-secondary" />
                       <p className="text-xs font-semibold text-white/70">Explore Mediasoft ERP</p>
                    </div>
                 </div>
              </div>
           )}

           <AnimatePresence>
            {currentConversation?.messages.filter(m => m.role !== 'system').map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-6 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-white/5 border border-white/10' : 'bg-brand-primary/10 border border-brand-primary/20 text-brand-primary'
                  }`}>
                    {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
                  </div>
                  <div className={`space-y-2 flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-6 py-4 rounded-3xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                      ? 'bg-brand-primary/10 text-white/90 rounded-tr-none border border-brand-primary/20' 
                      : 'bg-white/5 text-white/70 rounded-tl-none border border-white/5'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
              </motion.div>
            ))}
           </AnimatePresence>
           
           {loading && (
             <div className="flex gap-6 max-w-4xl mx-auto">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary animate-pulse">
                  <Bot size={18} />
                </div>
                <div className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 mt-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50 animate-bounce" />
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50 animate-bounce delay-75" />
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50 animate-bounce delay-150" />
                </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/5 bg-black/20">
           <form 
              onSubmit={handleSendMessage} 
              className="max-w-4xl mx-auto flex items-end gap-4 p-2 pl-6 rounded-2xl glass-effect border border-white/5 focus-within:border-brand-primary/30 transition-all shadow-lg"
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
                className="flex-1 bg-transparent border-none py-3 focus:outline-none text-sm resize-none"
              />
              <div className="flex items-center gap-2 pr-2 pb-1">
                 <button type="button" className="p-2 hover:bg-white/5 rounded-lg text-white/20 transition-all">
                    <Paperclip size={18} />
                 </button>
                 <button 
                  type="submit" 
                  disabled={!input.trim() || loading}
                  className="p-3 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-xl text-black hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:grayscale"
                 >
                    <Send size={18} />
                 </button>
              </div>
           </form>
           <p className="text-center text-[10px] text-white/20 mt-4 uppercase tracking-[2px] font-bold">
              Powered by Mediasoft AI Intelligence
           </p>
        </div>
      </main>

      {/* --- RIGHTBAR: KNOWLEDGE BASE --- */}
      <aside className="w-80 glass-effect border-l border-white/5 hidden xl:flex flex-col z-10 shadow-2xl">
         <div className="p-6 border-b border-white/5 flex items-center gap-3">
             <Database className="w-5 h-5 text-brand-secondary" />
             <h2 className="font-bold text-sm tracking-tight">Intelligence Bank</h2>
         </div>
         
         <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Context Stats */}
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Active Context</span>
                  <Settings className="w-3.5 h-3.5 text-white/20 cursor-pointer hover:text-white" />
               </div>
               <div className="p-4 rounded-xl border border-white/5 bg-white/2 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-white/40">Tokens</span>
                     <span className="text-blue-400 font-mono">1.2k / 8k</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                     <div className="h-full w-[15%] bg-gradient-to-r from-blue-400 to-cyan-400" />
                  </div>
               </div>
            </div>

            {/* Resources List */}
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Knowledge Clusters</span>
                  <Plus className="w-3.5 h-3.5 text-white/20 cursor-pointer hover:text-brand-primary" onClick={() => toast('Configure under Settings')} />
               </div>
               <div className="space-y-3">
                  {resources.map((res) => (
                    <motion.div 
                      key={res._id}
                      whileHover={{ x: 4 }}
                      className="p-4 rounded-xl border border-white/5 bg-white/2 group cursor-pointer hover:border-brand-secondary/30 transition-all"
                    >
                       <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-bold text-white/70 group-hover:text-brand-secondary transition-colors">{res.title}</h4>
                          <BookOpen size={12} className="text-white/20" />
                       </div>
                       <p className="text-[10px] text-white/30 line-clamp-2">
                          {res.content}
                       </p>
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>

         {/* Context Warning Badge */}
         <div className="p-6 pt-0">
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-3">
               <Info size={16} className="text-orange-500 flex-shrink-0" />
               <p className="text-[10px] text-orange-500/80 leading-relaxed italic">
                 AI responses are influenced by these resources (RAG enabled). Keep them accurate for best results.
               </p>
            </div>
         </div>
      </aside>

    </div>
  );
}
