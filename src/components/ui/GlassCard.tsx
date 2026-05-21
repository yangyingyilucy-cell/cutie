import type { ReactNode } from 'react';

export function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`glass-card p-4 ${className}`}>{children}</div>;
}

export function GlassButton({
  children,
  onClick,
  disabled = false,
  variant = 'accent',
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'accent' | 'ghost' | 'danger';
  className?: string;
}) {
  const base =
    'px-4 py-2 rounded-[12px] font-medium transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    accent:
      'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] dark:bg-[var(--color-accent-dark)]',
    ghost:
      'glass-card hover:bg-[var(--color-border-light)] dark:hover:bg-[var(--color-border-dark)]',
    danger: 'bg-red-400 text-white hover:bg-red-500',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
