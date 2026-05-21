import { useEffect, useRef, useState, useCallback } from 'react';
import { usePetStore } from '../../stores/petStore';
import { PetPanel } from './PetPanel';

function getInitialPosition() {
  return {
    x: window.innerWidth - 80,
    y: window.innerHeight - 80,
  };
}

export function PetFloating() {
  const { pet, panelOpen, setPanelOpen, tick, getPetStage } = usePetStore();
  const [position, setPosition] = useState(() => {
    const saved = sessionStorage.getItem('pet-position');
    return saved ? JSON.parse(saved) : getInitialPosition();
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    tick();
    const interval = setInterval(() => tick(), 30000);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    sessionStorage.setItem('pet-position', JSON.stringify(position));
  }, [position]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setHasMoved(false);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      if (Math.abs(newX - position.x) > 3 || Math.abs(newY - position.y) > 3) {
        setHasMoved(true);
      }
      setPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - 56)),
        y: Math.max(0, Math.min(newY, window.innerHeight - 56)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, position]);

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
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        className="fixed z-40 w-14 h-14 rounded-full pet-gradient text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200 cursor-grab active:cursor-grabbing select-none"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <span className="text-2xl pointer-events-none">{stageEmoji}</span>
        {needsAttention && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full flex items-center justify-center text-[10px] animate-pulse pointer-events-none">
            !
          </span>
        )}
      </button>
    </>
  );
}
