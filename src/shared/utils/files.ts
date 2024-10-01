import fs from 'fs-extra'
import path from 'path'
import { logger } from './logger'

export async function saveBase64AsTempFile (base64String: string, filename: string): Promise<string> {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "")

  const filePath = path.join('./upload', filename)

  await fs.writeFile(filePath, base64Data, 'base64')

  return filePath
}

export async function removeTempFile (filePath: string): Promise<void> {
  try {
    await fs.remove(filePath)
    logger.info(`Arquivo temporário ${filePath} removido com sucesso.`)
  } catch (error) {
    logger.error(`Erro ao remover o arquivo temporário: ${filePath}`, error)
  }
}

export function getExtensionFromBase64 (base64String: string): string {
  const mimeType = base64String.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)

  if (mimeType && mimeType.length) {
    const mime = mimeType[1]
    switch (mime) {
      case 'image/jpeg':
        return 'jpg'
      case 'image/png':
        return 'png'
      case 'image/gif':
        return 'gif'
      default:
        return ''
    }
  }
  return ''
}
