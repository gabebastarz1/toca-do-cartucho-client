# CategoryDataProvider

Componente centralizado para gerenciar gêneros e temáticas, com suporte tanto para dados mockados quanto para conexão com banco de dados.

## Funcionalidades

- **Dados Mockados**: Fallback com todos os gêneros e temáticas predefinidos
- **Conexão com API**: Busca automática de dados do backend quando disponível
- **Fallback Inteligente**: Se a API falhar, usa dados mockados automaticamente
- **Context API**: Compartilha dados entre todos os componentes
- **Hooks Específicos**: Hooks otimizados para diferentes necessidades

## Como Usar

### 1. Configuração no App.tsx

```tsx
import { CategoryDataProvider } from "./components/CategoryDataProvider";

function App() {
  return (
    <CategoryDataProvider useMockData={import.meta.env.DEV}>
      {/* Seu app aqui */}
    </CategoryDataProvider>
  );
}
```

### 2. Usando os Hooks

```tsx
import { useCategories, useGenres, useThemes } from "./components/CategoryDataProvider";

// Hook completo
const { genres, themes, loading, error, refetch } = useCategories();

// Hook específico para gêneros
const { genres, loading, error, refetch } = useGenres();

// Hook específico para temáticas
const { themes, loading, error, refetch } = useThemes();
```

### 3. Configuração da API

Crie um arquivo `.env` na raiz do projeto:

```env
# URL da API (opcional)
VITE_API_URL=http://localhost:3001/api

# Para forçar uso de dados mockados (opcional)
VITE_USE_MOCK_DATA=true
```

## Estrutura da API

A API deve retornar os dados no seguinte formato:

### Gêneros (`/api/genres`)
```json
[
  { "id": "action", "name": "Action" },
  { "id": "comedy", "name": "Comedy" },
  // ...
]
```

### Temáticas (`/api/themes`)
```json
[
  { "id": "fantasia", "name": "Fantasia" },
  { "id": "futurista", "name": "Futurista" },
  // ...
]
```

## Dados Mockados

### Gêneros (13 total)
- Action, Comedy, Drama, Educational, Fantasy, Historical, Horror, Kids, Mystery, Romance, Science fiction, Thriller, Warfare

### Temáticas (5 total)
- Fantasia, Futurista, Histórico, Medieval, Espacial

## Modos de Operação

### Desenvolvimento
- `useMockData={true}`: Força uso de dados mockados
- `useMockData={false}`: Tenta API primeiro, fallback para mockados

### Produção
- `useMockData={false}`: Usa API, fallback para mockados se falhar
- `useMockData={true}`: Força dados mockados (não recomendado)

## Exemplo de Implementação no Backend

```javascript
// Express.js exemplo
app.get('/api/genres', (req, res) => {
  res.json([
    { id: "action", name: "Action" },
    { id: "comedy", name: "Comedy" },
    // ... outros gêneros
  ]);
});

app.get('/api/themes', (req, res) => {
  res.json([
    { id: "fantasia", name: "Fantasia" },
    { id: "futurista", name: "Futurista" },
    // ... outras temáticas
  ]);
});
```

## Vantagens

1. **Flexibilidade**: Funciona com ou sem backend
2. **Resiliente**: Fallback automático para dados mockados
3. **Performance**: Cache automático dos dados
4. **TypeScript**: Tipagem completa
5. **Reutilizável**: Hooks específicos para diferentes necessidades
6. **Manutenível**: Centralização de todos os dados de categoria
