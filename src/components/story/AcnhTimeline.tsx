import { useState } from 'react';
import { Button } from 'animal-island-ui';
import type { Story } from '../../types';

export function AcnhTimeline({
  stories, activeStory, onSelectStory, onCreateStory,
}: {
  stories: Story[];
  activeStory: Story | undefined;
  onSelectStory: (id: string) => void;
  onCreateStory: () => void;
}) {
  const [showChapters, setShowChapters] = useState(true);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h4 style={{ fontSize: 12, fontWeight: 700, color: '#76665b', textTransform: 'uppercase', letterSpacing: 1 }}>故事列表</h4>
        <Button size="small" onClick={onCreateStory}>+ 新建</Button>
      </div>

      {stories.length === 0 && <p style={{ fontSize: 12, color: '#76665b' }}>暂无故事</p>}

      {stories.map((s) => (
        <div
          key={s.id}
          onClick={() => onSelectStory(s.id)}
          style={{
            padding: '8px 12px', borderRadius: 8, marginBottom: 4, cursor: 'pointer',
            background: activeStory?.id === s.id ? '#57bca8' : 'transparent',
            color: activeStory?.id === s.id ? '#fff' : '#76665b',
            fontSize: 13,
          }}
        >
          <div style={{ fontWeight: 600 }}>{s.title}</div>
          <div style={{ fontSize: 11, opacity: 0.6 }}>{s.chapters.length} 章 · {new Date(s.updatedAt).toLocaleDateString()}</div>
        </div>
      ))}

      {activeStory && (
        <div style={{ marginTop: 16 }}>
          <div
            onClick={() => setShowChapters(!showChapters)}
            style={{ fontSize: 12, fontWeight: 700, color: '#76665b', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}
          >
            {showChapters ? '▼' : '▶'} 章节
          </div>
          {showChapters && activeStory.chapters.length === 0 && (
            <p style={{ fontSize: 12, color: '#76665b' }}>暂无章节</p>
          )}
          {showChapters && activeStory.chapters.map((ch) => (
            <div key={ch.number} style={{ padding: '4px 12px', fontSize: 12, color: '#76665b', cursor: 'pointer' }}>
              第 {ch.number} 章
              <span style={{ opacity: 0.5, marginLeft: 4 }}>{ch.content.slice(0, 12)}...</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
