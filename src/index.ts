import express from 'express'
import { indexRouter } from './routes'
import { SERVER_PORT } from '@/config'
import morgan from 'morgan'
import cors from 'cors'

const app = express()

app.use(morgan('combined'))
app.use(cors())
app.use(express.json())

app.use('/api/v1', indexRouter)

app.listen(SERVER_PORT, () => console.log(`[main] server running on port ${SERVER_PORT}.`))