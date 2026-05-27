import { useState } from 'react';
import { Card, Button, Input } from 'animal-island-ui';
import { WRITING_STYLES } from '../../utils/writingStyles';

export function AcnhStoryCreator({
  onCreate,
}: {
  onCreate: (title: string, background: string, protagonist: string, conflict: string, style: string) => void;
}) {
  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('');
  const [protagonist, setProtagonist] = useState('');
  const [conflict, setConflict] = useState('');
  const [writingStyle, setWritingStyle] = useState(WRITING_STYLES[0].id);

  const canCreate = title.trim() && background.trim() && protagonist.trim() && conflict.trim();

  return (
    <Card color="default">
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#794f27', marginBottom: 16 }}>创建新故事</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Input placeholder="故事标题" value={title} onChange={(e: any) => setTitle(e.target.value)} />
        <Input placeholder="背景设定（世界是什么样子？）" value={background} onChange={(e: any) => setBackground(e.target.value)} />
        <Input placeholder="主角特征（性别、年龄、性格等）" value={protagonist} onChange={(e: any) => setProtagonist(e.target.value)} />
        <Input placeholder="核心冲突（故事的主要矛盾是什么？）" value={conflict} onChange={(e: any) => setConflict(e.target.value)} />
        <div>
          <label style={{ fontSize: 13, color: '#9f927d', marginBottom: 8, display: 'block' }}>写作风格</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {WRITING_STYLES.map((s) => (
              <div
                key={s.id}
                onClick={() => setWritingStyle(s.id)}
                style={{
                  padding: '8px 12px', borderRadius: 50, border: writingStyle === s.id ? '2px solid #19c8b9' : '2px solid #c4b89e',
                  fontSize: 13, cursor: 'pointer', textAlign: 'center',
                  background: writingStyle === s.id ? '#e6f9f6' : 'transparent',
                  color: writingStyle === s.id ? '#11a89b' : '#725d42',
                }}
              >{s.icon} {s.name}</div>
            ))}
          </div>
        </div>
        <Button type="primary" block onClick={() => onCreate(title, background, protagonist, conflict, writingStyle)} disabled={!canCreate}>
          一键开局，生成第一章
        </Button>
      </div>
    </Card>
  );
}
