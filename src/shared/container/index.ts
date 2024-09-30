import { container } from "tsyringe"
import "reflect-metadata"

//repositories
import { PacoteRepository } from '../../app/repositories/pacote.repository'

//interfaces
import { IPacote } from "../../app/interfaces/Pacote"

container.registerSingleton<IPacote>(
  "PacoteRepository",
  PacoteRepository
)
