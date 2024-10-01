import { inject, injectable } from "tsyringe"
import { Warning } from "../errors"
import { MeasureRepository } from "../repositories/measure.repository"
import { extractMimeType } from "../../shared/utils/image"
import { analyzeImage, getImageData, uploadImage } from "../api/gemini-vision"
import { getExtensionFromBase64, removeTempFile, saveBase64AsTempFile } from "../../shared/utils/files"
import { IMeasureConfirmValidator, IMeasureUploadValidator } from "../interfaces/Measure"
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
  }: IMeasureUploadValidator): Promise<{
    image_url: string
    measure_value: string
    measure_uuid: string
  }> => {

    const measureValidator = new IMeasureUploadValidator({
      image,
      customer_code,
      measure_datetime,
      measure_type
    })

    const errors = await validate(measureValidator)

    if (errors.length > 0) {
      throw new Warning({
        error_code: "INVALID_DATA",
        error_description: errors
      }, 400)
    }

    const measureExists = await this.measureRepository.findByTypeAndDate({
      type: measure_type,
      measureDateTime: measure_datetime
    })

    if (measureExists) {
      throw new Warning({
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada"
      }, 409)
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
        value: parseInt(analyzedImage),
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

  confirm = async ({
    measure_uuid,
    confirmed_value
  }: IMeasureConfirmValidator): Promise<{
    success: boolean
  }> => {

    const measureValidator = new IMeasureConfirmValidator({
      measure_uuid,
      confirmed_value
    })

    const errors = await validate(measureValidator)

    if (errors.length > 0) {
      throw new Warning({
        error_code: "INVALID_DATA",
        error_description: errors
      }, 400)
    }

    const measure = await this.measureRepository.findById(measure_uuid)

    if (!measure) {
      throw new Warning({
        error_code: "MEASURE_NOT_FOUND",
        error_description: "Leitura não encontrada"
      }, 404)
    }

    if (measure.confirmed) {
      throw new Warning({
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura do mês já realizada"
      }, 409)
    }

    await this.measureRepository.confirm({
      id: measure_uuid,
      value: parseInt(confirmed_value)
    })

    return {
      success: true
    }
  }

}
