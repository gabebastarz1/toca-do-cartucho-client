# Correção: Imagens das Variações Vinculadas ao ID Correto

## Problema Identificado

Ao cadastrar um anúncio com variação, as imagens da variação estavam sendo vinculadas tanto ao anúncio principal quanto à variação específica, quando deveriam estar vinculadas apenas à variação.

## Causa do Problema

No método `createAdvertisementFromExistingForm` do `useAdvertisementCreation.tsx`, havia uma chamada duplicada para `uploadImages`:

```typescript
// ❌ PROBLEMA: Chamada duplicada
await this.uploadImages(advertisement.id, variationImages, createdVariation.id);
await this.uploadImages(advertisement.id, variationImages); // ← Esta linha causava o problema
```

### Comportamento Incorreto:
1. **Primeira chamada**: Vinculava a imagem à variação específica (`createdVariation.id`)
2. **Segunda chamada**: Vinculava a mesma imagem ao anúncio principal (sem `variationId`)

## Solução Implementada

### Remoção da Chamada Duplicada
Removida a segunda chamada que vinculava as imagens ao anúncio principal:

```typescript
// ✅ CORRIGIDO: Apenas uma chamada
await this.uploadImages(advertisement.id, variationImages, createdVariation.id);
```

### Comportamento Correto:
- **Imagens do anúncio principal**: Vinculadas apenas ao anúncio principal
- **Imagens das variações**: Vinculadas apenas às variações específicas

## Implementação do Upload

### Método `uploadImages`
O método já estava implementado corretamente para suportar variações:

```typescript
async uploadImages(
  advertisementId: number,
  images: File[],
  variationId?: number
): Promise<void> {
  const formData = new FormData();
  images.forEach((image) => formData.append("images", image));

  // Se um ID de variação for fornecido, adicione-o ao corpo do formulário
  if (variationId) {
    formData.append("variationId", variationId.toString());
  }

  const url = `${this.baseUrl}/${advertisementId}/images`;
  await api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
```

### Fluxo de Upload Corrigido:

1. **Anúncio Principal**:
   ```typescript
   const mainImages = extractValidImages(formData.imagens);
   if (mainImages.length > 0) {
     await this.uploadImages(advertisement.id, mainImages); // Sem variationId
   }
   ```

2. **Variações**:
   ```typescript
   for (let i = 0; i < variations.length; i++) {
     const frontendVariation = variations[i];
     const createdVariation = advertisement.variations[i];
     const variationImages = extractValidImages(frontendVariation.imagens);
     
     if (variationImages.length > 0) {
       await this.uploadImages(
         advertisement.id, 
         variationImages, 
         createdVariation.id // Com variationId
       );
     }
   }
   ```

## Resultado Esperado

✅ **Imagens do Anúncio Principal**: Vinculadas apenas ao anúncio principal
✅ **Imagens das Variações**: Vinculadas apenas às variações específicas
✅ **Sem Duplicação**: Cada imagem é vinculada apenas uma vez ao local correto
✅ **Backend Correto**: O backend recebe o `variationId` correto para associar as imagens

## Arquivo Modificado

### `useAdvertisementCreation.tsx`
- **Linha 139-143**: Removida chamada duplicada de `uploadImages`
- **Comportamento**: Agora as imagens das variações são vinculadas apenas às variações específicas

## Teste Recomendado

1. Criar um anúncio com variações
2. Adicionar imagens diferentes para o anúncio principal e para cada variação
3. Verificar se as imagens aparecem corretamente associadas aos respectivos anúncios
4. Confirmar que não há duplicação de imagens entre anúncio principal e variações

A correção garante que cada imagem seja vinculada ao local correto, evitando confusão e duplicação desnecessária.


