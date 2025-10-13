export const cpfMask = (value: string): string => {
  if (!value) return "";
  value = value.replace(/\D/g, ''); // Remove tudo o que não é dígito
  value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca um ponto entre o terceiro e o quarto dígitos
  value = value.replace(/(\d{3})(\d)/, '$1.$2'); // Coloca um ponto entre o terceiro e o quarto dígitos de novo (para o segundo bloco de 3)
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Coloca um hífen entre o terceiro e o quarto dígitos
  return value.slice(0, 14); // Limita o tamanho
};