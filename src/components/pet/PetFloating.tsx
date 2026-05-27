import { useEffect, useState, useCallback, useRef } from 'react';
import { usePetStore } from '../../stores/petStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { PetPanel } from './PetPanel';

function getInitialPosition() {
  return {
    x: window.innerWidth - 80,
    y: window.innerHeight - 80,
  };
}

export function PetFloating() {
  const { pet, panelOpen, setPanelOpen, tick, getPetStage } = usePetStore();
  const theme = useSettingsStore((s) => s.theme);
  const isAcnh = theme === 'acnh';
  const [position, setPosition] = useState(() => {
    const saved = sessionStorage.getItem('pet-position');
    return saved ? JSON.parse(saved) : getInitialPosition();
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const dragRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    tick();
    const interval = setInterval(() => tick(), 30000);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    sessionStorage.setItem('pet-position', JSON.stringify(position));
  }, [position]);

  const clampPosition = useCallback(
    (x: number, y: number) => ({
      x: Math.max(0, Math.min(x, window.innerWidth - 56)),
      y: Math.max(0, Math.min(y, window.innerHeight - 56)),
    }),
    [],
  );

  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      setIsDragging(true);
      setHasMoved(false);
      setDragStart({ x: clientX - position.x, y: clientY - position.y });
    },
    [position],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    },
    [startDrag],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    },
    [startDrag],
  );

  useEffect(() => {
    if (!isDragging) return;

    const move = (clientX: number, clientY: number) => {
      const newX = clientX - dragStart.x;
      const newY = clientY - dragStart.y;
      if (Math.abs(newX - position.x) > 3 || Math.abs(newY - position.y) > 3) {
        setHasMoved(true);
      }
      setPosition(clampPosition(newX, newY));
    };

    const handleMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      move(e.touches[0].clientX, e.touches[0].clientY);
    };
    const end = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', end);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', end);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', end);
    };
  }, [isDragging, dragStart, position, clampPosition]);

  const handleClick = () => {
    if (hasMoved) return;
    setPanelOpen(!panelOpen);
  };

  const stage = getPetStage();
  const stageEmoji = stage === 'puppy' ? '🐶' : stage === 'adult' ? '🐕' : '🦮';
  const needsAttention = pet.hunger < 20 || pet.cleanliness < 20 || pet.health < 30;

  return (
    <>
      {panelOpen && (
        <div
          className="fixed z-50"
          style={{
            left: `${position.x}px`,
            bottom: `${window.innerHeight - position.y}px`,
          }}
        >
          <PetPanel />
        </div>
      )}
      <button
        ref={dragRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        className={`fixed z-40 w-12 h-12 md:w-14 md:h-14 rounded-full text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 cursor-grab active:cursor-grabbing select-none ${
          isAcnh ? '' : 'pet-gradient'
        }`}
        style={{
          ...(isAcnh ? { background: '#19c8b9' } : {}),
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <span className="text-2xl md:text-2xl text-xl pointer-events-none">{stageEmoji}</span>
        {needsAttention && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center text-[10px] animate-pulse pointer-events-none">
            !
          </span>
        )}
      </button>
    </>
  );
}
