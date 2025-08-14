// utils/RegexUtils.ts
export const regexPatterns = {
  // CNPJ: 00.000.000/0000-00
  cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,

  // CPF: 000.000.000-00
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,

  // Telefone: (00) 00000-0000 ou (00) 0000-0000
  phone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,

  // CEP: 00000-000
  cep: /^\d{5}-\d{3}$/,

  // Email simples (padrão RFC 5322 simplificado)
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Somente números
  onlyNumbers: /^\d+$/,

  // Somente letras
  onlyLetters: /^[A-Za-zÀ-ÿ\s]+$/,

  // Placa de carro Brasil: ABC-1234 ou ABC1D23 (novo padrão Mercosul)
  carPlate: /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/
};
