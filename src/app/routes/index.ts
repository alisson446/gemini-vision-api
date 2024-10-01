import { Router } from "express"
import { measure } from "../routes/measure.routes"

const router = Router()

router.use('/', measure)

export { router }
