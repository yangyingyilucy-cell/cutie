import { useState } from 'react';
import { Card, Button, Input } from 'animal-island-ui';
import { WRITING_STYLES } from '../../utils/writingStyles';

interface AcnhStoryCreatorProps {
  onCreate: (title: string, background: string, protagonist: string, conflict: string, style: string) => void;
}

export function AcnhStoryCreator({ onCreate }: AcnhStoryCreatorProps) {
  const [title, setTitle] = useState('');
  const [background, setBackground] = useState('');
  const [protagonist, setProtagonist] = useState('');
  const [conflict, setConflict] = useState('');
  const [writingStyle, setWritingStyle] = useState(WRITING_STYLES[0].id);

  const canCreate = title.trim() && background.trim() && protagonist.trim() && conflict.trim();

  // 动物森友会风格的内联样式（基于之前定义的颜色变量）
  const styles = {
    card: {
      background: '#fefcf7',      // 类似 --AntiqueWhite 的暖白
      borderRadius: 44,
      padding: '24px 28px',
      border: '1px solid #f0e5d4',
      boxShadow: '0 12px 20px -10px rgba(7, 87, 98, 0.06)',
      fontFamily: "'Nunito', 'Quicksand', sans-serif",
    },
    title: {
      fontSize: 20,
      fontWeight: 800,
      color: '#76665b',           // 统一字体颜色
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    },
    titleIcon: {
      fontSize: 24,
      color: '#fec844',           // --BrightSun
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 16,
    },
    inputWrapper: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: 6,
    },
    label: {
      fontSize: 13,
      fontWeight: 600,
      color: '#76665b',
      marginLeft: 8,
    },
    input: {
      width: '100%',
      padding: '12px 18px',
      fontSize: 15,
      fontFamily: 'inherit',
      background: '#faf6ee',      // --Parchment
      border: '1px solid #e8ddca',
      borderRadius: 60,
      outline: 'none',
      transition: 'all 0.2s',
      color: '#76665b',
    },
    inputFocus: {
      borderColor: '#9fd3c8',     // --ShadowGreen
      boxShadow: '0 0 0 2px rgba(159, 211, 200, 0.2)',
    },
    styleGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 10,
      marginTop: 6,
    },
    styleChip: (isActive: boolean) => ({
      padding: '8px 12px',
      borderRadius: 60,
      border: `2px solid ${isActive ? '#9fd3c8' : '#dacfbb'}`,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      textAlign: 'center' as const,
      background: isActive ? '#e6f9f6' : 'transparent',
      color: isActive ? '#075762' : '#76665b',
      transition: 'all 0.15s',
    }),
    button: {
      width: '100%',
      background: '#9fd3c8',      // --ShadowGreen
      border: 'none',
      borderRadius: 60,
      padding: '12px 20px',
      fontSize: 16,
      fontWeight: 700,
      fontFamily: 'inherit',
      color: '#76665b',
      cursor: 'pointer',
      transition: 'all 0.15s',
      marginTop: 8,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    buttonDisabled: {
      background: '#e0d5c2',
      cursor: 'not-allowed',
      opacity: 0.7,
    },
    buttonHover: {
      background: '#c2e0d6',
      transform: 'translateY(-1px)',
    },
  };

  const [focusStyle, setFocusStyle] = useState({});

  return (
    <div style={styles.card}>
      <div style={styles.title}>
        <span style={styles.titleIcon}>📖</span>
        <span>创建新故事</span>
      </div>
      <div style={styles.formGroup}>
        <div style={styles.inputWrapper}>
          <label style={styles.label}>故事标题</label>
          <input
            type="text"
            placeholder="例如：小岛的奇妙漂流"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ ...styles.input, ...focusStyle }}
            onFocus={() => setFocusStyle(styles.inputFocus)}
            onBlur={() => setFocusStyle({})}
          />
        </div>

        <div style={styles.inputWrapper}>
          <label style={styles.label}>背景设定</label>
          <input
            type="text"
            placeholder="世界是什么样子？"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            style={{ ...styles.input, ...focusStyle }}
            onFocus={() => setFocusStyle(styles.inputFocus)}
            onBlur={() => setFocusStyle({})}
          />
        </div>

        <div style={styles.inputWrapper}>
          <label style={styles.label}>主角特征</label>
          <input
            type="text"
            placeholder="性别、年龄、性格等"
            value={protagonist}
            onChange={(e) => setProtagonist(e.target.value)}
            style={{ ...styles.input, ...focusStyle }}
            onFocus={() => setFocusStyle(styles.inputFocus)}
            onBlur={() => setFocusStyle({})}
          />
        </div>

        <div style={styles.inputWrapper}>
          <label style={styles.label}>核心冲突</label>
          <input
            type="text"
            placeholder="故事的主要矛盾是什么？"
            value={conflict}
            onChange={(e) => setConflict(e.target.value)}
            style={{ ...styles.input, ...focusStyle }}
            onFocus={() => setFocusStyle(styles.inputFocus)}
            onBlur={() => setFocusStyle({})}
          />
        </div>

        <div>
          <label style={styles.label}>写作风格</label>
          <div style={styles.styleGrid}>
            {WRITING_STYLES.map((s) => (
              <div
                key={s.id}
                onClick={() => setWritingStyle(s.id)}
                style={styles.styleChip(writingStyle === s.id)}
              >
                {s.icon} {s.name}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => canCreate && onCreate(title, background, protagonist, conflict, writingStyle)}
          disabled={!canCreate}
          style={{
            ...styles.button,
            ...(!canCreate ? styles.buttonDisabled : {}),
          }}
          onMouseEnter={(e) => {
            if (canCreate) e.currentTarget.style.background = styles.buttonHover.background;
          }}
          onMouseLeave={(e) => {
            if (canCreate) e.currentTarget.style.background = styles.button.background;
          }}
        >
          一键开局，生成第一章
        </button>
      </div>
    </div>
  );
}