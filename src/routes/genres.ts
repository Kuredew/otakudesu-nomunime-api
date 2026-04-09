import express from 'express'
import { listGenresController } from '@/controller/genre'

const router = express.Router()

router.get('/', listGenresController)

export { router as genreRouter }