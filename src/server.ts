import express from 'express'
import "reflect-metadata"
import "express-async-errors"
import "dotenv/config"
import "./shared/container"
import { warning } from "./app/middlewares/error.middleware"
import cors from 'cors'
import { router } from './app/routes'

const app = express()
const PORT = process.env.PORT

app.use(cors({
  origin: [
    /http?:\/\/localhost:\d+/,
    'http://127.0.0.1:3000'
  ]
}))

app.use(express.json())
app.use(router)
app.use(warning)

app.listen(PORT, () => {
  console.log(`Servidor rodando na url: http://localhost:${PORT}`)
})
