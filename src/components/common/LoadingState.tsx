import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Carregando acervo...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-16 px-4 text-neutral-600">
      <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mb-4" />
      <p className="text-xs uppercase tracking-widest font-medium text-neutral-500">{message}</p>
    </div>
  );
};
