import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { STORE_CONFIG } from '../../config/store.config';

export const Footer: React.FC = () => {
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  const handlePolicyClick = (policyName: string) => {
    setActiveNotice(`A página de ${policyName} será estruturada nas próximas etapas do projeto.`);
    setTimeout(() => setActiveNotice(null), 4000);
  };

  return (
    <footer className="bg-neutral-900 text-neutral-300 pt-16 pb-12 border-t border-neutral-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {activeNotice && (
          <div className="mb-6 p-3 bg-neutral-800 border border-neutral-700 text-white text-xs text-center transition-all">
            {activeNotice}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          {/* Marca & Filosofia */}
          <div className="md:col-span-1">
            <span className="text-base font-bold tracking-widest uppercase text-white block mb-3">
              {STORE_CONFIG.name}
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {STORE_CONFIG.description}
            </p>
          </div>

          {/* Navegação Rápida */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-medium mb-4">Navegação</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-white transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/loja" className="text-neutral-400 hover:text-white transition-colors">Ver Camisetas / Catálogo</Link>
              </li>
            </ul>
          </div>

          {/* Políticas e Institucional (Com aviso de pendência) */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-medium mb-4">Políticas Institucionais</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  type="button"
                  onClick={() => handlePolicyClick('Trocas e Devoluções')}
                  className="text-neutral-400 hover:text-white transition-colors text-left font-normal"
                >
                  Trocas e Devoluções (Em breve)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handlePolicyClick('Política de Privacidade')}
                  className="text-neutral-400 hover:text-white transition-colors text-left font-normal"
                >
                  Política de Privacidade (Em breve)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handlePolicyClick('Termos de Uso')}
                  className="text-neutral-400 hover:text-white transition-colors text-left font-normal"
                >
                  Termos de Uso (Em breve)
                </button>
              </li>
            </ul>
          </div>

          {/* Atendimento & Contato Centralizado */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white font-medium mb-4">Atendimento ao Cliente</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>E-mail: <span className="text-neutral-200">{STORE_CONFIG.contact.email}</span></li>
              <li>WhatsApp: <span className="text-neutral-200">{STORE_CONFIG.contact.whatsapp}</span></li>
              <li>Localização: <span className="text-neutral-200">{STORE_CONFIG.contact.address}</span></li>
              {STORE_CONFIG.contact.social.instagram && (
                <li className="pt-2">
                  <a
                    href={STORE_CONFIG.contact.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-white transition-colors underline"
                  >
                    Instagram Oficial
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Direitos Reservados */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} {STORE_CONFIG.name}. Todos os direitos reservados.</p>
          <p className="mt-2 sm:mt-0 font-light">E-commerce autoral de camisetas com estética contemporânea.</p>
        </div>
      </div>
    </footer>
  );
};
