import { Router } from "express"
import { measureController } from "../controllers"

const measure = Router()

measure.get("/:customer_code/list", measureController.list)
measure.post("/upload", measureController.upload)
measure.patch("/confirm", measureController.confirm)

export { measure }
