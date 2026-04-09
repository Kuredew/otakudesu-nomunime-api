import express from 'express'
import { indexRouter } from './routes'
import { SERVER_PORT } from '@/config'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/v1', indexRouter)

app.listen(SERVER_PORT, () => console.log('server running on port 3000.'))