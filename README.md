# E-Commerce SUA MARCA — Camisetas Autorais

Aplicação e-commerce autoral de camisetas construída com React 19, TypeScript, Vite, React Router, Tailwind CSS e Supabase (PostgreSQL + RLS).

---

## ⚙️ Modos de Operação

O projeto suporta dois modos de operação distintos:

### 1. Modo Supabase Real (Produção / Staging)
- Ativado quando o arquivo `.env` possui credenciais válidas do Supabase (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`).
- Realiza consultas reais no banco de dados PostgreSQL via SDK oficial do Supabase.
- **Segurança**: Se houver falha de rede ou configuração ausente, a aplicação **não** exibe dados fictícios. Em vez disso, apresenta o estado de erro (`ErrorState`).
- Em produção (`import.meta.env.PROD`), este é o **único modo permitido**.

### 2. Modo Demonstrativo (Desenvolvimento Local Apenas)
- Ativado **exclusivamente em ambiente de desenvolvimento (`DEV`)** e mediante declaração explícita no arquivo `.env`:
  ```env
  VITE_DEMO_MODE=true
  ```
- Exibe o dataset demonstrativo do seed localmente e sinaliza a interface com um banner de alerta proeminente no cabeçalho.

---

## 🛠️ Passo a Passo Concreto para Conectar ao Supabase

### Etapa 1: Criar o Arquivo `.env` (Configuração da Conexão)
Na raiz do projeto (`c:\Users\Gustavo MK9\Desktop\PROJETOS\loja-online`), crie o arquivo `.env` preenchendo as seguintes variáveis obtidas no seu painel em [supabase.com](https://supabase.com) (Settings > API):

```env
VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co
VITE_SUPABASE_ANON_KEY=<sua-chave-anonima-publica>
```
*Aviso de Segurança: NUNCA utilize ou insira a chave `service_role` no frontend.*

### Etapa 2: Aplicar as Migrações SQL (Criação de Tabelas e RLS)
*Preencher o arquivo `.env` configura o cliente SDK no navegador, porém **não cria as tabelas no banco de dados**.*

Para criar o esquema de tabelas e as políticas de segurança RLS:
1. Abra o painel do seu projeto no **Supabase Dashboard**.
2. Vá até a seção **SQL Editor**.
3. Copie o conteúdo do arquivo [`supabase/migrations/20260915_mission1_schema.sql`](file:///c:/Users/Gustavo%20MK9/Desktop/PROJETOS/loja-online/supabase/migrations/20260915_mission1_schema.sql) e clique em **Run**.

### Etapa 3: Popular o Banco de Desenvolvimento (Seed)
Para inserir as camisetas e variantes demonstrativas de teste no ambiente de desenvolvimento:
1. No **SQL Editor** do Supabase Dashboard, abra uma nova consulta.
2. Copie o conteúdo do arquivo [`supabase/seed.sql`](file:///c:/Users/Gustavo%20MK9/Desktop/PROJETOS/loja-online/supabase/seed.sql) e clique em **Run**.

---

## 🧪 Comandos de Validação de Código

- **Build de Produção**: `npm run build`
- **Linter de Código**: `npm run lint`
