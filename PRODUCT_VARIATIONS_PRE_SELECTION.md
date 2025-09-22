# Atualização: ProductVariations com pré-seleção do anúncio principal

## Problema Identificado

O componente `ProductVariations` não estava pré-selecionando as opções do anúncio principal, deixando todas as opções desmarcadas inicialmente.

## Solução Implementada

### 1. Estado Inicial com Pré-seleção

```typescript
const [selection, setSelection] = useState<{ [key: string]: string }>(() => {
  if (!mainAdvertisement) return {};
  
  const initialSelection: { [key: string]: string } = {};
  
  // Mapear as opções do anúncio principal para seleções iniciais
  Object.keys(variationKeyMap).forEach((key) => {
    const value = variationKeyMap[key as keyof typeof variationKeyMap]?.(mainAdvertisement);
    if (value) {
      if (Array.isArray(value)) {
        // Para arrays (como idiomas), pegar o primeiro item
        initialSelection[key] = value[0] || "";
      } else {
        initialSelection[key] = value;
      }
    }
  });
  
  return initialSelection;
});
```

### 2. Atualização Dinâmica

```typescript
// Atualizar seleções quando mainAdvertisement mudar
useEffect(() => {
  if (mainAdvertisement) {
    const newSelection: { [key: string]: string } = {};
    
    Object.keys(variationKeyMap).forEach((key) => {
      const value = variationKeyMap[key as keyof typeof variationKeyMap]?.(mainAdvertisement);
      if (value) {
        if (Array.isArray(value)) {
          newSelection[key] = value[0] || "";
        } else {
          newSelection[key] = value;
        }
      }
    });
    
    setSelection(newSelection);
  }
}, [mainAdvertisement, variationKeyMap]);
```

## Lógica de Pré-seleção

### Mapeamento de Valores

```typescript
const variationKeyMap = {
  preservation: (v: AdvertisementDTO) => v.preservationState?.name,
  cartridgeType: (v: AdvertisementDTO) => v.cartridgeType?.name,
  region: (v: AdvertisementDTO) => v.gameLocalization?.region?.name,
  audioLanguages: (v: AdvertisementDTO) => v.gameLocalization?.audioLanguages?.map((l) => l.name),
  subtitleLanguages: (v: AdvertisementDTO) => v.gameLocalization?.subtitleLanguages?.map((l) => l.name),
  interfaceLanguages: (v: AdvertisementDTO) => v.gameLocalization?.interfaceLanguages?.map((l) => l.name),
};
```

### Tratamento de Arrays

Para campos que retornam arrays (como idiomas), a lógica pega o primeiro item:

```typescript
if (Array.isArray(value)) {
  initialSelection[key] = value[0] || "";
} else {
  initialSelection[key] = value;
}
```

## Comportamento Esperado

### Antes
- ❌ Todas as opções desmarcadas
- ❌ Usuário precisa selecionar manualmente
- ❌ Não reflete o anúncio principal

### Depois
- ✅ Opções do anúncio principal pré-selecionadas
- ✅ Usuário vê imediatamente as características do anúncio
- ✅ Pode alterar seleções para ver outras variações

## Exemplo de Funcionamento

### Anúncio Principal
```typescript
{
  id: 123,
  preservationState: { name: "Bom" },
  cartridgeType: { name: "Original" },
  gameLocalization: {
    region: { name: "Brasil" },
    audioLanguages: [{ name: "Português" }, { name: "Inglês" }],
    subtitleLanguages: [{ name: "Português" }],
    interfaceLanguages: [{ name: "Português" }]
  }
}
```

### Seleção Inicial
```typescript
{
  preservation: "Bom",
  cartridgeType: "Original", 
  region: "Brasil",
  audioLanguages: "Português",      // Primeiro item do array
  subtitleLanguages: "Português",   // Primeiro item do array
  interfaceLanguages: "Português"   // Primeiro item do array
}
```

## Vantagens

### ✅ Experiência do Usuário
- Usuário vê imediatamente as características do anúncio principal
- Não precisa adivinhar quais opções estão disponíveis
- Interface mais intuitiva e informativa

### ✅ Funcionalidade Completa
- Pré-seleção baseada em dados reais
- Atualização dinâmica quando anúncio muda
- Compatível com filtros existentes

### ✅ Flexibilidade
- Funciona com ou sem anúncio principal
- Trata arrays e valores simples
- Logs de debug para monitoramento

## Logs de Debug

Os logs mostram:
- `mainAdvertisement`: Dados do anúncio principal
- `initialSelection`: Seleções iniciais calculadas
- `newSelection`: Seleções atualizadas quando anúncio muda

## Casos de Uso

### 1. Anúncio com Variações
- Anúncio principal pré-selecionado
- Usuário pode alterar para ver variações
- Filtros funcionam dinamicamente

### 2. Anúncio sem Variações
- Apenas anúncio principal pré-selecionado
- Todas as opções mostram apenas o anúncio principal

### 3. Mudança de Anúncio
- Seleções atualizadas automaticamente
- Interface reflete novo anúncio
- Filtros recalculados

## Resultado Final

O componente `ProductVariations` agora:

1. **Pré-seleciona** as opções do anúncio principal
2. **Atualiza dinamicamente** quando o anúncio muda
3. **Mantém funcionalidade** de filtros e variações
4. **Fornece experiência** mais intuitiva ao usuário

A solução garante que o usuário sempre veja as características do anúncio principal destacadas, facilitando a navegação e compreensão das opções disponíveis.


