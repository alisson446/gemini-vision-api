import { MeasureType } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator"
import { fieldInvalid, fieldRequired } from "../../shared/utils/messages"
import { DateValidatorConstraint, ImageValidatorConstraint } from "../../shared/utils/customClassValidator"
import { IIndex } from "./Helpers"

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
