import { Router } from "express"
import { measure } from "../routes/measure.routes"

const router = Router()

router.use('/upload', measure)

export { router }
