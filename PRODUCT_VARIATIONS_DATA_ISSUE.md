# Problema: ProductVariations não recebendo dados das variações

## Problema Identificado

O componente `ProductVariations` não estava recebendo os dados das variações corretamente devido a um problema na passagem de props no `AdDetails.tsx`.

## Causa do Problema

### 1. Prop `data` Incorreta
No arquivo `AdDetails.tsx`, linha 118, estava sendo passada a prop `data` com `mockAdData.variations`:

```typescript
<ProductVariations
  data={mockAdData.variations}  // ❌ PROBLEMA: mockAdData.variations é um objeto
  variations={
    Array.isArray(adData.variations) ? adData.variations : []
  }
/>
```

### 2. Estrutura Incompatível
- **`mockAdData.variations`**: Objeto com arrays de strings
  ```typescript
  variations: {
    preservation: ["Novo", "Seminovo", "Bom"],
    cartridgeType: ["Normal", "Danificado", "Repro"],
    region: ["Australia", "Brasil", "Europe", "North America", "Korea"],
    audioLanguages: ["Inglês", "Português BR", "Japonês"],
    interfaceLanguages: ["Inglês", "Português BR", "Japonês"],
    stock: 3,
  }
  ```

- **`ProductVariations` espera**: Array de `AdvertisementDTO[]`
  ```typescript
  interface ProductVariationsProps {
    data?: ProductVariationsData; // Opcional
    variations?: AdvertisementDTO[]; // Array de objetos AdvertisementDTO
  }
  ```

## Solução Implementada

### 1. Remoção da Prop `data` Incorreta
Removida a prop `data` que estava passando dados incompatíveis:

```typescript
// ❌ ANTES (Problemático)
<ProductVariations
  data={mockAdData.variations}
  variations={
    Array.isArray(adData.variations) ? adData.variations : []
  }
/>

// ✅ DEPOIS (Corrigido)
<ProductVariations
  variations={
    Array.isArray(adData.variations) ? adData.variations : []
  }
/>
```

### 2. Logs de Debug Adicionados
Adicionados logs de debug no `ProductVariations.tsx` para monitorar:

```typescript
// Debug: Log dos dados recebidos
console.log('=== DEBUG ProductVariations ===');
console.log('variations recebidas:', variations);
console.log('tipo de variations:', typeof variations);
console.log('é array?', Array.isArray(variations));
console.log('length:', variations.length);
if (variations.length > 0) {
  console.log('primeira variação:', variations[0]);
}
console.log('================================');
```

### 3. Logs no useEffect
Adicionados logs detalhados no `useEffect` para monitorar o processamento:

```typescript
useEffect(() => {
  console.log('=== DEBUG useEffect variations ===');
  console.log('variations no useEffect:', variations);
  console.log('selection:', selection);
  console.log('variationKeyMap:', variationKeyMap);
  
  // ... resto da lógica com logs adicionais
}, [selection, variations, allPossibleOptions, variationKeyMap]);
```

## Estrutura de Dados Esperada

### AdvertisementDTO com Variações
```typescript
interface AdvertisementDTO {
  id: number;
  title: string;
  // ... outros campos
  variations?: AdvertisementDTO[]; // Array de variações
}
```

### Estrutura de uma Variação
```typescript
{
  id: number;
  title: string;
  preservationState?: { id: number; name: string; };
  cartridgeType?: { id: number; name: string; };
  gameLocalization?: {
    region?: { id: number; name: string; };
    // Campos de idiomas podem estar em outros lugares
  };
  // ... outros campos
}
```

## Problemas Identificados Adicionais

### 1. Campos de Idiomas Ausentes
O `GameLocalizationDTO` não possui campos para idiomas:
```typescript
export interface GameLocalizationDTO {
  id: number;
  name: string;
  gameId: number;
  region: RegionDTO;
  createdAt: string;
  updatedAt: string;
  // ❌ Faltam: audioLanguages, subtitleLanguages, interfaceLanguages
}
```

### 2. Mapeamento de Idiomas
O `variationKeyMap` está tentando acessar campos que podem não existir:
```typescript
audioLanguages: (v: AdvertisementDTO) =>
  v.gameLocalization?.audioLanguages?.map((l) => l.name), // ❌ Campo pode não existir
```

## Próximos Passos

### 1. Verificar Estrutura Real do Backend
- Confirmar se `GameLocalizationDTO` possui campos de idiomas
- Verificar se as variações são retornadas corretamente pela API

### 2. Testar com Dados Reais
- Verificar se `adData.variations` contém dados reais quando carregado da API
- Testar se os logs de debug mostram dados corretos

### 3. Ajustar Mapeamento
- Corrigir `variationKeyMap` se campos de idiomas estiverem em outros lugares
- Implementar fallbacks para campos ausentes

## Resultado Esperado

✅ **Prop Corrigida**: `data` removida, apenas `variations` passada
✅ **Logs Adicionados**: Debug para monitorar dados recebidos
✅ **Estrutura Correta**: `ProductVariations` recebe `AdvertisementDTO[]`
✅ **Processamento**: Lógica de filtro deve funcionar com dados reais

## Arquivos Modificados

### 1. `AdDetails.tsx`
- Removida prop `data` incorreta
- Mantida apenas prop `variations` com dados corretos

### 2. `ProductVariations.tsx`
- Adicionados logs de debug
- Logs detalhados no `useEffect`
- Monitoramento de processamento de variações

O problema principal foi a passagem de dados incompatíveis através da prop `data`. Com a correção, o componente `ProductVariations` deve receber os dados corretos das variações e processá-los adequadamente.


