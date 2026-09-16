import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ocorreu um problema ao carregar as informações',
  message = 'Por favor, verifique sua conexão ou tente novamente em alguns instantes.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-16 px-6 text-center text-neutral-800">
      <AlertCircle className="w-10 h-10 text-neutral-400 mb-4 stroke-1" />
      <h3 className="text-base font-medium tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-md mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
};
