import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionHref?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nenhum produto encontrado',
  message = 'Não encontramos itens correspondentes ao filtro ou busca selecionada no momento.',
  actionText = 'Ver toda a coleção',
  actionHref = '/loja',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-16 px-6 text-center text-neutral-800">
      <PackageOpen className="w-10 h-10 text-neutral-300 mb-4 stroke-1" />
      <h3 className="text-base font-medium tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-md mb-6">{message}</p>
      {actionHref && (
        <Link
          to={actionHref}
          className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase tracking-wider font-medium hover:bg-neutral-800 transition-colors"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};
