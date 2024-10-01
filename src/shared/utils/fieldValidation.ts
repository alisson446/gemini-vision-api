export const dateValidation = (date: string): boolean => {

  if (date === null) return false

  const dateGenerate = new Date(date)

  return (
    !isNaN(dateGenerate.getTime()) &&
    dateGenerate.toISOString().slice(0, 10) === date.slice(0, 10)
  )
}

export const isValidBase64Image = (base64String: string): boolean => {
  // Verifica se a string tem o prefixo base64 de uma imagem
  const imagePattern = /^data:image\/(png|jpeg|jpg|gif);base64,/
  if (!imagePattern.test(base64String)) {
    return false
  }

  // Remove o prefixo base64
  const base64Data = base64String.replace(imagePattern, '')

  // Verifica se a string restante é uma base64 válida
  try {
    return btoa(atob(base64Data)) === base64Data
  } catch (err) {
    return false
  }
}
