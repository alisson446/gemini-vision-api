import { inject, injectable } from "tsyringe"
import { Warning } from "../errors"
import { PacoteRepository } from "../repositories/pacote.repository"
import { extractMimeType } from "../../shared/utils/image"
import { analyzeImage, uploadImage } from "../api/gemini-vision"
import { getExtensionFromBase64, removeTempFile, saveBase64AsTempFile } from "../../shared/utils/files"

@injectable()
export class PacoteService {

  constructor (
    @inject("PacoteRepository")
    private pacoteRepository: PacoteRepository
  ) { }

  upload = async (image: string): Promise<string> => {

    const mimeType = extractMimeType(image) as string
    const base64 = image.split("base64,").pop() as string

    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join("")
    const extension = getExtensionFromBase64(image)
    const fileName = `${randomName}.${extension}`

    const filePath = await saveBase64AsTempFile(base64, fileName)
    const uploadResponse = await uploadImage(randomName, filePath, mimeType)

    try {
      return await analyzeImage(uploadResponse.file.uri, uploadResponse.file.mimeType)
    } catch (error: any) {
      throw new Warning(error.response.data.message, 400)
    } finally {
      await removeTempFile(filePath)
    }
  }
}
