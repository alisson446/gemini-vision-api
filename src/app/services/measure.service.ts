import { inject, injectable } from "tsyringe"
import { Warning } from "../errors"
import { MeasureRepository } from "../repositories/measure.repository"
import { extractMimeType } from "../../shared/utils/image"
import { analyzeImage, getImageData, uploadImage } from "../api/gemini-vision"
import { getExtensionFromBase64, removeTempFile, saveBase64AsTempFile } from "../../shared/utils/files"
import { validate } from "class-validator"
import { MeasureType } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator"
import { fieldInvalid, fieldRequired } from "../../shared/utils/messages"
import { DateValidatorConstraint, ImageValidatorConstraint } from "../../shared/utils/customClassValidator"
import { IIndex } from "../interfaces/Helpers"

export interface IMeasure {
  list (customer_code: string, data: IIndex): Promise<IMeasureListResponse[]>
  create (data: IMeasureDTO): Promise<IMeasureResponse>
  findById (measure_uuid: string): Promise<IMeasureResponse | null>
  findByTypeAndDate (data: IMeasureFindTypeAndDate): Promise<IMeasureResponse | null>
  confirm (data: IMeasureConfirm): Promise<IMeasureResponse>
}

export interface IMeasureListResponse {
  measure_uuid: string
  measure_datetime: Date
  measure_type: MeasureType
  has_confirmed?: boolean
  image_url: string
}

export interface IMeasureDTO {
  llm_value: number
  customer_code: string
  measure_datetime: Date
  measure_type: MeasureType
  has_confirmed?: boolean
  image_url: string
}

export interface IMeasureResponse extends IMeasureDTO {
  measure_uuid: string
  createdAt: Date
  updatedAt: Date
}

export interface IMeasureFindTypeAndDate {
  customer_code: string
  measure_type: MeasureType
  measure_datetime: Date
}

export interface IMeasureConfirm {
  measure_uuid: string
  confirmed_value: number
}

export class IMeasureUploadValidator {

  @IsNotEmpty({ message: fieldRequired("image") })
  @IsString({ message: fieldInvalid("image") })
  @Validate(ImageValidatorConstraint)
  image!: string

  @IsNotEmpty({ message: fieldRequired("customer_code") })
  @IsString({ message: fieldInvalid("customer_code") })
  customer_code!: string

  @IsNotEmpty({ message: fieldRequired("measure_datetime") })
  @Validate(DateValidatorConstraint)
  measure_datetime!: Date

  @IsNotEmpty({ message: fieldRequired("measure_type") })
  @IsEnum(MeasureType, { message: fieldInvalid("measure_type") })
  measure_type!: MeasureType

  constructor (data: IMeasureUploadValidator) {
    Object.assign(this, data)
  }
}

export class IMeasureConfirmValidator {

  @IsNotEmpty({ message: fieldRequired("measure_uuid") })
  @IsString({ message: fieldInvalid("measure_uuid") })
  measure_uuid!: string

  @IsNotEmpty({ message: fieldRequired("confirmed_value") })
  @IsNumber({}, { message: fieldInvalid("confirmed_value") })
  confirmed_value!: string

  constructor (data: IMeasureConfirmValidator) {
    Object.assign(this, data)
  }
}

@injectable()
export class MeasureService {

  constructor (
    @inject("MeasureRepository")
    private measureRepository: MeasureRepository
  ) { }

  list = async (customer_code: string, data: IIndex): Promise<{
    customer_code: string
    measures: IMeasureListResponse[]
  }> => {

    const measures = await this.measureRepository.list(customer_code, data)

    if (!measures.length) {
      throw new Warning({
        error_code: "MEASURES_NOT_FOUND",
        error_description: "Nenhuma leitura encontrada"
      }, 404)
    }

    return {
      customer_code,
      measures
    }
  }

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
      customer_code,
      measure_type,
      measure_datetime
    })

    if (measureExists) {
      throw new Warning({
        error_code: "DOUBLE_REPORT",
        error_description: "Leitura do mês já realizada"
      }, 409)
    }

    const mimeType = extractMimeType(image) as string
    const base64 = image.split("base64,").pop() as string

    const extension = getExtensionFromBase64(image)
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join("")
    const fileName = `${randomName}.${extension}`

    const filePath = await saveBase64AsTempFile(base64, fileName)

    try {
      const uploadResponse = await uploadImage(randomName, filePath, mimeType)

      const imageData = await getImageData(uploadResponse.file.name)

      const analyzedImage = await analyzeImage(uploadResponse.file.uri, uploadResponse.file.mimeType)

      const measure = await this.measureRepository.create({
        llm_value: parseInt(analyzedImage),
        customer_code,
        measure_datetime,
        measure_type,
        image_url: imageData.uri
      })

      return {
        image_url: imageData.uri,
        measure_value: analyzedImage,
        measure_uuid: measure.measure_uuid
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

    if (measure.has_confirmed) {
      throw new Warning({
        error_code: "CONFIRMATION_DUPLICATE",
        error_description: "Leitura do mês já realizada"
      }, 409)
    }

    await this.measureRepository.confirm({
      measure_uuid,
      confirmed_value: parseInt(confirmed_value)
    })

    return {
      success: true
    }
  }

}
