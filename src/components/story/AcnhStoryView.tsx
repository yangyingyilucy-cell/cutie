import { useState, useCallback } from 'react';
import { Card, Button, Cursor } from 'animal-island-ui';
import { useStoryStore } from '../../stores/storyStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { usePetStore } from '../../stores/petStore';
import { streamStoryChunk, parseOptionsFromText } from '../../services/api';
import { WRITING_STYLES, getStyleById } from '../../utils/writingStyles';
import { AcnhStoryCreator } from './AcnhStoryCreator';
import { AcnhChapterView } from './AcnhChapterView';
import { AcnhTimeline } from './AcnhTimeline';
import { StorySettingsPanel } from './StorySettings';

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

export function AcnhStoryView() {
  const storyStore = useStoryStore();
  const settings = useSettingsStore();
  const { tick, grantExp } = usePetStore();
  const [showCreator, setShowCreator] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const activeStory = storyStore.getActiveStory();
  const activeStyle = activeStory ? getStyleById(activeStory.writingStyle) : null;

  const buildSystemPrompt = useCallback((story: typeof activeStory) => {
    if (!story) return BASE_SYSTEM_PROMPT;
    const style = getStyleById(story.writingStyle);
    let prompt = BASE_SYSTEM_PROMPT;

    if (style) {
      prompt += `\n\n## 写作风格要求\n你必须严格遵循以下写作风格进行创作：\n\n${style.guide}\n\n请严格按照以上风格要求进行创作。`;
    }

    const params: string[] = [];
    if (story.userCharacter) params.push(`- 用户在故事中的角色：${story.userCharacter}`);
    params.push(`- 叙事视角：${story.viewpoint === 'first' ? '第一人称（以"我"展开叙述）' : '第三人称（客观叙述）'}`);
    params.push(`- 本章目标字数：${story.wordCount}字左右`);
    if (story.outputFormat) params.push(`- 输出格式要求：${story.outputFormat}`);
    if (params.length > 0) prompt += `\n\n## 故事参数\n${params.join('\n')}\n\n请严格遵守以上参数进行创作。`;

    return prompt;
  }, []);

  const handleGenerateChapter = async (prompt: string) => {
    if (!settings.isConfigured()) {
      alert('请先在设置中配置 API Key 和模型');
      return;
    }
    if (!activeStory) return;

    storyStore.setGenerating(true);
    storyStore.setStoryStreamContent('');

    let systemPrompt = buildSystemPrompt(activeStory);

    if (activeStory.chapters.length === 0) {
      systemPrompt += `\n这是故事的开端。请根据以下设定生成第一章。`;
      const userPrompt = `故事标题：${activeStory.title}\n背景设定：${activeStory.background}\n主角特征：${activeStory.protagonist}\n核心冲突：${activeStory.conflict}\n请开始写第一章。`;
      sendStream(systemPrompt, userPrompt);
    } else {
      systemPrompt += `\n这是故事的第 ${activeStory.chapters.length + 1} 章。`;
      const chapterSummary = activeStory.chapters.map((c) => `第${c.number}章: ${c.content.slice(0, 100)}...`).join('\n');
      const userPrompt = `前情提要：\n${chapterSummary}\n\n用户选择的方向：${prompt}\n请续写下一章。`;
      sendStream(systemPrompt, userPrompt);
    }
  };

  const sendStream = (systemPrompt: string, userPrompt: string) => {
    streamStoryChunk({
      apiBaseUrl: settings.apiBaseUrl, apiKey: settings.apiKey, model: settings.model,
      systemPrompt, userPrompt,
      onChunk: (chunk) => storyStore.appendStoryStreamContent(chunk),
      onDone: () => {
        storyStore.saveStreamAsChapter();
        const content = storyStore.storyStreamContent;
        storyStore.finishStoryStream();
        const options = parseOptionsFromText(content);
        if (options.length >= 2) storyStore.setGeneratedOptions(options);
        tick(); grantExp(15);
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
  };

  const handleCustomInput = (input: string) => {
    setUserInput('');
    storyStore.setGeneratedOptions([]);
    handleGenerateChapter(input);
  };

  const handleStyleChange = (styleId: string) => {
    if (activeStory) { storyStore.setWritingStyle(activeStory.id, styleId); }
    setShowStylePicker(false);
  };

  const handleSettingsSave = (settingsObj: any) => {
    if (activeStory) storyStore.setStorySettings(activeStory.id, settingsObj);
  };

  if (showCreator || !activeStory) {
    return (
      <Cursor>
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f8f0' }}>
          <div style={{ padding: '12px 20px', borderBottom: '2px solid #d4c9b4', fontSize: 18, fontWeight: 700, color: '#794f27' }}>
            📖 故事生成器
            <Button size="small" onClick={() => setShowCreator(true)} style={{ marginLeft: 16 }}>
              + 新建
            </Button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
            {storyStore.stories.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 13, color: '#9f927d', marginBottom: 12 }}>已有故事</h3>
                {storyStore.stories.map((s) => (
                  <Card key={s.id} color="default" onClick={() => { storyStore.setActiveStory(s.id); setShowCreator(false); }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#794f27' }}>{s.title}</div>
                        <div style={{ fontSize: 12, color: '#9f927d' }}>
                          {s.chapters.length} 章 · {new Date(s.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: '#c4b89e' }}>打开</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            <AcnhStoryCreator
              onCreate={(title, bg, prot, conf, style) => {
                storyStore.createStory(title, bg, prot, conf, style);
                setShowCreator(false);
              }}
            />
          </div>
        </div>
      </Cursor>
    );
  }

  return (
    <Cursor>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f8f0' }}>
        {/* Header */}
        <div style={{ padding: '8px 20px', borderBottom: '2px solid #d4c9b4', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#794f27' }}>📖 {activeStory.title}</span>
          <div style={{ flex: 1 }} />
          {/* Style picker */}
          <Button size="small" onClick={() => setShowStylePicker(!showStylePicker)}>
            🎨 {activeStyle?.name || '文风'}
          </Button>
          {showStylePicker && (
            <div style={{ position: 'absolute', top: 48, right: 200, zIndex: 50 }}>
              <Card color="default" style={{ padding: 8 }}>
                {WRITING_STYLES.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => handleStyleChange(style.id)}
                    style={{
                      padding: '6px 12px', cursor: 'pointer', borderRadius: 8, fontSize: 13,
                      color: activeStory.writingStyle === style.id ? '#19c8b9' : '#76665b',
                      fontWeight: activeStory.writingStyle === style.id ? 700 : 500,
                    }}
                  >{style.icon} {style.name}</div>
                ))}
              </Card>
            </div>
          )}
          <Button size="small" onClick={() => setShowSettings(true)}>⚙️ 设定</Button>
        </div>

        {showSettings && activeStory && (
          <StorySettingsPanel story={activeStory} onSave={handleSettingsSave} onClose={() => setShowSettings(false)} />
        )}

        {/* Main: sidebar + content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div style={{ width: 200, borderRight: '2px solid #d4c9b4', padding: 16, overflow: 'auto' }}>
            <AcnhTimeline
              stories={storyStore.stories}
              activeStory={activeStory}
              onSelectStory={(id) => storyStore.setActiveStory(id)}
              onCreateStory={() => setShowCreator(true)}
            />
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <AcnhChapterView
              story={activeStory}
              isGenerating={storyStore.isGenerating}
              streamContent={storyStore.storyStreamContent}
              options={storyStore.generatedOptions}
              onSelectOption={handleSelectOption}
              onCustomInput={handleCustomInput}
              onStart={() => handleGenerateChapter('')}
              userInput={userInput}
              setUserInput={setUserInput}
            />
          </div>
        </div>
      </div>
    </Cursor>
  );
}
