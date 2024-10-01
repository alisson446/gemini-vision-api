import { Router } from "express"
import { pacote } from "../routes/pacote.routes"

const router = Router()

router.use('/upload', pacote)

export { router }
