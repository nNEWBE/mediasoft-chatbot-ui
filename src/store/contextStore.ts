import { create } from 'zustand';
import api from '@/utils/api';
import { toast } from 'sonner';

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

interface ContextState {
  contexts: Context[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  fetchContexts: () => Promise<void>;
  create: (title: string, content: string) => Promise<void>;
  update: (id: string, title: string, content: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setContexts: (contexts: Context[]) => void;
}

export const useContextStore = create<ContextState>((set, get) => ({
  contexts: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  setContexts: (contexts) => set({ contexts }),

  fetchContexts: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/chatbot/resources');
      set({ contexts: data.data || [] });
    } catch (error: any) {
      console.error('Failed to fetch contexts:', error);
      toast.error(error.response?.data?.message || 'Failed to load contexts');
    } finally {
      set({ isLoading: false });
    }
  },

  create: async (title: string, content: string) => {
    set({ isCreating: true });
    try {
      await api.post('/chatbot/resources', { title, content });
      toast.success('Context created successfully');
      await get().fetchContexts();
    } catch (error: any) {
      console.error('Failed to create context:', error);
      toast.error(error.response?.data?.message || 'Failed to create context');
    } finally {
      set({ isCreating: false });
    }
  },

  update: async (id: string, title: string, content: string) => {
    set({ isUpdating: true });
    try {
      await api.put(`/chatbot/resources/${id}`, { title, content });
      toast.success('Context updated successfully');
      await get().fetchContexts();
    } catch (error: any) {
      console.error('Failed to update context:', error);
      toast.error(error.response?.data?.message || 'Failed to update context');
    } finally {
      set({ isUpdating: false });
    }
  },

  remove: async (id: string) => {
    set({ isDeleting: true });
    try {
      await api.delete(`/chatbot/resources/${id}`);
      toast.success('Context deleted successfully');
      await get().fetchContexts();
    } catch (error: any) {
      console.error('Failed to delete context:', error);
      toast.error(error.response?.data?.message || 'Failed to delete context');
    } finally {
      set({ isDeleting: false });
    }
  },
}));
