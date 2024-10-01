import { container } from "tsyringe"
import "reflect-metadata"
import "../../shared/container/index"

//controllers
import { MeasureController } from "./measure.controller"

export const measureController = container.resolve(MeasureController)
