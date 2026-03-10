import { AlertCircle } from 'lucide-react';

interface Props {
  message: string;
  compact?: boolean;
}

export function ErrorMessage({ message, compact = false }: Props) {
  if (compact) {
    return (
      <span className="flex items-center gap-1 text-xs text-red-500">
        <AlertCircle className="h-3 w-3 flex-shrink-0" />
        {message}
      </span>
    );
  }

  return (
    <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
