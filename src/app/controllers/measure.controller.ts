import { injectable } from "tsyringe"
import { Request, Response } from "express"
import { MeasureService } from "../services/measure.service"

@injectable()
class MeasureController {

  constructor (
    private measureService: MeasureService
  ) { }

  upload = async (request: Request, response: Response): Promise<void> => {

    const res = await this.measureService.upload(request.body)

    response.status(200).send(res)
  }
}

export { MeasureController }
