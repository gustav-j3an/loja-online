-- Missão 4: Tabela de Perfis e Segurança RLS vinculada a auth.users

BEGIN;

-- 1. GARANTIR A FUNÇÃO DE ATUALIZAÇÃO AUTOMÁTICA DE UPDATED_AT
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. TABELA DE PERFIS DE USUÁRIO
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE RLS PARA PROFILES (RESTRITAS A USUÁRIOS AUTENTICADOS)

-- Leitura: Cada usuário lê estritamente seu próprio perfil
DROP POLICY IF EXISTS "Usuário pode visualizar próprio perfil" ON public.profiles;
CREATE POLICY "Usuário pode visualizar próprio perfil"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Inserção: Cada usuário insere apenas seu próprio perfil
DROP POLICY IF EXISTS "Usuário pode criar próprio perfil" ON public.profiles;
CREATE POLICY "Usuário pode criar próprio perfil"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Atualização: Cada usuário altera apenas seu próprio perfil
DROP POLICY IF EXISTS "Usuário pode atualizar próprio perfil" ON public.profiles;
CREATE POLICY "Usuário pode atualizar próprio perfil"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5. TRIGGER PARA ATUALIZAR UPDATED_AT EM PROFILES
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 6. FUNCTION E TRIGGER AUTOMÁTICO AO CRIAR USUÁRIO EM AUTH.USERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger disparado após cadastro em auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMIT;
