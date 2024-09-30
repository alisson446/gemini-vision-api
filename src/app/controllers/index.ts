import { container } from "tsyringe"
import "reflect-metadata"
import "../../shared/container/index"

//controllers
import { PacoteController } from "./pacote.controller"

export const pacoteController = container.resolve(PacoteController)
