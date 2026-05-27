import { Button, Cursor } from 'animal-island-ui';
import type { PanelView } from '../layout/Sidebar';

export function AcnhHomePage({ onEnter }: { onEnter: (module: PanelView) => void }) {
  return (
    <Cursor>
      <div
        style={{
          minHeight: '100vh',
          background: '#7DC395',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          padding: 32,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: '#794f27',
              fontFamily: "'Zen Maru Gothic', serif",
              margin: 0,
            }}
          >
            Cutie
          </h1>
          <p style={{ fontSize: 14, color: '#5a4a30', marginTop: 4 }}>
            AI Story & Pet Companion
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 24,
            width: 'min(360px, 90vw)',
          }}
        >
          <Button type="primary" block size="large" onClick={() => onEnter('chat')}>
            💬 聊天
          </Button>
          <Button type="primary" block size="large" onClick={() => onEnter('story')}>
            📖 故事
          </Button>
          <Button block size="large" onClick={() => onEnter('diary')}>
            ☁️ 记忆
          </Button>
          <Button block size="large" onClick={() => onEnter('settings')}>
            ⚙️ 设置
          </Button>
        </div>
      </div>
    </Cursor>
  );
}
