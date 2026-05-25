import { MessagesSquare, BookOpen, Cloud, Settings } from 'lucide-react';
import { PetFloating } from '../pet/PetFloating';
import type { PanelView } from './Sidebar';

export function HomePage({ onEnter }: { onEnter: (module: PanelView) => void }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 md:gap-8 relative px-4">
      <div className="text-center">
        <h1 className="text-xl md:text-2xl font-semibold opacity-80">Cutie</h1>
        <p className="text-xs md:text-sm opacity-40 mt-1">AI Story & Pet Companion</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        <button
          onClick={() => onEnter('chat')}
          className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-[16px] md:rounded-[20px] glass-card flex flex-col items-center justify-center gap-2 md:gap-3 hover:scale-105 transition-all duration-200 cursor-pointer group"
        >
          <MessagesSquare size={32} className="md:size-10 opacity-60 group-hover:opacity-100 transition-opacity" />
          <span className="text-xs md:text-sm font-medium opacity-70 group-hover:opacity-100">聊天</span>
        </button>
        <button
          onClick={() => onEnter('story')}
          className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-[16px] md:rounded-[20px] glass-card flex flex-col items-center justify-center gap-2 md:gap-3 hover:scale-105 transition-all duration-200 cursor-pointer group"
        >
          <BookOpen size={32} className="md:size-10 opacity-60 group-hover:opacity-100 transition-opacity" />
          <span className="text-xs md:text-sm font-medium opacity-70 group-hover:opacity-100">故事</span>
        </button>
        <button
          onClick={() => onEnter('diary')}
          className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-[16px] md:rounded-[20px] glass-card flex flex-col items-center justify-center gap-2 md:gap-3 hover:scale-105 transition-all duration-200 cursor-pointer group"
        >
          <Cloud size={32} className="md:size-10 opacity-60 group-hover:opacity-100 transition-opacity" />
          <span className="text-xs md:text-sm font-medium opacity-70 group-hover:opacity-100">记忆</span>
        </button>
        <button
          onClick={() => onEnter('settings')}
          className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-[16px] md:rounded-[20px] glass-card flex flex-col items-center justify-center gap-2 md:gap-3 hover:scale-105 transition-all duration-200 cursor-pointer group"
        >
          <Settings size={32} className="md:size-10 opacity-60 group-hover:opacity-100 transition-opacity" />
          <span className="text-xs md:text-sm font-medium opacity-70 group-hover:opacity-100">设置</span>
        </button>
      </div>

      <PetFloating />
    </div>
  );
}
