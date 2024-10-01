import { MeasureType } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator"
import { fieldInvalid, fieldRequired } from "../../shared/utils/messages"
import { DateValidatorConstraint, ImageValidatorConstraint } from "../../shared/utils/customClassValidator"

export interface IMeasure {
  create (data: IMeasureDTO): Promise<IMeasureResponse>
  findById (id: string): Promise<IMeasureResponse | null>
  findByTypeAndDate (data: IMeasureFindTypeAndDate): Promise<IMeasureResponse | null>
  confirm (data: IMeasureConfirm): Promise<IMeasureResponse>
}

export interface IMeasureDTO {
  value: number
  customerCode: string
  measureDateTime: Date
  type: MeasureType
  confirmed?: boolean
  imageUrl: string
}

export interface IMeasureResponse extends IMeasureDTO {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface IMeasureFindTypeAndDate {
  type: MeasureType
  measureDateTime: Date
}

export interface IMeasureConfirm {
  id: string
  value: number
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
