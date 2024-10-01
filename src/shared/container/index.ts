import { container } from "tsyringe"
import "reflect-metadata"

//repositories
import { MeasureRepository } from '../../app/repositories/measure.repository'

//interfaces
import { IMeasure } from "../../app/interfaces/Measure"

container.registerSingleton<IMeasure>(
  "MeasureRepository",
  MeasureRepository
)
