import type { ChatMessage } from '../../types';

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
}: {
  messages: ChatMessage[];
  streamContent: string;
  isStreaming: boolean;
}) {
  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex items-center justify-center h-40 opacity-40 text-sm">
        开始你的第一条消息吧
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages
        .filter((m) => m.role !== 'system')
        .map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[var(--color-accent)] text-white rounded-[16px_16px_4px_16px]'
                  : 'glass-card rounded-[16px_16px_16px_4px]'
              }`}
              dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
            />
          </div>
        ))}
      {isStreaming && streamContent && (
        <div className="flex justify-start">
          <div className="max-w-[80%] px-4 py-2.5 text-sm leading-relaxed glass-card rounded-[16px_16px_16px_4px]">
            <span dangerouslySetInnerHTML={{ __html: formatContent(streamContent) }} />
            <span className="inline-block w-1.5 h-4 bg-[var(--color-accent)] ml-0.5 animate-pulse align-text-bottom rounded-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
