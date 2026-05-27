import { useState, useRef, useCallback } from 'react';
import { Button, Cursor } from 'animal-island-ui';
import { useDiaryStore } from '../../stores/diaryStore';
import type { DiaryEntry, HighlightedRange } from '../../types';
import { ArrowLeft, Underline, X } from 'lucide-react';

const MOODS = ['😊', '😢', '🎉', '😤', '😐', '🥰', '😰', '🤔', '😴', '🤩'];

export function DiaryEditor({
  date,
  editEntry,
  onClose,
}: {
  date: string;
  editEntry?: DiaryEntry;
  onClose: () => void;
}) {
  const diaryStore = useDiaryStore();
  const [mood, setMood] = useState(editEntry?.mood || '😐');
  const [title, setTitle] = useState(editEntry?.title || '');
  const [content, setContent] = useState(editEntry?.content || '');
  const [isImportant, setIsImportant] = useState(editEntry?.isImportant || false);
  const [highlights, setHighlights] = useState<HighlightedRange[]>(
    editEntry?.highlightedRanges || [],
  );
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleHighlight = useCallback(() => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) return;
    const text = content.slice(start, end);
    const exists = highlights.find((h) => h.start === start && h.end === end);
    if (exists) {
      setHighlights(highlights.filter((h) => h !== exists));
    } else {
      setHighlights([...highlights, { start, end, text }]);
    }
  }, [content, highlights]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    const entryData = {
      date,
      title: title.trim(),
      content: content.trim(),
      mood,
      isImportant,
      highlightedRanges: highlights,
      keywords: highlights.map((h) => h.text),
    };
    if (editEntry) {
      diaryStore.updateEntry(editEntry.id, entryData);
    } else {
      diaryStore.addEntry(entryData);
    }
    onClose();
  };

  return (
    <Cursor>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f8f8f0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '2px solid #d4c9b4' }}>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#8a7b66', padding: 4 }}>
            <ArrowLeft size={20} />
          </button>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#794f27' }}>
            {editEntry ? '编辑日志' : '写日志'}
          </span>
          <span style={{ fontSize: 13, color: '#c4b89e' }}>{date}</span>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: 32, maxWidth: 900, margin: '0 auto', width: '100%' }}>
          {/* Mood */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#a0936e', marginBottom: 10 }}>今天的心情</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  style={{
                    fontSize: 22, padding: 8, borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: m === mood ? '#e6f9f6' : 'rgb(247,243,223)',
                    outline: m === mood ? '2px solid #19c8b9' : 'none',
                    outlineOffset: 1,
                  }}
                >{m}</button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#a0936e', marginBottom: 10 }}>标题</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给今天起个名字吧~"
              style={{
                width: '100%', padding: '12px 18px', borderRadius: 50, border: '2.5px solid #c4b89e',
                background: 'rgb(247,243,223)', fontSize: 15, color: '#725d42', outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#ffcc00'; }}
              onBlur={(e) => { e.target.style.borderColor = '#c4b89e'; }}
            />
          </div>

          {/* Divider */}
          <div style={{ borderTop: '2px dashed #c4b89e', marginBottom: 20 }} />

          {/* Content */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#a0936e' }}>正文</span>
              <button
                onClick={handleHighlight}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8a7b66',
                  border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 8,
                }}
              >
                <Underline size={12} /> 选中文字划重点
              </button>
            </div>
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="记录今天发生的事吧..."
              rows={10}
              style={{
                width: '100%', padding: '14px 18px', borderRadius: 20, border: '2.5px solid #c4b89e',
                background: 'rgb(247,243,223)', fontSize: 15, color: '#725d42', outline: 'none',
                resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.7, fontFamily: 'inherit',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#ffcc00'; }}
              onBlur={(e) => { e.target.style.borderColor = '#c4b89e'; }}
            />

            {highlights.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {highlights.map((h, i) => (
                  <span
                    key={i}
                    onClick={() => setHighlights(highlights.filter((_, j) => j !== i))}
                    style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 50, cursor: 'pointer',
                      background: '#e6f9f6', color: '#11a89b',
                    }}
                  >✕ {h.text.slice(0, 15)}</span>
                ))}
              </div>
            )}
          </div>

          {/* Important toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isImportant}
              onChange={(e) => setIsImportant(e.target.checked)}
              style={{ accentColor: '#19c8b9', width: 18, height: 18 }}
            />
            <span style={{ fontSize: 14, color: '#725d42' }}>
              重要日志（勾选后，AI聊天每次都会读取此日志）
            </span>
          </label>

          {/* Privacy notice */}
          <div style={{
            padding: 16, borderRadius: 20, background: '#e6f9f6',
            fontSize: 13, color: '#11a89b', lineHeight: 1.6, marginBottom: 20,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: '#794f27' }}>🔒 隐私提醒</div>
            <div>你在聊天时，AI 会读取与本日志相关的记忆。</div>
            <div>重要日志会被全部读取，普通日志通过关键词匹配读取。</div>
            <div>请勿记录敏感个人信息（密码、身份证、银行卡等）。</div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, paddingBottom: 24 }}>
            <Button type="primary" onClick={handleSave} disabled={!title.trim() || !content.trim()} style={{ background: '#82d5bb', borderColor: '#6fbda3', color: '#fff', fontWeight: 700 }}>
              保存
            </Button>
            <Button type="primary" danger onClick={onClose}>
              <X size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Cursor>
  );
}
