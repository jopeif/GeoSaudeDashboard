# CONTEXT.md — Contexto Geral do Repositório GeoSaúde

> **Objetivo deste documento:** Servir como base de conhecimento, contexto e instruções arquiteturais para desenvolvedores e modelos de IA que forem atuar no repositório **GeoSaúde Dashboard**.

---

## 1. Visão Geral e Propósito do Projeto

O **GeoSaúde** é uma plataforma voltada para a saúde pública e vigilância epidemiológica, projetada para auxiliar secretarias de saúde e equipes de campo no monitoramento, prevenção e combate a endemias transmitidas por vetores (especialmente Dengue, Zika e Chikungunya).

O ecossistema no repositório compreende duas frentes principais:
1. **GeoSaúde Dashboard (`main`)**: Aplicação SPA (Single Page Application) completa para supervisores e administradores epidemiológicos. Inclui gestão de rotas de agentes de saúde, mapa de calor de focos endêmicos, dashboards de indicadores (KPIs), emissão de relatórios e telemetria de erros de dispositivos móveis.
2. **GeoSaúde Landing Page (`landing-page`)**: Página institucional de apresentação da plataforma GeoSaúde, destacando funcionalidades, arquitetura do sistema e direcionando para a versão de produção.

### Informações de Ambiente e Deploy

- **Ambiente de Produção (Dashboard):** [https://geo-saude-dashboard.vercel.app](https://geo-saude-dashboard.vercel.app)
- **API Backend (Produção):** `https://geosaudeapi.onrender.com`
- **API Backend (Local/Dev):** `http://localhost:3000` (chaveável em `src/api/client.ts`)
- **Hospedagem / Deploy:** Vercel (configurado via `vercel.json` na raiz da branch `main`)
- **Porta Local Padrão:** `http://localhost:5173` (`npm run dev`)

---

## 2. Estrutura de Branches do Repositório

O repositório opera com duas branches principais com escopos distintos:

| Branch | Escopo | Descrição |
|---|---|---|
| **`main`** | **Dashboard SPA Completo** | Aplicação de supervisão e administração com rotas, autenticação JWT, Leaflet, Recharts, layouts e integração completa com a API. |
| **`landing-page`** | **Página Institucional** | Landing page de apresentação estática/interativa com tema dark/light e apresentação do projeto. |

> 💡 **Nota para Prompts:** Ao trabalhar em tarefas relacionadas a autenticação, gráficos, mapas, tabelas ou chamadas de API, certifique-se de estar contextualmente referenciando a base de código da branch **`main`**.

---

## 3. Stack Tecnológica e Dependências

### Core e Ferramental

| Ferramenta | Versão | Função |
|---|---|---|
| **React** | 19.x | Biblioteca de interface e componentes |
| **TypeScript** | ~6.0 | Tipagem estática rigorosa (`tsconfig.app.json` com `target: es2023`) |
| **Vite** | 8.x | Build tool e servidor de desenvolvimento ultra-rápido com HMR |
| **ESLint** | 10.x | Linter com suporte a regras de React Hooks e TypeScript |

### Bibliotecas de Produção (Branch `main`)

| Biblioteca | Versão | Utilização |
|---|---|---|
| **react-router-dom** | 7.x | Gerenciamento de rotas e navegação client-side SPA |
| **axios** | 1.x | Cliente HTTP com suporte a interceptors de requisição e renovação de token |
| **recharts** | 3.x | Gráficos interativos (visitas por período, tipos de foco, evolução, regiões) |
| **leaflet** + **react-leaflet** | 1.9 / 5.x | Renderização de mapas interativos e rotas de agentes de campo |
| **leaflet.heat** | 0.2.x | Plugin para renderização de mapas de calor epidemiológicos (densidade de focos) |
| **lucide-react** | 1.x | Biblioteca de ícones SVG consistentes |
| **react-hook-form** | 7.x | Gerenciamento e validação de formulários (ex: cadastro de nova visita) |

### ⚠️ Regra Crítica sobre Estilização

- **Vanilla CSS Puro com CSS Custom Properties:** Todo o estilo visual da aplicação é construído em CSS puro modularizado por componente e variáveis globais em `src/index.css`.
- **NÃO UTILIZAR Tailwind CSS no JSX:** Embora bibliotecas auxiliares de Tailwind possam figurar no histórico do `package.json`, o framework **não** está configurado para uso em produção. É proibido injetar classes utilitárias Tailwind (`p-4`, `flex-col`, `bg-blue-500`, etc.) nos componentes.

---

## 4. Arquitetura da Aplicação (GeoSaúde Dashboard)

### 4.1. Fluxo de Autenticação e Sessão

A autenticação é baseada em JSON Web Tokens (JWT) com Access Token e Refresh Token:

1. **Tokens e Sessão:**
   - Armazenados no `localStorage` sob prefixo `@App:`:
     - `@App:token`: JWT Access Token de curta duração.
     - `@App:refreshToken`: JWT Refresh Token para renovação.
     - `@App:userId`: ID do usuário logado.
     - `@App:role`: Nível de permissão (`SUPERVISOR`, `ADMIN`/`ADM`, `SUPERADMIN`).
     - `@App:userName`: Nome do usuário para exibição.
     - `@App:selectedPanel`: Estado de seleção de painel (para administradores).
     - `@App:theme`: Tema ativo (`light` ou `dark`).

2. **Mecanismo de Refresh Lock (`src/api/client.ts`):**
   - Interceptor de resposta Axios monitora retornos `401` ou `403`.
   - Implementa uma trava (`isRefreshing` e `refreshPromise`) para evitar condições de corrida (múltiplas requisições simultâneas tentando dar refresh ao mesmo tempo).
   - Ao obter um novo par de tokens, salva no `localStorage`, reexecuta a requisição falha e emite o Custom Event `auth:update` na janela (`window`).
   - O `AuthContext` escuta o evento `auth:update` e atualiza o estado interno da sessão de forma transparente, sem necessidade de recarregar a página.

### 4.2. Papéis de Usuário (RBAC) e Guards de Rota

A aplicação possui isolamento de rotas baseado no perfil de acesso:

| Papel (`role`) | Painel de Acesso | Redirecionamento Padrão |
|---|---|---|
| `SUPERVISOR` | Painel de Supervisão Epidemiológica (`/dashboard`) | `/dashboard` |
| `ADMIN` / `ADM` | Painel Administrativo Geral (`/admin`) | `/admin` |
| `SUPERADMIN` | Painel Administrativo Geral (`/admin`) | `/admin` |

**Guards Implementados em `src/App.tsx` e `src/routes/`:**
- `PublicRoute`: Permite acesso à tela de login; se o usuário já estiver logado, redireciona para seu respectivo painel (`/admin` ou `/dashboard`).
- `SupervisorRoute`: Valida se o usuário está autenticado e garante que administradores não acessem a visualização de supervisor indevidamente (redirecionando para `/admin`).
- `AdminRoute`: Implementado via `<Outlet />`, restringe sub-rotas a usuários com roles `ADMIN`, `ADM` ou `SUPERADMIN`.
- `DefaultRoute`: Rota curinga (`*`) que direciona o usuário autenticado para seu painel ou para o login.

### 4.3. Camada de Serviços (API Client)

Todos os serviços de comunicação externa estão agrupados em `src/services/` e consomem a instância configurada do Axios (`src/api/client.ts`):

- **`Auth.service.ts`:** Login, refresh token, recuperação e reset de senha, gerenciamento de sessão local.
- **`Dashboard.service.ts`:** Indicadores consolidados (`/dashboard/kpis`), dados de gráficos (`/dashboard/charts`), pontos do mapa de calor (`/dashboard/heatmap`) e trajetórias de agentes (`/dashboard/agent-route`).
- **`HealthDepartment.service.ts`:** Gestão de secretarias de saúde (listagem geral e paginada, cadastro de novas regionais).
- **`RegistrationRequest.service.ts`:** Aprovação e rejeição de solicitações de cadastro de novos agentes e supervisores.
- **`Telemetry.service.ts`:** Visualização de logs de telemetria e erros mobile (`/telemetry/all`), alternância de pin (`togglepin`) e exclusão de logs.
- **`User.service.ts`:** Consulta paginada de usuários, busca por ID, bloqueio/desbloqueio (`toggle-ban`) e cadastro de agentes, supervisores e administradores.
- **`Visit.service.ts`:** Cadastro de visitas de campo, histórico paginado por agente, consulta detalhada, atualização e deleção permanente.

### 4.4. Sistema de Temas (Dark Mode)

- Implementado via `ThemeContext.tsx` e persistido em `@App:theme`.
- Alterna a presença da classe `.dark` diretamente na tag raiz `<html>` (`document.documentElement`).
- Variáveis de cores mapeadas em `src/index.css`:
  - Fundo principal: `--bg-page`
  - Fundo de cartões/modais: `--card-bg` / `--card-soft`
  - Bordas: `--border-color` / `--border-soft`
  - Textos: `--text-main`, `--text-muted`, `--text-light`
  - Marca: `--brand-blue` (`#005A9C`), `--brand-green` (`#2E8B57`), `--primary`, `--secondary`
- Todo componente deve aplicar estilos que referenciem essas variáveis CSS para suportar transição suave entre temas.

---

## 5. Estrutura de Pastas e Arquitetura de Diretórios

A estrutura de arquivos do projeto na branch principal (`main`) organiza-se da seguinte forma:

```
GeoSaudeDashboard/
├── public/                    # Arquivos estáticos e favicons
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/
│   │   └── client.ts          # Instância Axios singleton, interceptors e refresh lock
│   ├── assets/                # Assets gráficos (vetores e ilustrações)
│   ├── components/            # Componentes visuais reutilizáveis
│   │   ├── AddUserModal/      # Modal de cadastro de novos usuários (Agente, Supervisor, Admin)
│   │   ├── AdminNavbar/       # Barra superior do layout administrativo
│   │   ├── InfoTooltip/       # Tooltip de auxílio em ícones
│   │   ├── Layouts/
│   │   │   ├── AdminLayout/   # Container com Navbar administrativa e Outlet
│   │   │   └── DashboardLayout/ # Container com Sidebar, Navbar do supervisor e Outlet
│   │   ├── Navbar/            # Barra superior da área do supervisor
│   │   ├── Sidebar/           # Menu lateral de navegação
│   │   └── ThemeSwitch/       # Controle alternador do tema Dark/Light
│   ├── contexts/              # Contextos globais React
│   │   ├── AuthContext.tsx    # Contexto de autenticação, roles e sessão
│   │   └── ThemeContext.tsx   # Contexto do tema visual
│   ├── imgs/                  # Imagens e logotipos da identidade visual
│   │   ├── logo-full.png
│   │   ├── logo-icon.png
│   │   ├── logo-icon-dark.png
│   │   └── logo-square.png
│   ├── pages/                 # Páginas da aplicação (rotas)
│   │   ├── Admin/
│   │   │   ├── AdminHome/     # Gestão de secretarias de saúde e usuários
│   │   │   └── LogsPage/      # Monitoramento de telemetria e erros mobile
│   │   ├── AgentActivityPage/ # Lista de agentes e solicitações de registro pendentes
│   │   ├── AgentDetails/      # Rota individual do agente, histórico de visitas e mapa
│   │   ├── DashboardHome/     # Painel central com KPIs e gráficos epidemiológicos
│   │   ├── Heatmap/           # Visualização espacial de calor com Leaflet
│   │   ├── login/             # Página de login com seleção de perfil administrativo
│   │   ├── MaintencePage/     # Página estática para status de manutenção
│   │   ├── NewVisitPage/      # Formulário completo de registro de visita de campo
│   │   ├── ProfilePage/       # Informações cadastrais do usuário autenticado
│   │   ├── ReportsPage/       # Emissão e exportação de relatórios
│   │   └── VisitDetailPage.tsx/ # Detalhamento minucioso de uma visita específica
│   ├── routes/
│   │   └── AdminRoutes.tsx    # Rota protegida exclusiva para Administradores
│   ├── services/              # Camada de comunicação com endpoints da API
│   │   ├── Auth.service.ts
│   │   ├── Dashboard.service.ts
│   │   ├── HealthDepartment.service.ts
│   │   ├── RegistrationRequest.service.ts
│   │   ├── Telemetry.service.ts
│   │   ├── User.service.ts
│   │   └── Visit.service.ts
│   ├── types/                 # Definições de tipos e interfaces TypeScript (DTOs)
│   │   ├── auth.ts
│   │   ├── dashboard.ts
│   │   ├── healthDepartment.ts
│   │   ├── registrationRequest.ts
│   │   ├── telemetry.ts
│   │   ├── user.ts
│   │   └── visit.ts
│   ├── App.css                # Estilos globais complementares
│   ├── App.tsx                # Roteamento central e guards de autorização
│   ├── index.css              # Variáveis CSS, resets, tipografia e scrollbar
│   └── main.tsx               # Ponto de entrada (BrowserRouter > ThemeProvider > AuthProvider > App)
├── eslint.config.js           # Configurações do linter ESLint v10
├── index.html                 # HTML template raiz do Vite
├── package.json               # Dependências e scripts do projeto
├── tsconfig.app.json          # Configuração do compilador TS para o código da aplicação
├── tsconfig.json              # Configuração base de TypeScript
├── tsconfig.node.json         # Configuração de TypeScript para scripts de build/Vite
├── vercel.json                # Configuração de rotas de SPA para deploy na Vercel
└── vite.config.ts             # Configuração do empacotador Vite
```

---

## 6. Convenções e Padrões de Código

### 6.1. Componentes e Estrutura de Arquivos
- **Co-localização de Estilos:** Todo componente possui seu arquivo de estilos no mesmo diretório (ex: `AddUserModal.tsx` acompanhado de `AddUserModal.css`).
- **Interfaces de Props Obrigatórias:** Todo componente React que aceita propriedades deve declarar uma `interface [NomeDoComponente]Props`.
- **Exportação Nomeada:** Preferir `export const ComponentName = (...) => { ... }` em vez de default exports.

### 6.2. Regras de TypeScript
- **Imports com Verbatim Syntax:** O compilador está configurado com `verbatimModuleSyntax: true`. Tipos e interfaces devem ser importados estritamente com `import type { ... } from '...'`.
- **Proibição de `any` em código novo:** Definir interfaces ou tipos explícitos para parâmetros e retornos de funções.
- **DTOs Isolados:** Todos os tipos trafegados entre cliente e API devem estar centralizados na pasta `src/types/`.

### 6.3. Padrões de CSS e Design
- **Nomenclatura BEM Simplificada:** Classes estruturadas no padrão `bloco-elemento--modificador` (ex: `logs-table`, `log-row`, `log-badge--active`).
- **Uso Estrito de Custom Properties:** Não utilizar valores hexadecimais fixos nos arquivos de CSS dos componentes. Utilizar `var(--primary)`, `var(--card-bg)`, `var(--text-main)`, etc.
- **Efeito Glassmorphism:** Cards e headers translúcidos devem utilizar `backdrop-filter: blur(10px)`, `background: rgba(...)` e borda suave.
- **Transições Suaves:** Interações visuais (`hover`, `focus`) devem respeitar transições suaves de `0.2s ease` ou `0.3s ease`.

### 6.4. Responsividade
- **Breakpoints:**
  - Desktop: `> 900px`
  - Tablet: `≤ 900px` (colapso de headers, scroll horizontal em tabelas)
  - Mobile: `≤ 768px` (tabelas transformadas em cards, botões adaptados para touch)
- **Padrão Tabela -> Cards (ex: `LogsPage`):** Em telas menores que 768px, o cabeçalho (`thead`) é ocultado e cada linha (`tr`) é exibida como um bloco `display: grid` com áreas definidas (`device`, `error`, `actions`, `date`).
- **Variantes Mobile em Elementos Interativos:** Elementos que dependem de hover no desktop recebem botões dedicados e visíveis em telas touch.

### 6.5. Idioma e Nomenclatura
- **Interface com o Usuário:** 100% em **Português do Brasil (pt-BR)** (rótulos, mensagens de erro, botões, modais).
- **Código-Fonte e Identificadores:** 100% em **Inglês** (nomes de variáveis, métodos, componentes, arquivos, types e commits).

---

## 7. Guia de Comandos Essenciais

### Comandos de Desenvolvimento e Build

```bash
# Instalar todas as dependências do projeto
npm install

# Iniciar o servidor local de desenvolvimento (http://localhost:5173)
npm run dev

# Executar checagem de tipos (tsc) e build otimizado para produção
npm run build

# Executar análise estática do código com ESLint
npm run lint

# Visualizar localmente a versão gerada do build de produção
npm run preview
```

### Comandos Git e Alternância de Escopo

```bash
# Alternar para a branch com o Dashboard SPA completo
git checkout main

# Alternar para a branch da Landing Page institucional
git checkout landing-page

# Conferir status de alterações pendentes
git status
```

---

## 8. Débitos Técnicos e Itens de Atenção Conhecidos

Ao planejar novas funcionalidades ou refatorações, levar em consideração:

1. **Nome do Diretório `src/pages/VisitDetailPage.tsx/`:** O diretório da tela de detalhes da visita possui a extensão `.tsx` no nome da pasta por legado. Não alterar o nome sem coordenar com imports dependentes.
2. **Rotas em Desenvolvimento Comentadas na Sidebar:**
   - As páginas `NewVisitPage` (`/new-visit`) e `ReportsPage` (`/reports`) estão implementadas mas comentadas no menu da `Sidebar.tsx`.
   - A página `MaintencePage` está implementada e pronta para modo de manutenção, mas comentada no início de `src/App.tsx`.
3. **Páginas Administrativas Futuras:**
   - Rotas `/admin/users` e `/admin/settings` estão mapeadas como comentários para implementações futuras em `App.tsx`.
4. **Telemetria de Erros (`LogsPage`):**
   - Os endpoints de fixar log (`togglePin`) e excluir log (`deleteLog`) estão implementados no `telemetryService`, com interface preparada na tabela de logs.
5. **Debug Remanescente:**
   - Existe uma chamada `console.log("getKPIs params final:", params)` no método `getKPIs` em `src/services/Dashboard.service.ts` que deve ser limpa.
6. **Arquivo `AGENTS.md`:**
   - Arquivo de diretrizes internas mantido no repositório com instruções para agentes de inteligência artificial. Nunca deve ser removido do `.gitignore`.
