import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
import type { CustomerAddress, AddressFormData } from '../../types/address.types';
import { getAddresses, createAddress, updateAddress, deleteAddress } from '../../services/addressService';
import { AddressForm } from './AddressForm';
import { LoadingState } from '../common/LoadingState';

interface AddressListProps {
  userId: string;
}

export const AddressList: React.FC<AddressListProps> = ({ userId }) => {
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadAddresses = React.useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await getAddresses(userId);
      setAddresses(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Não foi possível carregar os endereços.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadAddresses();
    }
  }, [userId, loadAddresses]);

  const handleCreateOrUpdate = async (formData: AddressFormData) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, userId, formData);
        setSuccessMsg('Endereço atualizado com sucesso!');
      } else {
        await createAddress(userId, formData);
        setSuccessMsg('Novo endereço cadastrado com sucesso!');
      }
      setIsFormOpen(false);
      setEditingAddress(null);
      await loadAddresses();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao salvar o endereço no banco de dados.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await deleteAddress(id, userId);
      setSuccessMsg('Endereço excluído com sucesso.');
      setDeletingId(null);
      await loadAddresses();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao remover o endereço.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingState message="Carregando endereços..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            Meus Endereços DE Entrega
          </h2>
          <p className="text-neutral-400 text-xs mt-0.5">
            Cadastre seus locais de entrega para uso futuro
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={() => {
              setEditingAddress(null);
              setIsFormOpen(true);
              setSuccessMsg(null);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-sm rounded-lg transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Adicionar Endereço
          </button>
        )}
      </div>

      {/* Mensagens de Notificação */}
      {successMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-sm rounded-lg flex items-center justify-between">
          <span>{successMsg}</span>
          <button
            onClick={() => setSuccessMsg(null)}
            className="text-xs text-emerald-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-950/60 border border-red-800/80 text-red-200 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Formulário de Adição/Edição */}
      {isFormOpen && (
        <AddressForm
          initialData={
            editingAddress
              ? {
                  recipient_name: editingAddress.recipient_name,
                  postal_code: editingAddress.postal_code,
                  street: editingAddress.street,
                  number: editingAddress.number,
                  complement: editingAddress.complement || '',
                  neighborhood: editingAddress.neighborhood,
                  city: editingAddress.city,
                  state: editingAddress.state,
                }
              : undefined
          }
          onSubmit={handleCreateOrUpdate}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingAddress(null);
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Lista de Endereços */}
      {!isFormOpen && (
        <>
          {addresses.length === 0 ? (
            <div className="p-8 text-center bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
              <MapPin className="w-8 h-8 text-neutral-600 mx-auto" />
              <p className="text-neutral-300 font-medium">Nenhum endereço cadastrado</p>
              <p className="text-neutral-500 text-xs">
                Clique no botão acima para adicionar seu primeiro endereço de entrega.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-5 bg-neutral-950 border border-neutral-800 rounded-xl flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-white text-base">
                        {addr.recipient_name}
                      </span>
                      <span className="text-xs bg-neutral-800 text-neutral-300 font-mono px-2 py-0.5 rounded">
                        CEP {addr.postal_code}
                      </span>
                    </div>
                    <p className="text-neutral-300 text-sm">
                      {addr.street}, {addr.number}
                      {addr.complement ? ` — ${addr.complement}` : ''}
                    </p>
                    <p className="text-neutral-400 text-xs">
                      {addr.neighborhood} • {addr.city}/{addr.state}
                    </p>
                  </div>

                  {/* Confirmação de Exclusão ou Ações */}
                  {deletingId === addr.id ? (
                    <div className="pt-3 border-t border-neutral-800 bg-red-950/40 -mx-5 -mb-5 p-4 rounded-b-xl space-y-2">
                      <p className="text-xs font-semibold text-red-200">
                        Confirmar exclusão deste endereço?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteConfirm(addr.id)}
                          disabled={isSubmitting}
                          className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded transition-colors"
                        >
                          {isSubmitting ? 'Excluindo...' : 'Sim, excluir'}
                        </button>
                        <button
                          onClick={() => setDeletingId(null)}
                          disabled={isSubmitting}
                          className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2 pt-3 border-t border-neutral-900">
                      <button
                        onClick={() => {
                          setEditingAddress(addr);
                          setIsFormOpen(true);
                          setSuccessMsg(null);
                        }}
                        className="p-2 text-neutral-400 hover:text-amber-400 transition-colors rounded hover:bg-neutral-900"
                        title="Editar endereço"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(addr.id)}
                        className="p-2 text-neutral-400 hover:text-red-400 transition-colors rounded hover:bg-neutral-900"
                        title="Excluir endereço"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
