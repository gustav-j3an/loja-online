import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 text-center text-neutral-900">
      <Compass className="w-12 h-12 text-neutral-400 mb-6 stroke-1" />
      <span className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-400 mb-2">
        Erro 404
      </span>
      <h1 className="text-2xl sm:text-4xl font-light tracking-tight mb-4">
        Página não encontrada
      </h1>
      <p className="text-sm text-neutral-500 max-w-md mb-8 font-light">
        O endereço digitado não existe ou o conteúdo foi movido para outra seção do acervo.
      </p>
      <Link
        to="/"
        className="px-8 py-3 bg-neutral-900 text-white text-xs uppercase tracking-widest font-medium hover:bg-neutral-800 transition-colors"
      >
        Voltar à página inicial
      </Link>
    </div>
  );
};
