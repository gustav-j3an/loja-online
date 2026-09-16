import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signUp(email, password, fullName);
      if (!res.success) {
        setErrorMsg(res.error || 'Falha ao criar conta.');
      } else if (res.requiresEmailConfirmation) {
        setInfoMsg(
          'Conta criada com sucesso! Por favor, verifique a caixa de entrada do seu e-mail para confirmar a conta antes de entrar.'
        );
      } else {
        navigate('/minha-conta', { replace: true });
      }
    } catch {
      setErrorMsg('Ocorreu um erro inesperado ao criar a conta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl">
      <h1 className="text-2xl font-bold text-white mb-2 text-center">Criar Nova Conta</h1>
      <p className="text-neutral-400 text-sm text-center mb-6">
        Cadastre-se para acompanhar sua conta na loja
      </p>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 text-red-200 text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      {infoMsg && (
        <div className="mb-4 p-4 bg-amber-950/60 border border-amber-800/80 text-amber-200 text-sm rounded-lg space-y-2">
          <p className="font-semibold">{infoMsg}</p>
          <div className="pt-2 text-xs text-amber-300 border-t border-amber-800/50">
            Link para login:{' '}
            <Link to="/entrar" className="underline hover:text-white">
              Ir para tela de login
            </Link>
          </div>
        </div>
      )}

      {!infoMsg && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Seu Nome Completo"
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

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
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="No mínimo 6 caracteres"
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repita sua senha"
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-lg transition-colors duration-200"
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      )}

      <div className="mt-6 pt-6 border-t border-neutral-800 text-center text-sm text-neutral-400">
        Já tem uma conta?{' '}
        <Link to="/entrar" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
          Faça login
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
