import { PacoteRepository } from "../repositories/pacote.repository"
import { inject, injectable } from "tsyringe"
import { Request, Response } from "express"
import { PacoteService } from "../services/pacote.service"

@injectable()
class PacoteController {

  constructor (
    // @inject("PacoteRepository")
    // private pacoteRepository: PacoteRepository,
    private pacoteService: PacoteService
  ) { }

  upload = async (request: Request, response: Response): Promise<void> => {

    const { image } = request.body

    const res = await this.pacoteService.upload(image)

    response.status(200).send(res)
  }
}

export { PacoteController }
