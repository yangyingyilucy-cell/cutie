import { useState } from 'react';
import { usePetStore } from '../../stores/petStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { Button } from 'animal-island-ui';
import { GlassCard, GlassButton } from '../ui/GlassCard';
import { X, Bone, Heart, Droplets, Star } from 'lucide-react';

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <span style={{ fontSize: 12, width: 36, color: 'rgba(255,248,240,0.7)' }}>{label}</span>
      <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 4, transition: 'width 0.5s', width: `${value}%`, backgroundColor: color }} />
      </div>
      <span style={{ fontSize: 12, width: 32, textAlign: 'right', color: 'rgba(255,248,240,0.7)' }}>{Math.round(value)}</span>
    </div>
  );
}

export function PetPanel() {
  const { pet, feed, petAction, bathe, setPanelOpen, setPetName, getPetStage } = usePetStore();
  const theme = useSettingsStore((s) => s.theme);
  const isAcnh = theme === 'acnh';
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(pet.name);

  const stage = getPetStage();
  const stageName = stage === 'puppy' ? '幼犬' : stage === 'adult' ? '成犬' : '成熟犬';
  const stageEmoji = stage === 'puppy' ? '🐶' : stage === 'adult' ? '🐕' : '🦮';

  const statusText = pet.health <= 0 ? '💀 已故...' : pet.hunger < 20 ? '🍖 饿了！' : pet.cleanliness < 20 ? '🛁 脏了！' : pet.mood < 30 ? '😔 心情低落' : pet.mood > 80 ? '❤️ 超开心！' : '😊 普普通通';

  const content = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>{stageEmoji}</span>
          <div>
            {editingName ? (
              <div style={{ display: 'flex', gap: 4 }}>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onBlur={() => { setPetName(nameInput || '伯恩山犬'); setEditingName(false); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { setPetName(nameInput || '伯恩山犬'); setEditingName(false); } }}
                  autoFocus
                  style={{
                    background: 'transparent', border: 'none', borderBottom: '2px solid rgba(255,248,240,0.5)',
                    color: isAcnh ? '#fff8f0' : 'inherit', fontSize: 14, fontWeight: 700, width: 100, outline: 'none',
                  }}
                />
              </div>
            ) : (
              <div
                onClick={() => { setNameInput(pet.name); setEditingName(true); }}
                style={{
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  color: isAcnh ? '#fff8f0' : '#794f27',
                }}
              >{pet.name}</div>
            )}
            <div style={{ fontSize: 11, opacity: isAcnh ? 0.6 : 0.5, color: isAcnh ? '#fff8f0' : undefined }}>
              {stageName} · Lv.{pet.level}
            </div>
          </div>
        </div>
        <button onClick={() => setPanelOpen(false)} style={{ opacity: isAcnh ? 0.7 : 0.5, cursor: 'pointer', border: 'none', background: 'none', color: isAcnh ? '#fff8f0' : 'inherit', fontSize: 16 }}>
          <X size={18} />
        </button>
      </div>

      <StatBar label="生命" value={pet.health} color="#e85d75" />
      <StatBar label="饥饿" value={pet.hunger} color="#f0a060" />
      <StatBar label="清洁" value={pet.cleanliness} color="#60b8e8" />
      <StatBar label="心情" value={pet.mood} color="#d4a5c9" />

      <div style={{ margin: '8px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.6, marginBottom: 2, color: isAcnh ? '#fff8f0' : undefined }}>
          <span>经验</span><span>{pet.exp}/100</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 2, background: isAcnh ? '#19c8b9' : 'var(--color-accent)', width: `${pet.exp}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, opacity: 0.6, marginBottom: 12, color: isAcnh ? '#fff8f0' : undefined }}>
        <Star size={12} color="#f5c31c" /> {pet.coins} 金币
      </div>

      <div style={{ textAlign: 'center', fontSize: 13, opacity: 0.7, marginBottom: 12, color: isAcnh ? '#fff8f0' : undefined }}>{statusText}</div>

      <div style={{ display: 'flex', gap: 8 }}>
        {isAcnh ? (
          <>
            <Button size="small" onClick={feed} disabled={pet.coins < 10 || pet.health <= 0}>🍖 喂食(10)</Button>
            <Button size="small" onClick={petAction} disabled={pet.health <= 0}>❤️ 抚摸</Button>
            <Button size="small" onClick={bathe} disabled={pet.coins < 20 || pet.health <= 0}>🛁 洗澡(20)</Button>
          </>
        ) : (
          <>
            <GlassButton variant="ghost" onClick={feed} disabled={pet.coins < 10 || pet.health <= 0} className="text-xs py-1.5"><Bone size={12} />喂食(10)</GlassButton>
            <GlassButton variant="ghost" onClick={petAction} disabled={pet.health <= 0} className="text-xs py-1.5"><Heart size={12} />抚摸</GlassButton>
            <GlassButton variant="ghost" onClick={bathe} disabled={pet.coins < 20 || pet.health <= 0} className="text-xs py-1.5"><Droplets size={12} />洗澡(20)</GlassButton>
          </>
        )}
      </div>
    </>
  );

  if (isAcnh) {
    return (
      <div style={{ background: '#9a835a', borderRadius: 20, padding: 16, width: 280, color: '#fff8f0' }}>
        {content}
      </div>
    );
  }

  return (
    <GlassCard className="w-72">
      {content}
    </GlassCard>
  );
}
