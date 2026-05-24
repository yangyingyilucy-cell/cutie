import { useState } from 'react';
import type { ChatMessage } from '../../types';
import { X } from 'lucide-react';

function formatContent(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export function MessageList({
  messages,
  streamContent,
  isStreaming,
  onDeleteMessage,
}: {
  messages: ChatMessage[];
  streamContent: string;
  isStreaming: boolean;
  onDeleteMessage: (id: string) => void;
}) {
  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex items-center justify-center h-40 opacity-40 text-sm">
        开始你的第一条消息吧
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 md:gap-3">
      {messages
        .filter((m) => m.role !== 'system')
        .map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            onDelete={() => onDeleteMessage(msg.id)}
          />
        ))}
      {isStreaming && streamContent && (
        <div className="flex justify-start">
          <div className="max-w-[90%] md:max-w-[80%] px-3 md:px-4 py-2 md:py-2.5 text-sm leading-relaxed glass-card rounded-[16px_16px_16px_4px]">
            <span dangerouslySetInnerHTML={{ __html: formatContent(streamContent) }} />
            <span className="inline-block w-1.5 h-4 bg-[var(--color-accent)] ml-0.5 animate-pulse align-text-bottom rounded-sm" />
          </div>
        </div>
      )}
    </div>
  );
}

function MessageBubble({
  msg,
  onDelete,
}: {
  msg: ChatMessage;
  onDelete: () => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative">
        <div
          className={`px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm leading-relaxed ${
            msg.role === 'user'
              ? 'max-w-[90%] md:max-w-[22ch] break-all bg-[var(--color-accent)] text-white rounded-[16px_16px_4px_16px]'
              : 'max-w-[90%] md:max-w-[80%] glass-card rounded-[16px_16px_16px_4px]'
          }`}
          dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
        />
        {(showActions) && (
          <button
            onClick={onDelete}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-500"
          >
            <X size={10} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
