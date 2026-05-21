import { usePetStore } from '../../stores/petStore';
import { GlassCard, GlassButton } from '../ui/GlassCard';
import { X, Bone, Heart, Droplets, Star } from 'lucide-react';

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-12 opacity-60">{label}</span>
      <div className="flex-1 h-2 bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs w-8 text-right opacity-60">{Math.round(value)}</span>
    </div>
  );
}

export function PetPanel() {
  const { pet, feed, petAction, bathe, setPanelOpen, getPetStage } = usePetStore();

  const stage = getPetStage();
  const stageName = stage === 'puppy' ? '幼犬' : stage === 'adult' ? '成犬' : '成熟犬';
  const stageEmoji = stage === 'puppy' ? '🐶' : stage === 'adult' ? '🐕' : '🦮';

  const statusText =
    pet.health <= 0
      ? '💀 已故...'
      : pet.hunger < 20
        ? '🍖 饿了！'
        : pet.cleanliness < 20
          ? '🛁 脏了！'
          : pet.mood < 30
            ? '😔 心情低落'
            : pet.mood > 80
              ? '❤️ 超开心！'
              : '😊 普普通通';

  return (
    <GlassCard className="w-72">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{stageEmoji}</span>
          <div>
            <div className="text-sm font-semibold">伯恩山犬</div>
            <div className="text-xs opacity-50">{stageName} · Lv.{pet.level}</div>
          </div>
        </div>
        <button onClick={() => setPanelOpen(false)} className="opacity-50 hover:opacity-80">
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 mb-3">
        <StatBar label="生命" value={pet.health} color="#e85d75" />
        <StatBar label="饥饿" value={pet.hunger} color="#f0a060" />
        <StatBar label="清洁" value={pet.cleanliness} color="#60b8e8" />
        <StatBar label="心情" value={pet.mood} color="#d4a5c9" />
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between text-xs opacity-60 mb-0.5">
          <span>经验</span>
          <span>{pet.exp}/100</span>
        </div>
        <div className="h-1.5 bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--color-accent)] transition-all"
            style={{ width: `${pet.exp}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs opacity-60 mb-3">
        <Star size={12} className="text-amber-400" /> {pet.coins} 金币
      </div>

      <div className="text-xs text-center mb-3 opacity-70">{statusText}</div>

      <div className="flex gap-2">
        <GlassButton
          variant="ghost"
          onClick={feed}
          disabled={pet.coins < 10 || pet.health <= 0}
          className="flex-1 text-xs py-1.5"
        >
          <Bone size={12} className="inline mr-0.5" />
          喂食 (10)
        </GlassButton>
        <GlassButton
          variant="ghost"
          onClick={petAction}
          disabled={pet.health <= 0}
          className="flex-1 text-xs py-1.5"
        >
          <Heart size={12} className="inline mr-0.5" />
          抚摸
        </GlassButton>
        <GlassButton
          variant="ghost"
          onClick={bathe}
          disabled={pet.coins < 20 || pet.health <= 0}
          className="flex-1 text-xs py-1.5"
        >
          <Droplets size={12} className="inline mr-0.5" />
          洗澡 (20)
        </GlassButton>
      </div>
    </GlassCard>
  );
}
