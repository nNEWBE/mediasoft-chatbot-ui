'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Edit3, Trash2, Search, Save, X,
  Database, FileText, Settings, AlertCircle, Check
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock data for context items - in a real app, this would come from your store/API
const mockContextItems = [
  {
    id: '1',
    title: 'Customer Service Guidelines',
    content: 'Always greet customers warmly, address concerns promptly, escalate complex issues to supervisors.',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Product Information',
    content: 'Our flagship product includes advanced analytics, real-time reporting, and customizable dashboards.',
    createdAt: '2024-01-16T14:22:00Z',
    updatedAt: '2024-01-16T14:22:00Z'
  },
  {
    id: '3',
    title: 'Company Values',
    content: 'Integrity, Innovation, Excellence, Customer Focus, Teamwork.',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  }
];

export default function ContextManagementPage() {
  const [contexts, setContexts] = useState(mockContextItems);
  const [filteredContexts, setFilteredContexts] = useState(mockContextItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // Filter contexts based on search term
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    if (editingId) {
      // Update existing context
      setContexts(prev => prev.map(ctx =>
        ctx.id === editingId
          ? { ...ctx, ...formData, updatedAt: new Date().toISOString() }
          : ctx
      ));
      toast.success('Context updated successfully');
    } else {
      // Create new context
      const newContext = {
        id: `ctx-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setContexts(prev => [...prev, newContext]);
      toast.success('Context created successfully');
    }

    // Reset form and exit edit/create mode
    setFormData({ title: '', content: '' });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (context: typeof mockContextItems[0]) => {
    setFormData({
      title: context.title,
      content: context.content
    });
    setEditingId(context.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    setContexts(prev => prev.filter(ctx => ctx.id !== id));
    setShowDeleteConfirm(null);
    toast.success('Context deleted successfully');
  };

  const startCreate = () => {
    setFormData({ title: '', content: '' });
    setIsCreating(true);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setIsCreating(false);
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

  return (
    <div className="flex flex-col h-full bg-gray-50 text-gray-900 overflow-hidden font-outfit">
      <div className="p-5 border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Context Management</h1>
              <p className="text-gray-600">Create, update, and manage context for your AI assistant</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search contexts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                />
              </div>
              <Button
                onClick={startCreate}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 h-10 transition-all flex items-center gap-2 px-4 shadow-sm"
              >
                <Plus size={18} />
                <span>Add Context</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-6xl mx-auto">
          {/* Create/Edit Form */}
          <AnimatePresence>
            {(isCreating || editingId) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">
                    {editingId ? 'Edit Context' : 'Create New Context'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={cancelEdit}
                    className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 h-8 w-8"
                  >
                    <X size={20} />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 block">Title</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter context title..."
                      className="h-10 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700 block">Content</label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Enter context content..."
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-3 resize-none text-base"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelEdit}
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 h-9 px-4"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center gap-2 h-9 px-4 shadow-sm"
                    >
                      <Save size={16} />
                      {editingId ? 'Update Context' : 'Create Context'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Context List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Context Items ({filteredContexts.length})
              </h2>
            </div>

            {filteredContexts.length === 0 ? (
              <Card className="bg-white border-gray-200 text-center py-12 shadow-sm">
                <CardContent>
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No contexts found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm
                      ? 'No contexts match your search. Try different keywords.'
                      : 'Get started by creating your first context item.'}
                  </p>
                  {!searchTerm && (
                    <Button
                      onClick={startCreate}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 h-10 px-6 shadow-sm"
                    >
                      <Plus size={18} className="mr-2" />
                      Create Your First Context
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredContexts.map((context) => (
                  <motion.div
                    key={context.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-300 transition-all shadow-sm group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 text-base truncate">
                        {context.title}
                      </h3>
                      <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(context)}
                          className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 h-8 w-8"
                        >
                          <Edit3 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowDeleteConfirm(context.id)}
                          className="text-gray-500 hover:bg-red-50 hover:text-red-600 h-8 w-8"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-5">
                      {context.content}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                      <span className="flex items-center gap-1.5">
                        <Database size={12} />
                        Created: {formatDate(context.createdAt)}
                      </span>
                      <span>Updated: {formatDate(context.updatedAt)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-effect w-full max-w-md rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white mb-2">Confirm Deletion</h3>
                  <p className="text-white/70 text-sm mb-6">
                    Are you sure you want to delete this context? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(null)}
                      className="border-white/20 text-white/80 hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(showDeleteConfirm)}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}