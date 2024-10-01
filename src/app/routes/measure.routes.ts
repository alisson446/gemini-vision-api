import { Router } from "express"
import { measureController } from "../controllers"

const measure = Router()

measure.post("/", measureController.upload)

export { measure }
