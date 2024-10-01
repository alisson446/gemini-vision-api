import { MeasureType } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString, Validate } from "class-validator"
import { fieldInvalid, fieldRequired } from "../../shared/utils/messages"
import { DateValidatorConstraint, ImageValidatorConstraint } from "../../shared/utils/customClassValidator"

export interface IMeasure {
  create (data: IMeasureDTO): Promise<IMeasureResponse>
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

export class IMeasureUploadBody {

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

  constructor (data: IMeasureUploadBody) {
    Object.assign(this, data)
  }
}
