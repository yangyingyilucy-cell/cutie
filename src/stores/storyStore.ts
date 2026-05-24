import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Story, Chapter, StoryOption } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface StoryStore {
  stories: Story[];
  activeStoryId: string | null;
  isGenerating: boolean;
  generatedOptions: StoryOption[];
  storyStreamContent: string;

  getActiveStory: () => Story | undefined;
  createStory: (title: string, background: string, protagonist: string, conflict: string, writingStyle: string) => string;
  addChapter: (chapter: Chapter) => void;
  setWritingStyle: (storyId: string, style: string) => void;
  setStorySettings: (storyId: string, settings: Partial<Pick<Story, 'userCharacter' | 'viewpoint' | 'wordCount' | 'outputFormat'>>) => void;
  setGenerating: (generating: boolean) => void;
  setGeneratedOptions: (options: StoryOption[]) => void;
  setStoryStreamContent: (content: string) => void;
  appendStoryStreamContent: (chunk: string) => void;
  saveStreamAsChapter: () => void;
  finishStoryStream: () => void;
  deleteStory: (id: string) => void;
  setActiveStory: (id: string | null) => void;
  exportStoryJSON: (id: string) => void;
}

export const useStoryStore = create<StoryStore>()(
  persist(
    (set, get) => ({
      stories: [],
      activeStoryId: null,
      isGenerating: false,
      generatedOptions: [],
      storyStreamContent: '',

      getActiveStory: () => {
        const { stories, activeStoryId } = get();
        return stories.find((s) => s.id === activeStoryId);
      },

      createStory: (title, background, protagonist, conflict, writingStyle) => {
        const id = uuidv4();
        const story: Story = {
          id,
          title,
          background,
          protagonist,
          conflict,
          writingStyle,
          userCharacter: '',
          viewpoint: 'third',
          wordCount: 800,
          outputFormat: '',
          chapters: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({ stories: [...get().stories, story], activeStoryId: id });
        return id;
      },

      addChapter: (chapter) => {
        const { stories, activeStoryId } = get();
        if (!activeStoryId) return;
        set({
          stories: stories.map((s) => {
            if (s.id !== activeStoryId) return s;
            return {
              ...s,
              chapters: [...s.chapters, chapter],
              updatedAt: Date.now(),
            };
          }),
        });
      },

      setWritingStyle: (storyId, writingStyle) => {
        set({
          stories: get().stories.map((s) =>
            s.id === storyId ? { ...s, writingStyle } : s,
          ),
        });
      },

      setStorySettings: (storyId, settings) => {
        set({
          stories: get().stories.map((s) =>
            s.id === storyId ? { ...s, ...settings } : s,
          ),
        });
      },

      setGenerating: (isGenerating) => set({ isGenerating }),
  setGeneratedOptions: (generatedOptions) => set({ generatedOptions }),
  setStoryStreamContent: (storyStreamContent) => set({ storyStreamContent }),
  appendStoryStreamContent: (chunk) =>
    set((s) => ({ storyStreamContent: s.storyStreamContent + chunk })),
  saveStreamAsChapter: () => {
    const { storyStreamContent } = get();
    if (!storyStreamContent) return;
    const activeStory = get().getActiveStory();
    const chapterNum = (activeStory?.chapters.length ?? 0) + 1;
    const chapter: Chapter = {
      number: chapterNum,
      content: storyStreamContent,
    };
    get().addChapter(chapter);
  },
  finishStoryStream: () => {
    set({
      isGenerating: false,
      storyStreamContent: '',
      generatedOptions: [],
    });
  },

      deleteStory: (id) => {
        set({
          stories: get().stories.filter((s) => s.id !== id),
          activeStoryId: get().activeStoryId === id ? null : get().activeStoryId,
        });
      },

      setActiveStory: (activeStoryId) => set({ activeStoryId }),

      exportStoryJSON: (id) => {
        const story = get().stories.find((s) => s.id === id);
        if (!story) return;
        const blob = new Blob([JSON.stringify(story, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `story-${story.title}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
    }),
    {
      name: 'cutie-stories',
      partialize: (state) => ({
        stories: state.stories,
        activeStoryId: state.activeStoryId,
      }),
    },
  ),
);
