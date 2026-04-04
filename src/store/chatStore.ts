import { create } from 'zustand';
import api from '@/utils/api';
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
  updatedAt: string;
  createdAt: string;
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
  totalConversations: number;
  abortController: AbortController | null;
  streamingMessage: string;

  fetchConversations: (params?: { page?: number; limit?: number; searchTerm?: string }) => Promise<void>;
  fetchResources: () => Promise<void>;
  selectConversation: (conv: Conversation) => void;
  startNewChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  setIsTyping: (isTyping: boolean) => void;
  stopGeneration: () => void;
  setConversations: (conversations: Conversation[]) => void;
  createResource: (title: string, content: string) => Promise<void>;
  updateContext: (conversationId: string, context: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  resources: [],
  isLoading: false,
  isSending: false,
  isTyping: false,
  totalConversations: 0,
  abortController: null,
  streamingMessage: '',

  setConversations: (conversations) => set({ conversations }),

  setIsTyping: (isTyping) => set({ isTyping }),

  stopGeneration: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
    }
    set({ isSending: false, isTyping: false, abortController: null });
  },

  fetchConversations: async (params = {}) => {
    set({ isLoading: true });
    try {
      const { page = 1, limit = 10, searchTerm = '' } = params;
      const { data } = await api.get('/chatbot/conversations', {
        params: { page, limit, searchTerm }
      });
      set({
        conversations: data.data,
        totalConversations: data.meta.total
      });
    } catch (err) {
      toast.error('Failed to load conversations');
    } finally {
      set({ isLoading: false });
    }
  },

  deleteConversation: async (conversationId: string) => {
    try {
      await api.delete(`/chatbot/conversations/${conversationId}`);

      const { conversations, currentConversation, totalConversations } = get();

      // Update local state
      set({
        conversations: conversations.filter(c => c._id !== conversationId),
        totalConversations: Math.max(0, totalConversations - 1),
        currentConversation: currentConversation?._id === conversationId ? null : currentConversation
      });

      toast.success('Conversation deleted');
    } catch (err) {
      toast.error('Failed to delete conversation');
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

    // Add user message immediately
    if (currentConversation) {
      set({
        currentConversation: {
          ...currentConversation,
          messages: [...currentConversation.messages, userMsg],
        },
        isSending: true,
        streamingMessage: '',
      });
    } else {
      set({
        currentConversation: {
          _id: 'temp-' + Date.now(),
          title: 'New Session',
          messages: [userMsg],
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        } as Conversation,
        isSending: true,
        streamingMessage: '',
      });
    }

    try {
      await api.stream(
        '/chatbot/send-message',
        {
          conversationId: get().currentConversation?._id,
          content,
        },
        // onChunk - receives each character as it streams
        (chunk: string) => {
          set((state) => ({
            streamingMessage: state.streamingMessage + chunk,
            isTyping: true,
          }));
        },
        // onComplete - called when streaming finishes
        async (conversationId?: string) => {
          const { streamingMessage, currentConversation } = get();

          // Add the complete AI message to the conversation
          if (currentConversation) {
            const aiMsg: Message = { role: 'assistant', content: streamingMessage };
            const updatedConversation = {
              ...currentConversation,
              _id: conversationId || currentConversation._id,
              messages: [...currentConversation.messages, aiMsg],
            };

            set({
              currentConversation: updatedConversation,
              isSending: false,
              isTyping: false,
            });

            // Refresh conversations in background
            get().fetchConversations({ page: 1, limit: 100 });
          } else {
            set({
              isSending: false,
              isTyping: false,
            });
          }
        },
        // onError
        (error: Error) => {
          toast.error('Failed to get AI response: ' + error.message);
          set({
            currentConversation: previousConversation,
            conversations: previousConversations,
            isSending: false,
            streamingMessage: '',
          });
        }
      );
    } catch (err: any) {
      toast.error('Failed to get AI response');
      set({
        currentConversation: previousConversation,
        conversations: previousConversations,
        isSending: false,
        streamingMessage: '',
      });
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
