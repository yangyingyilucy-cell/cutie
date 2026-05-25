import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiaryEntry, HighlightedRange } from '../types';
import { v4 as uuidv4 } from 'uuid';

function estimateTokens(text: string): number {
  return Math.ceil(text.length * 1.5);
}

interface DiaryStore {
  entries: DiaryEntry[];
  addEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, updates: Partial<Omit<DiaryEntry, 'id' | 'createdAt'>>) => void;
  deleteEntry: (id: string) => void;
  getEntryByDate: (date: string) => DiaryEntry | undefined;
  getEntriesByMonth: (year: number, month: number) => DiaryEntry[];
  getImportantEntries: () => DiaryEntry[];
  matchEntries: (userMessage: string) => DiaryEntry[];
  buildMemoryContext: (userMessage: string) => string;
}

export const useDiaryStore = create<DiaryStore>()(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (entry) => {
        const newEntry: DiaryEntry = {
          ...entry,
          id: uuidv4(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          keywords: entry.highlightedRanges?.map((r: HighlightedRange) => r.text) || [],
        };
        // replace existing entry on same date
        const existing = get().entries.findIndex((e) => e.date === entry.date);
        if (existing >= 0) {
          set({
            entries: get().entries.map((e, i) => (i === existing ? newEntry : e)),
          });
        } else {
          set({ entries: [...get().entries, newEntry] });
        }
      },

      updateEntry: (id, updates) => {
        set({
          entries: get().entries.map((e) => {
            if (e.id !== id) return e;
            return {
              ...e,
              ...updates,
              updatedAt: Date.now(),
              keywords: updates.highlightedRanges
                ? updates.highlightedRanges.map((r: HighlightedRange) => r.text)
                : e.keywords,
            };
          }),
        });
      },

      deleteEntry: (id) => {
        set({ entries: get().entries.filter((e) => e.id !== id) });
      },

      getEntryByDate: (date) => {
        return get().entries.find((e) => e.date === date);
      },

      getEntriesByMonth: (year, month) => {
        const prefix = `${year}-${String(month).padStart(2, '0')}`;
        return get().entries.filter((e) => e.date.startsWith(prefix));
      },

      getImportantEntries: () => {
        return get()
          .entries.filter((e) => e.isImportant)
          .sort((a, b) => b.updatedAt - a.updatedAt);
      },

      matchEntries: (userMessage) => {
        const msg = userMessage.toLowerCase();
        return get()
          .entries.filter((e) => {
            if (e.isImportant) return false;
            return e.keywords.some((kw) => msg.includes(kw.toLowerCase()));
          })
          .sort((a, b) => b.updatedAt - a.updatedAt);
      },

      buildMemoryContext: (userMessage) => {
        const important = get().getImportantEntries();
        const matched = get().matchEntries(userMessage);
        if (important.length === 0 && matched.length === 0) return '';

        const parts: string[] = [];
        let tokenBudget = 500000; // 50万 token for memory

        for (const entry of important) {
          const line = `\n[重要] ${entry.date} | ${entry.title}\n${entry.content.slice(0, 600)}\n`;
          const tokens = estimateTokens(line);
          if (tokenBudget - tokens < 0) break;
          parts.push(line);
          tokenBudget -= tokens;
        }

        tokenBudget = Math.min(tokenBudget, 200000); // 普通日志 20万 token

        for (const entry of matched) {
          const line = `\n[相关] ${entry.date} | ${entry.title}\n关键词：${entry.keywords.join('、')}\n${entry.content.slice(0, 300)}\n`;
          const tokens = estimateTokens(line);
          if (tokenBudget - tokens < 0) break;
          parts.push(line);
          tokenBudget -= tokens;
        }

        if (parts.length === 0) return '';

        return `## 用户的记忆日志\n请在聊天中自然地参考以下记忆，让对话更有连贯性。不要刻意逐条提及，而是在合适的时候自然带出。\n${parts.join('')}\n> 以上记忆仅供了解用户近况，请自然地融入对话。`;
      },
    }),
    {
      name: 'cutie-diary',
      partialize: (state) => ({ entries: state.entries }),
    },
  ),
);
