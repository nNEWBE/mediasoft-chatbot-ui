import { create } from 'zustand';
import api from '@/utils/axios';
import { toast } from 'sonner';

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
  isTyping: boolean;
  abortController: AbortController | null;
  
  fetchConversations: () => Promise<void>;
  fetchResources: () => Promise<void>;
  selectConversation: (conv: Conversation) => void;
  startNewChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  setIsTyping: (isTyping: boolean) => void;
  stopGeneration: () => void;
  setConversations: (conversations: Conversation[]) => void;
  createResource: (title: string, content: string) => Promise<void>;
  updateContext: (conversationId: string, context: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  resources: [],
  isLoading: false,
  isSending: false,
  isTyping: false,
  abortController: null,

  setConversations: (conversations) => set({ conversations }),

  setIsTyping: (isTyping) => set({ isTyping }),

  stopGeneration: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
    }
    set({ isSending: false, isTyping: false, abortController: null });
  },

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
    const userMsg: Message = { role: 'user', content };

    const previousConversation = currentConversation;
    const previousConversations = conversations;

    if (currentConversation) {
      set({
        currentConversation: {
          ...currentConversation,
          messages: [...currentConversation.messages, userMsg],
        },
        isSending: true,
      });
    } else {
      set({
        currentConversation: {
          _id: 'temp-' + Date.now(),
          title: 'New Session',
          messages: [userMsg],
        } as Conversation,
        isSending: true,
      });
    }

    const controller = new AbortController();
    set({ abortController: controller });

    try {
      const { data } = await api.post('/chatbot/send-message', {
        conversationId: 
          currentConversation?._id && !currentConversation._id.startsWith('temp-') 
            ? currentConversation._id 
            : undefined,
        content
      }, {
        signal: controller.signal
      });
      
      const updatedConv = data.data;
      const isNewChat = !previousConversation || previousConversation._id.startsWith('temp-');
      
      if (isNewChat) {
        set({ 
          conversations: [updatedConv, ...previousConversations],
          currentConversation: updatedConv,
          isSending: false,
          abortController: null
        });
      } else {
        set({ 
          conversations: previousConversations.map(c => c._id === updatedConv._id ? updatedConv : c),
          currentConversation: updatedConv,
          isSending: false,
          abortController: null
        });
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
        console.log('Request aborted');
      } else {
        toast.error('Failed to get AI response');
        set({ 
          currentConversation: previousConversation,
          conversations: previousConversations,
        });
      }
      set({ isSending: false, abortController: null });
    }
  },

  createResource: async (title: string, content: string) => {
    try {
      await api.post('/chatbot/resources', { title, content });
      toast.success('Resource saved to Knowledge Cluster');
      get().fetchResources(); 
    } catch (err) {
      toast.error('Failed to save resource');
    }
  },

  updateContext: async (conversationId: string, context: string) => {
    try {
      await api.patch(`/chatbot/conversations/${conversationId}/context`, { context });
      toast.success('Conversation context updated');
      
      const { conversations, currentConversation } = get();
      
      const updatedConversations = conversations.map(c => 
        c._id === conversationId ? { ...c, context } : c
      );

      set({ 
        conversations: updatedConversations,
        currentConversation: currentConversation?._id === conversationId 
          ? { ...currentConversation, context } 
          : currentConversation
      });
    } catch (err) {
      toast.error('Failed to update context');
    }
  },
}));
