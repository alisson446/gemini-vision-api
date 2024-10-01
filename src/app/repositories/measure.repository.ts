import prismaManager from "../database/database"
import { Warning } from "../errors"
import { IMeasure, IMeasureDTO, IMeasureFindTypeAndDate, IMeasureResponse } from "../interfaces/Measure"

class MeasureRepository implements IMeasure {

  private prisma = prismaManager.getPrisma()

  create = async ({
    value,
    customerCode,
    measureDateTime,
    type,
    imageUrl
  }: IMeasureDTO): Promise<IMeasureResponse> => {

    try {

      return await this.prisma.measure.create({
        data: {
          value,
          customerCode,
          measureDateTime,
          type,
          imageUrl
        }
      })

    } catch (error) {
      throw new Warning('Não foi possivel cadastrar a medição', 400)
    }
  }

  findByTypeAndDate = async ({
    type,
    measureDateTime
  }: IMeasureFindTypeAndDate): Promise<IMeasureResponse | null> => {

    try {

      return await this.prisma.measure.findFirst({
        where: {
          type,
          measureDateTime
        }
      })

    } catch (error) {
      throw new Warning('Não foi possivel encontrar a medição', 400)
    }
  }

}

export { MeasureRepository }
