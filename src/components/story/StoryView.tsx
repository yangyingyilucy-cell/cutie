import { useState, useCallback } from 'react';
import { useStoryStore } from '../../stores/storyStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { usePetStore } from '../../stores/petStore';
import { streamStoryChunk, parseOptionsFromText } from '../../services/api';
import { WRITING_STYLES, getStyleById } from '../../utils/writingStyles';
import { StoryCreator } from './StoryCreator';
import { ChapterView } from './ChapterView';
import { Timeline } from './Timeline';
import { GlassCard } from '../ui/GlassCard';
import { Sidebar, BookOpen, Palette } from 'lucide-react';

const BASE_SYSTEM_PROMPT = `你是一位专业的小说作家，擅长和用户共同创作故事。

你的任务：
1. 根据用户提供的背景设定、主角特征和核心冲突，生成小说章节
2. 每章结束后，提供 3 个后续发展选项（格式：选项A: xxx 选项B: xxx 选项C: xxx）
3. 用户选择后，根据选择生成下一章内容
4. 保持故事连贯、角色塑造一致

注意：在每章内容末尾，必须清晰地给出3个选项，格式为：
选项A: [具体的发展方向]
选项B: [另一个发展方向]
选项C: [第三个发展方向]`;

export function StoryView({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const storyStore = useStoryStore();
  const settings = useSettingsStore();
  const { tick, grantExp } = usePetStore();
  const [showCreator, setShowCreator] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showStylePicker, setShowStylePicker] = useState(false);

  const activeStory = storyStore.getActiveStory();
  const activeStyle = activeStory ? getStyleById(activeStory.writingStyle) : null;

  const buildSystemPrompt = useCallback((styleId: string) => {
    const style = getStyleById(styleId);
    if (!style) return BASE_SYSTEM_PROMPT;
    return `${BASE_SYSTEM_PROMPT}

## 写作风格要求
你必须严格遵循以下写作风格进行创作：

${style.guide}

请严格按照以上风格要求进行创作。`;
  }, []);

  const handleGenerateChapter = async (prompt: string) => {
    if (!settings.isConfigured()) {
      alert('请先在设置中配置 API Key 和模型');
      return;
    }
    if (!activeStory) return;

    storyStore.setGenerating(true);
    storyStore.setStoryStreamContent('');

    let systemPrompt = buildSystemPrompt(activeStory.writingStyle);
    let userPrompt: string;

    if (activeStory.chapters.length === 0) {
      systemPrompt += `\n这是故事的开端。请根据以下设定生成第一章。`;
      userPrompt = `故事标题：${activeStory.title}\n背景设定：${activeStory.background}\n主角特征：${activeStory.protagonist}\n核心冲突：${activeStory.conflict}\n请开始写第一章。`;
    } else {
      systemPrompt += `\n这是故事的第 ${activeStory.chapters.length + 1} 章。`;
      const chapterSummary = activeStory.chapters
        .map((c) => `第${c.number}章: ${c.content.slice(0, 100)}...`)
        .join('\n');
      userPrompt = `前情提要：\n${chapterSummary}\n\n用户选择的方向：${prompt}\n请续写下一章。`;
    }

    streamStoryChunk({
      apiBaseUrl: settings.apiBaseUrl,
      apiKey: settings.apiKey,
      model: settings.model,
      systemPrompt,
      userPrompt,
      onChunk: (chunk) => storyStore.appendStoryStreamContent(chunk),
      onDone: () => {
        storyStore.saveStreamAsChapter();
        const content = storyStore.storyStreamContent;
        storyStore.finishStoryStream();
        const options = parseOptionsFromText(content);
        if (options.length >= 2) {
          storyStore.setGeneratedOptions(options);
        }
        tick();
        grantExp(15);
      },
      onError: (err) => {
        storyStore.setGenerating(false);
        storyStore.setStoryStreamContent('');
        alert(`生成失败: ${err.message}`);
      },
    });
  };

  const handleSelectOption = (optionText: string) => {
    setUserInput(optionText);
    storyStore.setGeneratedOptions([]);
    handleGenerateChapter(optionText);
  };

  const handleStyleChange = (styleId: string) => {
    if (activeStory) {
      storyStore.setWritingStyle(activeStory.id, styleId);
    }
    setShowStylePicker(false);
  };

  if (showCreator || !activeStory) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 p-3 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
          <button onClick={onToggleSidebar} className="opacity-50 hover:opacity-80 cursor-pointer">
            <Sidebar size={20} />
          </button>
          <BookOpen size={20} className="opacity-50" />
          <span className="font-medium text-sm">故事生成器</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {storyStore.stories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold opacity-60 mb-2">已有故事</h3>
              <div className="flex flex-col gap-2">
                {storyStore.stories.map((s) => (
                  <GlassCard key={s.id} className="cursor-pointer">
                    <div
                      onClick={() => {
                        storyStore.setActiveStory(s.id);
                        setShowCreator(false);
                      }}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium text-sm">{s.title}</div>
                        <div className="text-xs opacity-50">
                          {s.chapters.length} 章 · {new Date(s.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="text-xs opacity-40">打开</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
          <StoryCreator
            onCreate={(title, bg, prot, conf, style) => {
              storyStore.createStory(title, bg, prot, conf, style);
              setShowCreator(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-3 border-b border-[var(--color-border-light)] dark:border-[var(--color-border-dark)]">
        <button onClick={onToggleSidebar} className="opacity-50 hover:opacity-80 cursor-pointer">
          <Sidebar size={20} />
        </button>
        <BookOpen size={20} className="opacity-50" />
        <span className="font-medium text-sm">{activeStory.title}</span>
        {/* Style indicator & picker */}
        <div className="relative ml-auto flex items-center gap-2">
          <button
            onClick={() => setShowStylePicker(!showStylePicker)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-[8px] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] opacity-60 hover:opacity-100 cursor-pointer transition-all"
          >
            <Palette size={12} />
            {activeStyle?.icon} {activeStyle?.name || '选择文风'}
          </button>
          {showStylePicker && (
            <div
              className="absolute top-full right-0 mt-1 glass-card p-1 z-50 shadow-lg min-w-[140px]"
            >
              {WRITING_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => handleStyleChange(style.id)}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-[8px] hover:bg-[var(--color-bg-light)] dark:hover:bg-[var(--color-bg-dark)] cursor-pointer ${
                    activeStory.writingStyle === style.id
                      ? 'text-[var(--color-accent)] font-medium'
                      : ''
                  }`}
                >
                  {style.icon} {style.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setShowCreator(true);
            storyStore.setActiveStory(null);
          }}
          className="text-xs opacity-50 hover:opacity-80 cursor-pointer"
        >
          + 新故事
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-52 border-r border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] p-3 overflow-y-auto">
          <Timeline story={activeStory} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChapterView
            story={activeStory}
            isGenerating={storyStore.isGenerating}
            streamContent={storyStore.storyStreamContent}
            options={storyStore.generatedOptions}
            onSelectOption={handleSelectOption}
            onCustomInput={(input) => {
              setUserInput(input);
              storyStore.setGeneratedOptions([]);
              handleGenerateChapter(input);
            }}
            onStart={() => handleGenerateChapter('')}
            userInput={userInput}
            setUserInput={setUserInput}
          />
        </div>
      </div>
    </div>
  );
}
