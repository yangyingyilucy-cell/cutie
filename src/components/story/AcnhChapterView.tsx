import { Card, Button, Input } from 'animal-island-ui';
import type { Story, StoryOption } from '../../types';

function formatContent(content: string): string {
  return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
}

export function AcnhChapterView({
  story, isGenerating, streamContent, options,
  onSelectOption, onCustomInput, onStart, userInput, setUserInput,
}: {
  story: Story;
  isGenerating: boolean;
  streamContent: string;
  options: StoryOption[];
  onSelectOption: (text: string) => void;
  onCustomInput: (input: string) => void;
  onStart: () => void;
  userInput: string;
  setUserInput: (v: string) => void;
}) {
  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      {story.chapters.length === 0 && !isGenerating && (
        <div style={{ textAlign: 'center', marginTop: 60 }}>
          <p style={{ fontSize: 14, color: '#9f927d', marginBottom: 20 }}>故事已创建，点击下方按钮生成第一章</p>
          <Button type="primary" size="large" onClick={onStart}>生成第一章</Button>
        </div>
      )}

      {story.chapters.map((ch) => (
        <div key={ch.number} style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#794f27', marginBottom: 12 }}>
            第 {ch.number} 章
          </h3>
          <Card color="default">
            <div
              style={{ fontSize: 15, lineHeight: 1.8, color: '#725d42' }}
              dangerouslySetInnerHTML={{ __html: formatContent(ch.content) }}
            />
          </Card>
          {ch.choice && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#c4b89e', paddingLeft: 8, borderLeft: '3px solid #19c8b9' }}>
              选择: {ch.choice}
            </div>
          )}
        </div>
      ))}

      {isGenerating && streamContent && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#794f27', marginBottom: 12 }}>
            第 {story.chapters.length + 1} 章 (生成中...)
          </h3>
          <Card color="default">
            <div style={{ fontSize: 15, lineHeight: 1.8, color: '#725d42' }}>
              <span dangerouslySetInnerHTML={{ __html: formatContent(streamContent) }} />
              <span style={{ display: 'inline-block', width: 2, height: 18, background: '#19c8b9', marginLeft: 2 }} />
            </div>
          </Card>
        </div>
      )}

      {options.length >= 2 && !isGenerating && (
        <Card color="app-yellow" style={{ marginBottom: 16 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#725d42', marginBottom: 12 }}>选择下一步</h4>
          {options.map((opt) => (
            <div
              key={opt.index}
              onClick={() => onSelectOption(opt.text)}
              style={{
                padding: '10px 14px', marginBottom: 8, borderRadius: 12, cursor: 'pointer',
                border: '2px solid #d4c9b4', fontSize: 14, color: '#725d42',
                background: 'rgb(247,243,223)',
              }}
            >
              <span style={{ color: '#19c8b9', fontWeight: 700, marginRight: 8 }}>
                {String.fromCharCode(65 + opt.index)}.
              </span>
              {opt.text}
            </div>
          ))}
        </Card>
      )}

      {!isGenerating && story.chapters.length > 0 && options.length === 0 && (
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="输入接下来的发展方向..."
              value={userInput}
              onChange={(e: any) => setUserInput(e.target.value)}
              onKeyDown={(e: any) => { if (e.key === 'Enter' && userInput.trim()) onCustomInput(userInput); }}
            />
          </div>
          <Button type="primary" onClick={() => userInput.trim() && onCustomInput(userInput)} disabled={!userInput.trim()} style={{ background: '#82d5bb', borderColor: '#6fbda3', color: '#fff', fontWeight: 700 }}>
            续写
          </Button>
        </div>
      )}
    </div>
  );
}
