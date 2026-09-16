# E-Commerce SUA MARCA — Camisetas Autorais

Aplicação e-commerce autoral de camisetas construída com React 19, TypeScript, Vite, React Router, Tailwind CSS e Supabase (PostgreSQL + RLS).

---

## ⚙️ Modos de Operação

### 1. Modo Supabase Real (Produção / Staging / Dev Real)
- Ativado quando o arquivo `.env` possui a URL e a chave pública do Supabase (`VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` ou `VITE_SUPABASE_ANON_KEY`).
- Realiza consultas públicas reais no banco de dados PostgreSQL via SDK oficial do Supabase.
- **Segurança**: Trava automática impede o uso de chaves `service_role` no frontend. Se houver falha de rede ou configuração ausente, a aplicação apresenta o estado de erro (`ErrorState`).

### 2. Modo Demonstrativo (Desenvolvimento Local Apenas)
- Ativado **exclusivamente em ambiente de desenvolvimento (`DEV`)** mediante declaração no arquivo `.env`:
  ```env
  VITE_DEMO_MODE=true
  ```

---

## 🛠️ Configuração da Conexão com o Supabase

Na raiz do projeto, crie/edite o arquivo `.env` com as chaves públicas:

```env
VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<sua-chave-publica-aqui>
VITE_DEMO_MODE=false
```
*Aviso de Segurança: NUNCA utilize ou insira a chave `service_role` no frontend.*

---

## 🧪 Comandos de Validação

- **Build de Produção**: `npm run build`
- **Linter de Código**: `npm run lint`
