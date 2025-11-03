# 🎮 Toca do Cartucho - Frontend

Aplicação web frontend da plataforma Toca do Cartucho, desenvolvida em React com TypeScript. Uma plataforma para compra, venda e troca de jogos retrô e cartuchos.

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Desenvolvimento](#desenvolvimento)
- [Build de Produção](#build-de-produção)
- [Troubleshooting](#troubleshooting)

## 🛠️ Tecnologias

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e dev server moderno
- **React Router DOM** - Roteamento no lado do cliente
- **Axios** - Cliente HTTP para requisições à API
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones
- **Material-UI** - Componentes React prontos
- **Swiper** - Carrossel/touch slider

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** (geralmente vem com o Node.js) ou **yarn**
- **Git** (para clonar o repositório)

## 🚀 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/gabebastarz1/toca-do-cartucho-client.git
   cd toca-do-cartucho-client
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente** (veja seção [Configuração](#configuração))

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação:**
   - A aplicação estará disponível em `http://localhost:3000`

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_API_URL= (URL DISPONÍVEL NO REPOSITÓRIO DO BACKEND)
```

**Descrição das variáveis:**
- `VITE_API_URL`: URL base da API backend

**Nota:** Todas as variáveis de ambiente no Vite devem começar com `VITE_` para serem expostas ao código do cliente.

## 📜 Scripts Disponíveis

### `npm run dev`
Inicia o servidor de desenvolvimento com hot-reload. A aplicação estará disponível em `http://localhost:3000`.

### `npm run build`
Compila o projeto para produção. Os arquivos otimizados serão gerados na pasta `dist/`.

### `npm run preview`
Serve a build de produção localmente para testar antes do deploy.

### `npm run lint`
Executa o linter ESLint para verificar problemas no código.

## 📁 Estrutura do Projeto

```
toca-do-cartucho-client/
├── public/              # Arquivos estáticos
│   └── Icons/          # Ícones da aplicação
├── src/
│   ├── api/            # Tipos e configurações da API
│   ├── assets/         # Imagens e outros assets
│   ├── components/     # Componentes React reutilizáveis
│   │   ├── ui/         # Componentes de UI base
│   │   └── ...
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Páginas/rotas da aplicação
│   ├── services/       # Serviços e integrações
│   ├── utils/          # Funções utilitárias
│   ├── App.tsx         # Componente raiz
│   └── main.tsx        # Entry point
├── .env                # Variáveis de ambiente (não commitado)
├── package.json        # Dependências e scripts
├── tsconfig.json       # Configuração TypeScript
├── vite.config.ts      # Configuração Vite
└── tailwind.config.js  # Configuração Tailwind CSS
```

## ✨ Funcionalidades Principais

- 🔐 **Autenticação**
  - Login e cadastro de usuários
  - Autenticação de dois fatores
  - Login com Google
  - Recuperação de senha

- 👤 **Gerenciamento de Perfil**
  - Visualização e edição de dados pessoais
  - Upload de foto de perfil
  - Gerenciamento de endereços
  - Configurações de segurança

- 🛍️ **Anúncios**
  - Listagem de produtos com filtros avançados
  - Criação e edição de anúncios
  - Visualização de detalhes do produto
  - Sistema de favoritos

- 🔍 **Busca e Filtros**
  - Busca por texto
  - Filtros por categoria, preço, condição, etc.
  - Ordenação de resultados
  - Paginação

- 💬 **Sistema de Avaliações**
  - Avaliação de vendedores
  - Histórico de transações

- 🎨 **UI/UX**
  - Design responsivo
  - Tema personalizado
  - Componentes reutilizáveis
  - Feedback visual (alerts, modals)

## 💻 Desenvolvimento

### Hot Module Replacement (HMR)
O Vite oferece HMR extremamente rápido, atualizando automaticamente os módulos alterados sem recarregar toda a página.

### Linting
Execute o linter antes de commitar:
```bash
npm run lint
```

