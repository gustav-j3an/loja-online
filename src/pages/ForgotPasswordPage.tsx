import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl">
      <h1 className="text-2xl font-bold text-white mb-2 text-center">Recuperar Senha</h1>
      <p className="text-neutral-400 text-sm text-center mb-6">
        Informe seu e-mail para receber as instruções de redefinição
      </p>

      {submitted ? (
        <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-sm rounded-lg space-y-3">
          <p className="font-semibold">
            Se este e-mail estiver cadastrado em nosso sistema, enviamos um link para redefinição de senha.
          </p>
          <p className="text-xs text-emerald-300">
            Verifique sua caixa de entrada e a pasta de spam.
          </p>
          <div className="pt-2 text-center">
            <Link to="/entrar" className="text-amber-500 hover:text-amber-400 text-xs font-semibold">
              Voltar para o Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              E-mail cadastrado
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-lg transition-colors duration-200"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Instruções'}
          </button>
        </form>
      )}

      <div className="mt-6 pt-6 border-t border-neutral-800 text-center text-sm text-neutral-400">
        Lembrou da senha?{' '}
        <Link to="/entrar" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
          Faça login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
