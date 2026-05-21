import { MessagesSquare, BookOpen } from 'lucide-react';
import { PetFloating } from '../pet/PetFloating';

export function HomePage({ onEnter }: { onEnter: (module: 'chat' | 'story') => void }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 relative">
      <div className="text-center">
        <h1 className="text-2xl font-semibold opacity-80">Cutie</h1>
        <p className="text-sm opacity-40 mt-1">AI Story & Pet Companion</p>
      </div>

      <div className="flex gap-6">
        <button
          onClick={() => onEnter('chat')}
          className="w-[140px] h-[140px] rounded-[20px] glass-card flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-200 cursor-pointer group"
        >
          <MessagesSquare size={40} className="opacity-60 group-hover:opacity-100 transition-opacity" />
          <span className="text-sm font-medium opacity-70 group-hover:opacity-100">聊天</span>
        </button>
        <button
          onClick={() => onEnter('story')}
          className="w-[140px] h-[140px] rounded-[20px] glass-card flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all duration-200 cursor-pointer group"
        >
          <BookOpen size={40} className="opacity-60 group-hover:opacity-100 transition-opacity" />
          <span className="text-sm font-medium opacity-70 group-hover:opacity-100">故事</span>
        </button>
      </div>

      <PetFloating />
    </div>
  );
}
