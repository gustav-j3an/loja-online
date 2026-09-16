-- Missão 5: Tabela de Endereços de Clientes e RLS

BEGIN;

-- 1. CRIAR TABELA DE ENDEREÇOS DOS CLIENTES
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_name VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(255),
    neighborhood VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ÍNDICE PARA CONSULTAS POR USUÁRIO
CREATE INDEX IF NOT EXISTS idx_customer_addresses_user_id ON public.customer_addresses(user_id);

-- 3. PERMISSÕES DE TABELA PARA ROLES DO SUPABASE
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_addresses TO authenticated;

-- 4. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICAS RLS ESTRITAS (APENAS O PRÓPRIO USUÁRIO)

-- Consulta: usuário autenticado só visualiza seus próprios endereços
DROP POLICY IF EXISTS "Usuário pode visualizar seus próprios endereços" ON public.customer_addresses;
CREATE POLICY "Usuário pode visualizar seus próprios endereços"
ON public.customer_addresses FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Inserção: usuário autenticado só insere endereço para si mesmo
DROP POLICY IF EXISTS "Usuário pode criar seus próprios endereços" ON public.customer_addresses;
CREATE POLICY "Usuário pode criar seus próprios endereços"
ON public.customer_addresses FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Atualização: usuário só altera seus endereços e não pode transferir para outro user_id
DROP POLICY IF EXISTS "Usuário pode atualizar seus próprios endereços" ON public.customer_addresses;
CREATE POLICY "Usuário pode atualizar seus próprios endereços"
ON public.customer_addresses FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Exclusão: usuário só exclui seus próprios endereços
DROP POLICY IF EXISTS "Usuário pode excluir seus próprios endereços" ON public.customer_addresses;
CREATE POLICY "Usuário pode excluir seus próprios endereços"
ON public.customer_addresses FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 6. TRIGGER PARA UPDATED_AT AUTOMÁTICO
DROP TRIGGER IF EXISTS set_customer_addresses_updated_at ON public.customer_addresses;
CREATE TRIGGER set_customer_addresses_updated_at
BEFORE UPDATE ON public.customer_addresses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;
