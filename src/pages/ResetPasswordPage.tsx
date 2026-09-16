import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!newPassword || !confirmPassword) {
      setErrorMsg('Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updatePassword(newPassword);
      if (!res.success) {
        setErrorMsg(res.error || 'Falha ao redefinir a senha.');
      } else {
        setSuccessMsg('Sua senha foi redefinida com sucesso!');
        setTimeout(() => {
          navigate('/minha-conta', { replace: true });
        }, 2000);
      }
    } catch {
      setErrorMsg('Ocorreu um erro inesperado ao atualizar a senha.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl">
      <h1 className="text-2xl font-bold text-white mb-2 text-center">Nova Senha</h1>
      <p className="text-neutral-400 text-sm text-center mb-6">
        Crie uma nova senha segura para sua conta
      </p>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-950/60 border border-red-800/80 text-red-200 text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-sm rounded-lg">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            Nova Senha
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="No mínimo 6 caracteres"
            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            Confirmar Nova Senha
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repita a nova senha"
            className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-lg transition-colors duration-200"
        >
          {isSubmitting ? 'Atualizando...' : 'Redefinir Senha'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
