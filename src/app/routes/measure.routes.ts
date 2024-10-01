import { Router } from "express"
import { measureController } from "../controllers"

const measure = Router()

measure.post("/upload", measureController.upload)
measure.patch("/confirm", measureController.confirm)

export { measure }
