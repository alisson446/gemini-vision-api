import { ValidatorConstraint, ValidatorConstraintInterface } from "class-validator"
import { dateValidation, isValidBase64Image } from "./fieldValidation"
import { fieldInvalid } from "./messages"

@ValidatorConstraint({ async: false })
export class DateValidatorConstraint implements ValidatorConstraintInterface {

  validate (date: string) {
    return dateValidation(date)
  }

  defaultMessage () {
    return fieldInvalid("data")
  }
}

@ValidatorConstraint({ async: false })
export class ImageValidatorConstraint implements ValidatorConstraintInterface {

  validate (image: string) {
    return isValidBase64Image(image)
  }

  defaultMessage () {
    return "O campo image deve ser uma imagem base64 válida"
  }
}
