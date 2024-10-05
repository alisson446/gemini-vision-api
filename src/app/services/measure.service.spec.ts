import "reflect-metadata"
import { container } from "tsyringe"
import { MeasureService } from "./measure.service"
import { Warning } from "../errors"
import { MeasureType } from "@prisma/client"

jest.mock("../repositories/measure.repository")
jest.mock("../errors", () => ({
  Warning: jest.fn().mockImplementation((message) => {
    const error = new Error(message)
    error.name = "Warning"
    return error
  })
}))

describe("MeasureService", () => {
  let measureService: MeasureService
  const measureRepository = {
    list: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByTypeAndDate: jest.fn(),
    confirm: jest.fn()
  }

  beforeEach(() => {
    container.clearInstances()

    container.registerInstance("MeasureRepository", measureRepository)
    measureService = container.resolve(MeasureService)
  })

  describe("list", () => {
    it("should return measures for a given customer code", async () => {
      const customer_code = "123"
      const data = {}
      const measures = [
        {
          measure_uuid: "uuid",
          measure_datetime: new Date(),
          measure_type: MeasureType.WATER,
          image_url: "url"
        }
      ]
      measureRepository.list.mockResolvedValue(measures)

      const result = await measureService.list(customer_code, data)

      expect(result).toEqual({ customer_code, measures })
    })

    it("should throw an error if no measures are found", async () => {
      measureRepository.list.mockResolvedValue([])

      await expect(measureService.list("123", {})).rejects.toThrow(Warning)
    })
  })
})