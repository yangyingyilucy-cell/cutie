import { useState, useRef, useEffect } from 'react';

export function ChatInput({
  value,
  onChange,
  onSend,
  onStop,
  isStreaming,
  disabled,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled: boolean;
  placeholder: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming) onSend();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border border-[var(--color-border-light)] dark:border-[var(--color-border-dark)] rounded-[16px] px-4 py-2.5 text-sm resize-none outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-40 max-h-[150px]"
      />
      {isStreaming ? (
        <button
          onClick={onStop}
          className="px-4 py-2.5 rounded-[12px] bg-red-400 text-white text-sm cursor-pointer hover:bg-red-500 transition-colors"
        >
          停止
        </button>
      ) : (
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="px-4 py-2.5 rounded-[12px] bg-[var(--color-accent)] text-white text-sm cursor-pointer disabled:opacity-40 hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          发送
        </button>
      )}
    </div>
  );
}
