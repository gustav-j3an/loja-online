import { supabase, isSupabaseConfigured, isDemoMode } from './supabaseClient';
import type { CustomerAddress, AddressFormData } from '../types/address.types';

// Lista em memória exclusivamente para o modo demonstrativo explícito (VITE_DEMO_MODE=true)
let MOCK_DEMO_ADDRESSES: CustomerAddress[] = [
  {
    id: 'demo-addr-1',
    user_id: 'demo-user-id',
    recipient_name: 'Cliente Demonstração',
    postal_code: '01001-000',
    street: 'Praça da Sé',
    number: '100',
    complement: 'Apto 12',
    neighborhood: 'Sé',
    city: 'São Paulo',
    state: 'SP',
    created_at: new Date().toISOString(),
  },
];

export async function getAddresses(userId: string): Promise<CustomerAddress[]> {
  if (isDemoMode) {
    return MOCK_DEMO_ADDRESSES.filter((a) => a.user_id === userId || userId === 'demo-user-id');
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Configuração do Supabase ausente ou inválida.');
  }

  const { data, error } = await supabase
    .from('customer_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar endereços do usuário:', error.message);
    throw new Error(error.message);
  }

  return (data as CustomerAddress[]) || [];
}

export async function createAddress(
  userId: string,
  formData: AddressFormData
): Promise<CustomerAddress> {
  if (isDemoMode) {
    const newAddr: CustomerAddress = {
      id: `demo-addr-${Date.now()}`,
      user_id: userId,
      ...formData,
      created_at: new Date().toISOString(),
    };
    MOCK_DEMO_ADDRESSES.unshift(newAddr);
    return newAddr;
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Configuração do Supabase ausente ou inválida.');
  }

  const { data, error } = await supabase
    .from('customer_addresses')
    .insert([
      {
        user_id: userId,
        recipient_name: formData.recipient_name.trim(),
        postal_code: formData.postal_code.trim(),
        street: formData.street.trim(),
        number: formData.number.trim(),
        complement: formData.complement?.trim() || null,
        neighborhood: formData.neighborhood.trim(),
        city: formData.city.trim(),
        state: formData.state.trim().toUpperCase(),
      },
    ])
    .select('*')
    .single();

  if (error) {
    console.error('Erro ao criar endereço:', error.message);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('O banco de dados não retornou a confirmação do endereço cadastrado.');
  }

  return data as CustomerAddress;
}

export async function updateAddress(
  addressId: string,
  userId: string,
  formData: AddressFormData
): Promise<CustomerAddress> {
  if (isDemoMode) {
    const index = MOCK_DEMO_ADDRESSES.findIndex((a) => a.id === addressId);
    if (index !== -1) {
      MOCK_DEMO_ADDRESSES[index] = {
        ...MOCK_DEMO_ADDRESSES[index],
        ...formData,
        updated_at: new Date().toISOString(),
      };
      return MOCK_DEMO_ADDRESSES[index];
    }
    throw new Error('Endereço não encontrado');
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Configuração do Supabase ausente ou inválida.');
  }

  const { data, error } = await supabase
    .from('customer_addresses')
    .update({
      recipient_name: formData.recipient_name.trim(),
      postal_code: formData.postal_code.trim(),
      street: formData.street.trim(),
      number: formData.number.trim(),
      complement: formData.complement?.trim() || null,
      neighborhood: formData.neighborhood.trim(),
      city: formData.city.trim(),
      state: formData.state.trim().toUpperCase(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', addressId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) {
    console.error('Erro ao atualizar endereço:', error.message);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Nenhum registro foi alterado ou o endereço não pertence ao usuário.');
  }

  return data as CustomerAddress;
}

export async function deleteAddress(addressId: string, userId: string): Promise<boolean> {
  if (isDemoMode) {
    MOCK_DEMO_ADDRESSES = MOCK_DEMO_ADDRESSES.filter((a) => a.id !== addressId);
    return true;
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Configuração do Supabase ausente ou inválida.');
  }

  const { data, error } = await supabase
    .from('customer_addresses')
    .delete()
    .eq('id', addressId)
    .eq('user_id', userId)
    .select('id');

  if (error) {
    console.error('Erro ao remover endereço:', error.message);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    throw new Error('Nenhum registro foi removido ou você não possui permissão para excluir este endereço.');
  }

  return true;
}
