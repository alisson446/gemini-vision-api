import { MeasureType } from "@prisma/client"
import prismaManager from "../database/database"
import { Warning } from "../errors"
import {
  IMeasure,
  IMeasureConfirm,
  IMeasureDTO,
  IMeasureFindTypeAndDate,
  IMeasureListResponse,
  IMeasureResponse
} from "../interfaces/Measure"
import { IIndex } from "../interfaces/Helpers"

class MeasureRepository implements IMeasure {

  private prisma = prismaManager.getPrisma()

  list = async (customer_code: string, { orderBy, order, skip, take, filter }: IIndex): Promise<IMeasureListResponse[]> => {

    const where = {
      customer_code
    }

    if (filter) {
      const specialFilter = ["measure_type"]

      Object.entries(filter).map(([key, value]) => {

        if (specialFilter.includes(key) && key === "measure_type") {

          if (!Object.values(MeasureType).includes(value as MeasureType)) {
            throw new Warning({
              error_code: "INVALID_TYPE",
              error_description: "Tipo de medição não permitida"
            }, 400)
          }

          Object.assign(where, {
            measure_type: value
          })
        }

        if (!specialFilter.includes(key)) {
          Object.assign(where, {
            [key]: {
              contains: value,
              mode: "insensitive"
            }
          })
        }
      })
    }

    return this.prisma.measure.findMany({
      skip,
      take,
      orderBy: { [orderBy as string]: order as string },
      where,
      select: {
        measure_uuid: true,
        measure_datetime: true,
        measure_type: true,
        has_confirmed: true,
        image_url: true
      }
    })
  }

  create = async ({
    llm_value,
    customer_code,
    measure_datetime,
    measure_type,
    image_url
  }: IMeasureDTO): Promise<IMeasureResponse> => {

    try {

      return await this.prisma.measure.create({
        data: {
          llm_value,
          customer_code,
          measure_datetime: new Date(measure_datetime),
          measure_type,
          image_url
        }
      })

    } catch (error) {
      throw new Warning('Não foi possivel cadastrar a medição', 400)
    }
  }

  findById (measure_uuid: string): Promise<IMeasureResponse | null> {
    return this.prisma.measure.findUnique({
      where: {
        measure_uuid
      }
    })
  }

  findByTypeAndDate = async ({
    customer_code,
    measure_type,
    measure_datetime
  }: IMeasureFindTypeAndDate): Promise<IMeasureResponse | null> => {

    try {
      const date = new Date(measure_datetime)

      const year = date.getFullYear()
      const month = date.getMonth() + 1

      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 1)

      return await this.prisma.measure.findFirst({
        where: {
          customer_code,
          measure_type,
          measure_datetime: {
            gte: startDate,
            lt: endDate
          }
        }
      })

    } catch (error) {
      throw new Warning('Não foi possivel encontrar a medição', 400)
    }
  }

  confirm = async ({
    measure_uuid,
    confirmed_value
  }: IMeasureConfirm): Promise<IMeasureResponse> => {

    try {

      return await this.prisma.measure.update({
        where: {
          measure_uuid
        },
        data: {
          confirmed_value,
          has_confirmed: true
        }
      })

    } catch (error) {
      throw new Warning('Não foi possivel confirmar a medição', 400)
    }
  }

}

export { MeasureRepository }
