# Integração dos Dados do Usuário Logado

Este documento descreve a integração dos dados do usuário logado utilizando a rota `/api/users/profile-info` nos componentes TopBar, SideBar e UserDropdown.

## Arquivos Modificados

### 1. Hook Personalizado - `useUserProfile.tsx`
- **Localização**: `src/hooks/useUserProfile.tsx`
- **Função**: Hook personalizado para gerenciar os dados do perfil do usuário
- **Funcionalidades**:
  - Busca automática dos dados do usuário na inicialização
  - Estados de loading e erro
  - Função `refetch` para recarregar os dados
  - Integração com a rota `/api/users/profile-info`

### 2. TopBar - `TopBar.tsx`
- **Localização**: `src/components/TopBar.tsx`
- **Modificações**:
  - Importação do hook `useUserProfile`
  - Priorização dos dados do perfil sobre os dados do contexto de autenticação
  - Exibição do nome completo do usuário quando disponível

### 3. UserDropdown - `UserDropdown.tsx`
- **Localização**: `src/components/UserDropdown.tsx`
- **Modificações**:
  - Importação do hook `useUserProfile`
  - Uso dos dados do perfil para exibir nome e inicial do usuário
  - Fallback para dados do contexto de autenticação quando necessário

### 4. SideBar - `SideBar.tsx`
- **Localização**: `src/components/SideBar.tsx`
- **Modificações**:
  - Importação do hook `useUserProfile`
  - Exibição do nome do usuário na saudação do menu lateral
  - Priorização dos dados do perfil sobre os dados do contexto

## Como Funciona

### Fluxo de Dados
1. **Inicialização**: O hook `useUserProfile` é chamado automaticamente quando o componente é montado
2. **Requisição**: Uma requisição GET é feita para `/api/users/profile-info`
3. **Fallback**: Se os dados do perfil não estiverem disponíveis, os dados do contexto de autenticação são utilizados
4. **Exibição**: Os componentes exibem as informações mais atualizadas disponíveis

### Estrutura dos Dados
```typescript
interface UserDTO {
  id: string;
  nickName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  slug: string;
  phoneNumber?: string;
  createdAt?: string;
  addresses?: UserAddressDTO[];
  roles?: RoleDTO[];
  favoriteAdvertisements?: AdvertisementDTO[];
}
```

## Componentes de Teste

### UserProfileTest
- **Localização**: `src/components/UserProfileTest.tsx`
- **Função**: Componente para testar e visualizar os dados carregados
- **Recursos**:
  - Exibe status de loading e erros
  - Mostra dados do contexto de autenticação
  - Mostra dados da API
  - Botão para recarregar dados

## Benefícios da Integração

1. **Dados Atualizados**: Os componentes sempre exibem as informações mais recentes do usuário
2. **Fallback Inteligente**: Se a API não estiver disponível, os dados do contexto são utilizados
3. **Experiência Consistente**: Todos os componentes exibem as mesmas informações do usuário
4. **Manutenibilidade**: Centralização da lógica de busca de dados do usuário

## Uso

Para usar o hook em outros componentes:

```typescript
import { useUserProfile } from '../hooks/useUserProfile';

const MeuComponente = () => {
  const { userProfile, isLoading, error, refetch } = useUserProfile();
  
  // Usar os dados conforme necessário
  return (
    <div>
      {isLoading ? 'Carregando...' : userProfile?.nickName}
    </div>
  );
};
```

## Considerações Técnicas

- **Performance**: O hook faz cache dos dados e só recarrega quando necessário
- **Error Handling**: Tratamento de erros com fallback para dados do contexto
- **TypeScript**: Tipagem completa para melhor experiência de desenvolvimento
- **Reutilização**: Hook pode ser usado em qualquer componente que precise dos dados do usuário
