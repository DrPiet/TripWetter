export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-4',
  }[size];

  return (
    <div
      className={`${sizeClass} animate-spin rounded-full border-blue-500 border-t-transparent`}
      role="status"
      aria-label="Lädt..."
    />
  );
}
