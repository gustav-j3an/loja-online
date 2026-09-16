import React, { useState } from 'react';
import type { FormEvent } from 'react';
import type { AddressFormData } from '../../types/address.types';
import { BRAZILIAN_STATES } from '../../types/address.types';

interface AddressFormProps {
  initialData?: AddressFormData;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<AddressFormData>({
    recipient_name: initialData?.recipient_name || '',
    postal_code: initialData?.postal_code || '',
    street: initialData?.street || '',
    number: initialData?.number || '',
    complement: initialData?.complement || '',
    neighborhood: initialData?.neighborhood || '',
    city: initialData?.city || '',
    state: initialData?.state || 'SP',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatPostalCode = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    if (digits.length > 5) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }
    return digits;
  };

  const handleChange = (field: keyof AddressFormData, value: string) => {
    if (field === 'postal_code') {
      setFormData((prev) => ({ ...prev, postal_code: formatPostalCode(value) }));
    } else if (field === 'state') {
      setFormData((prev) => ({ ...prev, state: value.toUpperCase() }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validações
    if (!formData.recipient_name.trim()) {
      setErrorMsg('O nome do destinatário é obrigatório.');
      return;
    }

    const cleanCep = formData.postal_code.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setErrorMsg('O CEP deve conter exatamente 8 dígitos numéricos.');
      return;
    }

    if (!formData.street.trim()) {
      setErrorMsg('O logradouro / rua é obrigatório.');
      return;
    }

    if (!formData.number.trim()) {
      setErrorMsg('O número é obrigatório (use "S/N" caso não possua).');
      return;
    }

    if (!formData.neighborhood.trim()) {
      setErrorMsg('O bairro é obrigatório.');
      return;
    }

    if (!formData.city.trim()) {
      setErrorMsg('A cidade é obrigatória.');
      return;
    }

    if (!BRAZILIAN_STATES.includes(formData.state as any)) {
      setErrorMsg('Selecione um estado (UF) válido.');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao salvar o endereço. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-950 p-6 rounded-xl border border-neutral-800 space-y-4">
      <h3 className="text-lg font-semibold text-white mb-2">
        {initialData ? 'Editar Endereço' : 'Novo Endereço de Entrega'}
      </h3>

      {errorMsg && (
        <div className="p-3 bg-red-950/60 border border-red-800/80 text-red-200 text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Destinatário */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            Nome do Destinatário *
          </label>
          <input
            type="text"
            value={formData.recipient_name}
            onChange={(e) => handleChange('recipient_name', e.target.value)}
            required
            placeholder="Ex: João da Silva"
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* CEP */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            CEP (8 dígitos) *
          </label>
          <input
            type="text"
            value={formData.postal_code}
            onChange={(e) => handleChange('postal_code', e.target.value)}
            required
            placeholder="00000-000"
            maxLength={9}
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors font-mono"
          />
        </div>

        {/* UF / Estado */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            Estado (UF) *
          </label>
          <select
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-500 transition-colors"
          >
            {BRAZILIAN_STATES.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </div>

        {/* Logradouro / Rua */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            Logradouro / Rua *
          </label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            required
            placeholder="Ex: Av. Paulista"
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Número */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            Número *
          </label>
          <input
            type="text"
            value={formData.number}
            onChange={(e) => handleChange('number', e.target.value)}
            required
            placeholder="Ex: 1000 ou S/N"
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Complemento */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            Complemento (Opcional)
          </label>
          <input
            type="text"
            value={formData.complement || ''}
            onChange={(e) => handleChange('complement', e.target.value)}
            placeholder="Ex: Apto 42, Bloco B"
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Bairro */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            Bairro *
          </label>
          <input
            type="text"
            value={formData.neighborhood}
            onChange={(e) => handleChange('neighborhood', e.target.value)}
            required
            placeholder="Ex: Bela Vista"
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Cidade */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
            Cidade *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
            placeholder="Ex: São Paulo"
            className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-lg transition-colors"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Endereço'}
        </button>
      </div>
    </form>
  );
};
