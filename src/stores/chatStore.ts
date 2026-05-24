import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, Conversation } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeCharacterId: string | null;
  isStreaming: boolean;
  streamContent: string;

  getActiveConversation: () => Conversation | undefined;
  setActiveCharacter: (characterId: string) => void;
  setActiveConversation: (convId: string) => void;
  clearConversation: (characterId: string) => void;
  clearCurrentConversation: () => void;
  createNewConversation: (characterId: string) => string;
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  deleteMessage: (msgId: string) => void;
  setStreaming: (streaming: boolean) => void;
  setStreamContent: (content: string) => void;
  appendStreamContent: (chunk: string) => void;
  finishStream: () => void;
  deleteConversation: (id: string) => void;
  getConversationsByCharacter: (characterId: string) => Conversation[];
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      activeCharacterId: null,
      isStreaming: false,
      streamContent: '',

      getActiveConversation: () => {
        const { conversations, activeConversationId } = get();
        return conversations.find((c) => c.id === activeConversationId);
      },

      setActiveCharacter: (characterId) => {
        const { conversations } = get();
        let conv = conversations.find(
          (c) => c.characterId === characterId,
        );
        if (!conv) {
          conv = {
            id: uuidv4(),
            characterId,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          set({ conversations: [...conversations, conv] });
        }
        set({
          activeCharacterId: characterId,
          activeConversationId: conv.id,
        });
      },

      setActiveConversation: (convId) => {
        const conv = get().conversations.find((c) => c.id === convId);
        if (conv) {
          set({
            activeConversationId: convId,
            activeCharacterId: conv.characterId,
          });
        }
      },

      clearConversation: (characterId) => {
        const { conversations } = get();
        const filtered = conversations.filter(
          (c) => !(c.characterId === characterId && c.messages.length > 0),
        );
        set({ conversations: filtered });
      },

      clearCurrentConversation: () => {
        const { conversations, activeConversationId } = get();
        if (!activeConversationId) return;
        set({
          conversations: conversations.map((c) =>
            c.id === activeConversationId
              ? { ...c, messages: [], updatedAt: Date.now() }
              : c,
          ),
        });
      },

      createNewConversation: (characterId) => {
        const conv: Conversation = {
          id: uuidv4(),
          characterId,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({
          conversations: [...get().conversations, conv],
          activeConversationId: conv.id,
          activeCharacterId: characterId,
        });
        return conv.id;
      },

      addMessage: (role, content) => {
        const { conversations, activeConversationId } = get();
        if (!activeConversationId) return;
        set({
          conversations: conversations.map((c) => {
            if (c.id !== activeConversationId) return c;
            const newMsg: ChatMessage = {
              id: uuidv4(),
              role,
              content,
              timestamp: Date.now(),
            };
            return {
              ...c,
              messages: [...c.messages, newMsg],
              updatedAt: Date.now(),
            };
          }),
        });
      },

      deleteMessage: (msgId) => {
        const { conversations, activeConversationId } = get();
        if (!activeConversationId) return;
        set({
          conversations: conversations.map((c) => {
            if (c.id !== activeConversationId) return c;
            return {
              ...c,
              messages: c.messages.filter((m) => m.id !== msgId),
              updatedAt: Date.now(),
            };
          }),
        });
      },

      setStreaming: (isStreaming) => set({ isStreaming }),
      setStreamContent: (streamContent) => set({ streamContent }),

      appendStreamContent: (chunk) => {
        set((s) => ({ streamContent: s.streamContent + chunk }));
      },

      finishStream: () => {
        const { streamContent, conversations, activeConversationId } = get();
        if (!activeConversationId || !streamContent) {
          set({ isStreaming: false, streamContent: '' });
          return;
        }
        const newMsg: ChatMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: streamContent,
          timestamp: Date.now(),
        };
        set({
          conversations: conversations.map((c) => {
            if (c.id !== activeConversationId) return c;
            return {
              ...c,
              messages: [...c.messages, newMsg],
              updatedAt: Date.now(),
            };
          }),
          isStreaming: false,
          streamContent: '',
        });
      },

      deleteConversation: (id) => {
        set({
          conversations: get().conversations.filter((c) => c.id !== id),
          activeConversationId:
            get().activeConversationId === id ? null : get().activeConversationId,
        });
      },

      getConversationsByCharacter: (characterId) => {
        return get()
          .conversations.filter((c) => c.characterId === characterId)
          .sort((a, b) => b.updatedAt - a.updatedAt);
      },
    }),
    {
      name: 'cutie-conversations',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        activeCharacterId: state.activeCharacterId,
      }),
    },
  ),
);
