'use client';

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, MessageSquare, 
  ArrowRight, Trash2, ChevronRight, X, Clock, ChevronDown
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/store/chatStore';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ConfirmationModal } from '@/components/ConfirmationModal';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
  createdAt: string;
}

const HistoryItem = memo(({ 
  conv, 
  onOpen, 
  onDelete,
  formatDate,
  getPreviewText 
}: { 
  conv: Conversation; 
  onOpen: (conv: Conversation) => void;
  onDelete: (conv: Conversation) => void;
  formatDate: (d: string) => string;
  getPreviewText: (c: Conversation) => string;
}) => (
  <div className="group relative">
    <div className="absolute -inset-px bg-linear-to-r from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    
    <div className="relative z-10 bg-zinc-900/60 rounded-2xl border border-white/5 p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 hover:bg-zinc-800/80 hover:border-white/10 transition-all duration-200 transform-gpu">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
          <MessageSquare size={18} className="text-zinc-400 group-hover:text-white transition-colors" />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-bold text-white text-sm lg:text-[15px] font-space uppercase tracking-wide truncate max-w-[200px]">
              {conv.title || 'Untitled Session'}
            </h3>
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
              {conv.messages.length} NODES
            </span>
          </div>
          <p className="text-[12px] lg:text-[13px] text-zinc-500 truncate font-light leading-relaxed">
            {getPreviewText(conv)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 lg:gap-10 pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
        <div className="flex flex-col items-start sm:items-end shrink-0">
          <span className="text-[8px] lg:text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-bold mb-0.5 lg:mb-1">Last Sync</span>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Clock size={9} className="text-zinc-600" />
            <span className="text-[10px] lg:text-[11px] tabular-nums font-medium">{formatDate(conv.updatedAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => onOpen(conv)}
            variant="ghost"
            className="bg-white hover:bg-zinc-200 text-black h-9 lg:h-11 px-4 lg:px-6 rounded-xl flex items-center gap-2 group/btn transition-all font-bold text-[10px] lg:text-xs uppercase tracking-tight"
          >
            Access
            <ArrowRight size={13} className="-rotate-45 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
          </Button>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(conv);
            }}
            variant="ghost"
            className="w-9 h-9 lg:w-11 lg:h-11 p-0 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 text-zinc-600 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all shadow-sm active:scale-90"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>
    </div>
  </div>
));

HistoryItem.displayName = 'HistoryItem';

export default function ChatHistoryPage() {
  const router = useRouter();
  const { 
    conversations, 
    isLoading, 
    fetchConversations, 
    selectConversation,
    totalConversations,
    deleteConversation
  } = useChatStore();
  
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLimitOpen, setIsLimitOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchConversations({ 
        page: currentPage, 
        limit: pageSize, 
        searchTerm 
      });
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, pageSize, fetchConversations]);

  useEffect(() => {
    if (!isLoading && conversations.length === 0 && currentPage > 1 && !searchTerm) {
      setCurrentPage(prev => Math.max(1, prev - 1));
    }
  }, [conversations, isLoading, currentPage, searchTerm]);

  const totalPages = Math.ceil(totalConversations / pageSize);

  const handleOpenChat = (conv: Conversation) => {
    selectConversation(conv);
    router.push('/dashboard');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPreviewText = (conv: Conversation) => {
    const lastMsg = conv.messages[conv.messages.length - 1];
    if (!lastMsg) return 'Empty session';
    return lastMsg.content.substring(0, 120) + (lastMsg.content.length > 120 ? '...' : '');
  };

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-hidden font-outfit">
      <DashboardHeader
        title="Chat History"
        subtitle="Manage your previous AI sessions"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search conversations..."
        onAction={() => router.push('/dashboard')}
        actionText="New Session"
      />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/2 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-white/1 blur-[100px]" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 lg:py-6 scrollbar-hide relative z-10 transform-gpu will-change-scroll">
        <div className="max-w-7xl mx-auto pb-20">
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-6">
                <h2 className="text-[9px] lg:text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] lg:tracking-[0.4em] flex items-center gap-3 lg:gap-4">
                  Archive Repository
                  <span className="h-px w-12 lg:w-24 bg-linear-to-r from-zinc-800 to-transparent" />
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[9px] lg:text-[10px] font-bold text-white tabular-nums tracking-widest">
                    TOTAL {totalConversations.toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-12 h-12">
                     <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                     <div className="absolute inset-0 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-medium opacity-50">Synchronizing Logs...</p>
                </div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="bg-zinc-900/40 border border-white/5 rounded-2xl text-center py-24 shadow-2xl">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <History className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-space uppercase tracking-tight">System Purged</h3>
                <p className="text-zinc-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                  {searchTerm 
                    ? 'No matching logs found in the current archival scope.' 
                    : 'Your session history is currently offline. Engage with the AI to initialize records.'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="bg-white text-black hover:bg-zinc-200 h-11 px-8 font-semibold text-[12px] tracking-tight rounded-xl"
                  >
                    Start New Session
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {conversations.map((conv) => (
                    <HistoryItem
                      key={conv._id}
                      conv={conv}
                      onOpen={handleOpenChat}
                      onDelete={setConversationToDelete}
                      formatDate={formatDate}
                      getPreviewText={getPreviewText}
                    />
                  ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
                  <div className="relative">
                    <button
                      onClick={() => setIsLimitOpen(!isLimitOpen)}
                      className="group/limit relative flex items-center gap-3 bg-zinc-900/60 border border-white/5 rounded-xl px-3 py-1.5 hover:border-white/20 hover:bg-zinc-900 transition-all active:scale-95"
                    >
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Limit</span>
                      <span className="text-[12px] font-bold text-white tabular-nums border-l border-white/10 pl-3">
                        {pageSize.toString().padStart(2, '0')}
                      </span>
                      <ChevronDown 
                        size={12} 
                        className={`text-zinc-600 transition-transform duration-300 group-hover/limit:text-white ${isLimitOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>

                    <AnimatePresence>
                      {isLimitOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsLimitOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute bottom-full left-0 w-28 mb-1.5 z-50 overflow-hidden bg-zinc-950 border border-white/10 rounded-xl p-1 shadow-2xl"
                          >
                            {[5, 10, 20, 50].map((size) => (
                              <button
                                key={size}
                                onClick={() => {
                                  setPageSize(size);
                                  setIsLimitOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                                  pageSize === size 
                                    ? 'bg-white text-black' 
                                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                {size.toString().padStart(2, '0')}
                                {pageSize === size && <div className="w-1 h-1 rounded-full bg-black/20" />}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1 p-0.5 bg-white/5 border border-white/5 rounded-xl">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={`h-8 w-8 p-0 rounded-lg transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </Button>
                      
                      <div className="flex items-center px-1">
                        {(() => {
                          const pages = [];
                          if (totalPages <= 7) {
                            for (let i = 1; i <= totalPages; i++) pages.push(i);
                          } else {
                            if (currentPage <= 4) {
                              for (let i = 1; i <= 5; i++) pages.push(i);
                              pages.push('...');
                              pages.push(totalPages);
                            } else if (currentPage >= totalPages - 3) {
                              pages.push(1);
                              pages.push('...');
                              for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
                            } else {
                              pages.push(1);
                              pages.push('...');
                              pages.push(currentPage - 1);
                              pages.push(currentPage);
                              pages.push(currentPage + 1);
                              pages.push('...');
                              pages.push(totalPages);
                            }
                          }

                          return pages.map((page, idx) => (
                            page === '...' ? (
                              <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-zinc-700 text-[10px] font-bold">
                                ...
                              </span>
                            ) : (
                              <button
                                key={page}
                                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-[11px] font-bold transition-all ${
                                  currentPage === page 
                                    ? 'bg-white text-black' 
                                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                }`}
                              >
                                {typeof page === 'number' ? page.toString().padStart(2, '0') : page}
                              </button>
                            )
                          ));
                        })()}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={`h-8 w-8 p-0 rounded-lg transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!conversationToDelete}
        onClose={() => setConversationToDelete(null)}
        onConfirm={async () => {
          if (conversationToDelete) {
            await deleteConversation(conversationToDelete._id);
            setConversationToDelete(null);
            fetchConversations({ 
              page: currentPage, 
              limit: pageSize, 
              searchTerm 
            });
          }
        }}
        title="Erase Archive"
        description={
          <p>
            You are about to permanently purge <span className="text-white font-bold italic">"{conversationToDelete?.title || 'Untitled Session'}"</span> from the repository. All associated data nodes will be lost.
          </p>
        }
        confirmText="Confirm Erase"
        abortText="Abort"
        confirmIcon={Trash2}
        abortIcon={X}
        variant="danger"
        icon={Trash2}
      />
    </div>
  );
}