import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const getSafeRedirectUrl = (rawRedirect: string | null): string => {
    if (!rawRedirect) return '/minha-conta';
    if (rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')) {
      return rawRedirect;
    }
    return '/minha-conta';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signIn(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Falha ao realizar login. Verifique suas credenciais.');
      } else {
        const redirectPath = getSafeRedirectUrl(searchParams.get('redirect'));
        navigate(redirectPath, { replace: true });
      }
    } catch {
      setErrorMsg('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl">
      <h1 className="text-2xl font-bold text-white mb-2 text-center">Acessar Conta</h1>
      <p className="text-neutral-400 text-sm text-center mb-6">
        Entre com suas credenciais para visualizar sua conta
      </p>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 text-red-200 text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            E-mail
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

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Senha
            </label>
            <Link
              to="/recuperar-senha"
              className="text-xs text-amber-500 hover:text-amber-400 transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-lg transition-colors duration-200"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-neutral-800 text-center text-sm text-neutral-400">
        Ainda não possui uma conta?{' '}
        <Link to="/cadastro" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
          Cadastre-se
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
