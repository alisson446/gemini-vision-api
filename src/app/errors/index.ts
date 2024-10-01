import { ValidationError } from "class-validator"
import { Logger } from "../../shared/utils/logger"

interface IWarningMessage {
  error_code: string
  error_description: unknown
}

export class Warning {

  public readonly message: string[] | IWarningMessage | undefined
  public readonly code: number
  public readonly logger: Logger

  constructor (message: IWarningMessage | unknown, code = 500, logger: Logger = {}) {

    this.code = code
    this.logger = logger

    if (typeof message === "string") {
      this.message = [message]
    }

    if (Array.isArray(message) && typeof message[0] === "string") {
      this.message = message
    }

    if (Array.isArray(message) && message[0] instanceof ValidationError) {

      const errors: string[] = message.map(value => {

        const key = Object.keys(value.constraints).pop() as string
        return value.constraints[key]
      })

      this.message = errors
    }

    const isIWarningMessage = message && typeof message === 'object' && 'error_description' in message

    if (isIWarningMessage) {

      if (Array.isArray(message.error_description) && message.error_description[0] instanceof ValidationError) {
        const errors: string[] = message.error_description.map(value => {

          const key = Object.keys(value.constraints).pop() as string
          return value.constraints[key]
        })

        this.message = {
          ...message,
          error_description: errors
        } as IWarningMessage

      } else {
        this.message = message as IWarningMessage
      }
    }
  }
}
