import React from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { AddressList } from '../components/address/AddressList';

export const AccountPage: React.FC = () => {
  const { user, profile, signOut, updateProfileName } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = React.useState(profile?.full_name || '');
  const [isEditing, setIsEditing] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('O nome não pode ficar em branco.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateProfileName(fullName.trim());
      if (!res.success) {
        setErrorMsg(res.error || 'Erro ao atualizar perfil.');
      } else {
        setSuccessMsg('Nome atualizado com sucesso!');
        setIsEditing(false);
      }
    } catch {
      setErrorMsg('Erro inesperado ao salvar perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <div className="max-w-3xl mx-auto my-12 p-6 md:p-8 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Minha Conta</h1>
          <p className="text-neutral-400 text-sm">
            Gerencie seus dados pessoais, acesso e endereços de entrega
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-200 text-sm font-semibold rounded-lg transition-colors duration-200 self-start md:self-auto"
        >
          Sair da Conta
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-950/60 border border-red-800/80 text-red-200 text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-sm rounded-lg">
          {successMsg}
        </div>
      )}

      {/* Dados do Perfil */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-white">Dados de Identificação</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              E-mail (Leitura)
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-400 cursor-not-allowed select-none"
            />
            <p className="text-xs text-neutral-500 mt-1">
              O e-mail cadastrado na autenticação não pode ser alterado por aqui.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Nome Completo
            </label>
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="flex gap-3">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-lg transition-colors"
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFullName(profile?.full_name || '');
                  }}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg">
                <span className="text-white font-medium">
                  {profile?.full_name || 'Não informado'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFullName(profile?.full_name || '');
                    setIsEditing(true);
                  }}
                  className="text-xs text-amber-500 hover:text-amber-400 font-semibold transition-colors"
                >
                  Editar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-neutral-800">
        {user && <AddressList userId={user.id} />}
      </div>
    </div>
  );
};

export default AccountPage;
