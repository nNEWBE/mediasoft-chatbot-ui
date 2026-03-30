import { create } from 'zustand';
import api from '@/utils/axios';
import { toast } from 'react-hot-toast';

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

interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  resources: Resource[];
  isLoading: boolean;
  isSending: boolean;
  
  // Actions
  fetchConversations: () => Promise<void>;
  fetchResources: () => Promise<void>;
  selectConversation: (conv: Conversation) => void;
  startNewChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  setConversations: (conversations: Conversation[]) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  resources: [],
  isLoading: false,
  isSending: false,

  setConversations: (conversations) => set({ conversations }),

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/chatbot/conversations');
      set({ conversations: data.data });
    } catch (err) {
      toast.error('Failed to load conversations');
    } finally {
      set({ isLoading: false });
    }
  },

  fetchResources: async () => {
    try {
      const { data } = await api.get('/chatbot/resources');
      set({ resources: data.data });
    } catch (err) {
      console.error('Failed to load resources');
    }
  },

  selectConversation: (conv) => set({ currentConversation: conv }),

  startNewChat: () => set({ currentConversation: null }),

  sendMessage: async (content: string) => {
    const { currentConversation, conversations } = get();
    set({ isSending: true });
    
    try {
      // Optimistic update could go here but let's stick to the server response for consistency with the existing logic
      const { data } = await api.post('/chatbot/send-message', {
        conversationId: currentConversation?._id,
        content
      });
      
      const updatedConv = data.data;
      
      // Update store state
      if (!currentConversation) {
        set({ 
          conversations: [updatedConv, ...conversations],
          currentConversation: updatedConv 
        });
      } else {
        set({ 
          conversations: conversations.map(c => c._id === updatedConv._id ? updatedConv : c),
          currentConversation: updatedConv 
        });
      }
    } catch (err) {
      toast.error('Failed to get AI response');
    } finally {
      set({ isSending: false });
    }
  },
}));
