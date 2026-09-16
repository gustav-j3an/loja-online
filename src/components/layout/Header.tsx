import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingBag, Database } from 'lucide-react';
import { STORE_CONFIG } from '../../config/store.config';
import { useCart } from '../../context/useCart';
import { isDemoMode } from '../../services/supabaseClient';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalUnits } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100">
      {/* Banner de Identificação de Modo */}
      {isDemoMode ? (
        <div className="bg-amber-600 text-white text-[11px] uppercase tracking-widest text-center py-1.5 px-4 font-semibold flex items-center justify-center gap-2">
          <Database className="w-3.5 h-3.5" />
          <span>Modo Demonstrativo — Exibindo dados locais do seed (Supabase não conectado)</span>
        </div>
      ) : (
        <div className="bg-neutral-900 text-white text-[11px] uppercase tracking-widest text-center py-2 px-4 font-light">
          {STORE_CONFIG.tagline}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-neutral-700 hover:text-neutral-900 focus:outline-none"
            aria-label="Abrir menu de navegação"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 stroke-1" /> : <Menu className="w-5 h-5 stroke-1" />}
          </button>

          {/* Logo Centralizada / Alinhada */}
          <Link to="/" className="flex flex-col items-center md:items-start group">
            <span className="text-lg font-bold tracking-widest uppercase text-neutral-900">
              {STORE_CONFIG.logo.text}
            </span>
            {STORE_CONFIG.logo.subtext && (
              <span className="text-[9px] tracking-widest text-neutral-400 font-light -mt-1">
                {STORE_CONFIG.logo.subtext}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-xs uppercase tracking-widest transition-colors ${
                  isActive ? 'text-neutral-900 font-semibold border-b border-neutral-900 py-1' : 'text-neutral-500 hover:text-neutral-900 py-1'
                }`
              }
            >
              Início
            </NavLink>
            <NavLink
              to="/loja"
              className={({ isActive }) =>
                `text-xs uppercase tracking-widest transition-colors ${
                  isActive ? 'text-neutral-900 font-semibold border-b border-neutral-900 py-1' : 'text-neutral-500 hover:text-neutral-900 py-1'
                }`
              }
            >
              Loja / Catálogo
            </NavLink>
          </nav>

          {/* Sacola de compras com indicador de contagem */}
          <div className="flex items-center space-x-4">
            <Link
              to="/carrinho"
              className="p-2 text-neutral-700 hover:text-neutral-900 transition-colors flex items-center gap-2 relative"
              title="Sacola de Compras"
              aria-label={`Sacola de compras com ${totalUnits} itens`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-1" />
                {totalUnits > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-neutral-900 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalUnits > 99 ? '99+' : totalUnits}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-medium text-neutral-700">Sacola</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-100 bg-white px-4 pt-2 pb-6 space-y-3">
          <NavLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block py-2 text-sm uppercase tracking-wider ${
                isActive ? 'text-neutral-900 font-semibold' : 'text-neutral-600'
              }`
            }
          >
            Início
          </NavLink>
          <NavLink
            to="/loja"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block py-2 text-sm uppercase tracking-wider ${
                isActive ? 'text-neutral-900 font-semibold' : 'text-neutral-600'
              }`
            }
          >
            Loja / Catálogo
          </NavLink>
          <NavLink
            to="/carrinho"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block py-2 text-sm uppercase tracking-wider ${
                isActive ? 'text-neutral-900 font-semibold' : 'text-neutral-600'
              }`
            }
          >
            Sacola ({totalUnits})
          </NavLink>
        </div>
      )}
    </header>
  );
};
