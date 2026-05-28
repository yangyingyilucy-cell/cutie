import { useState } from 'react';
import { Card, Button, Cursor } from 'animal-island-ui';
import { useDiaryStore } from '../../stores/diaryStore';
import { DiaryEditor } from './DiaryEditor';
import { ChevronLeft, ChevronRight, Edit3, Trash2 } from 'lucide-react';

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function AcnhDiaryView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [showEditor, setShowEditor] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const diaryStore = useDiaryStore();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthEntries = diaryStore.getEntriesByMonth(year, month + 1);
  const selectedEntry = diaryStore.getEntryByDate(selectedDate);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const todayStr = formatDate(new Date());

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const handleEdit = () => {
    if (selectedEntry) { setEditingEntryId(selectedEntry.id); setShowEditor(true); }
  };

  const handleDelete = () => {
    if (selectedEntry && confirm('确定要删除这篇日志吗？')) {
      diaryStore.deleteEntry(selectedEntry.id); setEditingEntryId(null);
    }
  };

  const handleEditorClose = () => { setShowEditor(false); setEditingEntryId(null); };

  if (showEditor) {
    return (
      <DiaryEditor
        date={selectedDate}
        editEntry={editingEntryId ? diaryStore.entries.find((e) => e.id === editingEntryId) : undefined}
        onClose={handleEditorClose}
      />
    );
  }

  return (
    <Cursor>
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        background: '#efe3cc',
        backgroundImage: 'linear-gradient(180deg, rgba(125,195,149,0.08) 0%, rgba(125,195,149,0.02) 50%, rgba(125,195,149,0.06) 100%)',
      }}>
        {/* Header */}
        <div style={{ padding: '12px 20px', borderBottom: '2px solid #d4c9b4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#794f27' }}>☁️ 记忆</span>
          <Button onClick={() => setShowEditor(true)}>+ 写日志</Button>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Left: Calendar */}
          <div style={{ flex: '5', padding: 16, display: 'flex', flexDirection: 'column' }}>
            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <button onClick={() => setCurrentDate(new Date(year, month - 1))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#76665b', fontSize: 20 }}>
                <ChevronLeft size={22} />
              </button>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#794f27' }}>{year}年 {month + 1}月</span>
              <button onClick={() => setCurrentDate(new Date(year, month + 1))} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#76665b', fontSize: 20 }}>
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Weekday header */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 8 }}>
              {WEEKDAYS.map((w, i) => (
                <div key={w} style={{
                  textAlign: 'center', fontSize: 12, fontWeight: 600,
                  color: i === 0 || i === 6 ? '#eb4762' : '#a0936e',
                  padding: '4px 0',
                }}>{w}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
              {days.map((d, i) => {
                if (d === null) return <div key={`empty-${i}`} />;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const entry = monthEntries.find((e) => e.date === dateStr);
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === todayStr;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      aspectRatio: '1', borderRadius: 16, border: 'none', cursor: 'pointer',
                      fontSize: 15, fontWeight: isToday ? 800 : 600,
                      background: isSelected ? '#19c8b9' : 'rgb(247,243,223)',
                      color: isSelected ? '#fff' : isToday ? '#11a89b' : '#76665b',
                      boxShadow: isSelected ? '0 3px 0 0 #11a89b' : '0 2px 0 0 #d4c9b4',
                      transition: 'all 0.15s',
                      position: 'relative',
                      outline: isToday && !isSelected ? '2px solid #ffcc00' : 'none',
                      outlineOffset: 2,
                    }}
                  >
                    {d}
                    {entry && (
                      <span style={{ fontSize: 14, lineHeight: 1, marginTop: 1 }}>{entry.mood}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Log detail with scrollable content */}
          <div style={{ flex: '4', borderLeft: '2px solid #d4c9b4', padding: 16, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ fontSize: 13, color: '#9f927d', marginBottom: 12 }}>
              📅 {selectedDate}
            </div>

            {selectedEntry ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 28 }}>{selectedEntry.mood}</span>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#794f27' }}>{selectedEntry.title}</div>
                    {selectedEntry.isImportant && (
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: '#e05a5a', color: '#fff' }}>重要</span>
                    )}
                  </div>
                </div>

                {/* Scrollable content area */}
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
                  <Card color="default">
                    <div style={{ fontSize: 15, lineHeight: 1.8, color: '#76665b', whiteSpace: 'pre-wrap' }}>
                      {selectedEntry.content}
                    </div>
                  </Card>
                </div>

                {selectedEntry.keywords.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                    {selectedEntry.keywords.map((kw) => (
                      <span key={kw} style={{
                        fontSize: 12, padding: '4px 12px', borderRadius: 50,
                        background: '#e6f9f6', color: '#11a89b',
                      }}>🏷 {kw}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, paddingTop: 16, borderTop: '1px solid #e4d9c6', marginTop: 'auto' }}>
                  <Button onClick={handleEdit}><Edit3 size={14} /> 编辑</Button>
                  <Button danger onClick={handleDelete}><Trash2 size={14} /> 删除</Button>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#c4b89e' }}>
                <span style={{ fontSize: 40, marginBottom: 12 }}>📝</span>
                <p style={{ fontSize: 15 }}>今天还没有记录哦~</p>
                <Button onClick={() => setShowEditor(true)} style={{ marginTop: 12 }}>写点什么吗？</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Cursor>
  );
}