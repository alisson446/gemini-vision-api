import { inject, injectable } from "tsyringe"
import { Warning } from "../errors"
import { MeasureRepository } from "../repositories/measure.repository"
import { extractMimeType } from "../../shared/utils/image"
import { analyzeImage, getImageData, uploadImage } from "../api/gemini-vision"
import { getExtensionFromBase64, removeTempFile, saveBase64AsTempFile } from "../../shared/utils/files"
import { IMeasureUploadBody } from "../interfaces/Measure"
import { validate } from "class-validator"

@injectable()
export class MeasureService {

  constructor (
    @inject("MeasureRepository")
    private measureRepository: MeasureRepository
  ) { }

  upload = async ({
    image,
    customer_code,
    measure_datetime,
    measure_type
  }: IMeasureUploadBody): Promise<{
    image_url: string
    measure_value: string
    measure_uuid: string
  }> => {

    const companyAssociatedPartnershipValidator = new IMeasureUploadBody({
      image,
      customer_code,
      measure_datetime,
      measure_type
    })

    const errors = await validate(companyAssociatedPartnershipValidator)

    if (errors.length > 0) {
      throw new Warning({
        error_code: "INVALID_DATA",
        error_description: errors
      }, 400)
    }

    const mimeType = extractMimeType(image) as string
    const base64 = image.split("base64,").pop() as string

    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join("")
    const extension = getExtensionFromBase64(image)
    const fileName = `${randomName}.${extension}`

    const filePath = await saveBase64AsTempFile(base64, fileName)

    try {
      const uploadResponse = await uploadImage(randomName, filePath, mimeType)

      const imageData = await getImageData(uploadResponse.file.name)

      const analyzedImage = await analyzeImage(uploadResponse.file.uri, uploadResponse.file.mimeType)

      const measure = await this.measureRepository.create({
        value: parseFloat(analyzedImage),
        customerCode: customer_code,
        measureDateTime: measure_datetime,
        type: measure_type,
        imageUrl: imageData.uri
      })

      return {
        image_url: imageData.uri,
        measure_value: analyzedImage,
        measure_uuid: measure.id
      }

    } catch (error: any) {
      throw new Warning(error.message, 400)
    } finally {
      await removeTempFile(filePath)
    }
  }
}
