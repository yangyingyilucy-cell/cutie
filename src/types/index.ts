export interface Character {
  id: string;
  name: string;
  avatar: string;
  systemPrompt: string;
  isBuiltin: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  characterId: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface ModelInfo {
  id: string;
  owned_by: string;
}

export interface Settings {
  apiKey: string;
  apiBaseUrl: string;
  model: string;
  theme: 'light' | 'dark';
  models: ModelInfo[];
}

export interface Chapter {
  number: number;
  content: string;
  choice?: string;
}

export interface Story {
  id: string;
  title: string;
  background: string;
  protagonist: string;
  conflict: string;
  writingStyle: string;
  userCharacter: string;
  viewpoint: 'first' | 'third';
  wordCount: number;
  outputFormat: string;
  chapters: Chapter[];
  createdAt: number;
  updatedAt: number;
}

export interface PetState {
  health: number;
  hunger: number;
  cleanliness: number;
  mood: number;
  level: number;
  exp: number;
  coins: number;
  lastFed: number;
  lastPetted: number;
  lastBathed: number;
}

export interface StoryOption {
  index: number;
  text: string;
}

export interface HighlightedRange {
  start: number;
  end: number;
  text: string;
}

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  isImportant: boolean;
  keywords: string[];
  highlightedRanges: HighlightedRange[];
  createdAt: number;
  updatedAt: number;
}
