import { useState } from 'react';
import { Modal, Button, Input } from 'animal-island-ui';
import type { Story } from '../../types';

export function StorySettingsPanel({
  story,
  onSave,
  onClose,
}: {
  story: Story;
  onSave: (settings: { userCharacter: string; viewpoint: 'first' | 'third'; wordCount: number; outputFormat: string }) => void;
  onClose: () => void;
}) {
  const [userCharacter, setUserCharacter] = useState(story.userCharacter);
  const [viewpoint, setViewpoint] = useState<'first' | 'third'>(story.viewpoint);
  const [wordCount, setWordCount] = useState(story.wordCount);
  const [outputFormat, setOutputFormat] = useState(story.outputFormat);

  const handleOk = () => {
    onSave({ userCharacter, viewpoint, wordCount, outputFormat });
  };

  return (
    <Modal
      open={true}
      title="故事设定"
      onClose={onClose}
      onOk={handleOk}
      typewriter={false}
      width={600}
      footer={
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button type="primary" danger onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleOk} style={{ background: '#9fd3c8', borderColor: '#9fd3c8', color: '#fff', fontWeight: 700 }}>保存</Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ fontSize: 13, color: '#76665b', marginBottom: 6, display: 'block' }}>你的角色</label>
          <Input
            style={{ width: '400px' }}
            placeholder="你在故事中的身份（如旁观者、邻家少年）"
            value={userCharacter}
            onChange={(e: any) => setUserCharacter(e.target.value)}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, color: '#76665b', marginBottom: 6, display: 'block' }}>叙事视角</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['first', 'third'] as const).map((v) => (
              <div
                key={v}
                onClick={() => setViewpoint(v)}
                style={{
                  flex: 1, textAlign: 'center', padding: '8px 16px', borderRadius: 50, cursor: 'pointer', fontSize: 13,
                  background: viewpoint === v ? '#19c8b9' : 'rgb(247,243,223)',
                  color: viewpoint === v ? '#fff' : '#76665b',
                  border: viewpoint === v ? '2px solid #11a89b' : '2px solid #c4b89e',
                }}
              >{v === 'first' ? '第一人称' : '第三人称'}</div>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 13, color: '#76665b', marginBottom: 6, display: 'block' }}>每章目标字数</label>
          <Input
            style={{ width: '400px' }}
            value={String(wordCount? wordCount:800)}
            onChange={(e: any) => setWordCount(Number(e.target.value) || 1000)}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, color: '#76665b', marginBottom: 6, display: 'block' }}>输出格式</label>
          <Input
            style={{ width: '400px' }}
            placeholder="如：纯叙述、对话为主、散文风格"
            value={outputFormat}
            onChange={(e: any) => setOutputFormat(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
