import { Router } from "express"
import { pacoteController } from "../controllers"

const pacote = Router()

pacote.post("/", pacoteController.upload)

export { pacote }
