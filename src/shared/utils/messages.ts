export const emailInvalid = "Adicione um e-mail válido"
export const cnpjInvalid = "Adicione um CNPJ válido"
export const cpfInvalid = "Adicione um CPF válido"
export const phoneInvalid = "Adicione um número de contato com DDD"
export const useTermRequired = "É necessário aceitar os termos de uso"

export const fieldRequired = (field: string): string =>
  `O campo '${field}' é obrigatório`

export const fieldInvalid = (field: string): string =>
  `O campo '${field}' é inválido`

export const minContent = (min: number, field = null): string => {
  const text = field ? `O campo '${field}'` : ""
  return `${text} deve conter no mínimo ${min} caracteres`
}

export const maxContent = (max: number, field = null): string => {
  const text = field ? `O campo '${field}'` : ""
  return `${text} deve conter no máximo ${max} caracteres`
}

export const rangeLenght = (min: number, max: number, field = null): string => {
  const text = field ? `O campo '${field}'` : ""
  return `${text} deve conter no mínimo ${min} e no máximo ${max} caracteres`
}
