'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Edit3, Trash2, Search, Save, X,
  FileText, AlertCircle, Bot
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardHeader } from '@/components/DashboardHeader';
import { useContextStore } from '@/store/contextStore';
import { ConfirmationModal } from '@/components/ConfirmationModal';

interface ContextOwner {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Context {
  _id: string;
  user: string | ContextOwner;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function ContextManagementPage() {
  const { 
    contexts, 
    isLoading, 
    isCreating: isCreatingStore, 
    isUpdating,
    isDeleting,
    fetchContexts, 
    create, 
    update, 
    remove 
  } = useContextStore();
  
  const [filteredContexts, setFilteredContexts] = useState<Context[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingLocal, setIsCreatingLocal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchContexts();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredContexts(contexts);
    } else {
      const filtered = contexts.filter(ctx =>
        ctx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ctx.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContexts(filtered);
    }
  }, [searchTerm, contexts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    if (editingId) {
      await update(editingId, formData.title, formData.content);
    } else {
      await create(formData.title, formData.content);
    }

    setFormData({ title: '', content: '' });
    setIsCreatingLocal(false);
    setEditingId(null);
  };

  const handleEdit = (context: Context) => {
    setFormData({
      title: context.title,
      content: context.content
    });
    setEditingId(context._id);
    setIsCreatingLocal(true);
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    setShowDeleteConfirm(null);
  };

  const startCreate = () => {
    setFormData({ title: '', content: '' });
    setIsCreatingLocal(true);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setIsCreatingLocal(false);
    setEditingId(null);
    setFormData({ title: '', content: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOwnerInfo = (user: string | ContextOwner) => {
    if (typeof user === 'string') {
      return { name: 'User', initial: 'U' };
    }
    const name = user.name || 'User';
    const initial = name.charAt(0).toUpperCase();
    return { name, initial };
  };

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-hidden font-outfit">
      <DashboardHeader
        title="Context Library"
        subtitle="Secure Knowledge Pipeline Online"
        onAction={startCreate}
        actionText="New Context"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search resources..."
      />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-white/3 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-white/2 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence>
            {(isCreatingLocal || editingId) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="mb-8 p-px rounded-2xl bg-linear-to-br from-white/10 via-transparent to-white/5 overflow-hidden"
              >
                <div className="bg-zinc-950/80 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-white font-space uppercase tracking-wider">
                        {editingId ? 'Refine Knowledge' : 'Initialize Context'}
                      </h2>
                      <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] mt-1 font-medium">Add data for AI retrieval</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={cancelEdit}
                      className="bg-zinc-900 border border-white/5 text-zinc-500 hover:bg-zinc-800 hover:text-white rounded-lg transition-all w-8 h-8 flex items-center justify-center p-0"
                    >
                      <X size={16} />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[12px] font-semibold text-zinc-500 tracking-wide block ml-1">Title</label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Context identifier..."
                        className="h-10 bg-white/5 border-white/5 text-white placeholder:text-zinc-700 focus:border-white/20 focus:ring-0 rounded-xl transition-all text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[12px] font-semibold text-zinc-500 tracking-wide block ml-1">Data Content</label>
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Define the knowledge or instructions..."
                        className="w-full bg-white/5 border border-white/5 text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/20 rounded-xl p-3 resize-none transition-all leading-relaxed text-xs min-h-[120px]"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={cancelEdit}
                        className="text-zinc-500 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 h-9 px-6 font-semibold text-[11px] tracking-tight rounded-xl transition-all"
                      >
                        Discard
                      </Button>
                      <Button
                        type="submit"
                        disabled={isCreatingStore || isUpdating}
                        className="bg-white text-black hover:bg-zinc-200 transition-all flex items-center gap-2 h-9 px-6 font-semibold text-[11px] tracking-tight rounded-xl shadow-xl shadow-white/5"
                      >
                        {(isCreatingStore || isUpdating) ? (
                          <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save size={14} />
                        )}
                        {editingId ? 'Apply Update' : 'Publish Context'}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-6">
                <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-4">
                  Archive Repository
                  <span className="h-px w-24 bg-linear-to-r from-zinc-800 to-transparent" />
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[10px] font-bold text-white tabular-nums tracking-widest">
                    INDEX {filteredContexts.length.toString().padStart(2, '0')}
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
                  <p className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse">Synchronizing Data...</p>
                </div>
              </div>
            ) : filteredContexts.length === 0 ? (
              <div className="bg-white/2 backdrop-blur-sm border border-white/5 rounded-2xl text-center py-24 shadow-2xl">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-zinc-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-space uppercase tracking-tight">Empty Repository</h3>
                <p className="text-zinc-500 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                  {searchTerm
                    ? 'No matching knowledge found in the current repository scope.'
                    : 'Your knowledge base is currently offline. Start by adding your first enterprise resource.'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={startCreate}
                    className="bg-white text-black hover:bg-zinc-200 h-11 px-8 font-semibold text-[12px] tracking-tight rounded-xl"
                  >
                    <Plus size={18} className="mr-2" />
                    Initialize First Context
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContexts.map((context) => {
                  const { name, initial } = getOwnerInfo(context.user);
                  return (
                    <motion.div
                      key={context._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="group relative"
                    >
                      <div className="absolute -inset-px bg-linear-to-br from-white/20 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
                      
                      <div className="relative z-10 h-full bg-zinc-950/60 backdrop-blur-md rounded-2xl border border-white/5 p-6 hover:bg-zinc-900/40 transition-all duration-300 flex flex-col">
                        <div className="flex items-start justify-between mb-6">
                          <div className="space-y-1">
                            <h3 className="font-bold text-white text-base font-space uppercase tracking-wide truncate pr-2 group-hover:gradient-text transition-all duration-300">
                              {context.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-bold text-white uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded-full border border-white/5">Active</span>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(context)}
                              className="bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white h-8 w-8 rounded-lg"
                            >
                              <Edit3 size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowDeleteConfirm(context._id)}
                              className="bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white h-8 w-8 rounded-lg"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-zinc-400 mb-8 line-clamp-5 leading-relaxed font-light">
                          {context.content}
                        </p>

                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-[10px] font-bold text-white border border-white/5 shadow-inner">
                              {initial}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-bold">Provider</span>
                              <span className="text-[11px] text-zinc-400 font-medium">{name}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-bold">Modified</span>
                            <span className="text-[11px] text-zinc-500 tabular-nums">{formatDate(context.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={async () => {
          if (showDeleteConfirm) {
            await handleDelete(showDeleteConfirm);
          }
        }}
        isLoading={isDeleting}
        title="Confirm Removal"
        description="This action will permanently delete this context from the AI knowledge base."
        confirmText="Confirm Removal"
        abortText="Cancel"
        confirmIcon={Trash2}
        abortIcon={X}
        variant="danger"
        icon={Trash2}
      />
    </div>
  );
}