import { injectable } from "tsyringe"
import { Request, Response } from "express"
import { MeasureService } from "../services/measure.service"
import { formatIndexFilters } from "../../shared/utils/filters"

@injectable()
class MeasureController {

  constructor (
    private measureService: MeasureService
  ) { }

  list = async (request: Request, response: Response): Promise<void> => {

    const { customer_code } = request.params

    const filters = formatIndexFilters(request)

    const measures = await this.measureService.list(customer_code, filters)

    response.status(200).json(measures)
  }

  upload = async (request: Request, response: Response): Promise<void> => {

    const res = await this.measureService.upload(request.body)

    response.status(200).send(res)
  }

  confirm = async (request: Request, response: Response): Promise<void> => {

    const res = await this.measureService.confirm(request.body)

    response.status(200).send(res)
  }
}

export { MeasureController }
