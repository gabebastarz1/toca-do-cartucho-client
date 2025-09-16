# 🍪 Guia de Troca de Cookie de Autenticação

## 📋 Visão Geral
Este guia explica como trocar o cookie de autenticação usado no sistema de desenvolvimento.

## 🔧 Como Trocar o Cookie

### 1. **Localizar o Cookie Atual**
O cookie está definido em: `src/components/CookieAuth.tsx`

```typescript
const providedCookie = "SEU_COOKIE_ATUAL_AQUI";
```

### 2. **Obter Novo Cookie**
1. Acesse o backend em desenvolvimento
2. Faça login normalmente
3. Abra DevTools (F12) → Application → Cookies
4. Copie o valor do cookie `Identity.Application`

### 3. **Substituir o Cookie**
Edite o arquivo `src/components/CookieAuth.tsx`:

```typescript
const handleUseProvidedCookie = () => {
  const providedCookie = "NOVO_COOKIE_AQUI"; // ← Substitua aqui
  setCookieAuth(providedCookie);
  setIsSet(true);
  setTimeout(() => setIsSet(false), 3000);
};
```

### 4. **Testar a Autenticação**
1. Acesse `/auth`
2. Clique na aba "Cookie"
3. Clique em "Usar Cookie Fornecido"
4. Verifique se está autenticado

## 🚨 Importante

- **Desenvolvimento apenas**: Este método é apenas para desenvolvimento
- **Segurança**: Não commite cookies de produção
- **Expiração**: Cookies têm tempo de vida limitado
- **Backend**: Certifique-se que o backend está rodando

## 🔄 Alternativas

### Opção 1: Login Tradicional
Use a aba "Login" com credenciais válidas do backend.

### Opção 2: Cookie Manual
Cole o novo cookie diretamente no campo de texto da aba "Cookie".

## 📝 Estrutura do Cookie

O cookie deve ter o formato:
```
Identity.Application=VALOR_DO_COOKIE_AQUI
```

## 🛠️ Troubleshooting

### Cookie não funciona?
- ✅ Verifique se o backend está rodando
- ✅ Confirme que o cookie não expirou
- ✅ Limpe localStorage: `localStorage.clear()`
- ✅ Recarregue a página

### Erro 401?
- ✅ Cookie pode ter expirado
- ✅ Backend pode ter reiniciado
- ✅ Use um cookie mais recente

## 📁 Arquivos Envolvidos

- `src/components/CookieAuth.tsx` - Componente principal
- `src/services/authService.ts` - Lógica de autenticação
- `src/services/api.ts` - Configuração HTTP

---

**💡 Dica**: Mantenha este guia atualizado quando trocar cookies!
